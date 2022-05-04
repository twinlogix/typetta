import { DefaultGenerationStrategy, IdGenerationStrategy } from '../dal/dao/dao.types'
import { TypeScriptTypettaPluginConfig } from './config'

export abstract class TypettaGenerator {
  protected config: TypeScriptTypettaPluginConfig
  constructor(config: TypeScriptTypettaPluginConfig) {
    this.config = config
  }
  abstract generate(nodes: (TsTypettaGeneratorNode | TsTypettaGeneratorScalar)[]): Promise<string>
}

type ScalarType = { kind: 'scalar'; scalar: string }
type EmbedFieldType = { kind: 'embedded'; embed: string }
type InnerRefFieldType = { kind: 'innerRef'; innerRef: string; refFrom?: string; refTo?: string }
type ForeignRefFieldType = { kind: 'foreignRef'; foreignRef: string; refFrom?: string; refTo?: string }
type RelationEntityRefFieldType = {
  kind: 'relationEntityRef'
  sourceRef: string
  destRef: string
  entity: string
  refThis?: { refFrom: string; refTo?: string }
  refOther?: { refFrom: string; refTo?: string }
}
export type FieldTypeType = ScalarType | EmbedFieldType | InnerRefFieldType | ForeignRefFieldType | RelationEntityRefFieldType

export type TsTypettaGeneratorField = {
  name: string
  type: FieldTypeType
  graphqlType: string
  isRequired: boolean
  isID: boolean
  idGenerationStrategy?: IdGenerationStrategy
  isList: boolean
  isListElementRequired: boolean
  isExcluded: boolean
  isEnum: boolean
  defaultGenerationStrategy?: DefaultGenerationStrategy
  alias?: string
}

export type TsTypettaGeneratorNode = {
  type: 'type'
  name: string
  entity?: { type: 'mongo'; collection: string; source: string } | { type: 'sql'; table: string; source: string } | { type: 'memory' }
  fields: TsTypettaGeneratorField[]
}

export type TsTypettaGeneratorScalar = {
  type: 'scalar'
  name: string
  isString: boolean
  isQuantity: boolean
}
