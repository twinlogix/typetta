export type LogicalOperators<FilterType> = {
  $and?: (LogicalOperators<FilterType> & FilterType)[]
  $nor?: (LogicalOperators<FilterType> & FilterType)[]
  $or?: (LogicalOperators<FilterType> & FilterType)[]
}

export declare type EqualityOperators<FieldType> = {
  eq?: FieldType | null
  in?: FieldType[] | null
  ne?: FieldType | null
  nin?: FieldType[] | null
}

export declare type QuantityOperators<FieldType> = {
  gt?: FieldType | null
  gte?: FieldType | null
  lt?: FieldType | null
  lte?: FieldType | null
}

export type ElementOperators = {
  exists?: boolean
}

export type StringOperators = {
  contains?: string
  startsWith?: string
  endsWith?: string
}
