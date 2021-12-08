import { TsTypettaGeneratorField, TsTypettaGeneratorNode, TsTypettaGeneratorScalar } from '../generator'
import { findID, findNode, indentMultiline, isEmbed, isEntity, isForeignRef, isInnerRef, toFirstLower } from '../utils'
import { TsTypettaAbstractGenerator } from './abstractGenerator'

export class TsTypettaDAOGenerator extends TsTypettaAbstractGenerator {
  public generateImports(): string[] {
    return [
      "import { DriverDataTypeAdapterMap, KnexJSDataTypeAdapterMap, MongoDBDataTypeAdapterMap, MongoDBDAOParams, KnexJsDAOParams, Schema, DAOAssociationType, DAOAssociationReference, AbstractMongoDBDAO, AbstractKnexJsDAO, AbstractDAOContext, LogicalOperators, QuantityOperators, EqualityOperators, GeospathialOperators, StringOperators, ElementOperators, ArrayOperators, OneKey, SortDirection, overrideAssociations } from '@twinlogix/typetta';",
      `import * as types from '${this._config.tsTypesImport}';`,
      "import { Db } from 'mongodb';",
      "import { Knex } from 'knex';",
      "import { v4 as uuidv4 } from 'uuid'",
    ]
  }

  public generateDefinition(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, customScalarsMap: Map<string, TsTypettaGeneratorScalar>): string {
    if (isEntity(node)) {
      const daoExcluded = this._generateDAOExludedFields(node)
      const daoSchema = this._generateDAOSchema(node, typesMap)
      const daoFilter = this._generateDAOFilter(node, typesMap, customScalarsMap)
      const daoProjection = this._generateDAOProjection(node, typesMap)
      const daoSort = this._generateDAOSort(node, typesMap)
      const daoUpdate = this._generateDAOUpdate(node, typesMap)
      const daoParams = this._generateDAOParams(node, typesMap)
      const dao = this._generateDAO(node, typesMap)
      return [daoExcluded, daoSchema, daoFilter, daoProjection, daoSort, daoUpdate, daoParams, dao].join('\n\n')
    } else {
      return ''
    }
  }

  public generateExports(typesMap: Map<string, TsTypettaGeneratorNode>): string[] {
    const hasMongoDBEntites = [...typesMap.values()].filter((type) => type.mongoEntity).length > 0
    const hasSQLEntities = [...typesMap.values()].filter((type) => type.sqlEntity).length > 0

    const contextDAOParamsDeclarations = Array.from(typesMap.values())
      .concat([])
      .filter((node) => isEntity(node))
      .map((node) => {
        return `${toFirstLower(node.name)}?: Partial<${node.name}DAOParams<OptionsType>>`
      })
      .join(',\n')

    const options = `options?: OptionsType`
    const overrides = `\noverrides?: { \n${indentMultiline(contextDAOParamsDeclarations)}\n}`
    const mongoDBParams = hasMongoDBEntites ? ',\nmongoDB: Db' : ''
    const knexJsParams = hasSQLEntities ? ',\nknex: Knex' : ''
    const adaptersParams = ',\nadapters?: Partial<DriverDataTypeAdapterMap<types.Scalars>>'

    const daoContextParamsExport = `export type DAOContextParams<OptionsType> = {\n${indentMultiline(`${options}${overrides}${mongoDBParams}${knexJsParams}${adaptersParams}`)}\n};`

    const daoDeclarations = Array.from(typesMap.values())
      .filter((node) => isEntity(node))
      .map((node) => {
        return `private _${toFirstLower(node.name)}: ${node.name}DAO<OptionType> | undefined;`
      })
      .join('\n')

    const mongoDBFields = hasMongoDBEntites ? '\nprivate mongoDB: Db;' : ''
    const knexJsFields = hasSQLEntities ? '\nprivate knex: Knex;' : ''
    const overridesDeclaration = `private overrides: DAOContextParams<OptionType>['overrides'];${mongoDBFields}${knexJsFields}`

    const daoGetters = Array.from(typesMap.values())
      .filter((node) => isEntity(node))
      .map((node) => {
        const daoImplementationInit = node.sqlEntity
          ? `, knex: this.knex, tableName: '${node.sqlEntity?.table}'`
          : node.mongoEntity
            ? `, collection: this.mongoDB.collection('${node.mongoEntity?.collection}')`
            : ''
        const daoInit = `this._${toFirstLower(node.name)} = new ${node.name}DAO({ daoContext: this, options: this.options, ...this.overrides?.${toFirstLower(node.name)}${daoImplementationInit} });`
        const daoGet = `if(!this._${toFirstLower(node.name)}) {\n${indentMultiline(daoInit)}\n}\nreturn this._${toFirstLower(node.name)}${false ? '.apiV1' : ''};`
        return `get ${toFirstLower(node.name)}() {\n${indentMultiline(daoGet)}\n}`
      })
      .join('\n')

    const mongoDBConstructor = hasMongoDBEntites ? '\nthis.mongoDB = params.mongoDB' : ''
    const knexJsContsructor = hasSQLEntities ? '\nthis.knex = params.knex;' : ''
    const daoConstructor =
      'constructor(params: DAOContextParams<OptionType>) {\n' + indentMultiline(`super(params)\nthis.overrides = params.overrides${mongoDBConstructor}${knexJsContsructor}`) + '\n}'

    const declarations = [daoDeclarations, overridesDeclaration, daoGetters, daoConstructor].join('\n\n')

    const daoExport = 'export class DAOContext<OptionType extends object = {}> extends AbstractDAOContext<types.Scalars, OptionType>  {\n\n' + indentMultiline(declarations) + '\n\n}'

    return [[daoContextParamsExport, daoExport].join('\n\n')]
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- EXCLUDED ------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAOExludedFields(node: TsTypettaGeneratorNode): string {
    const daoFilterFieldsBody = node.fields
      .filter((n) => n.isExcluded || (typeof n.type !== 'string' && ('innerRef' in n.type || 'foreignRef' in n.type)))
      .map((n) => `'${n.name}'`)
      .join(' | ')
    const daoExludedFields = `export type ${node.name}ExcludedFields = ${daoFilterFieldsBody ? daoFilterFieldsBody : 'never'}`
    return [daoExludedFields].join('\n')
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- SCHEMA --------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAOSchema(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const daoSchemaBody = indentMultiline(this._generateDAOSchemaFields(node, typesMap).join(',\n'))
    const daoSchema = `export const ${toFirstLower(node.name)}Schema : Schema<types.Scalars>= {\n` + daoSchemaBody + `\n};`
    return daoSchema
  }

  public _generateDAOSchemaFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, path: string = ''): string[] {
    return node.fields
      .filter((field) => (typeof field.type === 'string' || isEmbed(field.type)) && !field.isExcluded)
      .map((field) => {
        const decorators = `${field.isRequired ? ', \nrequired: true' : ''}${field.isList ? ', \narray: true' : ''}${field.alias ? `, \nalias: '${field.alias}'` : ''}`;
        if (typeof field.type === 'string') {
          // return [`'${field.name}': { scalar: '${field.graphqlType}'}${decorators}`]
          const scalar = `{\n${indentMultiline(`scalar: '${field.graphqlType}'${decorators}`)}\n}`
          return [`'${field.name}': ${scalar}`]
        } else if (isEmbed(field.type)) {
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
    const daoFilter = `export type ${node.name}Filter = ${node.name}FilterFields & LogicalOperators<${node.name}FilterFields>;`

    return [daoFilterFields, daoFilter].join('\n')
  }

  public _generateDAOFilterFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, customScalarsMap: Map<string, TsTypettaGeneratorScalar>, path: string = ''): string[] {
    return node.fields
      .filter((field) => (typeof field.type === 'string' || isEmbed(field.type)) && !field.isExcluded)
      .map((field) => {
        let fieldName = path
        if (typeof field.type === 'string') {
          fieldName += field.name
          const fieldType = field.isList ? `${field.type}[]` : field.type

          const stringOperators = field.type === 'string' ? ` | StringOperators` : ''
          const quantityOperators = field.type === 'number' || field.type === 'Date' ? ` | QuantityOperators<${field.type}>` : ''
          const geoOperators = customScalarsMap.get(field.type)?.isGeoPoint ? ` | GeospathialOperators` : ''
          const arrayOperators = field.isList ? ` | ArrayOperators<${fieldType}>` : ''

          return [`'${fieldName}'?: ${fieldType} | null | EqualityOperators<${fieldType}> | ElementOperators` + stringOperators + quantityOperators + geoOperators + arrayOperators]
        } else if (isEmbed(field.type)) {
          const embeddedType = findNode(field.type.embed, typesMap)!
          return this._generateDAOFilterFields(embeddedType, typesMap, customScalarsMap, path + field.name + '.')
        }
        return []
      })
      .reduce((a, c) => [...a, ...c], [])
  }

  // ---------------------------------------------------------------------------------------------------------
  // --------------------------------------------- PROJECTION ------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAOProjection(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const daoProjectionBody = indentMultiline(this._generateDAOProjectionFields(node, typesMap))
    const daoProjection = `export type ${node.name}Projection = {\n` + daoProjectionBody + `\n};`
    return daoProjection
  }

  public _generateDAOProjectionFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    return node.fields
      .map((field) => {
        if (typeof field.type === 'string') {
          return `${field.name}?: boolean,`
        } else if (isInnerRef(field.type)) {
          const linkedType = findNode(field.type.innerRef, typesMap)!
          return `${field.name}?: ${linkedType.name}Projection | boolean,`
        } else if (isForeignRef(field.type)) {
          const linkedType = findNode(field.type.foreignRef, typesMap)!
          return `${field.name}?: ${linkedType.name}Projection | boolean,`
        } else if (isEmbed(field.type)) {
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
    const daoSortFields = indentMultiline(this._generateDAOSortFields(node, typesMap).join('|\n'))
    const daoSortKeys = `export type ${node.name}SortKeys = \n${daoSortFields};`
    const daoSort = `export type ${node.name}Sort = OneKey<${node.name}SortKeys, SortDirection>;`
    return `${daoSortKeys}\n${daoSort}`
  }

  public _generateDAOSortFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, path: string = ''): string[] {
    return node.fields
      .filter((field) => (typeof field.type === 'string' || isEmbed(field.type)) && !field.isExcluded)
      .map((field) => {
        let fieldName = path
        if (typeof field.type === 'string') {
          fieldName += field.name
          return [`'${fieldName}'`]
        } else if (isEmbed(field.type)) {
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
    const daoUpdate = `export type ${node.name}Update = {\n` + daoUpdateFieldsBody + `\n};`

    return daoUpdate
  }

  public _generateDAOUpdateFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, path: string = ''): string[] {
    return node.fields
      .filter((field) => (typeof field.type === 'string' || isEmbed(field.type)) && !field.isExcluded)
      .map((field) => {
        const fieldName = path + field.name
        if (typeof field.type === 'string') {
          const fieldType = field.isList ? `Array<${field.type}>` : field.type
          return [`'${fieldName}'?: ${fieldType}${field.isRequired ? '' : ' | null'}`]
        } else if (isEmbed(field.type)) {
          const embeddedType = findNode(field.type.embed, typesMap)!
          const fieldType = field.isList ? `Array<types.${embeddedType.name}>` : `types.${embeddedType.name}`
          return [`'${fieldName}'?: ${fieldType}${field.isRequired ? '' : ' | null'}`, ...this._generateDAOUpdateFields(embeddedType, typesMap, path + field.name + '.')]
        }
        return []
      })
      .reduce((a, c) => [...a, ...c], [])
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- PARAMS --------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAOParams(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const idField = findID(node)!
    const dbDAOParams = node.sqlEntity ? 'KnexJsDAOParams' : node.mongoEntity ? 'MongoDBDAOParams' : 'DAOParams'
    const daoAllParams = `type ${node.name}DAOAllParams<OptionType> = ${dbDAOParams}<types.${node.name}, '${idField.name}', ${idField.type}, ${idField.isAutogenerated ? 'true' : 'false'}, ${node.name}Filter, ${node.name
      }Projection, ${node.name}Update, ${node.name}ExcludedFields, ${node.name}Sort, OptionType, types.Scalars>;`
    const daoParams = `export type ${node.name}DAOParams<OptionType> = Omit<${node.name}DAOAllParams<OptionType>, 'idField' | 'schema'> & Partial<Pick<${node.name}DAOAllParams<OptionType>, 'idField' | 'schema'>>;`
    return [daoAllParams, daoParams].join('\n')
  }

  // ---------------------------------------------------------------------------------------------------------
  // ------------------------------------------------ DAO ----------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAO(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const idField = findID(node)!
    const daoName = node.sqlEntity ? 'AbstractKnexJsDAO' : node.mongoEntity ? 'AbstractMongoDBDAO' : 'AbstractDAO'
    const daoBody = indentMultiline('\n' + this._generateConstructorMethod(node, typesMap) + '\n')

    return (
      `export class ${node.name}DAO<OptionType extends object> extends ${daoName}<types.${node.name}, '${idField.name}', ${idField.type}, ${idField.isAutogenerated ? 'true' : 'false'}, ${node.name}Filter, ${node.name
      }Projection, ${node.name}Sort, ${node.name}Update, ${node.name}ExcludedFields, OptionType, types.Scalars> {\n` +
      daoBody +
      '\n}'
    )
  }

  private _generateConstructorMethod(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const idField = findID(node)!
    const generatedAssociations = `[\n${indentMultiline(this._generateAssociations(node, typesMap).join(',\n'))}\n]`
    const associations = `associations: overrideAssociations(\n${indentMultiline(`${generatedAssociations}`)}\n)`
    const idGenerator = !idField.isAutogenerated ? '' : idField.type === 'string' ? `idGenerator: () => uuidv4()` : 'idGenerator: undefined'
    const constructorBody = `super({ ${indentMultiline(`\n...params, \nidField: '${idField.name}', \nschema: ${toFirstLower(node.name)}Schema, \n${associations}, \n${idGenerator}`)} \n});`
    return `public constructor(params: ${node.name}DAOParams<OptionType>){\n` + indentMultiline(constructorBody) + '\n}'
  }

  private _generateAssociations(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, path: string = ''): string[] {
    return node.fields
      .map((field) => {
        return this._generateAssociation(field, node, typesMap, path)
      })
      .reduce((a, c) => [...a, ...c], [])
  }

  private _generateAssociation(field: TsTypettaGeneratorField, node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, path: string = ''): string[] {
    if (typeof field.type !== 'string') {
      if (isInnerRef(field.type)) {
        const linkedType = findNode(field.type.innerRef, typesMap)!
        const linkedTypeIdField = findID(linkedType)!
        const type = field.isList ? 'DAOAssociationType.ONE_TO_MANY' : 'DAOAssociationType.ONE_TO_ONE'
        const reference = 'DAOAssociationReference.INNER'
        const refField = path + field.name
        const refFrom = field.type.refFrom ? field.type.refFrom : path + field.name + 'Id'
        const refTo = field.type.refTo ? field.type.refTo : linkedTypeIdField.name
        const dao = toFirstLower(field.type.innerRef)
        return [`{ type: ${type}, reference: ${reference}, field: '${refField}', refFrom: '${refFrom}', refTo: '${refTo}', dao: '${dao}' }`]
      } else if (isForeignRef(field.type)) {
        const idField = findID(node)!
        const type = field.isList ? 'DAOAssociationType.ONE_TO_MANY' : 'DAOAssociationType.ONE_TO_ONE'
        const reference = 'DAOAssociationReference.FOREIGN'
        const refField = path + field.name
        const refFrom = field.type.refFrom
        const refTo = path + (field.type.refTo ? field.type.refTo : idField.name)
        const dao = toFirstLower(field.type.foreignRef)
        return [`{ type: ${type}, reference: ${reference}, field: '${refField}', refFrom: '${refFrom}', refTo: '${refTo}', dao: '${dao}' }`]
      } else if (isEmbed(field.type)) {
        const embeddedType = findNode(field.type.embed, typesMap)!
        return this._generateAssociations(embeddedType, typesMap, path + field.name + '.')
      }
    }
    return []
  }

}
