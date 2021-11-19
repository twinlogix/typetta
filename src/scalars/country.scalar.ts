import { Kind, GraphQLError, GraphQLScalarType } from 'graphql'
import ISO3166 from 'i18n-iso-countries'

const validate = (value: any) => {
  if (typeof value !== 'string') {
    throw new TypeError(`Value is not string: ${value}`)
  }

  if (!ISO3166.isValid(value)) {
    throw new TypeError(`Value is not a valid country code: ${value}`)
  }

  return value
}

export const CountryScalar = /*#__PURE__*/ new GraphQLScalarType({
  name: `Country`,

  description: `A field whose value is a Country: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2.`,

  serialize(value) {
    return validate(value)
  },

  parseValue(value) {
    return validate(value)
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Can only validate strings as a country code but got a: ${ast.kind}`)
    }

    return validate(ast.value)
  },
})
