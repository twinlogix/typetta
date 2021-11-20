export enum DAOAssociationType {
  ONE_TO_ONE,
  ONE_TO_MANY,
}

export enum DAOAssociationReference {
  INNER,
  FOREIGN,
}

export type DAOAssociation = {
  type: DAOAssociationType
  reference: DAOAssociationReference
  field: string // TODO: use recursivekeyof
  refFrom: string
  refTo: string
  dao: string
  buildFilter?: (keys: any[]) => any
  hasKey?: (record: any, key: any) => boolean
  extractField?: string
}
