import { TsTypettaGeneratorField, TsTypettaGeneratorNode } from '../generator'
import { findID, findNode, indentMultiline, isEmbed, isEntity, isForeignRef, isInnerRef, toFirstLower } from '../utils'
import { TsTypettaAbstractGenerator } from './abstractGenerator'

export class TsTypettaDAOGenerator extends TsTypettaAbstractGenerator {
  public generateImports(): string[] {
    return [
      "import { DAOParams, DAOAssociationType, DAOAssociationReference, AbstractTypettaDAO, AbstractDAOContext, LogicalOperators, ComparisonOperators, ElementOperators, EvaluationOperators, GeospathialOperators, ArrayOperators, OneKey, SortDirection, overrideAssociations } from '@twinlogix/typetta';",
    ]
  }

  public generateDefinition(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    if (isEntity(node)) {
      const daoExcluded = this._generateDAOExludedFields(node)
      const daoFilter = this._generateDAOFilter(node, typesMap)
      const daoSort = this._generateDAOSort(node, typesMap)
      const daoUpdate = this._generateDAOUpdate(node, typesMap)
      const daoParams = this._generateDAOParams(node, typesMap)
      const dao = this._generateDAO(node, typesMap)
      return [daoExcluded, daoFilter, daoSort, daoUpdate, daoParams, dao].join('\n\n')
    } else {
      return ''
    }
  }

  public generateExports(typesMap: Map<string, TsTypettaGeneratorNode>): string[] {
    const contextDAOParamsDeclarations = Array.from(typesMap.values())
      .concat([])
      .filter((node) => isEntity(node))
      .map((node) => {
        return `${toFirstLower(node.name)}?: ${node.name}DAOParams`
      })
      .join(',\n')

    const daoContextParamsExport = `export interface DAOContextParams {\n${indentMultiline(
      `defaultOptions?: ${this._getOptionsType()},\ndaoOverrides?: { \n${indentMultiline(
        contextDAOParamsDeclarations,
      )} \n}, \nconnection?: Connection`,
    )}\n};`

    const daoDeclarations = Array.from(typesMap.values())
      .filter((node) => isEntity(node))
      .map((node) => {
        return `private _${toFirstLower(node.name)}: ${node.name}DAO | undefined;`
      })
      .concat([`private _defaultOptions?: ${this._getOptionsType()}`])
      .join('\n')

    const daoOverridesDeclaration = `private daoOverrides: DAOContextParams['daoOverrides'];\n` + `private connection: Connection | undefined`

    const daoGetters = Array.from(typesMap.values())
      .filter((node) => isEntity(node))
      .map((node) => {
        const daoInit = `this._${toFirstLower(node.name)} = new ${node.name}DAO({ daoContext: this, ...this.daoOverrides?.${toFirstLower(node.name)}, defaultOptions: this._defaultOptions }, this.connection);`
        const daoGet = `if(!this._${toFirstLower(node.name)}) {\n${indentMultiline(daoInit)}\n}\nreturn this._${toFirstLower(node.name)}${false ? '.apiV1' : ''};`
        return `get ${toFirstLower(node.name)}() {\n${indentMultiline(daoGet)}\n}`
      })
      .join('\n')

    const daoContructor = 'constructor(options?: DAOContextParams) {\n' + indentMultiline('super()\nthis.daoOverrides = options?.daoOverrides\nthis._defaultOptions = options?.defaultOptions\nthis.connection = options?.connection') + '\n}'

    const declarations = [daoDeclarations, daoOverridesDeclaration, daoGetters, daoContructor].join('\n\n')

    const daoExport = 'export class DAOContext extends AbstractDAOContext {\n\n' + indentMultiline(declarations) + '\n\n}'

    return [[daoContextParamsExport, daoExport].join('\n\n')]
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- FILTER --------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAOExludedFields(node: TsTypettaGeneratorNode): string {
    const daoFilterFieldsBody = node.fields
      .filter((n) => n.isExcluded)
      .map((n) => `'${n.name}'`)
      .join(' | ')
    const daoExludedFields = `export type ${node.name}ExcludedFields = ${daoFilterFieldsBody ? daoFilterFieldsBody : 'never'}`
    return [daoExludedFields].join('\n')
  }

  public _generateDAOFilter(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const daoFilterFieldsBody = indentMultiline(this._generateDAOFilterFields(node, typesMap).concat(['_?: any,']).join(',\n'))
    const daoFilterFields = `type ${node.name}FilterFields = {\n` + daoFilterFieldsBody + `\n};`
    const daoFilter = `export type ${node.name}Filter = ${node.name}FilterFields & LogicalOperators<${node.name}FilterFields>;`

    return [daoFilterFields, daoFilter].join('\n')
  }

  public _generateDAOFilterFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, path: string = ''): string[] {
    return node.fields
      .filter((field) => (typeof field.type === 'string' || isEmbed(field.type)) && !field.isExcluded)
      .map((field) => {
        let fieldName = path
        if (typeof field.type == 'string') {
          fieldName += field.name
          const arrayOperators = field.isList ? `| ArrayOperators<${field.type}>` : ''
          return [`'${fieldName}'?: ${field.type} | null | ComparisonOperators<${field.type}> | ElementOperators<${field.type}> | EvaluationOperators<${field.type}>` + arrayOperators]
        } else if (isEmbed(field.type)) {
          const embeddedType = findNode(field.type.embed, typesMap)!
          return this._generateDAOFilterFields(embeddedType, typesMap, path + field.name + '.')
        }
        return [] // TODO ??
      })
      .reduce((a, c) => [...a, ...c], [])
  }

  // ---------------------------------------------------------------------------------------------------------
  // ------------------------------------------------ SORT ---------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------
  public _generateDAOSort(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const daoSortFields = indentMultiline(this._generateDAOSortFields(node, typesMap).join('|\n'))
    const daoSortKeys = `export type ${node.name}SortKeys = \n${daoSortFields};`
    const daoSort = `export type ${node.name}Sort = OneKey<${node.name}SortKeys, SortDirection> | OneKey<${node.name}SortKeys, SortDirection>[] | { sorts?: OneKey<${node.name}SortKeys, SortDirection>[],  _?: any };`
    return `${daoSortKeys}\n${daoSort}`
  }

  public _generateDAOSortFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, path: string = ''): string[] {
    return node.fields
      .filter((field) => (typeof field.type == 'string' || isEmbed(field.type)) && !field.isExcluded)
      .map((field) => {
        let fieldName = path
        if (typeof field.type == 'string') {
          fieldName += field.name
          return [`'${fieldName}'`]
        } else if (isEmbed(field.type)) {
          const embeddedType = findNode(field.type.embed, typesMap)!
          return this._generateDAOSortFields(embeddedType, typesMap, path + field.name + '.')
        }
        return [] // TODO ??
      })
      .reduce((a, c) => [...a, ...c], [])
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- UPDATE --------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAOUpdate(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const daoUpdateFieldsBody = indentMultiline(this._generateDAOUpdateFields(node, typesMap).concat(['_?: any,']).join(',\n'))
    const daoUpdate = `export type ${node.name}Update = {\n` + daoUpdateFieldsBody + `\n};`

    return daoUpdate
  }

  public _generateDAOUpdateFields(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, path: string = ''): string[] {
    return node.fields
      .filter((field) => (typeof field.type == 'string' || isEmbed(field.type)) && !field.isExcluded)
      .map((field) => {
        const fieldName = path + field.name
        if (typeof field.type == 'string') {
          const fieldType = field.isList ? `Array<${field.type}>` : field.type
          return [`'${fieldName}'?: ${fieldType}${field.isRequired ? '' : ' | null'}`]
        } else if (isEmbed(field.type)) {
          const embeddedType = findNode(field.type.embed, typesMap)!
          const fieldType = field.isList ? `Array<types.${embeddedType.name}>` : `types.${embeddedType.name}`
          return [`'${fieldName}'?: ${fieldType}${field.isRequired ? '' : ' | null'}`, ...this._generateDAOUpdateFields(embeddedType, typesMap, path + field.name + '.')]
        }
        return [] // TODO ??
      })
      .reduce((a, c) => [...a, ...c], [])
  }

  // ---------------------------------------------------------------------------------------------------------
  // ----------------------------------------------- PARAMS --------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAOParams(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const idField = findID(node)!
    const daoParams = `export interface ${node.name}DAOParams extends DAOParams<types.${node.name}, '${idField.name}', ${node.name}Filter, ${node.name}Update, ${node.name}ExcludedFields, ${node.name}Sort, ${this._getOptionsType()}>{}`
    return daoParams
  }

  // ---------------------------------------------------------------------------------------------------------
  // ------------------------------------------------ DAO ----------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  public _generateDAO(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const idField = findID(node)!
    const daoName = node.sqlEntity ? 'AbstractSQLDAO' : node.mongoEntity ? 'AbstractMongoDBDAO' : 'AbstractDAO'
    const daoBody = indentMultiline('\n' + this._generateConstructorMethod(node, typesMap) + '\n');

    return (
      `export class ${node.name}DAO extends ${daoName}<types.${node.name}, '${idField.name}', ${node.name}Filter, ${node.name}Sort, ${node.name}Update, ${node.name}ExcludedFields, ${this._getOptionsType()}> {\n` +
      daoBody +
      '\n}'
    )
  }

  private _generateConstructorMethod(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string {
    const idField = findID(node)!
    const dbModel = `connection ? connection.model<Document>('${node.name}', ${node.name}Schema) : model<Document>('${node.name}', ${node.name}Schema)`
    const generatedAssociations = `[\n${indentMultiline(this._generateAssociations(node, typesMap).join(',\n'))}\n]`
    const associations = `associations: overrideAssociations(\n${indentMultiline(`${generatedAssociations}`)}\n),`
    // SIMPLE ENTITY
    const constructorBody = `super({ ${indentMultiline(`\ndbModel: ${dbModel}, \nidField: '${idField.name}', \n...params, \n${associations}`)} \n});`
    return `public constructor(params: { daoContext: AbstractDAOContext } & ${node.name}DAOParams, connection?: Connection){\n` + indentMultiline(constructorBody) + '\n}'
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

  private _getOptionsType(): string {
    return this._config.optionsType ? `{ mongodb?: any, sql?: any } & ${this._config.optionsType}` : '{ mongodb?: any, sql?: any }'
  }
}
