import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';
import ISO6391 from "iso-639-1";

const validate = (value: any) => {

    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }

    if (!ISO6391.validate(value)) {
        throw new TypeError(`Value is not a valid language code: ${value}`);
    }

    return value;
};

export const LanguageScalar = /*#__PURE__*/ new GraphQLScalarType({
    name: `Language`,

    description: `A field whose value is a Language: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes.`,

    serialize(value) {
        return validate(value);
    },

    parseValue(value) {
        return validate(value);
    },

    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(
                `Can only validate strings as a language but got a: ${ast.kind}`,
            );
        }

        return validate(ast.value);
    },
});
