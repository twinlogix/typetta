/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Difference, OmitNever } from '../../../utils/utils.types'
import { CachedTypes } from '../dao.types'
import { SortDirection } from '../sorts/sorts.types'
import { GraphQLResolveInfo } from 'graphql'
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
type AbstractSyntaxTreeFields<Entities extends string, Scalars extends AbstractScalars> = {
  [K in string]: AbstractSyntaxTreeElementField<Entities, Scalars>
}
export type AbstractSyntaxTree<Entities extends string = string, Scalars extends AbstractScalars = AbstractScalars> = {
  [K in Entities]: {
    fields: AbstractSyntaxTreeFields<Entities, Scalars>
    driverSpecification: {
      rawFilter: unknown
      rawUpdate: unknown
      rawSorts: unknown
    }
  }
}

export type Projection<Entity extends string, AST extends AbstractSyntaxTree> =
  | {
      [Field in keyof AST[Entity]['fields']]?: true | (AST[Entity]['fields'][Field]['type'] extends 'embedded' | 'relation' ? Projection<AST[Entity]['fields'][Field]['astName'], AST> : never)
    }

export type Project<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars, P, Cache extends CachedTypes | null = null> = 0 extends 1 & Cache
  ? any
  : P extends Record<string, never>
  ? { __projection: 'empty' }
  : [Projection<Entity, AST>] extends [P]
  ? Cache extends { model: infer Model }
    ? PartialDeep<Model> & { __projection: 'unknown' }
    : PartialDeep<GenerateModel<Entity, AST, Scalars, 'relation'>> & { __projection: 'unknown' }
  : P extends GraphQLResolveInfo
  ? Cache extends { model: infer Model }
    ? PartialDeep<Model> & { __projection: 'unknown' }
    : PartialDeep<GenerateModel<Entity, AST, Scalars, 'relation'>> & { __projection: 'unknown' }
  : P extends true | undefined
  ? Cache extends { insertResult: infer InsertResult }
    ? InsertResult & { __projection: 'all' }
    : GenerateModel<Entity, AST, Scalars, 'relation'> & { __projection: 'all' }
  : DecorateModel<
      OmitNever<{
        [K in keyof P]: K extends keyof AST[Entity]['fields']
          ? AST[Entity]['fields'][K] extends { astName: infer ASTName; type: infer Type }
            ? ASTName extends string
              ? P[K] extends true
                ? Type extends 'scalar'
                  ? Scalars[ASTName]['type']
                  : GenerateModel<ASTName, AST, Scalars, 'relation'>
                : Project<ASTName, AST, Scalars, P[K]>
              : never
            : never
          : never
      }>,
      Entity,
      AST
    > & { __projection: P }

export type Params<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars, P> = P extends Record<string, never>
  ? { __projection: 'empty' }
  : [Projection<Entity, AST>] extends [P]
  ? PartialDeep<GenerateModel<Entity, AST, Scalars, 'relation'>> & { __projection: 'unknown' }
  : P extends true
  ? GenerateModel<Entity, AST, Scalars, 'relation'> & { __projection: 'all' }
  : DecorateModel<
      OmitNever<{
        [K in keyof P]: K extends keyof AST[Entity]['fields']
          ? AST[Entity]['fields'][K] extends { astName: infer ASTName; type: infer Type }
            ? ASTName extends string
              ? P[K] extends true
                ? Type extends 'scalar'
                  ? Scalars[ASTName]['type']
                  : GenerateModel<ASTName, AST, Scalars, 'relation'>
                : Params<ASTName, AST, Scalars, P[K]>
              : never
            : never
          : never
      }>,
      Entity,
      AST
    > & { __projection?: P }

export type GenerateModel<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars, ExcludedType extends string = never> = DecorateModel<
  OmitNever<{
    [Field in keyof AST[Entity]['fields']]: AST[Entity]['fields'][Field] extends { type: infer Type; astName: infer ASTName }
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

type DecorateModel<Model extends Record<string, unknown>, Entity extends string, AST extends AbstractSyntaxTree> = DecorateModelWithOptional<
  NotRequiredFields<Entity, AST>,
  DecorateModelWithArray<Model, Entity, AST>
>
type DecorateModelInsert<Model extends Record<string, unknown>, Entity extends string, AST extends AbstractSyntaxTree> = DecorateModelWithOptional<
  NotRequiredFields<Entity, AST> | OptionalInsertFields<Entity, AST>,
  DecorateModelWithArray<Model, Entity, AST>
>
type DecorateModelWithArray<Model extends Record<string, unknown>, Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof Model]: K extends keyof AST[Entity]['fields']
    ? AST[Entity]['fields'][K]['isList'] extends true
      ? (AST[Entity]['fields'][K]['isListElementRequired'] extends true ? Model[K] : Model[K] | null)[]
      : Model[K]
    : never
}
type DecorateModelWithOptional<OptionalFields, Model extends Record<string, unknown>> = {
  [K in keyof Model & OptionalFields]?: Model[K] | null
} & {
  [K in Difference<keyof Model, OptionalFields>]: Model[K]
} extends infer O
  ? O
  : never

export type Filter<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars> = {
  [K in RecursiveScalarKeys<Entity, AST>]?: FieldFromPath<Entity, AST, K> extends { astName: infer ASTName; isList: infer IsList }
    ? Scalars[ASTName & string] extends { type: infer T; isQuantitative: infer IsQuantitative; isTextual: infer IsTextual }
      ? IsList extends true
        ? (T | null | (T | null)[]) | { eq?: T | null | (T | null)[]; in?: ((T | null)[] | T)[] | null; ne?: T | null | (T | null)[]; nin?: ((T | null)[] | T)[] | null; exists?: boolean | null }
        :
            | T
            | null
            | { eq?: T | null; in?: T[] | null; ne?: T | null; nin?: T[] | null; exists?: boolean | null }
            | (IsQuantitative extends true ? { gt?: T; lt?: T; gte?: T; lte?: T } : never)
            | (IsTextual extends true ? { contains?: T; startsWith?: T; endsWith?: T; mode?: 'sensitive' | 'insensitive' } : never)
      : never
    : never
}

export type Insert<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars> = DecorateModelInsert<
  OmitNever<{
    [K in keyof AST[Entity]['fields']]: AST[Entity]['fields'][K] extends { type: infer Type; isExcluded: infer IsExcluded; generationStrategy: infer GenerationStrategy; astName: infer ASTName }
      ? IsExcluded extends true
        ? never
        : GenerationStrategy extends 'db'
        ? never
        : Type extends 'scalar'
        ? Scalars[ASTName & string]['type']
        : Type extends 'embedded'
        ? Insert<ASTName & string, AST, Scalars>
        : never
      : never
  }>,
  Entity,
  AST
>

type UpdateEmbeddedModel<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars> = DecorateModelInsert<
  OmitNever<{
    [Field in keyof AST[Entity]['fields']]: AST[Entity]['fields'][Field] extends { type: infer Type; astName: infer ASTName; isExcluded: infer IsExluded }
      ? IsExluded extends true
        ? never
        : ASTName extends string
        ? Type extends 'relation'
          ? never
          : Type extends 'scalar'
          ? Scalars[ASTName]['type']
          : UpdateEmbeddedModel<ASTName, AST, Scalars>
        : never
      : never
  }>,
  Entity,
  AST
>

export type Update<Entity extends string, AST extends AbstractSyntaxTree, Scalars extends AbstractScalars> = Partial<
  OmitNever<
    {
      [K in RecursiveScalarKeys<Entity, AST>]: FieldFromPath<Entity, AST, K> extends {
        astName: infer ASTName
        generationStrategy: infer GenerationStrategy
        isList: infer IsList
        isListElementRequired: infer IsListElementRequired
        isExcluded: infer IsExluded
      }
        ? IsExluded extends true
          ? never
          : ASTName extends keyof Scalars
          ? Scalars[ASTName]['type'] extends infer T
            ? GenerationStrategy extends 'db'
              ? never
              : IsList extends true
              ? IsListElementRequired extends true
                ? T[] | null
                : (T | null)[] | null
              : T | null
            : never
          : never
        : never
    } & {
      [K in RecursiveEmbeddedKeys<Entity, AST>]: FieldFromPath<Entity, AST, K> extends {
        astName: infer ASTName
        isList: infer IsList
        isListElementRequired: infer IsListElementRequired
      }
        ? UpdateEmbeddedModel<ASTName & string, AST, Scalars> extends infer T
          ? IsList extends true
            ? IsListElementRequired extends true
              ? T[] | null
              : (T | null)[] | null
            : T | null
          : never
        : never
    }
  >
>

export type SortElement<Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in RecursiveScalarKeys<Entity, AST>]?: SortDirection
}

type FieldFromPath<Entity extends string, AST extends AbstractSyntaxTree, Path> = Path extends `${infer R}.${infer T}`
  ? FieldFromPath<AST[Entity]['fields'][R]['astName'], AST, T>
  : Path extends keyof AST[Entity]['fields']
  ? AST[Entity]['fields'][Path]
  : never

type RecursiveScalarKeys<Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof AST[Entity]['fields'] & string]: AST[Entity]['fields'][K] extends { type: infer Type; isExcluded: infer IsExcluded; astName: infer ASTName }
    ? Type extends 'scalar'
      ? IsExcluded extends true
        ? never
        : K
      : Type extends 'embedded'
      ? `${K}.${RecursiveScalarKeys<ASTName & string, AST>}`
      : never
    : never
}[keyof AST[Entity]['fields'] & string]

type RecursiveEmbeddedKeys<Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof AST[Entity]['fields'] & string]: AST[Entity]['fields'][K] extends { type: infer Type; isExcluded: infer IsExcluded; astName: infer ASTName }
    ? Type extends 'embedded'
      ? IsExcluded extends true
        ? never
        : K | `${K}.${RecursiveEmbeddedKeys<ASTName & string, AST>}`
      : never
    : never
}[keyof AST[Entity]['fields'] & string]

export type IdFields<Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof AST[Entity]['fields']]: AST[Entity]['fields'][K]['isId'] extends true ? K : never
}[keyof AST[Entity]['fields']]

export type EmbeddedFields<Entity extends string, AST extends AbstractSyntaxTree> = {
  [Field in keyof AST[Entity]['fields']]: AST[Entity]['fields'][Field]['type'] extends 'embedded' ? Field : never
}[keyof AST[Entity]['fields']]

export type NotRequiredFields<Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof AST[Entity]['fields']]: AST[Entity]['fields'][K]['isRequired'] extends true ? never : K
}[keyof AST[Entity]['fields']]

export type RequiredFields<Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof AST[Entity]['fields']]: AST[Entity]['fields'][K]['isRequired'] extends true ? K : never
}[keyof AST[Entity]['fields']]

export type OptionalInsertFields<Entity extends string, AST extends AbstractSyntaxTree> = {
  [K in keyof AST[Entity]['fields']]: AST[Entity]['fields'][K] extends { isId: infer IsId; generationStrategy: infer GenerationStrategy }
    ? IsId extends true
      ? GenerationStrategy extends 'user'
        ? never
        : K
      : GenerationStrategy extends 'middleware'
      ? K
      : GenerationStrategy extends 'generator'
      ? K
      : never
    : never
}[keyof AST[Entity]['fields']]
