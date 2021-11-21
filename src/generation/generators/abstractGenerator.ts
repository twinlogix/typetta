import { TypeScriptTypettaPluginConfig } from '../config'
import { TsTypettaGeneratorField, TsTypettaGeneratorNode } from '../generator'

type AddtionalPluginConfig = {
  optionsType?: string
}
export abstract class TsTypettaAbstractGenerator {

  protected _config: TypeScriptTypettaPluginConfig & AddtionalPluginConfig

  constructor(config: TypeScriptTypettaPluginConfig & AddtionalPluginConfig) {
    this._config = config
  }

  protected _toFirstLower(typeName: string) {
    return typeName.charAt(0).toLowerCase() + typeName.slice(1)
  }

  protected _isEntity(node: TsTypettaGeneratorNode): boolean {
    return node.mongoEntity !== undefined || node.sqlEntity !== undefined;
  }

  protected _findID(node: TsTypettaGeneratorNode): TsTypettaGeneratorField | undefined {
    return node.fields.find((field) => field.isID)
  }

  protected _findNode(code: string | undefined, typesMap: Map<String, TsTypettaGeneratorNode>): TsTypettaGeneratorNode | undefined {
    return code ? typesMap.get(code) : undefined
  }

  protected indentMultiline(str: string, count = 1): string {
    const indentation = '  '.repeat(count)
    const replaceWith = '\n' + indentation
    return indentation + str.replace(/\n/g, replaceWith)
  }

  public abstract generateImports(): string[]

  public abstract generateDefinition(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string

  public abstract generateExports(typesMap: Map<String, TsTypettaGeneratorNode>): string[]
}
