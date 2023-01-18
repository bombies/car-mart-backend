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

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true
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
