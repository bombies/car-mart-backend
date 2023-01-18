import {Injectable, Logger, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {AuthService} from "../route/auth.service";

@Injectable()
export class LocalMasterPasswordAuthStrategy extends PassportStrategy(Strategy, 'local-master-password-auth') {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(username: string, password: string) {
        const validated = this.authService.validateMasterPassword(password);
        if (!validated)
            throw new UnauthorizedException('Invalid master password.')
        return validated;
    }
}