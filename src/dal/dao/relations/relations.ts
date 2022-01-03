import { setTraversing } from '../../../utils/utils'
import { DAORelation } from './relations.types'

export function overrideRelations(relations1: DAORelation[] = [], relations2: DAORelation[] = []): DAORelation[] {
  return [...relations2, ...relations1.filter((relation1) => !relations2.find((relation2) => relation1.field === relation2.field))]
}

export function addRelationRefToProjection(relationFieldPath: string, refPath: string, projections: any, originalProjections: any = projections) {
  const relationFieldPathSplitted = relationFieldPath.split('.')
  if (relationFieldPathSplitted.length === 1) {
    if (projections[relationFieldPathSplitted[0]]) {
      setTraversing(originalProjections, refPath, true)
    }
  } else {
    if (projections[relationFieldPathSplitted[0]] === true) {
      setTraversing(originalProjections, refPath, true)
    } else if (typeof projections[relationFieldPathSplitted[0]] === 'object') {
      addRelationRefToProjection(relationFieldPathSplitted.slice(1).join('.'), refPath, projections[relationFieldPathSplitted[0]], originalProjections)
    }
  }
}
