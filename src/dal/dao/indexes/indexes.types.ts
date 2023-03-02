import { Update } from '../schemas/ast.types'
import { AbstractSyntaxTree, AbstractScalars } from '../schemas/ast.types'
import { CreateIndexesOptions, IndexDirection } from 'mongodb'

type MongoDBIndex<AST extends AbstractSyntaxTree, Scalars extends AbstractScalars, K extends keyof AST> = {
  name: string
  specs: { [F in keyof (K extends string ? Update<K, AST, Scalars> : never)]?: IndexDirection }
  opts?: Omit<CreateIndexesOptions, 'name'>
}

type MongoEntities<AST extends AbstractSyntaxTree> = {
  [K in keyof AST]: AST[K]['driverSpecification']['type'] extends 'mongodb' ? K : never
}[keyof AST]

export type MongoDBIndexes<AST extends AbstractSyntaxTree, Scalars extends AbstractScalars> = { [K in MongoEntities<AST>]: MongoDBIndex<AST, Scalars, K>[] }
export type Indexes<AST extends AbstractSyntaxTree = AbstractSyntaxTree, Scalars extends AbstractScalars = AbstractScalars> = {
  mongodb?: Partial<MongoDBIndexes<AST, Scalars>>
}

export type IndexesPlanResults = {
  mongodb: {
    toDelete: { collection: string; name: string }[]
    toCreate: { collection: string; name: string; specs: { [K in string]: IndexDirection }; opts?: Omit<CreateIndexesOptions, 'name'> }[]
  }
  //knexjs: never
}

export type IndexesApplyResults = {
  mongodb: {
    deleted: { collection: string; name: string }[]
    created: { collection: string; name: string; specs: { [K in string]: IndexDirection }; opts?: Omit<CreateIndexesOptions, 'name'> }[]
    failed: { collection: string; name: string; specs: { [K in string]: IndexDirection }; opts?: Omit<CreateIndexesOptions, 'name'>; error: unknown }[]
  }
  //knexjs: never
}
