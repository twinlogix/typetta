export type LogicalOperators<FilterType> = {
  $and?: LogicalOperators<FilterType>[] | FilterType[]
  $not?: LogicalOperators<FilterType> | FilterType
  $nor?: LogicalOperators<FilterType>[] | FilterType[]
  $or?: LogicalOperators<FilterType>[] | FilterType[]
}

export declare type EqualityOperators<FieldType> = {
  $eq?: FieldType
  $in?: FieldType[]
  $ne?: FieldType
  $nin?: FieldType[]
}

export declare type QuantityOperators<FieldType> = {
  $gt?: FieldType
  $gte?: FieldType
  $lt?: FieldType
  $lte?: FieldType
}

export type ElementOperators = {
  $exists?: boolean
}

export type StringOperators = {
  $text?: {
    $search: string
    $language?: string
    $caseSensitive?: boolean
    $diacriticSensitive?: boolean
  }
}

export type GeospathialOperators = {
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
