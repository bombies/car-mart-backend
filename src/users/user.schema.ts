import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = HydratedDocument<User>;

export type AllowedLocation = {
  location_id: string,
  allowed_stores: string[]
}

@Schema()
export class User {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  date_of_creation: number;

  @Prop([String])
  roles: string[];

  @Prop({ default: 0 })
  permissions: number;

  @Prop({ default: [] })
  allowed_locations: AllowedLocation[]
}

export const UserSchema = SchemaFactory.createForClass(User);