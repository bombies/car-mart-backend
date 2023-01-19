import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Location, LocationSchema} from "./location.schema";
import {LocationController} from "./location.controller";
import {LocationService} from "./location.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }])
    ],
    controllers: [LocationController],
    providers: [LocationService],
    exports: [LocationService],
})
export class LocationModule {}