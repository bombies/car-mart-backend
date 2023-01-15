import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(user_name: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(user_name);
    if (!user)
      return null;

    const match = await compare(password, user.password);
    if (match) {
      const { password, ...res } = user;
      return res;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      permissions: user.permissions,
      roles: user.roles,
      allowed_locations: user.allowed_locations,
      date_of_creation: user.date_of_creation,
    }

    return { access_token: this.jwtService.sign(payload) }
  }

  async logout() {
    return { access_token: this.jwtService.sign('logged out') }
  }
}
