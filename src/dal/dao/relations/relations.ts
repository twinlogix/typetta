import { DAORelation } from './relations.types'

export function overrideRelations(relations1: DAORelation[] = [], relations2: DAORelation[] = []): DAORelation[] {
  return [...relations2, ...relations1.filter((relation1) => !relations2.find((relation2) => relation1.field === relation2.field))]
}