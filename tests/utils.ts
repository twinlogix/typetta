import { Db, MongoClient } from 'mongodb'
import { MongoMemoryReplSet } from 'mongodb-memory-server'

export async function inMemoryMongoDb(): Promise<{ replSet: MongoMemoryReplSet; connection: MongoClient; db: Db }> {
  const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
  const connection = await MongoClient.connect(replSet.getUri(), {})
  const db = connection.db('__mock')
  return { replSet, connection, db }
}
