import _ from 'lodash'

export type LogicalOperators<FilterType> = {
  $and?: LogicalOperators<FilterType>[] | FilterType[]
  $not?: LogicalOperators<FilterType> | FilterType
  $nor?: LogicalOperators<FilterType>[] | FilterType[]
  $or?: LogicalOperators<FilterType>[] | FilterType[]
}

export type ComparisonOperators<FieldType> = {
  $eq?: FieldType
  $gt?: FieldType
  $gte?: FieldType
  $in?: FieldType[]
  $lt?: FieldType
  $lte?: FieldType
  $ne?: FieldType
  $nin?: FieldType[]
}

export type ElementOperators<FieldType> = {
  $exists?: boolean
  // $type
}

export type EvaluationOperators<FieldType> = {
  // $expr?
  // $jsonSchema
  // $mod
  // $regex
  $text?: {
    $search: string
    $language?: string
    $caseSensitive?: boolean
    $diacriticSensitive?: boolean
  }
  // $where
}

export type GeospathialOperators<FieldType> = {
  // $geoIntersect
  // $geoWithin
  $near?: {
    $geometry: {
      type: 'Point'
      coordinates: number[]
    }
    $maxDistance?: number
    $minDistance: number
  }
  $nearSphere?: {
    $geometry: {
      type: 'Point'
      coordinates: number[]
    }
    $maxDistance?: number
    $minDistance: number
  }
}

export type ArrayOperators<FieldType> = {
  $all?: FieldType[]
  // $elemMatch
  $size: number
}