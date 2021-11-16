import { Coordinates } from '@twinlogix/tl-commons';
import {Error as MongooseError, SchemaType } from "mongoose";

export class PointSchema extends SchemaType {

    constructor(key: any, options: any) {
        super(key, options, 'PointSchema');
    }

    validateCoordinates(coordinates: Coordinates) {
        if (coordinates.longitude > 180 || coordinates.longitude < -180) {
            throw new MongooseError('Point should be within the boundaries of longitude')
        }
        if (coordinates.latitude > 90 || coordinates.latitude < -90) {
            throw new MongooseError('Point should be within the boundaries of latitude')
        }
    }

    cast(value: any) {
        if(value.type && value.type === 'Point'){
            this.validateCoordinates(value.coordinates);
            return { longitude: value.coordinates[0], latitude: value.coordinates[1] };
        } else {
            this.validateCoordinates(value);
            return {
                type: "Point",
                coordinates: [value.longitude, value.latitude]
            };
        }
    }

}
