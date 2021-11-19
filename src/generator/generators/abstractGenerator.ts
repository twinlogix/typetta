import { TypeScriptMongoosePluginConfig } from '../config'
import { TsMongooseGeneratorField, TsMongooseGeneratorNode } from '../generator'

export abstract class TsMongooseAbstractGenerator {
  protected _config: TypeScriptMongoosePluginConfig
  protected _objectId
  protected _tsTypesImport

  constructor(config: TypeScriptMongoosePluginConfig) {
    this._config = config
    this._objectId = this._resolveObjectId(this._config.objectIdType)
    this._tsTypesImport = this._config.tsTypesImport ? this._config.tsTypesImport : './types'
  }

  protected _toFirstLower(typeName: string) {
    return typeName.charAt(0).toLowerCase() + typeName.slice(1)
  }

  protected _resolveObjectId(pointer: string | null | undefined): { identifier: string; module: string } {
    if (!pointer) {
      return { identifier: 'ObjectID', module: 'mongodb' }
    }
    if (pointer.includes('#')) {
      const [path, module] = pointer.split('#')
      return { identifier: path, module }
    }
    //@ts-ignore
    return { identifier: pointer, module: null }
  }

  protected _isEntity(node: TsMongooseGeneratorNode, interfacesMap: Map<String, TsMongooseGeneratorNode>): boolean {
    let res = node.isEntity
    if (!res) {
      res = node.interfaces.filter((interf) => interfacesMap.get(interf)!.isEntity).length > 0
    }
    return res
  }

  protected _findEntityNode(node: TsMongooseGeneratorNode, interfacesMap: Map<String, TsMongooseGeneratorNode>): TsMongooseGeneratorField {
    let res = null
    if (node.isEntity) {
      res = node
    } else {
      const entityInterfaces = node.interfaces.map((interf) => interfacesMap.get(interf)).filter((interf) => interf!.isEntity)
      if (entityInterfaces.length == 1) {
        res = entityInterfaces[0]
      }
    }
    //@ts-ignore
    return res
  }

  protected _findID(node: TsMongooseGeneratorNode, interfacesMap: Map<String, TsMongooseGeneratorNode>): TsMongooseGeneratorField {
    let res = node.fields.find((field) => field.isID)
    if (!res) {
      const ids = node.interfaces.map((interf) => interfacesMap.get(interf)).map((interf) => interf!.fields.find((field) => field.isID))
      if (ids.length == 1) {
        res = ids[0]
      }
    }
    //@ts-ignore
    return res
  }

  protected _findNode(code: string, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>): TsMongooseGeneratorNode {
    let res = typesMap.get(code)
    if (!res) {
      res = interfacesMap.get(code)
    }
    //@ts-ignore
    return res
  }

  protected indentMultiline(str: string, count = 1): string {
    const indentation = new Array(count).fill('    ').join('')
    const replaceWith = '\n' + indentation

    return indentation + str.replace(/\n/g, replaceWith)
  }

  public abstract generateImports(): string[]

  public abstract generateDefinition(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>): string

  public abstract generateExports(typesMap: Map<String, TsMongooseGeneratorNode>, interfacesMap: Map<String, TsMongooseGeneratorNode>): string[]
}
