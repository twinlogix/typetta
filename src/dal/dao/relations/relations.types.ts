export type DAORelation =
  | {
      type: '1-1' | '1-n'
      reference: 'foreign' | 'inner'
      field: string
      refFrom: string
      refTo: string
      dao: string
      required: boolean
    }
  | {
      type: '1-1' | '1-n'
      reference: 'relation'
      field: string
      refThis: { refFrom: string; refTo: string }
      refOther: { refFrom: string; refTo: string }
      relationDao: string
      entityDao: string
      required: boolean
    }
