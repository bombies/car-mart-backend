import { Controller, Post, UseGuards, Request } from "@nestjs/common";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { Public } from "../public.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

}