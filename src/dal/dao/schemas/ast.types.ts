/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OmitNever } from '../../../utils/utils.types'
import { SortDirection } from '../sorts/sorts.types'
import { PartialDeep } from 'type-fest'

type ScalarsElement = { type: unknown; isTextual: boolean; isQuantitative: boolean }
export type AbstractScalars<Scalars extends string = string> = {
  [K in Scalars]: ScalarsElement
}

type AbstractSyntaxTreeElementField<Entities extends string, Scalars extends AbstractScalars> = (
  | { type: 'relation'; relation: 'foreign' | 'inner' | 'relationEntity'; astName: Entities }
  | { type: 'scalar'; astName: keyof Scalars }
  | { type: 'embedded'; astName: Entities }
) & {
  isList: boolean
  isRequired: boolean
  isListElementRequired: boolean
  isExcluded: boolean
} & ({ isId: false; generationStrategy: 'undefined' | 'middleware' | 'generator' } | { isId: true; generationStrategy: 'undefined' | 'user' | 'db' | 'generator' })
type AbstractSyntaxTreeElement<Entities extends string, Scalars extends AbstractScalars> = {
  [K in string]: AbstractSyntaxTreeElementField<Entities, Scalars>
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
  : DecorateModel<
      {
        //@ts-ignore
        [K in keyof P]: K extends keyof AST[Entity] ? (P[K] extends true ? Scalars[AST[Entity][K]['astName']]['type'] : Project<AST[Entity][K]['astName'], AST, Scalars, P[K]>) : never
      },
      Entity,
      AST
    > & { __projection: P }

export type GenerateModel<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars, ExcludedType extends string = never> = DecorateModel<
  OmitNever<{
    [Field in keyof AST[Entity]]: AST[Entity][Field] extends { type: infer Type; astName: infer ASTName }
      ? ASTName extends string
        ? Type extends ExcludedType
          ? never
          : Type extends 'scalar'
          ? Scalars[ASTName]['type']
          : GenerateModel<ASTName, AST, Scalars, ExcludedType>
        : never
      : never
  }>,
  Entity,
  AST
>

type DecorateModel<Model extends Record<string, unknown>, Entity extends string, AST extends AbstractSyntaxTree> = DecorateModelWithOptional<DecorateModelWithArray<Model, Entity, AST>, Entity, AST>
type DecorateModelWithArray<Model extends Record<string, unknown>, Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof Model]: K extends keyof AST[Entity] ? (AST[Entity][K]['isList'] extends true ? (AST[Entity][K]['isListElementRequired'] extends true ? Model[K] : Model[K] | null)[] : Model[K]) : never
}
type DecorateModelWithOptional<Model extends Record<string, unknown>, Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof Model & NotRequiredFields<Entity, AST>]?: Model[K] | null
} & {
  [K in keyof Model & RequiredFields<Entity, AST>]: Model[K]
} extends infer O
  ? O
  : never

/*export type Filter2<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars> = OmitNever<{
  [K in keyof AST[Entity]]: AST[Entity][K]['type'] extends 'scalar'
    ? Scalars[AST[Entity][K]['astName']]['type'] | { eq: Scalars[AST[Entity][K]['astName']]['type'] } //TODO finish
    : AST[Entity][K]['type'] extends 'embedded'
    ? Filter2<AST[Entity][K]['astName'], AST, Scalars>
    : never
}>*/

export type Filter<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars> = {
  [K in RecursiveScalarKeys<Entity, AST>]?: FieldFromPath<Entity, AST, Scalars, K> extends { astName: infer ASTName; isList: infer IsList }
    ? ASTName extends string
      ? Scalars[ASTName] extends { type: infer T; isQuantitative: infer IsQuantitative; isTextual: infer IsTextual }
        ? IsList extends true
          ?
              | (T | null | (T | null)[])
              | { eq?: T | null | (T | null)[]; in?: ((T | null)[] | T)[]; ne?: T | null | (T | null)[]; nin?: ((T | null)[] | T)[]; exists?: boolean }
          :
              | T
              | { eq?: T | null; in?: T[]; ne?: T | null; nin?: T[]; exists?: boolean }
              | (IsQuantitative extends true ? { gt?: T; lt?: T; gte?: T; lte?: T } : never)
              | (IsTextual extends true ? { contains?: T; startsWith?: T; endsWith?: T; mode?: 'sensitive' | 'insensitive' } : never)
        : never
      : never
    : never
}

export type Update<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars> = Partial<
  OmitNever<{
    [K in RecursiveScalarKeys<Entity, AST>]: FieldFromPath<Entity, AST, Scalars, K> extends {
      astName: infer ASTName
      isRequired: infer IsRequired
      generationStrategy: infer GenerationStrategy
      isList: infer IsList
      isListElementRequired: infer IsListElementRequired
    }
      ? ASTName extends keyof Scalars
        ? Scalars[ASTName]['type'] extends infer T
          ? GenerationStrategy extends 'db'
            ? never
            : IsRequired extends true
            ? IsList extends true
              ? IsListElementRequired extends true
                ? T[]
                : (T | null)[]
              : T
            : (IsList extends true ? (IsListElementRequired extends true ? T[] : (T | null)[]) : T) | null
          : never
        : never
      : never
  }>
>

export type SortElement<Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in RecursiveScalarKeys<Entity, AST>]?: SortDirection
}

type FieldFromPath<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars, Path> = Path extends `${infer R}.${infer T}`
  ? FieldFromPath<AST[Entity][R]['astName'], AST, Scalars, T>
  : Path extends keyof AST[Entity]
  ? AST[Entity][Path]
  : never

type RecursiveScalarKeys<Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof AST[Entity] & string]: AST[Entity][K] extends { type: infer Type; isExcluded: infer IsExcluded; astName: infer ASTName }
    ? ASTName extends string
      ? Type extends 'scalar'
        ? IsExcluded extends true
          ? never
          : K
        : Type extends 'embedded'
        ? `${K}.${RecursiveScalarKeys<ASTName, AST>}`
        : never
      : never
    : never
}[keyof AST[Entity] & string]

export type IdFields<Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof AST[Entity]]: AST[Entity][K]['isId'] extends true ? K : never
}[keyof AST[Entity]]

export type EmbeddedFields<Entity extends string, AST extends AbstractSyntaxTree> = {
  [Field in keyof AST[Entity]]: AST[Entity][Field]['type'] extends 'embedded' ? Field : never
}[keyof AST[Entity]]

export type NotRequiredFields<Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof AST[Entity]]: AST[Entity][K]['isRequired'] extends true ? never : K
}[keyof AST[Entity]]

export type RequiredFields<Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof AST[Entity]]: AST[Entity][K]['isRequired'] extends true ? K : never
}[keyof AST[Entity]]

export type Insert<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars> = DecorateModel<
  OmitNever<{
    [K in keyof AST[Entity]]: AST[Entity][K] extends { type: infer Type; isExcluded: infer IsExcluded; generationStrategy: infer GenerationStrategy; astName: infer ASTName }
      ? ASTName extends string
        ? IsExcluded extends true
          ? never
          : GenerationStrategy extends 'db'
          ? never
          : Type extends 'scalar'
          ? Scalars[ASTName]['type']
          : Type extends 'embedded'
          ? Insert<ASTName, AST, Scalars>
          : never
        : never
      : never
  }>,
  Entity,
  AST
>

//TODO: remove under
const user: GenerateModel<'User', AST, Scalars, 'relation'> = {
  id: '',
  live: true,
}
const proj: Projection<'User', AST> = {
  amount: true,
  friends: { embeddedUser: true },
}
const projUser1: Project<'User', AST, Scalars, { id: true; amount: true; friends: { firstName: true }; embeddedUser: { userId: true } }> = {
  __projection: null as any,
  id: '',
  amount: 1,
  embeddedUser: { __projection: null as any, userId: '' },
  friends: [{ __projection: null as any, firstName: '' }],
}
const projUser2: Project<'User', AST, Scalars, Record<string, never>> = {
  __projection: 'empty',
}
const projUser3: Project<'User', AST, Scalars, typeof proj> = {
  __projection: 'unknown',
}
const projUser4: Project<'User', AST, Scalars, true> = {
  __projection: 'all',
  id: '',
  live: true,
}
const projUser5: Project<'User', AST, Scalars, undefined> = {
  __projection: 'all',
  id: '',
  live: true,
}
const filter: Filter<'User', AST, Scalars> = {
  'usernamePasswordCredentials.password': { nin: ['a', 'b'] },
  'embeddedPost.metadata.visible': { eq: true },
  amount: { gt: 3 },
  amounts: { in: [[1, 2, null]] },
}
const insert: Insert<'User', AST, Scalars> = {
  live: true,
}
const update: Update<'User', AST, Scalars> = {
  'credentials.password': 'asd',
}
const sort: SortElement<'User', AST> = {
  'credentials.password': 'asc',
  'embeddedPost.metadata.region': 'asc',
}

console.log(user, proj, projUser1, projUser2, projUser3, projUser4, projUser5, filter, sort, insert, update)

export type AST = {
  Address: {
    cities: {
      type: 'relation'
      relation: 'foreign'
      node: 'Entity'
      isList: true
      astName: 'City'
      isRequired: false
      isListElementRequired: true
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    id: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
  }
  Audit: {
    changes: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    entityId: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
  }
  Auditable: {
    createdBy: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    createdOn: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    deletedOn: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    modifiedBy: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    modifiedOn: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    state: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'State'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    versions: {
      type: 'relation'
      relation: 'foreign'
      node: 'Entity'
      isList: true
      astName: 'Audit'
      isRequired: true
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
  }
  City: {
    addressId: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    computedAddressName: {
      type: 'scalar'
      node: 'Entity'
      isList: false
      astName: 'String'
      isRequired: false
      isListElementRequired: false
      isExcluded: true
      isId: false
      generationStrategy: 'undefined'
    }
    computedName: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: true; isId: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    name: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  DefaultFieldsEntity: {
    creationDate: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'middleware' }
    id: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'user' }
    live: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Live'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'generator' }
    name: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    opt1: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Live'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'middleware' }
    opt2: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Live'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'generator' }
  }
  Device: {
    id: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    name: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    user: {
      type: 'relation'
      relation: 'inner'
      node: 'Entity'
      isList: false
      astName: 'User'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    userId: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  Dog: {
    id: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    name: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    owner: {
      type: 'relation'
      relation: 'inner'
      node: 'Entity'
      isList: false
      astName: 'User'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    ownerId: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  EmbeddedUser: {
    e: { type: 'embedded'; node: 'Entity'; isList: true; astName: 'EmbeddedUser2'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    user: {
      type: 'relation'
      relation: 'inner'
      node: 'Entity'
      isList: false
      astName: 'User'
      isRequired: true
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    userId: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  EmbeddedUser2: {
    user: {
      type: 'relation'
      relation: 'inner'
      node: 'Entity'
      isList: false
      astName: 'User'
      isRequired: true
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    userId: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  EmbeddedUser3: {
    user: {
      type: 'relation'
      relation: 'inner'
      node: 'Entity'
      isList: false
      astName: 'User'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    value: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  EmbeddedUser4: {
    e: { type: 'embedded'; node: 'Entity'; isList: false; astName: 'EmbeddedUser5'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    user: {
      type: 'relation'
      relation: 'inner'
      node: 'Entity'
      isList: false
      astName: 'User'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
  }
  EmbeddedUser5: {
    userId: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  Hotel: {
    audit: { type: 'embedded'; node: 'Entity'; isList: false; astName: 'Auditable'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'middleware' }
    embeddedUser3: {
      type: 'embedded'
      node: 'Entity'
      isList: false
      astName: 'EmbeddedUser3'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    embeddedUser4: {
      type: 'embedded'
      node: 'Entity'
      isList: false
      astName: 'EmbeddedUser4'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    embeddedUsers: {
      type: 'embedded'
      node: 'Entity'
      isList: true
      astName: 'EmbeddedUser'
      isRequired: false
      isListElementRequired: true
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    embeddedUsers3: {
      type: 'embedded'
      node: 'Entity'
      isList: true
      astName: 'EmbeddedUser3'
      isRequired: false
      isListElementRequired: true
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    embeddedUsers4: {
      type: 'embedded'
      node: 'Entity'
      isList: true
      astName: 'EmbeddedUser4'
      isRequired: false
      isListElementRequired: true
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    id: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
    name: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    userId: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    users: {
      type: 'embedded'
      node: 'Entity'
      isList: false
      astName: 'UserCollection'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
  }
  MockedEntity: {
    id: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'MongoID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
    name: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    user: {
      type: 'relation'
      relation: 'inner'
      node: 'Entity'
      isList: false
      astName: 'User'
      isRequired: true
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    userId: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  Organization: {
    address: { type: 'embedded'; node: 'Entity'; isList: false; astName: 'Address'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    computedName: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: true; isId: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    name: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    vatNumber: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  Post: {
    author: {
      type: 'relation'
      relation: 'inner'
      node: 'Entity'
      isList: false
      astName: 'User'
      isRequired: true
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    authorId: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    body: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    clicks: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Int'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    id: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'generator' }
    metadata: {
      type: 'embedded'
      node: 'Entity'
      isList: false
      astName: 'PostMetadata'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    title: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    views: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Int'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  PostMetadata: {
    region: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    visible: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Boolean'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
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
    id: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
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
  UserCollection: {
    users: {
      type: 'relation'
      relation: 'inner'
      node: 'Entity'
      isList: true
      astName: 'User'
      isRequired: true
      isListElementRequired: true
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    usersId: { type: 'scalar'; node: 'Entity'; isList: true; astName: 'ID'; isRequired: true; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
  UsernamePasswordCredentials: {
    password: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'Password'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    user: {
      type: 'relation'
      relation: 'inner'
      node: 'Entity'
      isList: false
      astName: 'User'
      isRequired: false
      isListElementRequired: false
      isExcluded: false
      isId: false
      generationStrategy: 'undefined'
    }
    username: { type: 'scalar'; node: 'Entity'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
  }
}

export type TypesScalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Coordinates: string
  Decimal: number
  JSON: string
  Live: boolean
  LocalizedString: string
  MongoID: string
  Password: string
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
  Password: { type: TypesScalars['Password']; isTextual: true; isQuantitative: false }
}
