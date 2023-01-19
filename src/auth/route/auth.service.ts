import {HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {UsersService} from "../../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {compare} from 'bcrypt';
import {User} from "../../users/user.schema";
import {v1} from "uuid";
import {Permission} from "../../utils/permissions/permission.enum";

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
      // @ts-ignore
      return res._doc;
    }
    return null;
  }

  validateMasterPassword(password: string): boolean {
    return password === process.env.MASTER_PASSWORD;
  }

  async createSuperUser(): Promise<{password: string}> {
    const currentSuperUser = await this.usersService.findOneByUsername('admin');
    if (currentSuperUser)
      throw new HttpException('Superuser already exists!', HttpStatus.BAD_REQUEST)

    const password = v1();
    await this.usersService.create({
      username: 'admin',
      password: password,
      email: 'admin@carmart.com',
      first_name: 'Root',
      last_name: 'User',
      permissions: Permission.INVITE_REPS,
    });
    return {password: password};
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
    }

    return { access_token: this.jwtService.sign(payload, { secret: process.env.API_SECRET_KEY }) }
  }

  async logout() {
    return { access_token: this.jwtService.sign('logged out') }
  }
}
