import {ConfigModule} from "@nestjs/config";
import {MailerModule} from "@nestjs-modules/mailer";
import {MongooseModule} from "@nestjs/mongoose";
import {AuthModule} from "./auth/route/auth.module";
import {UsersModule} from "./users/users.module";
import {RolesModule} from "./roles/roles.module";
import {SalesModule} from "./sales/sales.module";
import {LocationModule} from "./location/location.module";
import {AppController} from "./app.controller";
import {UsersController} from "./users/users.controller";
import {AuthController} from "./auth/route/auth.controller";
import {RolesController} from "./roles/roles.controller";
import {SalesController} from "./sales/sales.controller";
import {LocationController} from "./location/location.controller";
import {AppService} from "./app.service";
import {AuthService} from "./auth/route/auth.service";
import {JwtService} from "@nestjs/jwt";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./auth/guards/jwt-auth.guard";
import {PermissionGuard} from "./utils/permissions/permission.guard";
import {Module} from "@nestjs/common";


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
      UsersModule,
      RolesModule,
      SalesModule,
      LocationModule
  ],
  controllers: [AppController, UsersController, AuthController, RolesController, SalesController, LocationController],
  providers: [
      AppService,
      AuthService,
      JwtService,
      { provide: APP_GUARD, useClass: JwtAuthGuard },
      { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {}
