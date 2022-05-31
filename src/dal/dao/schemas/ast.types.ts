import { DeepRequired, RecursiveKeyOfLeaf, TypeTraversal } from '../../../utils/utils.types'
import { PartialDeep } from 'type-fest'

export type AbstractScalars<Scalars extends string = string> = {
  [K in Scalars]: { type: unknown; isTextual: boolean; isQuantitative: boolean }
}

export type AbstractSyntaxTreeElement<Entities extends string, Scalars extends AbstractScalars> = {
  [K in string]: ({ type: 'relation'; relation: 'foreign' | 'inner' | 'relationEntity'; astName: Entities } | { type: 'scalar'; astName: keyof Scalars } | { type: 'embedded'; astName: Entities }) & {
    isList: boolean
    isRequired: boolean
    isListElementRequired: boolean
    isExcluded: boolean
  } & ({ isId: false; generationStrategy: 'undefined' | 'middleware' | 'generator' } | { isId: true; generationStrategy: 'undefined' | 'user' | 'db' | 'generator' })
}

export type AbstractSyntaxTree<Entities extends string = string, Scalars extends AbstractScalars = AbstractScalars> = {
  [K in Entities]: AbstractSyntaxTreeElement<Entities, Scalars>
}

export type Projection<Entity extends string, AST extends AbstractSyntaxTree> =
  | {
      [Field in keyof AST[Entity]]?: true | (AST[Entity][Field]['type'] extends 'embedded' | 'relation' ? Projection<AST[Entity][Field]['astName'], AST> : never)
    }

export type Project<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars, P extends Projection<Entity, AST> | true | undefined> = P extends Record<string, never>
  ? { __projection: 'empty' }
  : [Projection<Entity, AST>] extends [P]
  ? PartialDeep<GenerateModel<Entity, AST, Scalars, 'relation'>> & { __projection: 'unknown' }
  : P extends true | undefined
  ? GenerateModel<Entity, AST, Scalars, 'relation'> & { __projection: 'all' }
  : DecorateGeneratedModel<
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        [K in keyof P]: K extends keyof AST[Entity] ? (P[K] extends true ? Scalars[AST[Entity][K]['astName']]['type'] : Project<AST[Entity][K]['astName'], AST, Scalars, P[K]>) : never
      },
      Entity,
      AST
    > & { __projection: P }

export type GenerateModel<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars, ExcludedType extends string = never> = DecorateGeneratedModel<
  OmitNever<{
    [Field in keyof AST[Entity]]: AST[Entity][Field]['type'] extends ExcludedType
      ? never
      : AST[Entity][Field]['type'] extends 'scalar'
      ? Scalars[AST[Entity][Field]['astName']]['type']
      : GenerateModel<AST[Entity][Field]['astName'], AST, Scalars, ExcludedType>
  }>,
  Entity,
  AST
>

type DecorateGeneratedModel<Model extends Record<string, unknown>, Entity extends string, AST extends AbstractSyntaxTree> = DecorateGeneratedModel2<
  {
    [K in keyof Model]: K extends keyof AST[Entity] ? (AST[Entity][K]['isList'] extends true ? (AST[Entity][K]['isListElementRequired'] extends true ? Model[K] : Model[K] | null)[] : Model[K]) : never
  },
  Entity,
  AST
>

type DecorateGeneratedModel2<Model extends Record<string, unknown>, Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof Model]: K extends keyof AST[Entity] ? (AST[Entity][K]['isRequired'] extends true ? Model[K] : Model[K] | undefined | null) : never
} extends infer O
  ? O
  : never

type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] }

export type FlattenEmbeddedFilter<T> = {
  [K in RecursiveKeyOfLeaf<DeepRequired<T>>]?: TypeTraversal<T, K>
}

export type Filter<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars> = Partial<
  OmitNever<{
    [K in keyof AST[Entity]]: AST[Entity][K]['type'] extends 'scalar'
      ? Scalars[AST[Entity][K]['astName']]['type'] | { eq: Scalars[AST[Entity][K]['astName']]['type'] } //TODO finish
      : AST[Entity][K]['type'] extends 'embedded'
      ? Filter<AST[Entity][K]['astName'], AST, Scalars>
      : never
  }>
> extends infer O
  ? O
  : never

export type IdFields<Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof AST[Entity]]: AST[Entity][K]['isId'] extends true ? K : never
}[keyof AST[Entity]]

export type EmbeddedFields<Entity extends string, AST extends AbstractSyntaxTree> = {
  [Field in keyof AST[Entity]]: AST[Entity][Field]['type'] extends 'embedded' ? Field : never
}[keyof AST[Entity]]



//TODO: remove under

type AST = {
  User: {
    amount: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Decimal'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    amounts: { type: 'scalar'; node: 'Entity'; isList: true; astName: 'Decimal'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    credentials: {
      type: 'embedded'
      node: 'Entity'
      isList: true
      astName: 'UsernamePasswordCredentials'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    dogs: {
      type: 'relation'
      relation: 'foreign'
      node: 'Entity'
      isList: true
      astName: 'Dog'
      isRequired: false
      isListElementRequired: true
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    embeddedPost: { type: 'embedded'; node: 'Entity'; isList: false; astName: 'Post'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    embeddedUser: {
      type: 'embedded'
      node: 'Entity'
      isList: false
      astName: 'EmbeddedUser2'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    firstName: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    friends: {
      type: 'relation'
      relation: 'inner'
      node: 'Entity'
      isList: true
      astName: 'User'
      isRequired: false
      isListElementRequired: true
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    friendsId: { type: 'scalar'; node: 'Entity'; isList: true; astName: 'ID'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    int: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    lastName: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    live: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Boolean'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    localization: {
      type: 'scalar'
      node: 'Entity'
      isList: false
      astName: 'Coordinates'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    title: {
      type: 'scalar'
      node: 'Entity'
      isList: false
      astName: 'LocalizedString'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    usernamePasswordCredentials: {
      type: 'embedded'
      node: 'Entity'
      isList: false
      astName: 'UsernamePasswordCredentials'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
  }
}

export type TypesScalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Coordinates: any
  Decimal: any
  JSON: any
  Live: boolean
  LocalizedString: any
  MongoID: any
  Password: any
}
type Scalars = {
  ID: { type: TypesScalars['ID']; isTextual: false; isQuantitative: false }
  String: { type: TypesScalars['String']; isTextual: true; isQuantitative: false }
  Boolean: { type: TypesScalars['Boolean']; isTextual: false; isQuantitative: false }
  Int: { type: TypesScalars['Int']; isTextual: false; isQuantitative: true }
  Float: { type: TypesScalars['Float']; isTextual: false; isQuantitative: true }
  Coordinates: { type: TypesScalars['Coordinates']; isTextual: false; isQuantitative: false }
  Decimal: { type: TypesScalars['Decimal']; isTextual: false; isQuantitative: true }
  JSON: { type: TypesScalars['JSON']; isTextual: false; isQuantitative: false }
  Live: { type: TypesScalars['Live']; isTextual: false; isQuantitative: false }
  LocalizedString: { type: TypesScalars['LocalizedString']; isTextual: false; isQuantitative: false }
  MongoID: { type: TypesScalars['MongoID']; isTextual: false; isQuantitative: false }
  Password: { type: TypesScalars['Password']; isTextual: false; isQuantitative: false }
}
type A = EmbeddedFields<'User', AST>
type LOL = GenerateModel<'User', AST, Scalars, 'relation'>
type P = Projection<'User', AST>
type ASD1 = Project<'User', AST, Scalars, Record<string, never>>
type ASD2 = Project<'User', AST, Scalars, undefined>
type ASD3 = Project<'User', AST, Scalars, true>
type ASD4 = Project<'User', AST, Scalars, P>
type ASD = Project<'User', AST, Scalars, { id: true }>
type Ids = IdFields<'User', AST>
type F = Filter<'User', AST, Scalars>
