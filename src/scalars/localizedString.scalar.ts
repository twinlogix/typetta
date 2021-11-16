import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';
import ISO6391 from "iso-639-1";

const validate = (value: any) => {
    if (typeof value !== 'object') {
        throw new TypeError(`Value is not an object: ${value}`);
    }

    Object.keys(value).forEach(key => {
        if (!ISO6391.validate(key)) {
            throw new GraphQLError(`Object field name is not a valid language code: ${key}`);
        }
        if (typeof value[key] !== 'string'){
            throw new GraphQLError(`Object field value is not of String type: ${key}`);
        }
    });

    return value;
};

export const LocalizedStringScalar = /*#__PURE__*/ new GraphQLScalarType({
    name: `LocalizedString`,
    description: `A localized String with a translation for each supported locale`,

    serialize(value) {
        return validate(value);
    },

    parseValue(value) {
        return validate(value);
    },

    parseLiteral(ast) {
        if (ast.kind !== Kind.OBJECT) {
            throw new GraphQLError(`Can only validate objects but got: ${ast.kind}`);
        }
        const value : {[key:string]: string} = {};
        ast.fields.forEach(ofn => {
            if (!ISO6391.validate(ofn.name.value)) {
                throw new GraphQLError(`Object field name is not a valid language code: ${ofn.name.value}`);
            }
            if (ofn.value.kind !== Kind.STRING){
                throw new GraphQLError(`Object field value is not of String type: ${ofn.name.value}`);
            }
            value[ofn.name.value] = ofn.value.value;
        });

        return value;
    },

});
