import {AllowedLocation} from "../../users/user.schema";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    first_name?: string;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsNumber()
    permissions?: number;

    @IsOptional()
    @IsString({
        each: true
    })
    roles?: string[];

    @IsOptional()
    allowed_locations?: AllowedLocation[];
}