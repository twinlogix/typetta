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

  protected idFilter<V extends Pick<T['modelType'], T['idKey']>>(model: V): T['filterType'] {
    return { [this.idField]: model[this.idField] } as unknown as T['filterType']
  }

  async find<P extends AnyProjection<T['projectionType']>>(
    filter: T['filterType'],
    projection?: P,
    sorts?: T['sortType'] | T['sortType'][],
    start?: number,
    limit?: number,
    options?: T['optionsType'] & T['driverOptionType'],
  ): Promise<ModelProjection<T['modelType'], T['projectionType'], P>[]> {
    return this.apiV2.findAll({ filter, projection, sorts: sorts ? (Array.isArray(sorts) ? sorts : [sorts]) : [], start, limit, options })
  }

  async findPage<P extends AnyProjection<T['projectionType']>>(
    filter: T['filterType'],
    projection?: P,
    sorts?: T['sortType'],
    start?: number,
    limit?: number,
    options?: T['optionsType'] & T['driverOptionType'],
  ): Promise<{ totalCount: number; records: ModelProjection<T['modelType'], T['projectionType'], P>[] }> {
    return this.apiV2.findPage({ filter, projection, sorts: sorts ? (Array.isArray(sorts) ? sorts : [sorts]) : [], start, limit, options })
  }

  async findOne<P extends AnyProjection<T['projectionType']>>(
    filter: T['filterType'],
    projection?: P,
    options?: T['optionsType'] & T['driverOptionType'],
  ): Promise<ModelProjection<T['modelType'], T['projectionType'], P> | null> {
    return this.apiV2.findOne({ filter, projection, options })
  }

  async exists(filter?: T['filterType'], options?: T['optionsType'] & T['driverOptionType']): Promise<boolean> {
    return this.apiV2.exists({ filter, options })
  }

  async count(filter?: T['filterType'], options?: T['optionsType'] & T['driverOptionType']): Promise<number> {
    return this.apiV2.count({ filter, options })
  }

  async insert(record: T['insertType'], options?: T['optionsType'] & T['driverOptionType']): Promise<Omit<T['modelType'], T['exludedFields']>> {
    return this.apiV2.insertOne({ record, options })
  }

  async update<V extends Pick<T['modelType'], T['idKey']>>(record: V, changes: T['updateType'], options?: T['optionsType'] & T['driverOptionType']): Promise<void> {
    return this.apiV2.updateOne({ filter: this.idFilter(record), changes, options })
  }

  async updateOne(filter: T['filterType'], changes: T['updateType'], options?: T['optionsType'] & T['driverOptionType']): Promise<void> {
    return this.apiV2.updateOne({ filter, changes, options })
  }

  async updateMany(filter: T['filterType'], changes: T['updateType'], options?: T['optionsType'] & T['driverOptionType']): Promise<void> {
    return this.apiV2.updateAll({ filter, changes, options })
  }

  async replace<V extends Pick<T['modelType'], T['idKey']>>(record: V, replace: T['insertType'], options?: T['optionsType'] & T['driverOptionType']): Promise<void> {
    return this.apiV2.replaceOne({ filter: this.idFilter(record), replace, options })
  }

  async replaceOne(filter: T['filterType'], replace: T['insertType'], options?: T['optionsType'] & T['driverOptionType']): Promise<void> {
    return this.apiV2.replaceOne({ filter, replace, options })
  }

  async delete<V extends Pick<T['modelType'], T['idKey']>>(record: V, options?: T['optionsType'] & T['driverOptionType']): Promise<void> {
    return this.apiV2.deleteOne({ filter: this.idFilter(record), options })
  }

  async deleteOne(filter: T['filterType'], options?: T['optionsType'] & T['driverOptionType']): Promise<void> {
    return this.apiV2.deleteOne({ filter, options })
  }

  async deleteMany(filter: T['filterType'], options?: T['optionsType'] & T['driverOptionType']): Promise<void> {
    return this.apiV2.deleteAll({ filter, options })
  }
}
