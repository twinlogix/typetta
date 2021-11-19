import { TsMongooseAbstractGenerator } from './abstractGenerator'
import { TsMongooseGeneratorField, TsMongooseGeneratorNode } from '../generator'

export class TsMongooseDAOGenerator extends TsMongooseAbstractGenerator {
  public generateImports(): string[] {
    return [
      "import { Model, Document, Types } from 'mongoose';",
      "import { DAOParams, DAOAssociationType, DAOAssociationReference, AbstractMongooseDAO, AbstractMongooseSubClassDAO, AbstractMongooseSuperClassDAO, AbstractDAOContext, LogicalOperators, ComparisonOperators, ElementOperators, EvaluationOperators, GeospathialOperators, ArrayOperators, DAOCache, OneKey, SortDirection, overrideAssociations } from '@twinlogix/tl-graphql-tools';",
    ]
  }

  public generateDefinition(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>): string {
    if (this._isEntity(node, interfacesMap)) {
      const daoExluded = this._generateDAOExluded(node, typesMap, interfacesMap)
      const daoFilter = this._generateDAOFilter(node, typesMap, interfacesMap)
      const daoSort = this._generateDAOSort(node, typesMap, interfacesMap)
      const daoUpdate = this._generateDAOUpdate(node, typesMap, interfacesMap)
      const daoParams = this._generateDAOParams(node, typesMap, interfacesMap)
      const dao = this._generateDAO(node, typesMap, interfacesMap)
      return [daoExluded, daoFilter, daoSort, daoUpdate, daoParams, dao].join('\n\n')
    } else {
      return ''
    }
  }

  public generateExports(typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>): string[] {
    const contextDAOParamsDeclarations = Array.from(typesMap.values())
      .concat(Array.from(interfacesMap.values()))
      .filter((node) => this._isEntity(node, interfacesMap))
      .map((node) => {
        return `${this._toFirstLower(node.name)}?: ${node.name}DAOParams<SecurityContext>`
      })
      .join(',\n')

    const daoContextParamsExport = `export interface DAOContextParams<SecurityContext> {\n${this.indentMultiline(
      `cache?: DAOCache, \nsecurityContext?: SecurityContext | (() => SecurityContext), \ndaoOverrides?: { \n${this.indentMultiline(contextDAOParamsDeclarations)} \n}, \nconnection?: Connection`,
    )}\n};`

    const daoDeclarations = Array.from(typesMap.values())
      .concat(Array.from(interfacesMap.values()))
      .filter((node) => this._isEntity(node, interfacesMap))
      .map((node) => {
        return `private _${this._toFirstLower(node.name)}: ${node.name}DAO<SecurityContext> | undefined;`
      })
      .join('\n')

    const daoOverridesDeclaration = `private daoOverrides: DAOContextParams<SecurityContext>['daoOverrides'];\n` + `private connection: Connection | undefined`

    const daoGetters = Array.from(typesMap.values())
      .concat(Array.from(interfacesMap.values()))
      .filter((node) => this._isEntity(node, interfacesMap))
      .map((node) => {
        const daoInit = `this._${this._toFirstLower(node.name)} = new ${node.name}DAO<SecurityContext>({ daoContext: this, ...this.daoOverrides?.${this._toFirstLower(node.name)} }, this.connection);`
        const daoGet = `if(!this._${this._toFirstLower(node.name)}) {\n${this.indentMultiline(daoInit)}\n}\nreturn this._${this._toFirstLower(node.name)};`
        return `get ${this._toFirstLower(node.name)}() {\n${this.indentMultiline(daoGet)}\n}`
      })
      .join('\n')

    const daoContructor =
      'constructor(options?: DAOContextParams<SecurityContext>) {\n' +
      this.indentMultiline('super(options);\nthis.daoOverrides = options?.daoOverrides;\nthis.connection = options?.connection') +
      '\n}'

    const declarations = [daoDeclarations, daoOverridesDeclaration, daoGetters, daoContructor].join('\n\n')

    const daoExport = 'export class DAOContext<SecurityContext = any> extends AbstractDAOContext<SecurityContext> {\n\n' + this.indentMultiline(declarations) + '\n\n}'

    return [[daoContextParamsExport, daoExport].join('\n\n')]
  }

  //---------------------------------------------------------------------------------------------------------
  //----------------------------------------------- FILTER --------------------------------------------------
  //---------------------------------------------------------------------------------------------------------

  public _generateDAOExluded(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>): string {
    const daoFilterFieldsBody = node.fields
      .filter((n) => n.isExcluded)
      .map((n) => `'${n.name}'`)
      .join(' | ')
    const daoExludedFields = `export type ${node.name}ExcludedFields = ${daoFilterFieldsBody ? daoFilterFieldsBody : 'never'}`
    return [daoExludedFields].join('\n')
  }

  public _generateDAOFilter(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>): string {
    const daoFilterFieldsBody = this.indentMultiline(this._generateDAOFilterFields(node, typesMap, interfacesMap).concat(['_?: any,']).join(',\n'))
    const daoFilterFields = `type ${node.name}FilterFields = {\n` + daoFilterFieldsBody + `\n};`
    const daoFilter = `export type ${node.name}Filter = ${node.name}FilterFields & LogicalOperators<${node.name}FilterFields>;`

    return [daoFilterFields, daoFilter].join('\n')
  }

  public _generateDAOFilterFields(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>, path: String = ''): string[] {
    //@ts-ignore
    return (
      node.fields
        .filter((field) => (typeof field.type == 'string' || field.type.embed) && !field.isExcluded)
        .map((field) => {
          let fieldName = path
          if (typeof field.type == 'string') {
            fieldName += field.name
            const arrayOperators = field.isList ? `| ArrayOperators<${field.type}>` : ''
            return [`'${fieldName}'?: ${field.type} | null | ComparisonOperators<${field.type}> | ElementOperators<${field.type}> | EvaluationOperators<${field.type}>` + arrayOperators]
          } else if (field.type.embed) {
            const embeddedType = this._findNode(field.type.embed, typesMap, interfacesMap)
            return this._generateDAOFilterFields(embeddedType, typesMap, interfacesMap, path + field.name + '.')
          }
        })
        //@ts-ignore
        .reduce((a, c) => [...a, ...c], [])
    )
  }

  //---------------------------------------------------------------------------------------------------------
  //------------------------------------------------ SORT ---------------------------------------------------
  //---------------------------------------------------------------------------------------------------------
  public _generateDAOSort(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>): string {
    const daoSortFields = this.indentMultiline(this._generateDAOSortFields(node, typesMap, interfacesMap).join('|\n'))
    const daoSortKeys = `export type ${node.name}SortKeys = \n${daoSortFields};`
    const daoSort = `export type ${node.name}Sort = OneKey<${node.name}SortKeys, SortDirection> | OneKey<${node.name}SortKeys, SortDirection>[] | { sorts?: OneKey<${node.name}SortKeys, SortDirection>[],  _?: any };`
    return `${daoSortKeys}\n${daoSort}`
  }

  public _generateDAOSortFields(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>, path: String = ''): string[] {
    //@ts-ignore
    return node.fields
      .filter((field) => (typeof field.type == 'string' || field.type.embed) && !field.isExcluded)
      .map((field) => {
        let fieldName = path
        if (typeof field.type == 'string') {
          fieldName += field.name
          return [`'${fieldName}'`]
        } else if (field.type.embed) {
          const embeddedType = this._findNode(field.type.embed, typesMap, interfacesMap)
          return this._generateDAOSortFields(embeddedType, typesMap, interfacesMap, path + field.name + '.')
        }
      })
      .reduce((a, c) => [...a, ...c], [])
  }

  //---------------------------------------------------------------------------------------------------------
  //----------------------------------------------- UPDATE --------------------------------------------------
  //---------------------------------------------------------------------------------------------------------

  public _generateDAOUpdate(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>): string {
    const daoUpdateFieldsBody = this.indentMultiline(this._generateDAOUpdateFields(node, typesMap, interfacesMap).concat(['_?: any,']).join(',\n'))
    const daoUpdate = `export type ${node.name}Update = {\n` + daoUpdateFieldsBody + `\n};`

    return daoUpdate
  }

  public _generateDAOUpdateFields(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>, path: String = ''): string[] {
    //@ts-ignore
    return node.fields
      .filter((field) => (typeof field.type == 'string' || field.type.embed) && !field.isExcluded)
      .map((field) => {
        let fieldName = path + field.name
        if (typeof field.type == 'string') {
          const fieldType = field.isList ? `Array<${field.type}>` : field.type
          return [`'${fieldName}'?: ${fieldType}${field.required ? '' : ' | null'}`]
        } else if (field.type.embed) {
          const embeddedType = this._findNode(field.type.embed, typesMap, interfacesMap)
          const fieldType = field.isList ? `Array<types.${embeddedType.name}>` : `types.${embeddedType.name}`
          return [`'${fieldName}'?: ${fieldType}${field.required ? '' : ' | null'}`, ...this._generateDAOUpdateFields(embeddedType, typesMap, interfacesMap, path + field.name + '.')]
        }
      })
      .reduce((a, c) => [...a, ...c], [])
  }

  //---------------------------------------------------------------------------------------------------------
  //----------------------------------------------- PARAMS --------------------------------------------------
  //---------------------------------------------------------------------------------------------------------

  public _generateDAOParams(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>): string {
    const idField = this._findID(node, interfacesMap)
    const daoParams = `export interface ${node.name}DAOParams<SecurityContext> extends DAOParams<types.${node.name}, '${idField.name}', ${idField.isAutogenerated}, ${node.name}Filter, ${node.name}Update, ${node.name}ExcludedFields, SecurityContext>{}`
    return daoParams
  }

  //---------------------------------------------------------------------------------------------------------
  //------------------------------------------------ DAO ----------------------------------------------------
  //---------------------------------------------------------------------------------------------------------

  public _generateDAO(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>): string {
    const idField = this._findID(node, interfacesMap)
    let abstractClassName
    let autoGeneratedParam

    let daoBody = ''

    autoGeneratedParam = `${idField.isAutogenerated}, `
    if (node.type === 'interface') {
      // INTERFACE
      abstractClassName = 'AbstractMongooseSuperClassDAO'
    } else if (node.type === 'type') {
      if (node.isEntity) {
        // SIMPLE ENTITY
        abstractClassName = 'AbstractMongooseDAO'
      } else {
        // SUBCLASS
        abstractClassName = 'AbstractMongooseSubClassDAO'
      }
    }
    daoBody += '\n' + this._generateConstructorMethod(node, typesMap, interfacesMap) + '\n'
    daoBody = this.indentMultiline(daoBody)

    return (
      `export class ${node.name}DAO<SecurityContext = any> extends ${abstractClassName}<types.${node.name}, '${idField.name}', ${autoGeneratedParam}${node.name}Filter, ${node.name}Sort, ${node.name}Update, ${node.name}ExcludedFields, SecurityContext> {\n` +
      daoBody +
      '\n}'
    )
  }

  private _generateConstructorMethod(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>): string {
    let constructorBody = ''
    const idField = this._findID(node, interfacesMap)
    const nodeName = this._findEntityNode(node, interfacesMap).name
    const dbModel = `connection ? connection.model<Document>('${nodeName}', ${nodeName}Schema) : model<Document>('${nodeName}', ${nodeName}Schema)`
    const generatedAssociations = `[\n${this.indentMultiline(this._generateAssociations(node, typesMap, interfacesMap).join(',\n'))}\n]`
    const associations = `associations: overrideAssociations(\n${this.indentMultiline(`${generatedAssociations}, \nparams?.associations`)}\n),`
    if (node.type === 'interface') {
      // INTERFACE
      const superclassConstructorBody = this._generateSuperClassConstructorBody(node, typesMap, interfacesMap)
      constructorBody += `super({ ${this.indentMultiline(`\ndbModel: ${dbModel}, \nidField: '${idField.name}', \n${superclassConstructorBody}, \n...params, \n${associations}`)} \n});`
    } else if (node.type === 'type') {
      if (node.isEntity) {
        // SIMPLE ENTITY
        constructorBody += `super({ ${this.indentMultiline(`\ndbModel: ${dbModel}, \nidField: '${idField.name}', \n...params, \n${associations}`)} \n});`
      } else {
        // SUBCLASS
        const subclassConstructorBody = this._generateSubClassConstructorBody(node, interfacesMap)
        constructorBody += `super({ ${this.indentMultiline(`\ndbModel: ${dbModel}, \nidField: '${idField.name}',\n${subclassConstructorBody}, \n...params, \n${associations}`)} \n});`
      }
    }
    return (
      `public constructor(params: { daoContext: AbstractDAOContext<SecurityContext> } & ${node.name}DAOParams<SecurityContext>, connection?: Connection){\n` +
      this.indentMultiline(constructorBody) +
      '\n}'
    )
  }

  private _generateAssociations(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>, path: string = ''): string[] {
    //@ts-ignore
    let associations = []
    //@ts-ignore
    associations = associations.concat(
      node.fields
        .map((field) => {
          let prefix = ''
          if (node.interfaces && node.interfaces.length > 0 && !this._isInheritedField(field, node, interfacesMap)) {
            prefix = this._toFirstLower(node.name) + '.'
          }
          const association = this._generateAssociation(field, node, typesMap, interfacesMap, prefix + path)
          return this._generateAssociation(field, node, typesMap, interfacesMap, prefix + path)
        })
        .reduce((a, c) => [...a, ...c], []),
    )

    if (node.type === 'interface') {
      const subtypes = Array.from(typesMap.values()).filter((type) => type.interfaces.includes(node.name))
      subtypes.forEach((subtype) => {
        //@ts-ignore
        associations = associations.concat(
          this._findSubTypeFields(subtype, interfacesMap)
            .map((field) => {
              return this._generateAssociation(field, node, typesMap, interfacesMap, this._toFirstLower(subtype.name) + '.' + path)
            })
            .reduce((a, c) => [...a, ...c], []),
        )
      })
    }
    return associations
  }

  private _generateAssociation(
    field: TsMongooseGeneratorField,
    node: TsMongooseGeneratorNode,
    typesMap: Map<String, TsMongooseGeneratorNode>,
    interfacesMap: Map<String, TsMongooseGeneratorNode>,
    path: string = '',
  ): string[] {
    if (typeof field.type !== 'string') {
      if (field.type.innerRef) {
        const linkedType = this._findNode(field.type.innerRef, typesMap, interfacesMap)
        const linkedTypeIdField = this._findID(linkedType, interfacesMap)
        const type = field.isList ? 'DAOAssociationType.ONE_TO_MANY' : 'DAOAssociationType.ONE_TO_ONE'
        const reference = 'DAOAssociationReference.INNER'
        const refField = path + field.name
        const refFrom = field.type.refFrom ? field.type.refFrom : path + field.name + 'Id'
        const refTo = field.type.refTo ? field.type.refTo : linkedTypeIdField.name
        const dao = this._toFirstLower(field.type.innerRef)
        return [`{ type: ${type}, reference: ${reference}, field: '${refField}', refFrom: '${refFrom}', refTo: '${refTo}', dao: '${dao}' }`]
      } else if (field.type.foreignRef) {
        const idField = this._findID(node, interfacesMap)
        const type = field.isList ? 'DAOAssociationType.ONE_TO_MANY' : 'DAOAssociationType.ONE_TO_ONE'
        const reference = 'DAOAssociationReference.FOREIGN'
        const refField = path + field.name
        const refFrom = field.type.refFrom
        const refTo = path + (field.type.refTo ? field.type.refTo : idField.name)
        const dao = this._toFirstLower(field.type.foreignRef)
        return [`{ type: ${type}, reference: ${reference}, field: '${refField}', refFrom: '${refFrom}', refTo: '${refTo}', dao: '${dao}' }`]
      } else if (field.type.embed) {
        const embeddedType = this._findNode(field.type.embed, typesMap, interfacesMap)
        return this._generateAssociations(embeddedType, typesMap, interfacesMap, path + field.name + '.')
      }
    }
    return []
  }

  private _generateSuperClassConstructorBody(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>): string {
    const subTypes = Array.from(typesMap.values()).filter((type) => type.interfaces.includes(node.code))
    return (
      'subclasses: [\n' +
      this.indentMultiline(
        subTypes
          .map((subType) => {
            const subTypeFields = this._findSubTypeFields(subType, interfacesMap)
              .map((f) => `'${f.name}'`)
              .join(',')
            return `{ typename: '${subType.name}', dbname: '${this._toFirstLower(subType.name)}', fields: [${subTypeFields}] }`
          })
          .join(',\n'),
      ) +
      '\n]'
    )
  }

  private _generateSubClassConstructorBody(node: TsMongooseGeneratorNode, interfacesMap: Map<String, TsMongooseGeneratorNode>): string {
    const subTypeTypename = `'${node.name}'`
    const subTypeDBName = `'${this._toFirstLower(node.name)}'`

    const subTypeFields = this._findSubTypeFields(node, interfacesMap)
    const subTypeFieldsDeclaration = '[' + subTypeFields.map((subTypeField) => `'${subTypeField.name}'`).join(',') + ']'

    return [`subclassTypename: ${subTypeTypename}`, `subclassDBName: ${subTypeDBName}`, `subclassFields: ${subTypeFieldsDeclaration}`].join(',\n')
  }

  private _findSubTypeFields(node: TsMongooseGeneratorNode, interfacesMap: Map<String, TsMongooseGeneratorNode>): TsMongooseGeneratorField[] {
    const interfacesFields = node.interfaces
      .map((interf) => interfacesMap.get(interf))
      .map((interf) => interf!.fields)
      .reduce((p, c) => [...p, ...c], [])

    return node.fields.filter((field) => !interfacesFields.find((iField) => field.name === iField.name))
  }

  private _isInheritedField(field: TsMongooseGeneratorField, node: TsMongooseGeneratorNode, interfacesMap: Map<String, TsMongooseGeneratorNode>): boolean {
    if (node.interfaces.length > 0) {
      const found = node.interfaces.find((interf) => interfacesMap.get(interf)!.fields.find((interfaceField) => interfaceField.name === field.name))
      return found !== undefined
    } else {
      return false
    }
  }
}
