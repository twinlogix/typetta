import { DriverDataTypeAdapterMap } from '../../dal/drivers/drivers.adapters'
import { AbstractDAO } from '../dao/dao'
import { DefaultModelScalars } from '../drivers/drivers.types'
import { mongoDbAdapters } from '../drivers/no-sql/mongodb/adapters.mongodb'
import { knexJsAdapters } from '../drivers/sql/knexjs/adapters.knexjs'

export abstract class AbstractDAOContext<ScalarsType extends DefaultModelScalars = DefaultModelScalars, MetadataType = any> {
  public scalars: DriverDataTypeAdapterMap<ScalarsType>
  public metadata?: MetadataType

  public constructor(args?: { scalars?: DriverDataTypeAdapterMap<ScalarsType>; metadata?: MetadataType; idGenerators?: { [K in keyof ScalarsType]?: () => ScalarsType[K] } }) {
    this.scalars = args?.scalars
      ? args.scalars
      : ({
          knex: knexJsAdapters,
          mongo: mongoDbAdapters,
        } as DriverDataTypeAdapterMap<ScalarsType>)
    this.metadata = args?.metadata
  }

  public dao(daoName: string): AbstractDAO<any> {
    return (this as any)[daoName]
  }
}
