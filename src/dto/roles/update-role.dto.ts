import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    permissions?: number;
}