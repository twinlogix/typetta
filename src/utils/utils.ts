import { Schema } from 'mongoose'
import { Request, Response } from 'express'
import { AbstractDAOContext } from '../dal/daoContext'
import { ComparisonOperators, ElementOperators, EvaluationOperators, SortDirection } from '..'
import { setTraversing } from '@twinlogix/tl-commons'
import { DAOAssociation } from '../dal/dao'
import { Projection } from './types'
import _ from 'lodash'

export type GraphQLContext<DAOContext extends AbstractDAOContext, SecureDAOContext extends AbstractDAOContext> = {
  request: Request
  response: Response
  dao: DAOContext
  secureDao: SecureDAOContext
}

export type RequestArgs<Filter, Sort> = {
  start?: number
  limit?: number
  filter?: Filter
  sorts?: Sort[]
}

export type ConditionalPartialBy<T, K extends keyof T, Condition extends boolean> = Condition extends true ? Omit<T, K> & Partial<Pick<T, K>> : T

export type OneKey<K extends string, V = any> = {
  [P in K]: Record<P, V> & Partial<Record<Exclude<K, P>, never>> extends infer O ? { [Q in keyof O]: O[Q] } : never
}[K]

export function overrideAssociations(associations1: DAOAssociation[] = [], associations2: DAOAssociation[] = []): DAOAssociation[] {
  return [...associations2, ...associations1.filter((association1) => !associations2.find((association2) => association1.field === association2.field))]
}

export function addAssociationRefToProjection(associationFieldPath: string, refPath: string, projections: any, originalProjections: any = projections) {
  const associationFieldPathSplitted = associationFieldPath.split('.')
  if (associationFieldPathSplitted.length === 1) {
    if (projections[associationFieldPathSplitted[0]]) {
      setTraversing(originalProjections, refPath, true)
    }
  } else {
    if (projections[associationFieldPathSplitted[0]] === true) {
      setTraversing(originalProjections, refPath, true)
    } else if (typeof projections[associationFieldPathSplitted[0]] === 'object') {
      addAssociationRefToProjection(associationFieldPathSplitted.slice(1).join('.'), refPath, projections[associationFieldPathSplitted[0]], originalProjections)
    }
  }
}

export function flattenSorts<SortInput extends { [key: string]: SortDirection | null | undefined }, SortKey extends string>(
  sorts?: SortInput[],
  mappings?: { [key: string]: SortKey },
): OneKey<SortKey, SortDirection>[] | undefined {
  return sorts
    ?.map((sort) =>
      Object.keys(sort)
        .filter((key) => sort[key] !== null && sort[key] !== undefined)
        .map((key) => {
          // @ts-ignore
          const resKey: SortKey = mappings && mappings[key] ? mappings[key] : key
          return { [resKey]: sort[key] } as OneKey<SortKey, SortDirection>
        }),
    )
    .flat()
}

export function mongooseProjection<T>(projections: Projection<T>, mongooseSchema: Schema, prefix: string = '') {
  if (projections) {
    let mongooseProjections: any = {}
    Object.entries(projections).forEach(([key, value]) => {
      if (value === true) {
        if (mongooseSchema.path(key)) {
          mongooseProjections[prefix + key] = 1
        }
      } else if (typeof value === 'object') {
        if (mongooseSchema.path(key)) {
          const schemaType: any = mongooseSchema.path(key)
          if (schemaType.schema) {
            mongooseProjections = { ...mongooseProjections, ...mongooseProjection(value, schemaType.schema, prefix + key + '.') }
          } else {
            mongooseProjections[prefix + key] = 1
          }
        }
      }
    })
    return mongooseProjections
  } else {
    return null
  }
}

export function hasIdFilter<IDType, Filter extends { id?: IDType | null | ComparisonOperators<IDType> | ElementOperators<IDType> | EvaluationOperators<IDType> }>(
  conditions: Filter,
  id: IDType | null,
): boolean {
  return hasFieldFilter<IDType, 'id', Filter>(conditions, 'id', id)
}

export function hasFieldFilter<
  FieldType,
  FieldName extends string,
  Filter extends { [P in FieldName]?: FieldType | null | ComparisonOperators<FieldType> | ElementOperators<FieldType> | EvaluationOperators<FieldType> },
>(conditions: Filter, fieldName: FieldName, id: FieldType | null): boolean {
  return (
    (id &&
      conditions[fieldName] &&
      (conditions[fieldName] === id ||
        (typeof conditions[fieldName] === 'object' &&
          (conditions[fieldName] as ComparisonOperators<FieldType>).$in &&
          (conditions[fieldName] as ComparisonOperators<FieldType>).$in!.length === 1 &&
          (conditions[fieldName] as ComparisonOperators<FieldType>).$in![0] === id) ||
        (typeof conditions[fieldName] === 'object' && (conditions[fieldName] as ComparisonOperators<FieldType>).$eq && (conditions[fieldName] as ComparisonOperators<FieldType>).$eq! === id))) ||
    false
  )
}
