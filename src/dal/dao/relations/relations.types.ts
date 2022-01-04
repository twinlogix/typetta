export enum DAORelationType {
  ONE_TO_ONE,
  ONE_TO_MANY,
}

export enum DAORelationReference {
  INNER,
  FOREIGN,
  RELATION,
}

export type DAORelation =
  | {
      type: DAORelationType
      reference: DAORelationReference.FOREIGN | DAORelationReference.INNER
      field: string
      refFrom: string
      refTo: string
      dao: string
      buildFilter?: (keys: any[]) => any
      hasKey?: (record: any, key: any) => boolean
    }
  | {
      type: DAORelationType
      reference: DAORelationReference.RELATION
      field: string
      refThis: { refFrom: string; refTo: string }
      refOther: { refFrom: string; refTo: string }
      relationDao: string
      entityDao: string
      buildFilter?: (keys: any[]) => any
      hasKey?: (record: any, key: any) => boolean
    }
