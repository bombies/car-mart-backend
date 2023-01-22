import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersController } from "./users/users.controller";
import { AuthModule } from "./auth/route/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_GUARD } from "@nestjs/core";
import { PermissionGuard } from "./utils/permissions/permission.guard";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { AuthController } from "./auth/route/auth.controller";
import { ConfigModule } from "@nestjs/config";
import { AuthService } from "./auth/route/auth.service";
import { JwtService } from "@nestjs/jwt";
import { UsersModule } from "./users/users.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { RolesModule } from "./roles/roles.module";
import { RolesController } from "./roles/roles.controller";
import { SalesModule } from "./sales/sales.module";
import { SalesController } from "./sales/sales.controller";
import { LocationController } from "./location/location.controller";
import { LocationModule } from "./location/location.module";
import { RedisModule } from "@liaoliaots/nestjs-redis";

@Module({
    imports: [
        RedisModule.forRoot({
            config: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT),
                password: process.env.REDIS_PASSWORD,
            },
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MailerModule.forRoot({
            transport: {
                service: "gmail",
                ignoreTLS: true,
                secure: false,
                auth: {
                    user: process.env.MAILER_USERNAME,
                    pass: process.env.MAILER_PASSWORD,
                },
            },
            defaults: {
                from: '"No Reply" <no-reply@localhost>',
            },
        }),
        MongooseModule.forRoot(process.env.MONGODB_HOST),
        AuthModule,
        UsersModule,
        RolesModule,
        SalesModule,
        LocationModule,
    ],
    controllers: [
        AppController,
        UsersController,
        AuthController,
        RolesController,
        SalesController,
        LocationController,
    ],
    providers: [
        AppService,
        AuthService,
        JwtService,
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: PermissionGuard },
    ],
})
export class AppModule {}
