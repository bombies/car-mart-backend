export class CreateSaleDto {
  location_id: string;
  store_id: string;
  item_id: string;
  item_name: string;
  quantity_sold: number;
  sale: number;
  date_of_sale: number;
  sold_by: string;
}