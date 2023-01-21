import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

export type LocationDocument = HydratedDocument<Location>;

export type LocationStore = {
    id: string,
    name: string,
    inventory: StoreItem[],
}

export type StoreItem = {
    id: string,
    name: string,
    quantity: number,
    cost: number,
    last_updated: number,
}

@Schema()
export class Location {
    @Prop({ required: true })
    id: string;
    @Prop({ required: true })
    name: string;
    @Prop({ default: [] })
    stores: LocationStore[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);