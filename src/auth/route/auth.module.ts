import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from "../../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "../strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "../strategies/jwt.strategy";
import {LocalMasterPasswordAuthStrategy} from "../strategies/local-master-password-auth.strategy";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>("API_SECRET_KEY"),
          signOptions: { expiresIn: '1d' },
        }
      },
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, LocalMasterPasswordAuthStrategy],
  exports: [AuthService]
})
export class AuthModule {}
