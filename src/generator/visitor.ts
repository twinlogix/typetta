import { DEFAULT_MONGOOSE_SCALARS } from './mongooseScalars'
import { getBaseTypeNode, ParsedConfig, BaseVisitor, buildScalars, DEFAULT_SCALARS, NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common'
import { TypeScriptOperationVariablesToObject } from '@graphql-codegen/typescript'
import autoBind from 'auto-bind'
import { Directives, TypeScriptMongoosePluginConfig } from './config'
import { DirectiveNode, GraphQLSchema, ObjectTypeDefinitionNode, FieldDefinitionNode, Kind, ValueNode, isObjectType, isInterfaceType, isEnumType, InterfaceTypeDefinitionNode } from 'graphql'
import { TsMongooseGeneratorField, TsMongooseGeneratorNode } from './generator'

type Directivable = { directives?: ReadonlyArray<DirectiveNode> }

export class TsMongooseVisitor extends BaseVisitor<TypeScriptMongoosePluginConfig, ParsedConfig> {
  private _variablesTransformer: TypeScriptOperationVariablesToObject
  public readonly mongooseScalars: NormalizedScalarsMap
  public readonly defaultIdAutogenerated: boolean

  constructor(private _schema: GraphQLSchema, pluginConfig: TypeScriptMongoosePluginConfig) {
    super(pluginConfig, {
      scalars: buildScalars(_schema, pluginConfig.scalars!, DEFAULT_SCALARS),
    } as Partial<ParsedConfig> as any)

    this.defaultIdAutogenerated = pluginConfig.defaultIdAutogenerated || false
    this.mongooseScalars = {}
    const denormalizedMongooseScalars = buildScalars(_schema, pluginConfig.mongooseScalars!, DEFAULT_MONGOOSE_SCALARS)
    Object.keys(denormalizedMongooseScalars || {}).forEach((key) => {
      this.mongooseScalars[key] = denormalizedMongooseScalars[key].type
    })

    this._variablesTransformer = new TypeScriptOperationVariablesToObject(this.scalars, this.convertName, false, false)

    autoBind(this)
  }

  private _toFirstLower(typeName: string) {
    return typeName.charAt(0).toLowerCase() + typeName.slice(1)
  }

  private _resolveDirectiveValue<T>(valueNode: ValueNode): T | undefined | null {
    switch (valueNode.kind) {
      case Kind.INT:
      case Kind.STRING:
      case Kind.FLOAT:
      case Kind.BOOLEAN:
      case Kind.ENUM:
        return valueNode.value as any as T
      case Kind.LIST:
        return valueNode.values.map((v) => this._resolveDirectiveValue<T>(v)) as any as T
      case Kind.NULL:
        return null
      case Kind.OBJECT:
        return valueNode.fields.reduce((prev, f) => {
          return {
            ...prev,
            [f.name.value]: this._resolveDirectiveValue<T>(f.value),
          }
        }, {} as T)
      default:
        return undefined
    }
  }

  private _getDirectiveArgValue<T>(node: DirectiveNode, argName: string): T | null | undefined {
    if (!node || !node.arguments || node.arguments.length === 0) {
      return undefined
    }

    const foundArgument = node.arguments.find((a) => a.name.value === argName)

    if (!foundArgument) {
      return undefined
    }

    return this._resolveDirectiveValue<T>(foundArgument.value)
  }

  private _getDirectiveFromAstNode(node: Directivable, directiveName: Directives): DirectiveNode | null {
    if (!node || !node.directives || node.directives.length === 0) {
      return null
    }

    const foundDirective = node.directives.find((d) => (d.name as any) === directiveName || (d.name.value && d.name.value === directiveName))

    if (!foundDirective) {
      return null
    }

    return foundDirective
  }

  private _buildFields(fields: ReadonlyArray<FieldDefinitionNode>): TsMongooseGeneratorField[] {
    const resFields: TsMongooseGeneratorField[] = []

    fields.forEach((field) => {
      const coreType = getBaseTypeNode(field.type)
      const coreTypeName = this.convertName(coreType, { useTypesPrefix: false })
      const schemaType = this._schema.getType(coreType.name.value)

      let resFieldType
      let resFieldMongooseType: string
      if (isObjectType(schemaType) || isInterfaceType(schemaType)) {
        const innerRefDirective = this._getDirectiveFromAstNode(field, Directives.INNER_REF)
        const foreignRefDirective = this._getDirectiveFromAstNode(field, Directives.FOREIGN_REF)

        if (innerRefDirective) {
          const innerRef = coreTypeName
          const refFrom = this._getDirectiveArgValue<string>(innerRefDirective, 'refFrom')!
          const refTo = this._getDirectiveArgValue<string>(innerRefDirective, 'refTo')!
          resFieldType = { innerRef, refFrom, refTo }
        } else if (foreignRefDirective) {
          const foreignRef = coreTypeName
          const refFrom = this._getDirectiveArgValue<string>(foreignRefDirective, 'refFrom')!
          const refTo = this._getDirectiveArgValue<string>(foreignRefDirective, 'refTo')!
          resFieldType = { foreignRef, refFrom, refTo }
        } else {
          resFieldType = { embed: coreTypeName }
        }
      } else if (isEnumType(schemaType)) {
        resFieldType = this.scalars.String
        resFieldMongooseType = this.mongooseScalars.String
      } else {
        if (this.scalars[coreType.name.value] && this.scalars[coreType.name.value] !== 'any') {
          resFieldType = this.scalars[coreType.name.value]
        } else {
          throw new Error(`Type mapping not found for custom scalar '${coreType.name.value}'.`)
        }

        if (this.mongooseScalars[coreType.name.value] && this.mongooseScalars[coreType.name.value] !== 'any') {
          resFieldMongooseType = this.mongooseScalars[coreType.name.value]
        } else {
          throw new Error(`Mongoose type mapping not found for custom scalar '${coreType.name.value}'.`)
        }
      }

      const idDirective = this._getDirectiveFromAstNode(field, Directives.ID)
      const idAuto = this._getDirectiveArgValue<string>(idDirective!, 'auto')

      const excludeDirective = this._getDirectiveFromAstNode(field, Directives.EXCLUDE)

      resFields.push({
        name: field.name.value,
        type: resFieldType,
        mongooseType: resFieldMongooseType!,
        required: field.type.kind === Kind.NON_NULL_TYPE,
        isID: idDirective != null,
        isAutogenerated: idAuto != null ? true : this.defaultIdAutogenerated,
        isList: field.type.kind === Kind.LIST_TYPE || (field.type.kind === Kind.NON_NULL_TYPE && field.type.type.kind === Kind.LIST_TYPE),
        isExcluded: excludeDirective != null,
      })
    })

    return resFields
  }

  _InterfaceOrTypeDefinition(node: InterfaceTypeDefinitionNode | ObjectTypeDefinitionNode): TsMongooseGeneratorNode {
    const plainName = this.convertName(node, { useTypesPrefix: false })
    const prefixedName = this.convertName(node)

    const entityDirective = this._getDirectiveFromAstNode(node, Directives.ENTITY)

    let collection
    if (entityDirective) {
      collection = this._getDirectiveArgValue<string>(entityDirective, 'collection')
    }
    if (!collection) {
      collection = this._toFirstLower(plainName) + 's'
    }

    const fields = this._buildFields(node.fields!)

    return {
      type: undefined,
      code: plainName,
      name: plainName,
      prefixedName: prefixedName,
      isEntity: entityDirective != null,
      collection: collection,
      interfaces: [],
      fields: fields,
    }
  }

  InterfaceTypeDefinition(node: InterfaceTypeDefinitionNode): TsMongooseGeneratorNode {
    return { ...this._InterfaceOrTypeDefinition(node), type: 'interface' }
  }

  ObjectTypeDefinition(node: ObjectTypeDefinitionNode): TsMongooseGeneratorNode {
    const definition = this._InterfaceOrTypeDefinition(node)
    const interfaces = node.interfaces!.map((i) => i.name.value)
    return { ...definition, interfaces, type: 'type' }
  }
}
