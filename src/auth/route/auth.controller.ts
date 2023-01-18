import {Body, Controller, Post, Request, UseGuards} from "@nestjs/common";
import {LocalAuthGuard} from "../guards/local-auth.guard";
import {AuthService} from "./auth.service";
import {Public} from "../public.decorator";
import {LocalMasterPasswordAuthGuard} from "../guards/local-master-password-auth.guard";
import {MailerService} from "@nestjs-modules/mailer";
import {InviteUserDto} from "../../dto/user/invite-user.dto";
import {Permission} from "../../utils/permissions/permission.enum";
import {Permissions} from "../../utils/permissions/permission.decorator";
import {UsersService} from "../../users/users.service";
import {v1, v4} from "uuid";

@Controller('auth')
export class AuthController {
  constructor(
      private authService: AuthService,
      private usersService: UsersService,
      private mailerService: MailerService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  async logout() {
    return this.authService.logout();
  }

  @Public()
  @UseGuards(LocalMasterPasswordAuthGuard)
  @Post('superuser')
  async createSuperUser() {
    return this.authService.createSuperUser();
  }

  @Post('invite')
  @Permissions(Permission.INVITE_REPS)
  async inviteUser(@Body() inviteUserDto: InviteUserDto) {
    const generatedPassword = v1();
    const user = await this.usersService.create({...inviteUserDto, password: generatedPassword })
    await this.mailerService.sendMail({
      to: inviteUserDto.email,
      subject: 'Welcome to The Car Mart.',
      html: `<div>
    <h1>Welcome to the Car Mart, ${inviteUserDto.first_name}.</h1>
    <h3>Here's your login details.</h3><br/>
    <p>Username: ${inviteUserDto.username}</p>
    <p>Password: ${generatedPassword}</p>
</div>`
    });
    return user;
  }
}