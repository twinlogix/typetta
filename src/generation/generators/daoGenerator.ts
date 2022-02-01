import { DAORelation } from '../../dal/dao/relations/relations.types'
import { TsTypettaGeneratorField, TsTypettaGeneratorNode, TsTypettaGeneratorScalar } from '../generator'
import { findID, findNode, indentMultiline, toFirstLower } from '../utils'
import { TsTypettaAbstractGenerator } from './abstractGenerator'
import { DEFAULT_SCALARS } from '@graphql-codegen/visitor-plugin-common'

export class TsTypettaDAOGenerator extends TsTypettaAbstractGenerator {
  public generateImports(typesMap: Map<string, TsTypettaGeneratorNode>): string[] {
    const sqlSources = [...new Set([...typesMap.values()].flatMap((type) => (type.entity?.type === 'sql' ? [type.entity.source] : [])))]
    const hasSQLEntities = sqlSources.length > 0

    const mongoSources = [...new Set([...typesMap.values()].flatMap((type) => (type.entity?.type === 'mongo' ? [type.entity.source] : [])))]
    const hasMongoDBEntites = mongoSources.length > 0

    const knexImports = [`import { KnexJsDAOGenerics, KnexJsDAOParams, AbstractKnexJsDAO } from '${this._config.typettaImport || '@twinlogix/typetta'}';`, "import { Knex } from 'knex';"]

    const mongodbImports = [
      `import { MongoDBDAOGenerics, MongoDBDAOParams, AbstractMongoDBDAO, inMemoryMongoDb } from '${this._config.typettaImport || '@twinlogix/typetta'}';`,
      "import { Collection, Db, Filter, Sort, UpdateFilter, Document } from 'mongodb';",
    ]

    const commonImports = [
      `import { MockDAOContextParams, createMockedDAOContext, DAOMiddleware, Coordinates, LocalizedString, UserInputDriverDataTypeAdapterMap, Schema, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, OneKey, SortDirection, overrideRelations, userInputDataTypeAdapterToDataTypeAdapter, LogFunction, LogInput, logInputToLogger, ParamProjection } from '${
        this._config.typettaImport || '@twinlogix/typetta'
      }';`,
      `import * as types from '${this._config.tsTypesImport || '@twinlogix/typetta'}';`,
    ]

    return [...commonImports, ...(hasSQLEntities ? knexImports : []), ...(hasMongoDBEntites ? mongodbImports : [])]
  }

  public generateDefinition(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, customScalarsMap: Map<string, TsTypettaGeneratorScalar>): string {
    if (node.entity) {
      const daoExcluded = this._generateDAOExludedFields(node)
      const daoSchema = this._generateDAOSchema(node, typesMap)
      const daoFilter = this._generateDAOFilter(node, typesMap, customScalarsMap)
      const daoRelations = this._generateDAORelations(node)
      const daoProjection = this._generateDAOProjection(node, typesMap)
      const daoSort = this._generateDAOSort(node, typesMap)
      const daoUpdate = this._generateDAOUpdate(node, typesMap)
      const daoInsert = this._generateDAOInsert(node, typesMap)
      const daoParams = this._generateDAOParams(node, typesMap)
      const dao = this._generateDAO(node, typesMap)
      return [daoExcluded, daoSchema, daoFilter, daoRelations, daoProjection, daoSort, daoUpdate, daoInsert, daoParams, dao].join('\n\n')
    } else {
      return ''
    }
  }

  public generateExports(typesMap: Map<string, TsTypettaGeneratorNode>, customScalarsMap: Map<string, TsTypettaGeneratorScalar>): string[] {
    const sqlSources = [...new Set([...typesMap.values()].flatMap((type) => (type.entity?.type === 'sql' ? [type.entity.source] : [])))]
    const mongoSources = [...new Set([...typesMap.values()].flatMap((type) => (type.entity?.type === 'mongo' ? [type.entity.source] : [])))]
    const hasMongoDBEntites = mongoSources.length > 0
    const hasSQLEntities = sqlSources.length > 0
    const sqlSourcesType = `Record<${sqlSources.map((v) => `'${v}'`).join(' | ')}, Knex>`
    const mongoSourcesType = `Record<${mongoSources.map((v) => `'${v}'`).join(' | ')}, Db>`
    const daoNamesType = Array.from(typesMap.values())
      .filter((node) => node.entity)
      .map((node) => `'${toFirstLower(node.name)}'`)
      .join(' | ')
    const contextDAOParamsDeclarations = Array.from(typesMap.values())
      .filter((node) => node.entity)
      .map((node) => {
        return `${toFirstLower(node.name)}?: Pick<Partial<${node.name}DAOParams<MetadataType, OperationMetadataType>>, ${
          node.fields.find((f) => f.isID)?.idGenerationStrategy === 'generator' ? "'idGenerator' | " : ''
        }'middlewares' | 'metadata'>`
      })
      .join(',\n')

    const metadata = `metadata?: MetadataType`
    const middlewares = `\nmiddlewares?: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]`
    const overrides = `\noverrides?: { \n${indentMultiline(contextDAOParamsDeclarations)}\n}`
    const mongoDBParams = hasMongoDBEntites ? `,\nmongo: ${mongoSourcesType}` : ''
    const knexJsParams = hasSQLEntities ? `,\nknex: ${sqlSourcesType}` : ''
    const adaptersParams = `,\nscalars?: UserInputDriverDataTypeAdapterMap<types.Scalars, '${hasMongoDBEntites && hasSQLEntities ? 'both' : hasMongoDBEntites ? 'mongo' : 'knex'}'>`
    const loggerParams = `,\nlog?: LogInput<${daoNamesType}>`

    const dbsInputParam =
      hasMongoDBEntites && hasSQLEntities ? `mongo: ${mongoSourcesType}; knex: ${sqlSourcesType}` : hasSQLEntities ? `knex: ${sqlSourcesType}` : hasMongoDBEntites ? `mongo: ${mongoSourcesType}` : ''
    const dbsParam = hasMongoDBEntites && hasSQLEntities ? 'mongo: this.mongo, knex: this.knex' : hasSQLEntities ? 'knex: this.knex' : hasMongoDBEntites ? 'mongo: this.mongo' : ''
    const entitiesInputParam = Array.from(typesMap.values())
      .flatMap((node) => {
        return node.entity?.type === 'mongo'
          ? [`${toFirstLower(node.name)}: Collection<Document>`]
          : node.entity?.type === 'sql'
          ? [`${toFirstLower(node.name)}: Knex.QueryBuilder<any, unknown[]>`]
          : []
      })
      .join('; ')
    const entitiesParam = Array.from(typesMap.values())
      .flatMap((node) => {
        return node.entity?.type === 'mongo'
          ? [`${toFirstLower(node.name)}: this.mongo.${node.entity.source}.collection('${node.entity.collection}')`]
          : node.entity?.type === 'sql'
          ? [`${toFirstLower(node.name)}: this.knex.${node.entity.source}.table('${node.entity.table}')`]
          : []
      })
      .join(', ')
    const execQueryF =
      `public async execQuery<T>(run: (dbs: { ${dbsInputParam} }, entities: { ${entitiesInputParam} }) => Promise<T>): Promise<T> {\n` + `  return run({ ${dbsParam} }, { ${entitiesParam} })\n` + `}`

    const createTableBody = Array.from(typesMap.values())
      .flatMap((node) => {
        return node.entity?.type === 'sql' ? [`this.${toFirstLower(node.name)}.createTable(typeMap, defaultType)`] : []
      })
      .join('\n  ')
    const createTableF =
      createTableBody.length > 0
        ? `public async createTables(typeMap: Partial<Record<keyof types.Scalars, { singleType: string; arrayType?: string }>>` +
          `, defaultType: { singleType: string; arrayType?: string }): Promise<void> {\n` +
          `  ${createTableBody.trimEnd()}\n}`
        : ''

    const daoContextParamsExport = `export type DAOContextParams<MetadataType, OperationMetadataType> = {\n${indentMultiline(
      `${metadata}${middlewares}${overrides}${mongoDBParams}${knexJsParams}${adaptersParams}${loggerParams}`,
    )}\n};`

    const daoDeclarations = Array.from(typesMap.values())
      .filter((node) => node.entity)
      .map((node) => {
        return `private _${toFirstLower(node.name)}: ${node.name}DAO<MetadataType, OperationMetadataType> | undefined;`
      })
      .join('\n')

    const mongoDBFields = hasMongoDBEntites ? `\nprivate mongo: ${mongoSourcesType};` : ''
    const knexJsFields = hasSQLEntities ? `\nprivate knex: ${sqlSourcesType};` : ''
    const overridesDeclaration = `private overrides: DAOContextParams<MetadataType, OperationMetadataType>['overrides'];${mongoDBFields}${knexJsFields}`
    const middlewareDeclaration = 'private middlewares: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]'
    const loggerDeclaration = `private logger?: LogFunction<${daoNamesType}>`

    const daoGetters = Array.from(typesMap.values())
      .filter((node) => node.entity)
      .map((node) => {
        const daoImplementationInit =
          node.entity?.type === 'sql'
            ? `, knex: this.knex.${node.entity.source}, tableName: '${node.entity?.table}'`
            : node.entity?.type === 'mongo'
            ? `, collection: this.mongo.${node.entity.source}.collection('${node.entity?.collection}')`
            : ''
        const daoMiddlewareInit = `, middlewares: [...(this.overrides?.${toFirstLower(node.name)}?.middlewares || []), ...selectMiddleware('${toFirstLower(
          node.name,
        )}', this.middlewares) as DAOMiddleware<${node.name}DAOGenerics<MetadataType, OperationMetadataType>>[]]`
        const daoInit = `this._${toFirstLower(node.name)} = new ${node.name}DAO({ daoContext: this, metadata: this.metadata, ...this.overrides?.${toFirstLower(
          node.name,
        )}${daoImplementationInit}${daoMiddlewareInit}, name: '${toFirstLower(node.name)}', logger: this.logger });`
        const daoGet = `if(!this._${toFirstLower(node.name)}) {\n${indentMultiline(daoInit)}\n}\nreturn this._${toFirstLower(node.name)};`
        return `get ${toFirstLower(node.name)}() {\n${indentMultiline(daoGet)}\n}`
      })
      .join('\n')

    const mongoDBConstructor = hasMongoDBEntites ? '\nthis.mongo = params.mongo' : ''
    const knexJsContsructor = hasSQLEntities ? '\nthis.knex = params.knex' : ''
    const scalarsNameList = [...Array.from(customScalarsMap.keys()), ...Object.keys(DEFAULT_SCALARS)]
    const daoConstructor =
      'constructor(params: DAOContextParams<MetadataType, OperationMetadataType>) {\n' +
      indentMultiline(
        `super({\n  ...params,\n  scalars: params.scalars ? userInputDataTypeAdapterToDataTypeAdapter(params.scalars, [${scalarsNameList
          .map((v) => `'${v}'`)
          .join(
            ', ',
          )}]) : undefined\n})\nthis.overrides = params.overrides${mongoDBConstructor}${knexJsContsructor}\nthis.middlewares = params.middlewares || []\nthis.logger = logInputToLogger(params.log)`,
      ) +
      '\n}'

    const declarations = [daoDeclarations, overridesDeclaration, middlewareDeclaration, loggerDeclaration, daoGetters, daoConstructor, execQueryF, createTableF].join('\n\n')

    const daoExport =
      'export class DAOContext<MetadataType = any, OperationMetadataType = any> extends AbstractDAOContext<types.Scalars, MetadataType>  {\n\n' + indentMultiline(declarations) + '\n\n}'

    const daoContextMiddleware = `type DAOContextMiddleware<MetadataType = any, OperationMetadataType = any> = DAOMiddleware<${Array.from(typesMap.values())
      .filter((node) => node.entity)
      .map((n) => `${n.name}DAOGenerics<MetadataType, OperationMetadataType>`)
      .join(' | ')}>`

    const utilsCode = `
//--------------------------------------------------------------------------------
//------------------------------------- UTILS ------------------------------------
//--------------------------------------------------------------------------------

type DAOName = keyof DAOMiddlewareMap<any, any>
type DAOMiddlewareMap<MetadataType, OperationMetadataType> = {
${Array.from(typesMap.values())
  .filter((node) => node.entity)
  .map((n) => `  ${toFirstLower(n.name)}: ${n.name}DAOGenerics<MetadataType, OperationMetadataType>`)
  .join('\n')}
}
type GroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> =
  | IncludeGroupMiddleware<N, MetadataType, OperationMetadataType>
  | ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>
type IncludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  include: { [K in N]: true }
  middleware: DAOMiddleware<DAOMiddlewareMap<MetadataType, OperationMetadataType>[N]>
}
type ExcludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  exclude: { [K in N]: true }
  middleware: DAOMiddleware<DAOMiddlewareMap<MetadataType, OperationMetadataType>[Exclude<DAOName, N>]>
}
export const groupMiddleware = {
  includes<N extends DAOName, MetadataType, OperationMetadataType>(
    include: { [K in N]: true },
    middleware: DAOMiddleware<DAOMiddlewareMap<MetadataType, OperationMetadataType>[N]>,
  ): IncludeGroupMiddleware<N, MetadataType, OperationMetadataType> {
    return { include, middleware }
  },
  excludes<N extends DAOName, MetadataType, OperationMetadataType>(
    exclude: { [K in N]: true },
    middleware: ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>['middleware'],
  ): ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType> {
    return { exclude, middleware }
  },
}
function selectMiddleware<MetadataType, OperationMetadataType>(
  name: DAOName,
  middlewares: (DAOContextMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<DAOName, MetadataType, OperationMetadataType>)[],
): DAOContextMiddleware<MetadataType, OperationMetadataType>[] {
  return middlewares.flatMap((m) =>
    'include' in m
      ? Object.keys(m.include).includes(name)
        ? [m.middleware]
        : []
      : 'exclude' in m
      ? !Object.keys(m.exclude).includes(name)
        ? [m.middleware as DAOContextMiddleware<MetadataType, OperationMetadataType>]
        : []
      : [m],
  )
}
export async function mockedDAOContext<MetadataType = any, OperationMetadataType = any>(params: MockDAOContextParams<DAOContextParams<MetadataType, OperationMetadataType>>) {
  const newParams = await createMockedDAOContext<DAOContextParams<MetadataType, OperationMetadataType>>(params, ['default'], [])
  return new DAOContext(newParams)
}`
    return [[daoContextParamsExport, daoContextMiddleware, daoExport, utilsCode].join('\n\n')]
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- EXCLUDED ------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAOExludedFields(node: TsTypettaGeneratorNode): string {
    const exludedFields = node.fields
      .filter((n) => n.isExcluded)
      .map((n) => `'${n.name}'`)
      .join(' | ')
    const relationsFields = node.fields
      .filter((n) => n.type.kind === 'innerRef' || n.type.kind === 'foreignRef' || n.type.kind === 'relationEntityRef')
      .map((n) => `'${n.name}'`)
      .join(' | ')
    const daoExludedFields = `export type ${node.name}ExcludedFields = ${exludedFields ? exludedFields : 'never'}`
    const daoRelationFields = `export type ${node.name}RelationFields = ${relationsFields ? relationsFields : 'never'}`
    return [daoExludedFields, daoRelationFields].join('\n')
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- SCHEMA --------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAOSchema(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const daoSchemaBody = indentMultiline(this._generateDAOSchemaFields(node, typesMap).join(',\n'))
    const daoSchema = `export const ${toFirstLower(node.name)}Schema: Schema<types.Scalars> = {\n` + daoSchemaBody + `\n};`
    return daoSchema
  }

  public _generateDAOSchemaFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, path = ''): string[] {
    return node.fields
      .filter((field) => (field.type.kind === 'scalar' || field.type.kind === 'embedded') && !field.isExcluded)
      .map((field) => {
        const decorators = `${field.isRequired ? ', \nrequired: true' : ''}${field.isList ? ', \narray: true' : ''}${field.alias ? `, \nalias: '${field.alias}'` : ''}`
        if (field.type.kind === 'scalar') {
          // return [`'${field.name}': { scalar: '${field.graphqlType}'}${decorators}`]
          const scalar = `{\n${indentMultiline(`scalar: '${field.graphqlType}'${decorators}`)}\n}`
          return [`'${field.name}': ${scalar}`]
        } else if (field.type.kind === 'embedded') {
          const embeddedType = findNode(field.type.embed, typesMap)!
          const embeddedFields = indentMultiline(this._generateDAOSchemaFields(embeddedType, typesMap, path + field.name + '.').join(',\n'))
          const embedded = `{\n${indentMultiline(`embedded: {\n${embeddedFields}\n}${decorators}`)}\n}`
          return [`'${field.name}': ${embedded}`]
        }
        return []
      })
      .reduce((a, c) => [...a, ...c], [])
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- FILTER --------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAOFilter(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, customScalarsMap: Map<string, TsTypettaGeneratorScalar>): string {
    const daoFilterFieldsBody = indentMultiline(this._generateDAOFilterFields(node, typesMap, customScalarsMap).join(',\n'))
    const daoFilterFields = `type ${node.name}FilterFields = {\n` + daoFilterFieldsBody + `\n};`
    const daoRawFilter = `export type ${node.name}RawFilter = ${
      node.entity?.type === 'mongo' ? '() => Filter<Document>' : node.entity?.type === 'sql' ? '(builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>' : 'never'
    }`
    const daoFilter = `export type ${node.name}Filter = ${node.name}FilterFields & LogicalOperators<${node.name}FilterFields>;`

    return [daoFilterFields, daoFilter, daoRawFilter].join('\n')
  }

  public _generateDAOFilterFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, customScalarsMap: Map<string, TsTypettaGeneratorScalar>, path = ''): string[] {
    return node.fields
      .filter((field) => (field.type.kind === 'scalar' || field.type.kind === 'embedded') && !field.isExcluded)
      .map((field) => {
        let fieldName = path
        if (field.type.kind === 'scalar') {
          fieldName += field.name
          const fieldType = field.isList ? `types.Scalars['${field.graphqlType}'][]` : `types.Scalars['${field.graphqlType}']`
          const quantityOperators = field.graphqlType === 'Int' || field.graphqlType === 'Float' || customScalarsMap.get(field.graphqlType)?.isQuantity ? ` | QuantityOperators<${fieldType}>` : ''
          const stringOperators = field.graphqlType === 'String' || customScalarsMap.get(field.graphqlType)?.isString ? ` | StringOperators` : ''
          return [`'${fieldName}'?: ${fieldType} | null | EqualityOperators<${fieldType}> | ElementOperators` + stringOperators + quantityOperators]
        } else if (field.type.kind === 'embedded') {
          const embeddedType = findNode(field.type.embed, typesMap)!
          return this._generateDAOFilterFields(embeddedType, typesMap, customScalarsMap, path + field.name + '.')
        }
        return []
      })
      .reduce((a, c) => [...a, ...c], [])
  }

  // ---------------------------------------------------------------------------------------------------------
  // --------------------------------------------- RELATIONS -------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAORelations(node: TsTypettaGeneratorNode): string[] {
    const relationsBody = node.fields.flatMap((field) => {
      if (field.isList && (field.type.kind === 'innerRef' || field.type.kind === 'foreignRef' || field.type.kind === 'relationEntityRef') && !field.isExcluded) {
        const nodeName = field.type.kind === 'innerRef' ? field.type.innerRef : field.type.kind === 'foreignRef' ? field.type.foreignRef : field.type.destRef
        const body = [`filter?: ${nodeName}Filter`, `sorts?: ${nodeName}Sort[] | ${nodeName}RawSort`, 'skip?: number', 'limit?: number', `relations?: ${nodeName}Relations`]
          .map((v) => `    ${v}`)
          .join('\n')
        return `  ${field.name}?: {\n${body}\n  }`
      } else {
        return []
      }
    })
    return [`export type ${node.name}Relations = ${relationsBody.length > 0 ? `{\n${relationsBody.join('\n')}\n}` : 'Record<never, string>'}`]
  }

  // ---------------------------------------------------------------------------------------------------------
  // --------------------------------------------- PROJECTION ------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAOProjection(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const daoProjectionBody = indentMultiline(this._generateDAOProjectionFields(node, typesMap))
    const daoProjection = `export type ${node.name}Projection = {\n` + daoProjectionBody + `\n}`
    const daoParams = `export type ${node.name}Params<P extends ${node.name}Projection> = ParamProjection<types.${node.name}, ${node.name}Projection, P>`
    return [daoProjection, daoParams].join('\n')
  }

  public _generateDAOProjectionFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    return node.fields
      .map((field) => {
        if (field.type.kind === 'scalar') {
          return `${field.name}?: boolean,`
        } else if (field.type.kind === 'innerRef') {
          const linkedType = findNode(field.type.innerRef, typesMap)!
          return `${field.name}?: ${linkedType.name}Projection | boolean,`
        } else if (field.type.kind === 'foreignRef') {
          const linkedType = findNode(field.type.foreignRef, typesMap)!
          return `${field.name}?: ${linkedType.name}Projection | boolean,`
        } else if (field.type.kind === 'relationEntityRef') {
          const linkedType = findNode(field.type.destRef, typesMap)!
          return `${field.name}?: ${linkedType.name}Projection | boolean,`
        } else if (field.type.kind === 'embedded') {
          const embeddedType = findNode(field.type.embed, typesMap)!
          const embeddedProjection = indentMultiline(this._generateDAOProjectionFields(embeddedType, typesMap))
          return `${field.name}?: {\n${embeddedProjection}\n} | boolean,`
        }
      })
      .join('\n')
  }

  // ---------------------------------------------------------------------------------------------------------
  // ------------------------------------------------ SORT ---------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------
  public _generateDAOSort(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const daoSortFields = this._generateDAOSortFields(node, typesMap).join(' | ')
    const daoSortKeys = `export type ${node.name}SortKeys = ${daoSortFields};`
    const daoSort = `export type ${node.name}Sort = OneKey<${node.name}SortKeys, SortDirection>;`
    const daoRawSort = `export type ${node.name}RawSort = ${
      node.entity?.type === 'mongo' ? '() => Sort' : node.entity?.type === 'sql' ? '(builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>' : 'never'
    }`
    return `${daoSortKeys}\n${daoSort}\n${daoRawSort}`
  }

  public _generateDAOSortFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, path = ''): string[] {
    return node.fields
      .filter((field) => (field.type.kind === 'scalar' || field.type.kind === 'embedded') && !field.isExcluded)
      .map((field) => {
        let fieldName = path
        if (field.type.kind === 'scalar') {
          fieldName += field.name
          return [`'${fieldName}'`]
        } else if (field.type.kind === 'embedded') {
          const embeddedType = findNode(field.type.embed, typesMap)!
          return this._generateDAOSortFields(embeddedType, typesMap, path + field.name + '.')
        }
        return []
      })
      .reduce((a, c) => [...a, ...c], [])
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- UPDATE --------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAOUpdate(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const daoUpdateFieldsBody = indentMultiline(this._generateDAOUpdateFields(node, typesMap).join(',\n'))
    const daoRawUpdate = `export type ${node.name}RawUpdate = ${
      node.entity?.type === 'mongo' ? '() => UpdateFilter<Document>' : node.entity?.type === 'sql' ? '(builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>' : 'never'
    }`
    const daoUpdate = `export type ${node.name}Update = {\n` + daoUpdateFieldsBody + `\n};`
    return [daoUpdate, daoRawUpdate].join('\n')
  }

  public _generateDAOUpdateFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, path = ''): string[] {
    return node.fields
      .filter((field) => (field.type.kind === 'scalar' || field.type.kind === 'embedded') && !field.isExcluded)
      .map((field) => {
        const fieldName = path + field.name
        if (field.type.kind === 'scalar') {
          const fieldType = field.isList ? `types.Scalars['${field.graphqlType}'][]` : `types.Scalars['${field.graphqlType}']`
          return [`'${fieldName}'?: ${fieldType}${field.isRequired ? '' : ' | null'}`]
        } else if (field.type.kind === 'embedded') {
          const embeddedType = findNode(field.type.embed, typesMap)!
          const fieldType = field.isList ? `types.${embeddedType.name}[]` : `types.${embeddedType.name}`
          return [`'${fieldName}'?: ${fieldType}${field.isRequired ? '' : ' | null'}`, ...this._generateDAOUpdateFields(embeddedType, typesMap, path + field.name + '.')]
        }
        return []
      })
      .reduce((a, c) => [...a, ...c], [])
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- INSERT --------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAOInsert(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const daoInsertBody = indentMultiline(this._generateDAOInsertFields(node, typesMap))
    const daoInsert = `export type ${node.name}Insert = {\n` + daoInsertBody + `\n};`
    return daoInsert
  }

  public _generateDAOInsertFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    return node.fields
      .flatMap((field) => {
        if ((field.isID && field.idGenerationStrategy === 'db') || field.isExcluded) {
          return []
        }
        const required = (field.isID && field.idGenerationStrategy === 'user') || (!field.isID && field.isRequired)
        if (field.type.kind === 'scalar') {
          return [`${field.name}${required ? '' : '?'}: types.Scalars['${field.graphqlType}']${field.isList ? '[]' : ''},`]
        }
        if (field.type.kind === 'embedded') {
          return [`${field.name}${required ? '' : '?'}: types.${field.type.embed}${field.isList ? '[]' : ''},`]
        }
        return []
      })
      .join('\n')
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- PARAMS --------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAOParams(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const idField = findID(node)!
    const dbDAOGenerics = node.entity?.type === 'sql' ? 'KnexJsDAOGenerics' : node.entity?.type === 'mongo' ? 'MongoDBDAOGenerics' : 'DAOGenerics'
    const dbDAOParams = node.entity?.type === 'sql' ? 'KnexJsDAOParams' : node.entity?.type === 'mongo' ? 'MongoDBDAOParams' : 'DAOParams'
    const daoGenerics = `type ${node.name}DAOGenerics<MetadataType, OperationMetadataType> = ${dbDAOGenerics}<types.${node.name}, '${idField.name}', '${idField.graphqlType}', '${
      idField.idGenerationStrategy || this._config.defaultIdGenerationStrategy || 'generator'
    }', ${node.name}Filter, ${node.name}RawFilter, ${node.name}Relations, ${node.name}Projection, ${node.name}Sort, ${node.name}RawSort, ${node.name}Insert, ${node.name}Update, ${
      node.name
    }RawUpdate, ${node.name}ExcludedFields, ${node.name}RelationFields, MetadataType, OperationMetadataType, types.Scalars, '${toFirstLower(node.name)}'>;`
    const daoParams = `export type ${node.name}DAOParams<MetadataType, OperationMetadataType> = Omit<${dbDAOParams}<${node.name}DAOGenerics<MetadataType, OperationMetadataType>>, ${
      node.fields.find((f) => f.isID)?.idGenerationStrategy !== 'generator' ? "'idGenerator' | " : ''
    }'idField' | 'schema' | 'idScalar' | 'idGeneration'>`
    return [daoGenerics, daoParams].join('\n')
  }

  // ---------------------------------------------------------------------------------------------------------
  // ------------------------------------------------ DAO ----------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAO(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const daoName = node.entity?.type === 'sql' ? 'AbstractKnexJsDAO' : node.entity?.type === 'mongo' ? 'AbstractMongoDBDAO' : 'AbstractDAO'
    const daoBody = indentMultiline('\n' + this._generateConstructorMethod(node, typesMap) + '\n')
    return `export class ${node.name}DAO<MetadataType, OperationMetadataType> extends ${daoName}<${node.name}DAOGenerics<MetadataType, OperationMetadataType>> {\n` + daoBody + '\n}'
  }

  private _generateConstructorMethod(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const idField = findID(node)!
    const generatedRelations = `[\n${indentMultiline(this._generateRelations(node, typesMap).join(',\n'))}\n]`
    const relations = `relations: overrideRelations(\n${indentMultiline(`${generatedRelations}`)}\n)`
    const idGenerator = `idGeneration: '${idField.idGenerationStrategy || this._config.defaultIdGenerationStrategy || 'generator'}'`
    const idScalar = `idScalar: '${idField.graphqlType}'`
    const constructorBody = `super({ ${indentMultiline(`\n...params, \nidField: '${idField.name}', \nschema: ${toFirstLower(node.name)}Schema, \n${relations}, \n${idGenerator}, \n${idScalar}`)} \n});`
    return `public constructor(params: ${node.name}DAOParams<MetadataType, OperationMetadataType>){\n` + indentMultiline(constructorBody) + '\n}'
  }

  private _generateRelations(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, path = ''): string[] {
    return node.fields
      .map((field) => {
        return this._generateRelation(field, node, typesMap, path)
      })
      .reduce((a, c) => [...a, ...c], [])
  }

  private _generateRelation(field: TsTypettaGeneratorField, node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, path = ''): string[] {
    const type: DAORelation['type'] = field.isList ? '1-n' : '1-1'
    if (field.type.kind === 'innerRef') {
      const linkedType = findNode(field.type.innerRef, typesMap)!
      const linkedTypeIdField = findID(linkedType)!
      const reference: DAORelation['reference'] = 'inner'
      const refField = path + field.name
      const refFrom = field.type.refFrom ? field.type.refFrom : path + field.name + 'Id'
      const refTo = field.type.refTo ? field.type.refTo : linkedTypeIdField.name
      const dao = toFirstLower(field.type.innerRef)
      return [`{ type: '${type}', reference: '${reference}', field: '${refField}', refFrom: '${refFrom}', refTo: '${refTo}', dao: '${dao}', required: ${field.isRequired} }`]
    } else if (field.type.kind === 'foreignRef') {
      const idField = findID(node)!
      const reference: DAORelation['reference'] = 'foreign'
      const refField = path + field.name
      const refFrom = field.type.refFrom ?? `${toFirstLower(node.name)}Id`
      const refTo = path + (field.type.refTo ? field.type.refTo : idField.name)
      const dao = toFirstLower(field.type.foreignRef)
      return [`{ type: '${type}', reference: '${reference}', field: '${refField}', refFrom: '${refFrom}', refTo: '${refTo}', dao: '${dao}', required: ${field.isRequired} }`]
    } else if (field.type.kind === 'relationEntityRef') {
      const idField = findID(node)!
      const reference: DAORelation['reference'] = 'relation'
      const refField = path + field.name
      const refThisRefFrom = field.type.refThis?.refFrom ?? toFirstLower(field.type.sourceRef) + 'Id'
      const refThisRefTo = field.type.refThis?.refTo ?? idField.name
      const refOtherRefFrom = field.type.refOther?.refFrom ?? toFirstLower(field.type.destRef) + 'Id'
      const refOtherRefTo = field.type.refOther?.refTo ?? idField.name
      const relationDao = toFirstLower(field.type.entity)
      const entityDao = toFirstLower(field.type.destRef)
      return [
        `{ type: '${type}', reference: '${reference}', field: '${refField}', relationDao: '${relationDao}', entityDao: '${entityDao}', refThis: { refFrom: '${refThisRefFrom}', refTo: '${refThisRefTo}' }, refOther: { refFrom: '${refOtherRefFrom}', refTo: '${refOtherRefTo}' }, required: ${field.isRequired} }`,
      ]
    } else if (field.type.kind === 'embedded') {
      const embeddedType = findNode(field.type.embed, typesMap)!
      return this._generateRelations(embeddedType, typesMap, path + field.name + '.')
    }
    return []
  }
}
