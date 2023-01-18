import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import {Injectable, Logger} from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("API_SECRET_KEY"),
    });
  }

  async validate(payload: any) {
    return {
      username: payload.username,
      email: payload.email,
      id: payload.id,
      first_name: payload.first_name,
      last_name: payload.last_name,
      permissions: payload.permissions,
      roles: payload.roles,
      allowed_locations: payload.allowed_locations,
      date_of_creation: payload.date_of_creation,
    }
  }
}