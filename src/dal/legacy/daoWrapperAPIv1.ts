import { AbstractDAO } from '../dao/dao'
import { DAOGenerics } from '../dao/dao.types'
import { AnyProjection, ModelProjection } from '../dao/projections/projections.types'

export class DAOWrapperAPIv1<T extends DAOGenerics> {
  private idField: T['idKey']
  public apiV2: AbstractDAO<T>
  constructor(apiV2: AbstractDAO<T>, idField: T['idKey']) {
    this.apiV2 = apiV2
    this.idField = idField
  }

  protected idFilter<V extends Pick<T['model'], T['idKey']>>(model: V): T['filter'] {
    return { [this.idField]: model[this.idField] } as unknown as T['filter']
  }

  async find<P extends AnyProjection<T['projection']>>(
    filter: T['filter'],
    projection?: P,
    sorts?: T['sort'] | T['sort'][],
    start?: number,
    limit?: number,
    options?: T['options'] & T['driverContext'],
  ): Promise<ModelProjection<T['model'], T['projection'], P>[]> {
    return this.apiV2.findAll({ filter, projection, sorts: sorts ? (Array.isArray(sorts) ? sorts : [sorts]) : [], start, limit, options })
  }

  async findPage<P extends AnyProjection<T['projection']>>(
    filter: T['filter'],
    projection?: P,
    sorts?: T['sort'],
    start?: number,
    limit?: number,
    options?: T['options'] & T['driverContext'],
  ): Promise<{ totalCount: number; records: ModelProjection<T['model'], T['projection'], P>[] }> {
    return this.apiV2.findPage({ filter, projection, sorts: sorts ? (Array.isArray(sorts) ? sorts : [sorts]) : [], start, limit, options })
  }

  async findOne<P extends AnyProjection<T['projection']>>(
    filter: T['filter'],
    projection?: P,
    options?: T['options'] & T['driverContext'],
  ): Promise<ModelProjection<T['model'], T['projection'], P> | null> {
    return this.apiV2.findOne({ filter, projection, options })
  }

  async exists(filter?: T['filter'], options?: T['options'] & T['driverContext']): Promise<boolean> {
    return this.apiV2.exists({ filter, options })
  }

  async count(filter?: T['filter'], options?: T['options'] & T['driverContext']): Promise<number> {
    return this.apiV2.count({ filter, options })
  }

  async insert(record: T['insert'], options?: T['options'] & T['driverContext']): Promise<Omit<T['model'], T['exludedFields']>> {
    return this.apiV2.insertOne({ record, options })
  }

  async update<V extends Pick<T['model'], T['idKey']>>(record: V, changes: T['update'], options?: T['options'] & T['driverContext']): Promise<void> {
    return this.apiV2.updateOne({ filter: this.idFilter(record), changes, options })
  }

  async updateOne(filter: T['filter'], changes: T['update'], options?: T['options'] & T['driverContext']): Promise<void> {
    return this.apiV2.updateOne({ filter, changes, options })
  }

  async updateMany(filter: T['filter'], changes: T['update'], options?: T['options'] & T['driverContext']): Promise<void> {
    return this.apiV2.updateAll({ filter, changes, options })
  }

  async replace<V extends Pick<T['model'], T['idKey']>>(record: V, replace: T['insert'], options?: T['options'] & T['driverContext']): Promise<void> {
    return this.apiV2.replaceOne({ filter: this.idFilter(record), replace, options })
  }

  async replaceOne(filter: T['filter'], replace: T['insert'], options?: T['options'] & T['driverContext']): Promise<void> {
    return this.apiV2.replaceOne({ filter, replace, options })
  }

  async delete<V extends Pick<T['model'], T['idKey']>>(record: V, options?: T['options'] & T['driverContext']): Promise<void> {
    return this.apiV2.deleteOne({ filter: this.idFilter(record), options })
  }

  async deleteOne(filter: T['filter'], options?: T['options'] & T['driverContext']): Promise<void> {
    return this.apiV2.deleteOne({ filter, options })
  }

  async deleteMany(filter: T['filter'], options?: T['options'] & T['driverContext']): Promise<void> {
    return this.apiV2.deleteAll({ filter, options })
  }
}
