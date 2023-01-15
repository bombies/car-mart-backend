import { Permission } from "./permission.enum";
import { SetMetadata } from "@nestjs/common";

export const PERMISSION_KEY = "permissions";
export const Permissions = (...permissions: Permission[]) => SetMetadata(PERMISSION_KEY, permissions)