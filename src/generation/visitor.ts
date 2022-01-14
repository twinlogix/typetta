import { getBaseTypeNode, ParsedConfig, BaseVisitor, buildScalars, DEFAULT_SCALARS } from '@graphql-codegen/visitor-plugin-common'
import autoBind from 'auto-bind'
import { TypeScriptTypettaPluginConfig } from './config'
import { DirectiveNode, GraphQLSchema, ObjectTypeDefinitionNode, ScalarTypeDefinitionNode, FieldDefinitionNode, Kind, ValueNode, isObjectType, isInterfaceType, isEnumType } from 'graphql'
import { EmbedFieldType, ForeignRefFieldType, InnerRefFieldType, RelationEntityRefFieldType, TsTypettaGeneratorField, TsTypettaGeneratorNode, TsTypettaGeneratorScalar } from './generator'
import { toFirstLower } from './utils'
import { Directives } from './directives'
import { IdGenerationStrategy } from '..'

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

  private _buildFields(fields: ReadonlyArray<FieldDefinitionNode>, node: ObjectTypeDefinitionNode): TsTypettaGeneratorField[] {
    const resFields: TsTypettaGeneratorField[] = []

    fields.forEach((field) => {
      const coreType = getBaseTypeNode(field.type)
      const coreTypeName = this.convertName(coreType, { useTypesPrefix: false })
      const schemaType = this._schema.getType(coreType.name.value)

      let resFieldType: string | EmbedFieldType | InnerRefFieldType | ForeignRefFieldType | RelationEntityRefFieldType
      let innerRefDirective
      let foreignRefDirective
      let relationEntityRefDirective
      if (isObjectType(schemaType)) {
        innerRefDirective = this._getDirectiveFromAstNode(field, Directives.INNER_REF)
        foreignRefDirective = this._getDirectiveFromAstNode(field, Directives.FOREIGN_REF)
        relationEntityRefDirective = this._getDirectiveFromAstNode(field, Directives.RELATION_ENTITY_REF)

        if (innerRefDirective) {
          const refFrom = this._getDirectiveArgValue<string>(innerRefDirective, 'refFrom')!
          const refTo = this._getDirectiveArgValue<string>(innerRefDirective, 'refTo')!
          resFieldType = { innerRef: coreTypeName, refFrom, refTo }
        } else if (foreignRefDirective) {
          const refFrom = this._getDirectiveArgValue<string>(foreignRefDirective, 'refFrom')!
          const refTo = this._getDirectiveArgValue<string>(foreignRefDirective, 'refTo')!
          resFieldType = { foreignRef: coreTypeName, refFrom, refTo }
        } else if (relationEntityRefDirective) {
          const entity = this._getDirectiveArgValue<string>(relationEntityRefDirective, 'entity')!
          const refThis = this._getDirectiveArgValue<{ refFrom: string; refTo?: string }>(relationEntityRefDirective, 'refThis')!
          const refOther = this._getDirectiveArgValue<{ refFrom: string; refTo?: string }>(relationEntityRefDirective, 'refOther')!
          resFieldType = { entity, refThis, refOther, destRef: coreTypeName, sourceRef: node.name.value }
        } else {
          resFieldType = { embed: coreTypeName }
        }
      } else if (isEnumType(schemaType)) {
        resFieldType = this.scalars.String
      } else {
        if (this.scalars[coreType.name.value]) {
          resFieldType = this.scalars[coreType.name.value]
        } else {
          throw new Error(`Type mapping not found for custom scalar '${coreType.name.value}'.`)
        }
      }

      const idDirective = this._getDirectiveFromAstNode(field, Directives.ID)
      const idGenerationStrategy = idDirective ? this._getDirectiveArgValue<IdGenerationStrategy>(idDirective, 'from') ?? 'generator' : undefined
      if(idGenerationStrategy && idGenerationStrategy !== 'db' && idGenerationStrategy !== 'generator' && idGenerationStrategy !== 'user') {
        throw new Error('@id(from: "db" | "generator" | "user") from must be either "db", "generator" or "user"')
      }

      const excludeDirective = this._getDirectiveFromAstNode(field, Directives.EXCLUDE)

      const aliasDirective = this._getDirectiveFromAstNode(field, Directives.ALIAS)
      const alias = (
        aliasDirective != null ?
          this._getDirectiveArgValue<string>(aliasDirective, 'value')!
          : undefined
      );

      if (aliasDirective && excludeDirective) {
        throw new Error(`@alias and @exclude directives of field '${field.name.value}' are incompatible.`)
      }
      if (aliasDirective && innerRefDirective) {
        throw new Error(`@alias and @innerRef directives of field '${field.name.value}' are incompatible.`)
      }
      if (aliasDirective && foreignRefDirective) {
        throw new Error(`@alias and @foreignRef directives of field '${field.name.value}' are incompatible.`)
      }
      if (aliasDirective && relationEntityRefDirective) {
        throw new Error(`@alias and @relationEntityRef directives of field '${field.name.value}' are incompatible.`)
      }

      resFields.push({
        name: field.name.value,
        graphqlType: coreType.name.value,
        type: resFieldType,
        coreType: coreType.name.value,
        isRequired: field.type.kind === Kind.NON_NULL_TYPE,
        isID: idDirective != null,
        idGenerationStrategy,
        isList: field.type.kind === Kind.LIST_TYPE || (field.type.kind === Kind.NON_NULL_TYPE && field.type.type.kind === Kind.LIST_TYPE),
        isExcluded: excludeDirective != null,
        alias
      })
    })

    return resFields
  }


  ObjectTypeDefinition(node: ObjectTypeDefinitionNode): TsTypettaGeneratorNode {
    const plainName = this.convertName(node, { useTypesPrefix: false })
    const prefixedName = this.convertName(node)

    const mongoEntityDirective = this._getDirectiveFromAstNode(node, Directives.MONGO_ENTITY)
    const collection = (mongoEntityDirective && this._getDirectiveArgValue<string>(mongoEntityDirective, 'collection')) || toFirstLower(plainName) + 's'
    const mongoSource = (mongoEntityDirective && this._getDirectiveArgValue<string>(mongoEntityDirective, 'source')) || 'default'

    const sqlEntityDirective = this._getDirectiveFromAstNode(node, Directives.SQL_ENTITY)
    const table = (sqlEntityDirective && this._getDirectiveArgValue<string>(sqlEntityDirective, 'table')) || toFirstLower(plainName) + 's'
    const knexSource = (sqlEntityDirective && this._getDirectiveArgValue<string>(sqlEntityDirective, 'source')) || 'default'

    const fields = this._buildFields(node.fields!, node)

    return {
      type: 'type',
      name: plainName,
      prefixedName,
      mongoEntity: mongoEntityDirective ? { collection, source: mongoSource } : undefined,
      sqlEntity: sqlEntityDirective ? { table, source: knexSource } : undefined,
      fields,
    }
  }

  ScalarTypeDefinition(node: ScalarTypeDefinitionNode): TsTypettaGeneratorScalar {
    return {
      type: 'scalar',
      name: node.name.value,
    }
  }
}
