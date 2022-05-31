import { PartialDeep } from 'type-fest'

export type AbstractASTElement<Entities extends string, Scalars extends string> = {
  [K in string]: ({ type: 'relation'; relation: 'foreign' | 'inner' | 'relationEntity'; astName: Entities } | { type: 'scalar'; astName: Scalars } | { type: 'embedded'; astName: Entities }) & {
    isList: boolean
    isRequired: boolean
    isListElementRequired: boolean
    isExcluded: boolean
  } & ({ isId: false; generationStrategy: 'undefined' | 'middleware' | 'generator' } | { isId: true; generationStrategy: 'undefined' | 'user' | 'db' | 'generator' })
}

export type AbstractAST<Entities extends string, Scalars extends string> = {
  [K in Entities]: AbstractASTElement<Entities, Scalars>
}

export type EmbeddedFields<Entity extends string, AST extends AbstractAST<string, string>> = {
  [Field in keyof AST[Entity]]: AST[Entity][Field]['type'] extends 'embedded' ? Field : never
}[keyof AST[Entity]]

export type Projection<Entity extends string, AST extends AbstractAST<string, string>> =
  | {
      [Field in keyof AST[Entity]]?: true | (AST[Entity][Field]['type'] extends 'embedded' | 'relation' ? Projection<AST[Entity][Field]['astName'], AST> : never)
    }

export type Project<Entity extends string, AST extends AbstractAST<string, string>, Scalars extends Record<string, unknown>, P extends Projection<Entity, AST> | true | undefined> = P extends Record<
  string,
  never
>
  ? { __projection: 'empty' }
  : [Projection<Entity, AST>] extends [P]
  ? PartialDeep<GenerateModel<Entity, AST, Scalars, 'relation'>> & { __projection: 'unknown' }
  : P extends true | undefined
  ? GenerateModel<Entity, AST, Scalars, 'relation'> & { __projection: 'all' }
  : DecorateGeneratedModel<
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        [K in keyof P]: K extends keyof AST[Entity] ? (P[K] extends true ? Scalars[AST[Entity][K]['astName']] : Project<AST[Entity][K]['astName'], AST, Scalars, P[K]>) : never
      },
      Entity,
      AST
    > & { __projection: P }

export type GenerateModel<Entity extends string, AST extends AbstractAST<string, string>, Scalars extends Record<string, unknown>, ExcludedType extends string = never> = DecorateGeneratedModel<
  OmitNever<{
    [Field in keyof AST[Entity]]: AST[Entity][Field]['type'] extends ExcludedType
      ? never
      : AST[Entity][Field]['type'] extends 'scalar'
      ? Scalars[AST[Entity][Field]['astName']]
      : GenerateModel<AST[Entity][Field]['astName'], AST, Scalars, ExcludedType>
  }>,
  Entity,
  AST
>

type DecorateGeneratedModel<Model extends Record<string, unknown>, Entity extends string, AST extends AbstractAST<string, string>> = DecorateGeneratedModel2<
  {
    [K in keyof Model]: K extends keyof AST[Entity] ? (AST[Entity][K]['isList'] extends true ? (AST[Entity][K]['isListElementRequired'] extends true ? Model[K] : Model[K] | null)[] : Model[K]) : never
  },
  Entity,
  AST
>

type DecorateGeneratedModel2<Model extends Record<string, unknown>, Entity extends string, AST extends AbstractAST<string, string>> = {
  [K in keyof Model]: K extends keyof AST[Entity] ? (AST[Entity][K]['isRequired'] extends true ? Model[K] : Model[K] | undefined | null) : never
} extends infer O
  ? O
  : never

type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] }
