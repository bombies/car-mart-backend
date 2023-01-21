import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SaleDocument = HydratedDocument<Sale>;

@Schema()
export class Sale {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  location_id: string;

  @Prop({ required: true })
  store_id: string;

  @Prop({ required: true })
  item_id: string;

  @Prop()
  item_name: string;

  @Prop()
  quantity_sold: number;

  @Prop()
  sale: number;

  @Prop()
  date_of_sale: number;

  @Prop()
  sold_by: string;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);