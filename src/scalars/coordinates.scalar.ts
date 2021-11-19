import { Kind, GraphQLError, GraphQLScalarType } from 'graphql'

const validate = (value: any) => {
  if (typeof value !== 'object') {
    throw new TypeError(`Value is not an object with latitude and longitude: ${value}`)
  }

  if (value.latitude === null || value.latitude === undefined || typeof value.latitude !== 'number') {
    throw new TypeError(`Latitude field must be a non null number`)
  }

  if (value.latitude > 90 || value.latitude < -90) {
    throw new TypeError('Latitude should be between -90 and 90')
  }

  if (value.longitude === null || value.longitude === undefined || typeof value.longitude !== 'number') {
    throw new TypeError(`Latitude field must be a non null number`)
  }

  if (value.longitude > 180 || value.longitude < -180) {
    throw new TypeError('Longitude should be between -180 and 180')
  }

  return value
}

export const CoordinatesScalar = /*#__PURE__*/ new GraphQLScalarType({
  name: `Coordinates`,
  description: `A coordinates object with latitude and longitude fields`,

  serialize(value) {
    return validate(value)
  },

  parseValue(value) {
    return validate(value)
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.OBJECT) {
      throw new GraphQLError(`Can only validate objects but got: ${ast.kind}`)
    }

    const latitudeField = ast.fields.find((ofn) => ofn.name.value === 'latitude')
    const longitudeField = ast.fields.find((ofn) => ofn.name.value === 'longitude')
    if (!latitudeField || !longitudeField) {
      throw new GraphQLError(`Can only validate objects with fields latitude and longitude`)
    }

    if (latitudeField.value.kind !== Kind.FLOAT && latitudeField.value.kind !== Kind.INT) {
      throw new GraphQLError(`Can only validate objects with latitude field as Float`)
    }
    const latitude = parseFloat(latitudeField.value.value)

    if (longitudeField.value.kind !== Kind.FLOAT && longitudeField.value.kind !== Kind.INT) {
      throw new GraphQLError(`Can only validate objects with longitude field as Float`)
    }
    const longitude = parseFloat(longitudeField.value.value)

    return validate({ latitude, longitude })
  },
})
