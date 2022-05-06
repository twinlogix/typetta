import { TypeScriptTypettaPluginConfig } from '../config'
import { TsTypettaGeneratorNode, TsTypettaGeneratorScalar } from '../types'

export abstract class TsTypettaAbstractGenerator {
  protected _config: TypeScriptTypettaPluginConfig

  constructor(config: TypeScriptTypettaPluginConfig) {
    this._config = config
  }

  public abstract generateImports(typesMap: Map<string, TsTypettaGeneratorNode>): string[]

  public abstract generateDefinition(node: TsTypettaGeneratorNode, typesMap: Map<string, TsTypettaGeneratorNode>, customScalarsMap: Map<string, TsTypettaGeneratorScalar>): string

  public abstract generateExports(typesMap: Map<string, TsTypettaGeneratorNode>, customScalarsMap: Map<string, TsTypettaGeneratorScalar>): string[]
}
