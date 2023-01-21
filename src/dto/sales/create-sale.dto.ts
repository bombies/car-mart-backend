import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSaleDto {
  @IsNotEmpty()
  @IsString()
  location_id: string;

  @IsNotEmpty()
  @IsString()
  store_id: string;

  @IsNotEmpty()
  @IsString()
  item_id: string;

  @IsNotEmpty()
  @IsString()
  item_name: string;

  @IsNotEmpty()
  @IsNumber()
  quantity_sold: number;

  @IsNotEmpty()
  @IsNumber()
  sale: number;

  @IsNotEmpty()
  @IsNumber()
  date_of_sale: number;

  @IsNotEmpty()
  @IsString()
  sold_by: string;
}