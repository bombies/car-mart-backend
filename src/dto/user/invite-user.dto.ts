import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class InviteUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsNotEmpty()
    @IsNumber()
    permissions: number;

    @IsNotEmpty()
    @IsString({
        each: true
    })
    roles: string[]
}