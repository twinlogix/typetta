import {Error as MongooseError, SchemaType } from "mongoose";
import ISO6391 from "iso-639-1";
import { LocalizedString } from '@twinlogix/tl-commons';

export class LocalizedStringSchema extends SchemaType {

    constructor(key: any, options: any) {
        super(key, options, 'LocalizedStringSchema');
    }

    validateLocalizedString(localizedString: LocalizedString) {
        Object.keys(localizedString).forEach(key => {
            if (!ISO6391.validate(key)) {
                throw new MongooseError(`Object field name is not a valid language code: ${key}`);
            }
            if (typeof localizedString[key] !== 'string'){
                throw new MongooseError(`Object field value is not of String type: ${key}`);
            }
        });
    }

    cast(value: any) {
        this.validateLocalizedString(value);
        return value;
    }

}
