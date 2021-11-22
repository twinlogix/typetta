import { getBaseTypeNode, ParsedConfig, BaseVisitor, buildScalars, DEFAULT_SCALARS } from '@graphql-codegen/visitor-plugin-common'
import autoBind from 'auto-bind'
import { Directives, TypeScriptTypettaPluginConfig } from './config'
import { DirectiveNode, GraphQLSchema, ObjectTypeDefinitionNode, FieldDefinitionNode, Kind, ValueNode, isObjectType, isInterfaceType, isEnumType } from 'graphql'
import { TsTypettaGeneratorField, TsTypettaGeneratorNode } from './generator'
import { toFirstLower } from './utils'

type Directivable = { directives?: ReadonlyArray<DirectiveNode> }

export class TsMongooseVisitor extends BaseVisitor<TypeScriptTypettaPluginConfig, ParsedConfig> {

  constructor(private _schema: GraphQLSchema, pluginConfig: TypeScriptTypettaPluginConfig) {
    super(pluginConfig, {
      scalars: buildScalars(_schema, pluginConfig.scalars!, DEFAULT_SCALARS),
    } as Partial<ParsedConfig> as any)

    autoBind(this)
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

  private _buildFields(fields: ReadonlyArray<FieldDefinitionNode>): TsTypettaGeneratorField[] {
    const resFields: TsTypettaGeneratorField[] = []

    fields.forEach((field) => {
      const coreType = getBaseTypeNode(field.type)
      const coreTypeName = this.convertName(coreType, { useTypesPrefix: false })
      const schemaType = this._schema.getType(coreType.name.value)

      let resFieldType
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
      } else {
        if (this.scalars[coreType.name.value] && this.scalars[coreType.name.value] !== 'any') {
          resFieldType = this.scalars[coreType.name.value]
        } else {
          throw new Error(`Type mapping not found for custom scalar '${coreType.name.value}'.`)
        }
      }

      const idDirective = this._getDirectiveFromAstNode(field, Directives.ID)
      const excludeDirective = this._getDirectiveFromAstNode(field, Directives.EXCLUDE)

      resFields.push({
        name: field.name.value,
        type: resFieldType,
        isRequired: field.type.kind === Kind.NON_NULL_TYPE,
        isID: idDirective != null,
        isList: field.type.kind === Kind.LIST_TYPE || (field.type.kind === Kind.NON_NULL_TYPE && field.type.type.kind === Kind.LIST_TYPE),
        isExcluded: excludeDirective != null,
      })
    })

    return resFields
  }

  ObjectTypeDefinition(node: ObjectTypeDefinitionNode): TsTypettaGeneratorNode {
    const plainName = this.convertName(node, { useTypesPrefix: false })
    const prefixedName = this.convertName(node)

    const mongoEntityDirective = this._getDirectiveFromAstNode(node, Directives.MONGO_ENTITY)
    const collection = (mongoEntityDirective && this._getDirectiveArgValue<string>(mongoEntityDirective, 'collection')) || toFirstLower(plainName) + 's'

    const sqlEntityDirective = this._getDirectiveFromAstNode(node, Directives.SQL_ENTITY)
    const table = (sqlEntityDirective && this._getDirectiveArgValue<string>(sqlEntityDirective, 'table')) || toFirstLower(plainName) + 's'

    const fields = this._buildFields(node.fields!)

    return {
      type: 'type',
      name: plainName,
      prefixedName,
      mongoEntity: mongoEntityDirective ? { collection } : undefined,
      sqlEntity: sqlEntityDirective ? { table } : undefined,
      fields,
    }
  }
}
