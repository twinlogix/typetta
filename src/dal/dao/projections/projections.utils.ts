import { GenericProjection, MergeGenericProjection } from './projections.types'
import { FieldNode, getNamedType, GraphQLInterfaceType, GraphQLNamedType, GraphQLObjectType, GraphQLResolveInfo, GraphQLSchema, GraphQLType, GraphQLUnionType } from 'graphql'

type SelectProjection<ProjectionType extends GenericProjection, P1 extends ProjectionType, P2 extends ProjectionType> = ProjectionType extends P1
  ? ProjectionType
  : ProjectionType extends P2
  ? ProjectionType
  : MergeGenericProjection<P1, P2>

export function mergeGenericProjection<P1 extends GenericProjection, P2 extends GenericProjection>(p1: P1, p2: P2): MergeGenericProjection<P1, P2> {
  return mergeProjections(p1, p2)
}
export interface ProjectionBuilderInterface<ProjectionType extends GenericProjection> {
  merge<P1 extends ProjectionType, P2 extends ProjectionType>(p1: P1, p2: P2): SelectProjection<ProjectionType, P1, P2>

  fromInfo(info: GraphQLResolveInfo, defaults?: any, context?: FieldNode, type?: GraphQLNamedType, schema?: GraphQLSchema): ProjectionType | true
}

export function projection<ProjectionType extends GenericProjection>(): ProjectionBuilderInterface<ProjectionType> {
  return new (class implements ProjectionBuilderInterface<ProjectionType> {
    merge<P1 extends ProjectionType, P2 extends ProjectionType>(p1: P1, p2: P2): SelectProjection<ProjectionType, P1, P2> {
      return mergeProjections(p1 as GenericProjection, p2 as GenericProjection) as SelectProjection<ProjectionType, P1, P2>
    }

    fromInfo(info: GraphQLResolveInfo, defaults?: any, context?: FieldNode, type?: GraphQLNamedType, schema?: GraphQLSchema): ProjectionType | true {
      return infoToProjection(info, defaults, context ? context : info.fieldNodes[0], type ? type : getNamedType(info.returnType), schema ? schema : info.schema)
    }
  })()
}

export function mergeProjections<P1 extends GenericProjection, P2 extends GenericProjection>(p1: P1, p2: P2): MergeGenericProjection<P1, P2> {
  if (p1 === true || p2 === true) return true as MergeGenericProjection<P1, P2>
  if (p1 === null || p1 === undefined) return p2 as MergeGenericProjection<P1, P2>
  if (p2 === null || p2 === undefined) return p1 as MergeGenericProjection<P1, P2>
  if (p1 === false) return p2 as MergeGenericProjection<P1, P2>
  if (p2 === false) return p1 as MergeGenericProjection<P1, P2>
  const p1k = Object.keys(p1)
  const p2k = Object.keys(p2)
  const keySet = new Set([...p1k, ...p2k])
  const res: Exclude<GenericProjection, true | false> = {}
  keySet.forEach((key) => {
    res[key] = mergeProjections(p1[key], p2[key])
  })
  return res as MergeGenericProjection<P1, P2>
}

export function infoToProjection<ProjectionType>(info: GraphQLResolveInfo, defaults: any, context: FieldNode, type: GraphQLNamedType, schema: GraphQLSchema): ProjectionType | true {
  if (context.selectionSet) {
    return context.selectionSet.selections.reduce(
      (proj: any, selection: any) => {
        switch (selection.kind) {
          case 'Field':
            if (selection && selection.selectionSet && selection.selectionSet.selections) {
              if (proj[selection.name.value] === true) {
                return proj
              } else {
                if (type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType) {
                  const field = type.getFields()[selection.name.value]
                  if (field) {
                    const fieldType = getNamedType(field.type)
                    return {
                      ...proj,
                      [selection.name.value]: infoToProjection(info, proj[selection.name.value], selection, fieldType, schema),
                    }
                  }
                }
              }
            } else {
              return {
                ...proj,
                [selection.name.value]: true,
              }
            }
          case 'InlineFragment':
            const inlineFragmentRef = selection.typeCondition.name.value
            return fragmentToProjections(info, proj, selection, inlineFragmentRef, type, schema)
          case 'FragmentSpread':
            const fragmentRef = info.fragments[selection.name.value].typeCondition.name.value
            return fragmentToProjections(info, proj, info.fragments[selection.name.value], fragmentRef, type, schema)
          default:
            return {}
        }
      },
      { ...defaults },
    )
  } else {
    return true
  }
}

function fragmentToProjections<ProjectionType>(info: any, proj: any, selection: any, fragmentRef: string, type: GraphQLType, schema: GraphQLSchema) {
  const fragmentKey = fragmentRef[0].toLowerCase() + fragmentRef.slice(1)
  if (proj[fragmentKey] === true) {
    return proj
  } else {
    const fragmentType = getNamedType(schema.getType(fragmentRef)!)
    if (fragmentType === type) {
      const p = infoToProjection<ProjectionType>(info, proj[fragmentKey], selection, fragmentType, schema)
      return {
        ...proj,
        ...(p === true ? {} : p),
      }
    } else {
      const fragmentProjections: any = infoToProjection(info, proj[fragmentKey], selection, fragmentType, schema)
      if (type instanceof GraphQLUnionType) {
        const res = {
          ...proj,
          [fragmentKey]: fragmentProjections,
        }
        return res
      } else if (type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType) {
        const res = {
          ...proj,
          ...Object.keys(fragmentProjections)
            .filter((field) => type.getFields()[field])
            .reduce((obj: any, key) => {
              obj[key] = fragmentProjections[key]
              return obj
            }, {}),
        }

        const subclassFragmentProjections = Object.keys(fragmentProjections)
          .filter((field) => !type.getFields()[field])
          .reduce((obj: any, key) => {
            obj[key] = fragmentProjections[key]
            return obj
          }, {})
        if (Object.keys(subclassFragmentProjections).length > 0) {
          res[fragmentKey] = subclassFragmentProjections
        }
        return res
      }
    }
  }
}

export function getProjection(projections: GenericProjection, path: string): GenericProjection {
  if (typeof projections === 'boolean') {
    return projections
  } else {
    const pathSplitted = path.split('.')
    if (path === '') {
      return projections
    } else if (pathSplitted.length === 1) {
      const subProjection = projections[pathSplitted[0]]
      if (subProjection) {
        return subProjection
      } else {
        return false
      }
    } else {
      const subProjection = projections[pathSplitted[0]]
      if (subProjection === true) {
        return true
      } else if (typeof subProjection === 'object') {
        return getProjection(subProjection, pathSplitted.slice(1).join('.'))
      } else {
        return false
      }
    }
  }
}

export function isProjectionIntersected(p1: GenericProjection, p2: GenericProjection, ignoredKeys: string[] = [], dotNotation: boolean = false): boolean {
  if (p1 === false || p2 === false) {
    return false
  }
  if (p1 === true || p2 === true) {
    return true
  }

  const p1k = Object.keys(p1).filter((k) => !ignoredKeys.includes(k))
  const p2k = Object.keys(p2).filter((k) => !ignoredKeys.includes(k))
  const keySet = new Set([...p1k, ...p2k])
  for (const key of Array.from(keySet.values())) {
    if (p1[key] !== undefined && p2[key] !== undefined && isProjectionIntersected(p1[key], p2[key], dotNotation ? subKeysOf(ignoredKeys, key) : ignoredKeys)) {
      return true
    }
  }
  return false
}

export function isProjectionContained(container: GenericProjection, contained: GenericProjection, ignoredKeys: string[] = [], dotNotation: boolean = false): [boolean, GenericProjection] {
  if (container === contained) {
    return [true, false]
  }
  if (container === true) {
    return [true, false]
  }
  if (container === false) {
    return [false, contained]
  }
  if (contained === true) {
    return [false, contained]
  }
  if (contained === false) {
    return [true, false]
  }

  const notContained: GenericProjection = {}
  for (const [key, subContained] of Object.entries(contained)) {
    if (ignoredKeys.includes(key)) {
      continue
    }
    const subContainer = container[key]
    if (subContainer === undefined) {
      notContained[key] = subContained
    } else {
      const [subResult, subProjection] = isProjectionContained(subContainer, subContained, dotNotation ? subKeysOf(ignoredKeys, key) : ignoredKeys)
      if (!subResult) {
        notContained[key] = subProjection
      }
    }
  }
  if (Object.keys(notContained).length > 0) {
    return [false, notContained]
  }

  return [true, false]
}

export function isChangesContainedInProjection(containerP: GenericProjection, changes: object): boolean {
  if (typeof containerP === 'boolean') {
    return containerP
  } else {
    for (const [key, value] of Object.entries(changes)) {
      if (!containerP[key] || (typeof value === 'object' && !isChangesContainedInProjection(containerP[key], value))) {
        return false
      }
    }
    return true
  }
}

function subKeysOf(keys: string[], key: string): string[] {
  return keys
    .filter((k) => head(k.split('.')) === key)
    .map((k) => tail(k.split('.')).join('.'))
    .filter((k) => k.length !== 0)
}

function head(array: string[]): string | undefined {
  return array.length > 0 ? array[0] : undefined;
}

function tail(array: string[]): string[] {
  if (array.length > 0) {
    const [_, ...t] = array;
    return t;
  } else {
    return [];
  }
}
