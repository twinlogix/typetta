import { GraphQLError, GraphQLScalarType, Kind } from 'graphql'
import BigNumber from 'bignumber.js'

export const BigNumberScalar = new GraphQLScalarType({
  name: 'Decimal',

  serialize(value: BigNumber) {
    if (value instanceof BigNumber) {
      return value.toNumber()
    } else {
      throw new GraphQLError(`${value} is not a instance of BigNumber type`)
    }
  },

  parseValue(value) {
    return new BigNumber(value)
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.FLOAT && ast.kind !== Kind.INT) {
      throw new GraphQLError(`Can only validate floating point numbers but got a: ${ast.kind}`)
    }
    return new BigNumber(ast.value)
  },
})
