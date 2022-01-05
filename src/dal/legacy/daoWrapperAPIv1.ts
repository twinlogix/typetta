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
    metadata?: T['metadata'],
  ): Promise<ModelProjection<T['model'], T['projection'], P>[]> {
    return this.apiV2.findAll({ filter, projection, sorts: sorts ? (Array.isArray(sorts) ? sorts : [sorts]) : [], start, limit, metadata })
  }

  async findPage<P extends AnyProjection<T['projection']>>(
    filter: T['filter'],
    projection?: P,
    sorts?: T['sort'],
    start?: number,
    limit?: number,
    metadata?: T['metadata'],
  ): Promise<{ totalCount: number; records: ModelProjection<T['model'], T['projection'], P>[] }> {
    return this.apiV2.findPage({ filter, projection, sorts: sorts ? (Array.isArray(sorts) ? sorts : [sorts]) : [], start, limit, metadata })
  }

  async findOne<P extends AnyProjection<T['projection']>>(filter: T['filter'], projection?: P, metadata?: T['metadata']): Promise<ModelProjection<T['model'], T['projection'], P> | null> {
    return this.apiV2.findOne({ filter, projection, metadata })
  }

  async exists(filter?: T['filter'], metadata?: T['metadata']): Promise<boolean> {
    return this.apiV2.exists({ filter, metadata })
  }

  async count(filter?: T['filter'], metadata?: T['metadata']): Promise<number> {
    return this.apiV2.count({ filter, metadata })
  }

  async insert(record: T['insert'], metadata?: T['metadata']): Promise<Omit<T['model'], T['exludedFields']>> {
    return this.apiV2.insertOne({ record, metadata })
  }

  async update<V extends Pick<T['model'], T['idKey']>>(record: V, changes: T['update'], metadata?: T['metadata']): Promise<void> {
    return this.apiV2.updateOne({ filter: this.idFilter(record), changes, metadata })
  }

  async updateOne(filter: T['filter'], changes: T['update'], metadata?: T['metadata']): Promise<void> {
    return this.apiV2.updateOne({ filter, changes, metadata })
  }

  async updateMany(filter: T['filter'], changes: T['update'], metadata?: T['metadata']): Promise<void> {
    return this.apiV2.updateAll({ filter, changes, metadata })
  }

  async replace<V extends Pick<T['model'], T['idKey']>>(record: V, replace: T['insert'], metadata?: T['metadata']): Promise<void> {
    return this.apiV2.replaceOne({ filter: this.idFilter(record), replace, metadata })
  }

  async replaceOne(filter: T['filter'], replace: T['insert'], metadata?: T['metadata']): Promise<void> {
    return this.apiV2.replaceOne({ filter, replace, metadata })
  }

  async delete<V extends Pick<T['model'], T['idKey']>>(record: V, metadata?: T['metadata']): Promise<void> {
    return this.apiV2.deleteOne({ filter: this.idFilter(record), metadata })
  }

  async deleteOne(filter: T['filter'], metadata?: T['metadata']): Promise<void> {
    return this.apiV2.deleteOne({ filter, metadata })
  }

  async deleteMany(filter: T['filter'], metadata?: T['metadata']): Promise<void> {
    return this.apiV2.deleteAll({ filter, metadata })
  }
}
