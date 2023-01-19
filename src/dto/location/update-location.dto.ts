import {LocationStore} from "../../location/location.schema";

export class UpdateLocationDto {
    name?: string;
    stores?: LocationStore[]
}