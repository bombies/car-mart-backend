import {AuthGuard} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";

@Injectable()
export class LocalMasterPasswordAuthGuard extends AuthGuard('local-master-password-auth') {}