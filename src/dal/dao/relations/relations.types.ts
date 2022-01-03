export enum DAORelationType {
  ONE_TO_ONE,
  ONE_TO_MANY,
}

export enum DAORelationReference {
  INNER,
  FOREIGN,
}

export type DAORelation = {
  type: DAORelationType
  reference: DAORelationReference
  field: string
  refFrom: string
  refTo: string
  dao: string
  buildFilter?: (keys: any[]) => any
  hasKey?: (record: any, key: any) => boolean
  extractField?: string
}
