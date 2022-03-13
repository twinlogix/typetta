export type LogicalOperators<FilterType> = {
  $and?: (LogicalOperators<FilterType> &  FilterType)[]
  $nor?: (LogicalOperators<FilterType> &  FilterType)[]
  $or?: (LogicalOperators<FilterType> &  FilterType)[]
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

export type StringOperators =
  | {
      $contains: string
    }
  | {
      $startsWith: string
    }
  | {
      $endsWith: string
    }
