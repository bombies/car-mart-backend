import {StoreItem} from "../../../location/location.schema";
import { IsOptional, IsString } from "class-validator";

export class UpdateStoreDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    inventory?: StoreItem[]
}