import { DriverDataTypeAdapterMap } from '../../dal/drivers/drivers.adapters'
import { AbstractDAO } from '../dao/dao'
import { DAOGenerics } from '../dao/dao.types'
import { DefaultModelScalars } from '../drivers/drivers.types'
import { mongoDbAdapters } from '../drivers/no-sql/mongodb/adapters.mongodb'
import { knexJsAdapters } from '../drivers/sql/knexjs/adapters.knexjs'
import { inMemoryAdapters } from '../drivers/in-memory/adapters.memory'

export abstract class AbstractDAOContext<ScalarsType extends DefaultModelScalars = DefaultModelScalars, MetadataType = unknown> {
  public adapters: DriverDataTypeAdapterMap<ScalarsType>
  public metadata?: MetadataType

  public constructor(args?: { scalars?: DriverDataTypeAdapterMap<ScalarsType>; metadata?: MetadataType; idGenerators?: { [K in keyof ScalarsType]?: () => ScalarsType[K] } }) {
    this.adapters = args?.scalars
      ? args.scalars
      : ({
          knex: knexJsAdapters,
          mongo: mongoDbAdapters,
          memory: inMemoryAdapters,
        } as DriverDataTypeAdapterMap<ScalarsType>)
    this.metadata = args?.metadata
  }

  public dao(daoName: string): AbstractDAO<DAOGenerics> {
    return (this as unknown as Record<string, AbstractDAO<DAOGenerics>>)[daoName]
  }
}
