import { defaultFieldResolver } from "graphql"
import { SchemaDirectiveVisitor } from "graphql-tools"
import { ForbiddenError } from "apollo-server-errors"
import gql from "graphql-tag"

export const privateDirectiveTypeDefs = gql`
    directive @private on OBJECT | FIELD_DEFINITION
`;

export class PrivateDirective extends SchemaDirectiveVisitor {

    public static getTypeDefs() : any {
        return privateDirectiveTypeDefs;
    };

    visitObject(type: any) {
        this.ensureFieldsWrapped(type);
        type._private = true;
    }

    // Visitor methods for nested types like fields and arguments
    // also receive a details object that provides information about
    // the parent and grandparent types.
    visitFieldDefinition(field: any, details: any) {
        this.ensureFieldsWrapped(details.objectType);
        field._private = true;
    }

    ensureFieldsWrapped(objectType: any) {
        // Mark the GraphQLObjectType object to avoid re-wrapping:
        if (objectType._authFieldsWrapped) return;
        objectType._authFieldsWrapped = true;

        const fields = objectType.getFields();

        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            const {resolve = defaultFieldResolver} = field;
            field.resolve = async function (...args: any) {
                if(field._private || objectType._private) {
                    throw new ForbiddenError("Access to a private element is forbidden.");
                } else {
                    return resolve.apply(this, args);
                }
            };
        });
    }
}
