import { OmitNever } from '../../../utils/utils.types'
import { AbstractSyntaxTree, FieldFromPath, RecursiveScalarKeys } from '../schemas/ast.types'
import { CreateIndexesOptions, IndexDirection } from 'mongodb'

type Specs<Entity extends string, AST extends AbstractSyntaxTree> = Partial<
  OmitNever<{
    [K in RecursiveScalarKeys<Entity, AST>]: FieldFromPath<Entity, AST, K> extends {
      isExcluded: infer IsExluded
    }
      ? IsExluded extends true
        ? never
        : IndexDirection
      : never
  }>
>

type MongoDBIndex<AST extends AbstractSyntaxTree, K extends keyof AST> = {
  name: string
  specs: K extends string ? Specs<K, AST> : never
  opts?: Omit<CreateIndexesOptions, 'name'>
}

type MongoEntities<AST extends AbstractSyntaxTree> = {
  [K in keyof AST]: AST[K]['driverSpecification']['type'] extends 'mongodb' ? K : never
}[keyof AST]

export type MongoDBIndexes<AST extends AbstractSyntaxTree> = { [K in MongoEntities<AST>]: MongoDBIndex<AST, K>[] }
export type Indexes<AST extends AbstractSyntaxTree = AbstractSyntaxTree> = {
  mongodb?: Partial<MongoDBIndexes<AST>>
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
