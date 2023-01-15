import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../constants";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return {
      user_name: payload.user_name,
      user_email: payload.user_email,
      id: payload.user_id,
      first_name: payload.first_name,
      last_name: payload.last_name,
      permissions: payload.permissions,
      roles: payload.roles,
      allowed_locations: payload.allowed_locations,
      date_of_creation: payload.date_of_creation,
    }
  }
}