import { DAOGenerics } from '../../dao.types'
import { intersectProjections, mergeProjections } from '../../projections/projections.utils'

export type CRUDPermission<T extends DAOGenerics> = {
  read?: boolean | T['projection']
  write?: boolean
  update?: boolean
  delete?: boolean
}

export const CRUD = {
  and: function <T extends DAOGenerics>(cruds: CRUDPermission<T>[]): CRUDPermission<T> {
    return cruds.reduce(
      (l, r) => ({
        delete: (l.delete ?? false) && (r.delete ?? false),
        read: intersectProjections(l.read ?? false, r.read ?? false),
        write: (l.write ?? false) && (r.write ?? false),
        update: (l.update ?? false) && (r.update ?? false),
      }),
      this.ALLOW,
    )
  },
  or: function <T extends DAOGenerics>(cruds: CRUDPermission<T>[]): CRUDPermission<T> {
    return cruds.reduce(
      (l, r) => ({
        delete: (l.delete ?? false) || (r.delete ?? false),
        read: mergeProjections(l.read ?? false, r.read ?? false),
        write: (l.write ?? false) || (r.write ?? false),
        update: (l.update ?? false) || (r.update ?? false),
      }),
      this.DENY,
    )
  },

  ALLOW: {
    delete: true,
    read: true,
    write: true,
    update: true,
  },
  DENY: {
    delete: false,
    read: false,
    write: false,
    update: false,
  },
}
