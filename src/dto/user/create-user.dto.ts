import {AllowedLocation} from "../../users/user.schema";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  permissions?: number;

  @IsOptional()
  @IsString({
    each: true
  })
  roles?: string[];

  @IsOptional()
  allowed_locations?: AllowedLocation[];
}