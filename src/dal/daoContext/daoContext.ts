import { AbstractDAO } from '../dao/dao'
import { DefaultModelScalars, DriverDataTypeAdapterMap } from '../drivers/drivers.types'
import { mongoDbAdapters, MongoDBDataTypeAdapterMap } from '../drivers/no-sql/mongodb/adapters.mongodb'
import { knexJsAdapters, KnexJSDataTypeAdapterMap } from '../drivers/sql/knexjs/adapters.knexjs'
import { v4 as uuidv4 } from 'uuid'

export abstract class AbstractDAOContext<ScalarsType extends DefaultModelScalars = DefaultModelScalars, MetadataType = any> {
  public idGenerators: { [K in keyof ScalarsType]?: () => ScalarsType[K] }
  public adapters: DriverDataTypeAdapterMap<ScalarsType>
  public metadata?: MetadataType

  public constructor(args?: { adapters?: Partial<DriverDataTypeAdapterMap<ScalarsType>>; metadata?: MetadataType; idGenerators?: { [K in keyof ScalarsType]?: () => ScalarsType[K] } }) {
    this.adapters = {
      knexjs: args?.adapters?.knexjs || (knexJsAdapters as KnexJSDataTypeAdapterMap<ScalarsType>),
      mongoDB: args?.adapters?.mongoDB || (mongoDbAdapters as MongoDBDataTypeAdapterMap<ScalarsType>),
    }
    this.idGenerators = args?.idGenerators || ({ String: () => uuidv4() } as { [K in keyof ScalarsType]?: () => ScalarsType[K] })
    this.metadata = args?.metadata
  }

  public dao(daoName: string): AbstractDAO<any> {
    return (this as any)[daoName]
  }
}
