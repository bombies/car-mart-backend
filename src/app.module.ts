import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from "@nestjs/mongoose";
import { APP_GUARD } from "@nestjs/core";
import { PermissionGuard } from "./utils/permissions/permission.guard";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { AuthController } from "./auth/auth.controller";

@Module({
  imports: [AuthModule, MongooseModule.forRoot(process.env.MONGODB_HOST)],
  controllers: [AppController, UsersController, AuthController],
  providers: [AppService, { provide: APP_GUARD, useClass: PermissionGuard }, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
