import { setTraversing } from '../../../utils/utils'
import { DAOAssociation } from './associations.types'

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
