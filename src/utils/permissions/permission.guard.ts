import {CanActivate, ExecutionContext, Injectable, Logger} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Permission } from "./permission.enum";
import { PERMISSION_KEY } from "./permission.decorator";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredPermissions)
      return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredPermissions.some(permission => PermissionGuard.userHasPermission(user.permissions, permission));
  }

  public static userHasPermission(userPermissions: number, permissionRequired: Permission) {
    return ((userPermissions & permissionRequired) === permissionRequired) ||
      ((userPermissions & Permission.INVITE_REPS) === Permission.INVITE_REPS)
  }
}