import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Sale, SaleDocument } from "./sales.schema";
import { Model } from "mongoose";
import { CreateSaleDto } from "../dto/sales/create-sale.dto";
import { v4 } from "uuid";

@Injectable()
export class SalesService {
  constructor(@InjectModel(Sale.name) private readonly salesModel: Model<SaleDocument>) {}

  async findAll() {
    return this.salesModel.find().exec();
  }

  async findOne(sale_id: string) {
    return this.salesModel.findOne({ id: sale_id }).exec();
  }

  async findByLocation(loc_id: string) {
    return this.salesModel.find({ location_id: loc_id }).exec();
  }

  async findByStore(store_id: string) {
    return this.salesModel.find({ store_id: store_id }).exec();
  }

  async findByItem(item_id: string) {
    return this.salesModel.find({ item_id: item_id }).exec();
  }

  async findBySeller(user_id: string) {
    return this.salesModel.find({ sold_by: user_id }).exec();
  }

  async create(createSaleDto: CreateSaleDto) {
    return new this.salesModel({
      id: v4(),
      ...createSaleDto
    });
  }

  async deleteOne(id: string) {
    return this.salesModel.deleteOne({ id: id }).exec();
  }

}
