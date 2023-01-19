import {AllowedLocation} from "../../users/user.schema";

export class UpdateUserDto {
    username?: string;
    password?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    permissions?: number;
    roles?: string[];
    allowed_locations?: AllowedLocation[];
}