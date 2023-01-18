import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/route/auth.module';
import { MongooseModule } from "@nestjs/mongoose";
import { APP_GUARD } from "@nestjs/core";
import { PermissionGuard } from "./utils/permissions/permission.guard";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { AuthController } from "./auth/route/auth.controller";
import {ConfigModule} from "@nestjs/config";
import {AuthService} from "./auth/route/auth.service";
import {UsersService} from "./users/users.service";
import {JwtService} from "@nestjs/jwt";
import {UsersModule} from "./users/users.module";
import {MailerModule} from "@nestjs-modules/mailer";

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true
      }),
      MailerModule.forRoot({
          transport: {
              service: 'gmail',
              ignoreTLS: true,
              secure: false,
              auth: {
                  user: process.env.MAILER_USERNAME,
                  pass: process.env.MAILER_PASSWORD
              }
          },
          defaults: {
              from: '"No Reply" <no-reply@localhost>'
          }
      }),
      MongooseModule.forRoot(process.env.MONGODB_HOST),
      AuthModule,
      UsersModule
  ],
  controllers: [AppController, UsersController, AuthController],
  providers: [
      AppService,
      AuthService,
      JwtService,
      { provide: APP_GUARD, useClass: JwtAuthGuard },
      { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {}
