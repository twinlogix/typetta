import { TypeScriptTypettaPluginConfig } from '../config'
import { TsTypettaGeneratorField, TsTypettaGeneratorNode, TsTypettaGeneratorScalar } from '../generator'

type AddtionalPluginConfig = {
  optionsType?: string
}
export abstract class TsTypettaAbstractGenerator {

  protected _config: TypeScriptTypettaPluginConfig & AddtionalPluginConfig

  constructor(config: TypeScriptTypettaPluginConfig & AddtionalPluginConfig) {
    this._config = config
  }

  public abstract generateImports(): string[]

  public abstract generateDefinition(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, customScalarsMap: Map<string, TsTypettaGeneratorScalar>): string

  public abstract generateExports(typesMap: Map<String, TsTypettaGeneratorNode>, customScalarsMap: Map<string, TsTypettaGeneratorScalar>): string[]
}
