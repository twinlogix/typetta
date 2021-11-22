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

  public abstract generateImports(): string[]

  public abstract generateDefinition(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>): string

  public abstract generateExports(typesMap: Map<String, TsTypettaGeneratorNode>): string[]
}
