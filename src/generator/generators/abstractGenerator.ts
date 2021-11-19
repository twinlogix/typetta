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

  protected _findID(node: TsMongooseGeneratorNode): TsMongooseGeneratorField | undefined {
    return node.fields.find((field) => field.isID)
  }

  protected _findNode(code: string | undefined, typesMap: Map<String, TsMongooseGeneratorNode>): TsMongooseGeneratorNode | undefined {
    return code ? typesMap.get(code) : undefined
  }

  protected indentMultiline(str: string, count = 1): string {
    const indentation = '  '.repeat(count)
    const replaceWith = '\n' + indentation
    return indentation + str.replace(/\n/g, replaceWith)
  }

  public abstract generateImports(): string[]

  public abstract generateDefinition(node: TsMongooseGeneratorNode, typesMap: Map<String, TsMongooseGeneratorNode>): string

  public abstract generateExports(typesMap: Map<String, TsMongooseGeneratorNode>): string[]
}
