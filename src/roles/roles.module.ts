import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Role, RoleSchema} from "./roles.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
    providers: [],
    controllers: [],
    exports: []
})
export class RolesModule {}
