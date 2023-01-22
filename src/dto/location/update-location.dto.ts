import {LocationStore} from "../../location/location.schema";
import { IsOptional, IsString } from "class-validator";

export class UpdateLocationDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    stores?: LocationStore[]
}