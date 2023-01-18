export class InviteUserDto {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    permissions: number;
    roles: string[]
}