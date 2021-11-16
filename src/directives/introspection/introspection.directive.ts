import { SchemaDirectiveVisitor } from 'graphql-tools';
import {GraphQLField} from "graphql";
import gql from "graphql-tag";
import {Blacklist} from "../../middlewares/introspection.middleware";


export const introspectionDirectiveTypeDefs = gql`
    directive @noIntrospection on FIELD_DEFINITION
`;

export const blacklist: Blacklist = [];
export class NoIntrospectionDirective extends SchemaDirectiveVisitor {

    public static getTypeDefs() : any {
        return introspectionDirectiveTypeDefs;
    };

    public visitFieldDefinition(_field: GraphQLField<any, any>, details: any) {
        blacklist.push({
          type: details.objectType.name,
          field: _field.name
        });
    }

}
