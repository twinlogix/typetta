import { TypeScriptTypettaPluginConfig } from '../config'
import { TsTypettaGeneratorField, TsTypettaGeneratorNode, TsTypettaGeneratorScalar, TypettaGenerator } from '../types'
import { findField, findID, findNode, getID, getNode, removeParentPath, toFirstLower } from '../utils'
import { DEFAULT_SCALARS, indentMultiline } from '@graphql-codegen/visitor-plugin-common'
import { Kind, ValueNode } from 'graphql'

export class TsTypettaGenerator extends TypettaGenerator {
  constructor(config: TypeScriptTypettaPluginConfig) {
    super(config)
  }

  public async generate(nodes: (TsTypettaGeneratorNode | TsTypettaGeneratorScalar)[]): Promise<string> {
    const typesMap = new Map<string, TsTypettaGeneratorNode>()
    nodes.filter((node) => node.type === 'type').forEach((type) => typesMap.set(type.name, type as TsTypettaGeneratorNode))

    const customScalarsMap = new Map<string, TsTypettaGeneratorScalar>()
    nodes.filter((node) => node.type === 'scalar').forEach((type) => customScalarsMap.set(type.name, type as TsTypettaGeneratorScalar))

    this.checkIds(typesMap)
    this.checkReferences(typesMap, (type) => (type.entity ? true : false))
    this.checkArrayInSqlEntities(typesMap)

    if (!Array.from(typesMap.values()).some((v) => v.entity?.type)) {
      throw new Error('At least one entity is required for code generation. (@entity)')
    }

    const imports = this.generateImports(typesMap).join('\n')
    const scalars = this.generateScalarsSpecification([...customScalarsMap.values()])
    const ast = this.generateAST([...typesMap.values()].filter((node) => node.name !== 'Query' && node.name !== 'Mutation'))
    const daos = [...typesMap.values()]
      .filter((node) => node.name !== 'Query' && node.name !== 'Mutation')
      .flatMap((node) => this.generateDAOs(node, typesMap))
      .join('\n')
    const entityManager = this.generateEntityManager(typesMap, customScalarsMap)
    return [imports, scalars, ast, daos, entityManager].join('\n\n')
  }

  private checkIds(typesMap: Map<string, TsTypettaGeneratorNode>) {
    Array.from(typesMap.values())
      .filter((type) => type.entity)
      .forEach((type) => {
        const id = findID(type)
        if (!id) {
          throw new Error(`Type ${type.name} requires an @id field being a @entity.`)
        }
      })
  }

  private checkArrayInSqlEntities(typesMap: Map<string, TsTypettaGeneratorNode>) {
    Array.from(typesMap.values())
      .filter((type) => type.entity?.type === 'sql')
      .forEach((type) => {
        type.fields.forEach((f) => {
          if ((typeof f.type === 'string' || 'embedded' in f.type) && f.isList) {
            console.warn(
              `Type ${type.name} is an sql entity and have an array field: ${f.name}. Plain field or embedded field are not supported as array, the only way to define an array is through references (@foreignRef or @relationEntityRef).`,
            )
          }
        })
      })
  }

  private checkReferences(typesMap: Map<string, TsTypettaGeneratorNode>, filter: (type: TsTypettaGeneratorNode) => boolean, parents: TsTypettaGeneratorNode[] = [], visited: string[] = []) {
    Array.from(typesMap.values())
      .filter(filter)
      .forEach((type) => {
        const errorPrefix = `(Type: ${type.name}${parents.length > 0 ? `, Parents: ${parents.map((v) => v.name).join('<-')}` : ''})`
        if (visited.includes(type.name)) {
          return
        }
        type.fields.forEach((field) => {
          if (field.type.kind === 'embedded') {
            const type2Name = field.type.embed
            this.checkReferences(typesMap, (t) => t.name === type2Name, [type, ...parents], [...visited, type.name])
          } else if (field.type.kind === 'innerRef') {
            const refType = findNode(field.type.innerRef, typesMap)
            if (!refType) {
              throw new Error(`${errorPrefix} Field ${field.name} has a inner reference to ${field.type.innerRef} that cannot be resolved.`)
            }
            if (!refType.entity) {
              throw new Error(`${errorPrefix} Field ${field.name} has a inner reference to ${field.type.innerRef} that isn't an entity.`)
            }
            const refFrom = field.type.refFrom ?? field.name + 'Id'
            const refFromField = findField(type, refFrom, typesMap, parents)
            if (!refFromField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} has a inner reference to ${field.type.innerRef} with refFrom = '${refFrom}' that cannot be resolved.`)
            }
            const refTo = field.type.refTo ?? type.fields.find((f) => f.isID)?.name ?? 'id'
            const refToField = findField(refType, refTo, typesMap, parents)
            if (!refToField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} has a inner reference to ${field.type.innerRef} with refTo = '${refTo}' that cannot be resolved.`)
            }
            if (refFromField.field.graphqlType !== refToField.field.graphqlType) {
              throw new Error(
                `${errorPrefix} Field '${refFromField.root.name}.${removeParentPath(refFrom)}: ${refFromField.field.graphqlType}' has a inner reference to '${refToField.root.name}.${removeParentPath(
                  refTo,
                )}: ${refToField.field.graphqlType}' but they have different scalar type.`,
              )
            }
          } else if (field.type.kind === 'foreignRef') {
            const refType = findNode(field.type.foreignRef, typesMap)
            if (!refType) {
              throw new Error(`${errorPrefix} Field ${field.name} has a foreign reference to ${field.type.foreignRef} that cannot be resolved.`)
            }
            const refFrom = field.type.refFrom ?? `${toFirstLower(type.name)}Id`
            const refFromField = findField(refType, refFrom, typesMap, parents)
            if (!refFromField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} has a foreign reference to ${field.type.foreignRef} with refFrom = '${field.type.refFrom}' that cannot be resolved.`)
            }
            const refTo = field.type.refTo ?? type.fields.find((f) => f.isID)?.name ?? 'id'
            const refToField = findField(type, refTo, typesMap, parents)
            if (!refToField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} has a foreign reference to ${field.type.foreignRef} with refTo = '${field.type.refTo}' that cannot be resolved.`)
            }
            if (refFromField.field.graphqlType !== refToField.field.graphqlType) {
              throw new Error(
                `${errorPrefix} Field '${refFromField.root.name}.${removeParentPath(refFrom)}: ${refFromField.field.graphqlType}' has a foreign reference to '${
                  refToField.root.name
                }.${removeParentPath(refTo)}: ${refToField.field.graphqlType}' but they have different scalar type.`,
              )
            }
          } else if (field.type.kind === 'relationEntityRef') {
            const refType = findNode(field.type.entity, typesMap)
            const sourceRefType = findNode(field.type.sourceRef, typesMap)
            const destRefType = findNode(field.type.destRef, typesMap)
            if (!sourceRefType || !destRefType) {
              throw new Error('Unreachable')
            }
            if (!refType) {
              throw new Error(`${errorPrefix} Field ${field.name} is related to ${field.type.entity} that cannot be resolved.`)
            }

            // Ref this check (source type)
            const refThisRefFrom = field.type.refThis?.refFrom ?? `${toFirstLower(field.type.sourceRef)}Id`
            const refThisRefFromField = findField(refType, refThisRefFrom, typesMap, parents)
            if (!refThisRefFromField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} is related to ${field.type.entity} with refThis.refFrom = '${refThisRefFrom}' that cannot be resolved.`)
            }
            const refThisRefTo = field.type.refThis?.refTo ?? type.fields.find((f) => f.isID)?.name ?? 'id'
            const refThisRefToField = findField(sourceRefType, refThisRefTo, typesMap, parents)
            if (!refThisRefToField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} is related to ${field.type.sourceRef} with refThis.refTo = '${refThisRefTo}' that cannot be resolved.`)
            }
            if (refThisRefToField.field.graphqlType !== refThisRefFromField.field.graphqlType) {
              throw new Error(
                `${errorPrefix} Field '${refThisRefFromField.root.name}.${removeParentPath(refThisRefFrom)}: ${refThisRefFromField.field.graphqlType}' is related to '${
                  refThisRefToField.root.name
                }.${removeParentPath(refThisRefTo)}: ${refThisRefToField.field.graphqlType}' but they have different scalar type.`,
              )
            }

            // Ref other check (dest type)
            const refOtherRefFrom = field.type.refOther?.refFrom ?? `${toFirstLower(field.type.destRef)}Id`
            const refOtherRefFromField = findField(refType, refOtherRefFrom, typesMap, parents)
            if (!refOtherRefFromField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} is related to ${field.type.entity} with refOther.refFrom = '${refOtherRefFrom}' that cannot be resolved.`)
            }
            const refOtherRefTo = field.type.refOther?.refTo ?? type.fields.find((f) => f.isID)?.name ?? 'id'
            const refOtherRefToField = findField(destRefType, refOtherRefTo, typesMap, parents)
            if (!refOtherRefToField.field) {
              throw new Error(`${errorPrefix} Field ${field.name} is related to ${field.type.destRef} with refOther.refTo = '${refOtherRefTo}' that cannot be resolved.`)
            }
            if (refOtherRefToField.field.graphqlType !== refOtherRefFromField.field.graphqlType) {
              throw new Error(
                `${errorPrefix} Field '${refOtherRefFromField.root.name}.${removeParentPath(refOtherRefFrom)}: ${refOtherRefFromField.field.graphqlType}' is related to '${
                  refOtherRefToField.root.name
                }.${removeParentPath(refOtherRefTo)}: ${refThisRefToField.field.graphqlType}' but they have different scalar type.`,
              )
            }
          }
        })
      })
  }

  public generateImports(typesMap: Map<string, TsTypettaGeneratorNode>): string[] {
    const sqlSources = [...new Set([...typesMap.values()].flatMap((type) => (type.entity?.type === 'sql' ? [type.entity.source] : [])))]
    const hasSQLEntities = sqlSources.length > 0

    const mongoSources = [...new Set([...typesMap.values()].flatMap((type) => (type.entity?.type === 'mongo' ? [type.entity.source] : [])))]
    const hasMongoDBEntites = mongoSources.length > 0

    const knexImports = "import { Knex } from 'knex'"
    const mongodbImports = "import * as M from 'mongodb'"
    const commonImports = [`import * as T from '${this.config.typettaImport || '@twinlogix/typetta'}'`, `import * as types from '${this.config.tsTypesImport || '@twinlogix/typetta'}'`]

    return [...commonImports, ...(hasSQLEntities ? [knexImports] : []), ...(hasMongoDBEntites ? [mongodbImports] : [])]
  }

  public generateDAOs(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    if (node.entity) {
      const daoSchema = this.generateDAOSchema(node, typesMap)
      const daoParams = this.generateDAOParams(node)
      const utilsType = this.generateEntityUtilsType(node)
      const dao = this.generateDAO(node, typesMap)
      return [daoSchema, daoParams, utilsType, dao].join('\n\n')
    } else {
      const daoSchema = this.generateDAOSchema(node, typesMap)
      const utilsType = this.generateUtilsType(node)
      return [daoSchema, utilsType].join('\n\n')
    }
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- SCALARS -------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  private generateScalarsSpecification(scalars: TsTypettaGeneratorScalar[]): string {
    const defaultScalarsSpecification: TsTypettaGeneratorScalar[] = [
      { isEnum: false, isQuantity: false, isString: false, name: 'ID', type: 'scalar' },
      { isEnum: false, isQuantity: false, isString: true, name: 'String', type: 'scalar' },
      { isEnum: false, isQuantity: false, isString: false, name: 'Boolean', type: 'scalar' },
      { isEnum: false, isQuantity: true, isString: false, name: 'Int', type: 'scalar' },
      { isEnum: false, isQuantity: true, isString: false, name: 'Float', type: 'scalar' },
    ]
    return `export type ScalarsSpecification = {
      ${[...defaultScalarsSpecification, ...scalars].map((s) => {
        return `${s.name}: { type: ${s.isEnum ? `types.${s.name}` : `types.Scalars['${s.name}']`}, isTextual: ${s.isString}, isQuantitative: ${s.isQuantity} }`
      })},
    }`
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- AST -----------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  private generateAST(nodes: TsTypettaGeneratorNode[]): string {
    function generateASTNodes(field: TsTypettaGeneratorField): string {
      const decorators = `
      isList: ${field.isList}, 
      astName: '${field.graphqlType}', 
      isRequired: ${field.isRequired}, 
      isListElementRequired: ${field.isListElementRequired},
      isExcluded: ${field.isExcluded},
      isId: ${field.isID},
      generationStrategy: '${field.isID ? field.idGenerationStrategy ?? field.defaultGenerationStrategy : field.defaultGenerationStrategy}'`

      if (field.type.kind === 'embedded') {
        return `${field.name}: { type: 'embedded', ${decorators} }`
      } else if (field.type.kind === 'scalar') {
        return `${field.name}: { type: 'scalar', ${decorators} }`
      } else if (field.type.kind === 'foreignRef') {
        return `${field.name}: { type: 'relation', relation: 'foreign', ${decorators} }`
      } else if (field.type.kind === 'innerRef') {
        return `${field.name}: { type: 'relation', relation: 'inner', ${decorators} }`
      } else if (field.type.kind === 'relationEntityRef') {
        return `${field.name}: { type: 'relation', relation: 'relationEntity', ${decorators} }`
      }
      return `${field.name}: { ${decorators} }`
    }
    return `export type AST = {
    ${nodes
      .map((node) => {
        return `${node.name}: {
          fields: { ${node.fields.map((f) => generateASTNodes(f)).join(',\n')} }, 
          driverSpecification: { 
            rawFilter: ${
              node.entity?.type === 'mongo' ? '() => M.Filter<M.Document>' : node.entity?.type === 'sql' ? '(builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>' : 'never'
            }, 
            rawUpdate: ${
              node.entity?.type === 'mongo' ? '() => M.UpdateFilter<M.Document>' : node.entity?.type === 'sql' ? '(builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>' : 'never'
            }, 
            rawSorts: ${node.entity?.type === 'mongo' ? '() => M.Sort' : node.entity?.type === 'sql' ? '(builder: Knex.QueryBuilder<any, any>) => Knex.QueryBuilder<any, any>' : 'never'} }
          }`
      })
      .join(',\n')}
  }`
  }

  public generateEntityManager(typesMap: Map<string, TsTypettaGeneratorNode>, customScalarsSpecificationMap: Map<string, TsTypettaGeneratorScalar>): string {
    const sqlSources = [...new Set([...typesMap.values()].flatMap((type) => (type.entity?.type === 'sql' ? [type.entity.source] : [])))]
    const mongoSources = [...new Set([...typesMap.values()].flatMap((type) => (type.entity?.type === 'mongo' ? [type.entity.source] : [])))]
    const hasMongoDBEntites = mongoSources.length > 0
    const hasSQLEntities = sqlSources.length > 0
    const sqlSourcesLiteral = sqlSources.map((v) => `'${v}'`).join(' | ')
    const mongoSourcesLiteral = mongoSources.map((v) => `'${v}'`).join(' | ')
    const sqlSourcesType = `Record<${sqlSourcesLiteral}, Knex | 'mock'>`
    const mongoSourcesType = `Record<${mongoSourcesLiteral}, M.Db | 'mock'>`
    const daoNamesType = Array.from(typesMap.values())
      .filter((node) => node.entity)
      .map((node) => `'${node.name}'`)
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
    const middlewares = `\nmiddlewares?: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]`
    const overrides = `\noverrides?: { \n${indentMultiline(contextDAOParamsDeclarations)}\n}`
    const mongoDBParams = hasMongoDBEntites ? `,\nmongodb: ${mongoSourcesType}` : ''
    const knexJsParams = hasSQLEntities ? `,\nknex: ${sqlSourcesType}` : ''
    const adaptersParams = `,\nscalars?: T.UserInputDriverDataTypeAdapterMap<ScalarsSpecification, '${hasMongoDBEntites && hasSQLEntities ? 'both' : hasMongoDBEntites ? 'mongo' : 'knex'}'>`
    const loggerParams = `,\nlog?: T.LogInput<${daoNamesType}>,\nawaitLog?: boolean`
    const securityPolicyParam = ',\nsecurity?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>'
    const dbsInputParam =
      hasMongoDBEntites && hasSQLEntities
        ? `mongodb: ${mongoSourcesType}, knex: ${sqlSourcesType}`
        : hasSQLEntities
        ? `knex: ${sqlSourcesType}`
        : hasMongoDBEntites
        ? `mongodb: ${mongoSourcesType}`
        : ''
    const dbsParam = hasMongoDBEntites && hasSQLEntities ? 'mongodb: this.mongodb, knex: this.knex' : hasSQLEntities ? 'knex: this.knex' : hasMongoDBEntites ? 'mongodb: this.mongodb' : ''
    const entitiesInputParam = Array.from(typesMap.values())
      .flatMap((node) => {
        return node.entity?.type === 'mongo'
          ? [`${toFirstLower(node.name)}: M.Collection<M.Document> | null`]
          : node.entity?.type === 'sql'
          ? [`${toFirstLower(node.name)}: Knex.QueryBuilder<any, unknown[]> | null`]
          : []
      })
      .join(', ')
    const entitiesParam = Array.from(typesMap.values())
      .flatMap((node) => {
        return node.entity?.type === 'mongo'
          ? [`${toFirstLower(node.name)}: this.mongodb.${node.entity.source} === 'mock' ? null : this.mongodb.${node.entity.source}.collection('${node.entity.collection}')`]
          : node.entity?.type === 'sql'
          ? [`${toFirstLower(node.name)}: this.knex.${node.entity.source} === 'mock' ? null : this.knex.${node.entity.source}.table('${node.entity.table}')`]
          : []
      })
      .join(', ')
    const execQueryF =
      `public async execQuery<T>(run: (dbs: { ${dbsInputParam} }, entities: { ${entitiesInputParam} }) => Promise<T>): Promise<T> {\n` + `  return run({ ${dbsParam} }, { ${entitiesParam} })\n` + `}`
    const cloneF = `protected clone(): this {\n  return new EntityManager<MetadataType, OperationMetadataType, Permissions, SecurityDomain>(this.params) as this\n}`
    const createTableBody = Array.from(typesMap.values())
      .flatMap((node) => {
        return node.entity?.type === 'sql' ? [`this.${toFirstLower(node.name)}.createTable(args.typeMap ?? {}, args.defaultType)`] : []
      })
      .join('\n  ')
    const createTableF =
      createTableBody.length > 0
        ? `public async createTables(args: { typeMap?: Partial<Record<keyof ScalarsSpecification, { singleType: string, arrayType?: string }>>` +
          `, defaultType: { singleType: string, arrayType?: string } }): Promise<void> {\n` +
          `  ${createTableBody.trimEnd()}\n}`
        : ''

    const entityManagerParamsExport = `
export type EntityManagerParams<MetadataType, OperationMetadataType, Permissions extends string, SecurityDomain extends Record<string, unknown>> = {\n${indentMultiline(
      `${metadata}${middlewares}${overrides}${mongoDBParams}${knexJsParams}${adaptersParams}${loggerParams}${securityPolicyParam}`,
    )}\n}`

    const daoDeclarations = Array.from(typesMap.values())
      .filter((node) => node.entity)
      .map((node) => {
        return `private _${toFirstLower(node.name)}: ${node.name}DAO<MetadataType, OperationMetadataType> | undefined`
      })
      .join('\n')

    const mongoDBFields = hasMongoDBEntites ? `\nprivate mongodb: ${mongoSourcesType}` : ''
    const knexJsFields = hasSQLEntities ? `\nprivate knex: ${sqlSourcesType}` : ''
    const overridesDeclaration = `private overrides: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']${mongoDBFields}${knexJsFields}`
    const middlewareDeclaration = 'private middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]'
    const loggerDeclaration = `private logger?: T.LogFunction<${daoNamesType}>`
    const paramsDeclaration = `private params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>`

    const entityManagerGetters = Array.from(typesMap.values())
      .filter((node) => node.entity)
      .map((node) => {
        const datasource = node.entity?.type === 'mongo' ? "'" + node.entity.source + "'" : node.entity?.type === 'sql' ? "'" + node.entity.source + "'" : 'null'
        const entityManagerImplementationInit =
          node.entity?.type === 'sql' ? `, knex: db, tableName: '${node.entity?.table}'` : node.entity?.type === 'mongo' ? `, collection: db.collection('${node.entity?.collection}')` : ''
        const entityManagerMiddlewareInit = `, middlewares: [...(this.overrides?.${toFirstLower(node.name)}?.middlewares || []), ...selectMiddleware('${toFirstLower(
          node.name,
        )}', this.middlewares) as T.DAOMiddleware<${node.name}DAOGenerics<MetadataType, OperationMetadataType>>[]]`
        const normalDaoInstance = `new ${node.name}DAO({ entityManager: this, datasource: ${datasource}, metadata: this.metadata, ...this.overrides?.${toFirstLower(
          node.name,
        )}${entityManagerImplementationInit}${entityManagerMiddlewareInit}, name: '${node.name}', logger: this.logger, awaitLog: this.params.awaitLog })`
        const entityManagerInit =
          node.entity?.type === 'memory'
            ? `this._${toFirstLower(node.name)} = ${normalDaoInstance}`
            : `${
                node.entity?.type === 'mongo' ? `const db = this.mongodb.${node.entity.source}` : node.entity?.type === 'sql' ? `const db = this.knex.${node.entity.source}` : ''
              }\nthis._${toFirstLower(node.name)} = db === 'mock' ? (new InMemory${node.name}DAO({ entityManager: this, datasource: null, metadata: this.metadata, ...this.overrides?.${toFirstLower(
                node.name,
              )}${entityManagerMiddlewareInit}, name: '${node.name}', logger: this.logger, awaitLog: this.params.awaitLog }) as unknown as ${
                node.name
              }DAO<MetadataType, OperationMetadataType>) : ${normalDaoInstance}`
        const entityManagerGet = `if(!this._${toFirstLower(node.name)}) {\n${indentMultiline(entityManagerInit)}\n}\nreturn this._${toFirstLower(node.name)}`
        return `get ${toFirstLower(node.name)}(): ${node.name}DAO<MetadataType, OperationMetadataType> {\n${indentMultiline(entityManagerGet)}\n}`
      })
      .join('\n')

    const mongoDBConstructor = hasMongoDBEntites ? '\nthis.mongodb = params.mongodb' : ''
    const knexJsContsructor = hasSQLEntities ? '\nthis.knex = params.knex' : ''
    const scalarsNameList = [...Array.from(customScalarsSpecificationMap.keys()), ...Object.keys(DEFAULT_SCALARS)]
    const entityManagerConstructor =
      'constructor(params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>) {\n' +
      indentMultiline(
        `super({\n  ...params,\n  scalars: params.scalars ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, [${scalarsNameList.map((v) => `'${v}'`).join(', ')}]) : undefined\n})
this.overrides = params.overrides${mongoDBConstructor}${knexJsContsructor}\nthis.middlewares = params.middlewares || []
this.logger = T.logInputToLogger(params.log)
if(params.security && params.security.applySecurity !== false) {
  const securityMiddlewares = T.createSecurityPolicyMiddlewares(params.security)
  const defaultMiddleware = securityMiddlewares.others ? [groupMiddleware.excludes(Object.fromEntries(Object.keys(securityMiddlewares.middlewares).map(k => [k, true])) as any, securityMiddlewares.others as any)] : []
  this.middlewares = [...(params.middlewares ?? []), ...defaultMiddleware, ...Object.entries(securityMiddlewares.middlewares).map(([name, middleware]) => groupMiddleware.includes({[name]: true} as any, middleware as any))]
}
this.params = params`,
      ) +
      '\n}'

    const declarations = [
      daoDeclarations,
      paramsDeclaration,
      overridesDeclaration,
      middlewareDeclaration,
      loggerDeclaration,
      entityManagerGetters,
      entityManagerConstructor,
      execQueryF,
      cloneF,
      createTableF,
    ].join('\n\n')

    const entityManagerExport =
      `export class EntityManager<MetadataType = never, OperationMetadataType = never, Permissions extends string = never, SecurityDomain extends Record<string, unknown> = never> extends T.AbstractEntityManager<${
        mongoSourcesLiteral || 'never'
      }, ${sqlSourcesLiteral || 'never'}, ScalarsSpecification, MetadataType>  {\n\n` +
      indentMultiline(declarations) +
      '\n\n}'

    const entityManagerMiddleware = `type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>`

    const utilsCode = `
type DAOName = keyof DAOGenericsMap<never, never>
type DAOGenericsMap<MetadataType, OperationMetadataType> = {
${Array.from(typesMap.values())
  .filter((node) => node.entity)
  .map((n) => `  ${toFirstLower(n.name)}: ${n.name}DAOGenerics<MetadataType, OperationMetadataType>`)
  .join('\n')}
}
type DAOGenericsUnion<MetadataType, OperationMetadataType> = DAOGenericsMap<MetadataType, OperationMetadataType>[DAOName]
type GroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> =
  | IncludeGroupMiddleware<N, MetadataType, OperationMetadataType>
  | ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>
type IncludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  include: { [K in N]: true }
  middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[N]>
}
type ExcludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  exclude: { [K in N]: true }
  middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[Exclude<DAOName, N>]>
}
export const groupMiddleware = {
  includes<N extends DAOName, MetadataType, OperationMetadataType>(
    include: { [K in N]: true },
    middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[N]>,
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
  middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<DAOName, MetadataType, OperationMetadataType>)[],
): EntityManagerMiddleware<MetadataType, OperationMetadataType>[] {
  return middlewares.flatMap((m) =>
    'include' in m
      ? Object.keys(m.include).includes(name)
        ? [m.middleware]
        : []
      : 'exclude' in m
      ? !Object.keys(m.exclude).includes(name)
        ? [m.middleware as EntityManagerMiddleware<MetadataType, OperationMetadataType>]
        : []
      : [m],
  )
}
`
    return [[entityManagerParamsExport, entityManagerMiddleware, entityManagerExport, utilsCode].join('\n')].join('\n')
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- SCHEMA --------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public generateDAOSchema(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const daoSchemaBody = indentMultiline(this.generateDAOSchemaFields(node, typesMap).join(',\n'))
    const daoSchema = `export function ${toFirstLower(node.name)}Schema(): T.Schema<ScalarsSpecification> {\n  return {\n` + daoSchemaBody + `\n  }\n}`
    return daoSchema
  }

  public generateDAOSchemaFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string[] {
    function resolveNodeValue(valueNode: ValueNode): unknown {
      switch (valueNode.kind) {
        case Kind.INT:
          return Number(valueNode.value)
        case Kind.STRING:
          return valueNode.value
        case Kind.FLOAT:
          return Number(valueNode.value)
        case Kind.BOOLEAN:
          return valueNode.value
        case Kind.ENUM:
          return valueNode.value
        case Kind.LIST:
          return valueNode.values.map((v) => resolveNodeValue(v))
        case Kind.NULL:
          return null
        case Kind.OBJECT:
          return valueNode.fields.reduce((prev, f) => {
            return {
              ...prev,
              [f.name.value]: resolveNodeValue(f.value),
            }
          }, {})
        default:
          return 'UNKNOWN VALUE NODE KIND'
      }
    }
    return node.fields.flatMap((field) => {
      const decorators = [
        field.isListElementRequired ? 'isListElementRequired: true' : null,
        field.isID ? 'isId: true' : null,
        field.isID ? `generationStrategy: '${field.idGenerationStrategy || this.config.defaultIdGenerationStrategy || 'generator'}'` : null,
        field.isRequired ? 'required: true' : null,
        field.isList ? 'isList: true' : null,
        field.isEnum ? 'isEnum: true' : null,
        field.alias ? `alias: '${field.alias}'` : null,
        field.defaultGenerationStrategy && !field.isID ? `generationStrategy: '${field.defaultGenerationStrategy}'` : null,
        field.schemaMetadata ? `metadata: Object.fromEntries([${field.schemaMetadata.map((m) => `['${m.key}', '${m.value}']`).join(', ')}])` : null,
        `directives: { ${field.customDirectives.map((d) => `'${d.name.value}': { ${d.arguments?.map((a) => `'${a.name.value}': ${JSON.stringify(resolveNodeValue(a.value))}`)} }`).join(',')} }`,
      ]
        .filter((v) => v != null)
        .join(',')
      if (field.type.kind === 'scalar' && !field.isExcluded) {
        const scalar = field.isEnum ? 'String' : field.graphqlType
        return [
          `'${field.name}': {
            type: 'scalar',
            scalar: '${scalar}',
            ${decorators}
          }`,
        ]
      } else if (field.type.kind === 'embedded' && !field.isExcluded) {
        const schema = toFirstLower(field.graphqlType)
        return [
          `'${field.name}': {
            type: 'embedded',
            schema: () => ${schema}Schema(),
            ${decorators}
          }`,
        ]
      } else if (field.type.kind === 'innerRef') {
        const dao = toFirstLower(field.type.innerRef)
        const schema = toFirstLower(field.graphqlType)
        const linkedType = getNode(field.type.innerRef, typesMap)
        const refFrom = field.type.refFrom ?? field.name + 'Id'
        const refTo = field.type.refTo ?? getID(linkedType).name
        return [
          `'${field.name}': {
              type: 'relation',
              relation: 'inner',
              schema: () => ${schema}Schema(),
              refFrom: '${refFrom}',
              refTo: '${refTo}',
              dao: '${dao}',
              ${decorators}
            }`,
        ]
      } else if (field.type.kind === 'foreignRef') {
        const dao = toFirstLower(field.type.foreignRef)
        const schema = toFirstLower(field.graphqlType)
        const refFrom = field.type.refFrom ?? `${toFirstLower(node.name)}Id`
        const refTo = field.type.refTo ?? getID(node).name
        return [
          `'${field.name}':{
              type: 'relation',
              relation: 'foreign',
              schema: () => ${schema}Schema(),
              refFrom: '${refFrom}',
              refTo: '${refTo}',
              dao: '${dao}',
              ${decorators}
            }`,
        ]
      } else if (field.type.kind === 'relationEntityRef') {
        const schema = toFirstLower(field.graphqlType)
        const refThisRefFrom = field.type.refThis?.refFrom ?? toFirstLower(field.type.sourceRef) + 'Id'
        const refThisRefTo = field.type.refThis?.refTo ?? getID(node).name
        const refOtherRefFrom = field.type.refOther?.refFrom ?? toFirstLower(field.type.destRef) + 'Id'
        const refOtherRefTo = field.type.refOther?.refTo ?? getID(node).name
        const relationDao = toFirstLower(field.type.entity)
        const entityDao = toFirstLower(field.type.destRef)
        return [
          `'${field.name}': { 
               type: 'relation',
               relation: 'relationEntity',
               schema: () => ${schema}Schema(),
               refThis: {
                 refFrom: '${refThisRefFrom}',
                 refTo: '${refThisRefTo}'
               },
               refOther: {
                 refFrom: '${refOtherRefFrom}',
                 refTo: '${refOtherRefTo}',
                 dao: '${entityDao}'
               },
               relationEntity: { schema: () => ${toFirstLower(field.type.entity)}Schema(), dao: '${relationDao}' },
               ${decorators}
            }`,
        ]
      }
      return []
    })
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- PARAMS --------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public generateDAOParams(node: TsTypettaGeneratorNode): string {
    const dbDAOGenerics =
      node.entity?.type === 'sql' ? 'T.KnexJsDAOGenerics' : node.entity?.type === 'mongo' ? 'T.MongoDBDAOGenerics' : node.entity?.type === 'memory' ? 'T.InMemoryDAOGenerics' : 'T.DAOGenerics'
    const dbDAOParams =
      node.entity?.type === 'sql' ? 'T.KnexJsDAOParams' : node.entity?.type === 'mongo' ? 'T.MongoDBDAOParams' : node.entity?.type === 'memory' ? 'T.InMemoryDAOParams' : 'T.DAOParams'
    const daoGenerics = `type ${node.name}DAOGenerics<MetadataType, OperationMetadataType> = ${dbDAOGenerics}<'${node.name}', AST, ScalarsSpecification, ${node.name}CachedTypes, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>`
    const daoParams = `export type ${node.name}DAOParams<MetadataType, OperationMetadataType> = Omit<${dbDAOParams}<${node.name}DAOGenerics<MetadataType, OperationMetadataType>>, ${
      node.fields.find((f) => f.isID)?.idGenerationStrategy !== 'generator' ? "'idGenerator' | " : ''
    }'idField' | 'schema' | 'idScalar' | 'idGeneration'>`
    const inMemoryDaoParams = `export type InMemory${node.name}DAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<${
      node.name
    }DAOGenerics<MetadataType, OperationMetadataType>>, ${
      node.fields.find((f) => f.isID)?.idGenerationStrategy !== 'generator' ? "'idGenerator' | " : ''
    }'idField' | 'schema' | 'idScalar' | 'idGeneration'>`
    return [daoGenerics, daoParams, inMemoryDaoParams].join('\n')
  }

  private generateEntityUtilsType(node: TsTypettaGeneratorNode): string {
    return `
    export type ${node.name}IdFields = T.IdFields<'${node.name}', AST>
    export interface ${node.name}Model extends types.${node.name} {}
    export interface ${node.name}Insert extends T.Insert<'${node.name}', AST, ScalarsSpecification> {}
    export interface ${node.name}PlainModel extends T.GenerateModel<'${node.name}', AST, ScalarsSpecification, 'relation'> {}
    export interface ${node.name}Projection extends T.Projection<'${node.name}', AST> {}
    export interface ${node.name}Update extends T.Update<'${node.name}', AST, ScalarsSpecification> {}
    export interface ${node.name}Filter extends T.Filter<'${node.name}', AST, ScalarsSpecification> {}
    export interface ${node.name}SortElement extends T.SortElement<'${node.name}', AST> {}
    export interface ${node.name}RelationsFindParams extends T.RelationsFindParams<'${node.name}', AST, ScalarsSpecification> {}
    export type ${node.name}Params<P extends ${node.name}Projection> = T.Params<'${node.name}', AST, ScalarsSpecification, P>
    export type ${node.name}CachedTypes = T.CachedTypes<${node.name}IdFields, ${node.name}Model, ${node.name}Insert, ${node.name}PlainModel, ${node.name}Projection, ${node.name}Update, ${node.name}Filter, ${node.name}SortElement, ${node.name}RelationsFindParams>`
  }

  private generateUtilsType(node: TsTypettaGeneratorNode): string {
    return `
    export interface ${node.name}Model extends types.${node.name} {}
    export interface ${node.name}PlainModel extends T.GenerateModel<'${node.name}', AST, ScalarsSpecification, 'relation'> {}`
  }

  // ---------------------------------------------------------------------------------------------------------
  // ------------------------------------------------ DAO ----------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public generateDAO(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const daoName =
      node.entity?.type === 'sql' ? 'T.AbstractKnexJsDAO' : node.entity?.type === 'mongo' ? 'T.AbstractMongoDBDAO' : node.entity?.type === 'memory' ? 'T.AbstractInMemoryDAO' : 'AbstractDAO'
    const daoBody = indentMultiline('\n' + this._generateConstructorMethod(node, typesMap, `${node.name}DAOParams`) + '\n')
    const daoBodyInMemory = indentMultiline('\n' + this._generateConstructorMethod(node, typesMap, `InMemory${node.name}DAOParams`) + '\n')
    return [
      `export class ${node.name}DAO<MetadataType, OperationMetadataType> extends ${daoName}<${node.name}DAOGenerics<MetadataType, OperationMetadataType>> {${daoBody}}`,
      `export class InMemory${node.name}DAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<${node.name}DAOGenerics<MetadataType, OperationMetadataType>> {${daoBodyInMemory}}`,
    ].join('\n\n')
  }

  private _generateConstructorMethod(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, daoParams: string): string {
    const constructorBody = `super({ ${indentMultiline(`\n...params, \nschema: ${toFirstLower(node.name)}Schema()`)} \n})`
    return (
      `
      public static projection<P extends T.Projection<'${node.name}', AST>>(p: P) {
        return p
      }
      public static mergeProjection<P1 extends T.Projection<'${node.name}', AST>, P2 extends T.Projection<'${node.name}', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'${node.name}', AST>, P1, P2> {
        return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'${node.name}', AST>, P1, P2>
      }
      public constructor(params: ${daoParams}<MetadataType, OperationMetadataType>){\n` +
      indentMultiline(constructorBody) +
      '\n}'
    )
  }
}
