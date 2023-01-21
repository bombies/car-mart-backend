import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Sale, SaleSchema } from "./sales.schema";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    MongooseModule.forFeature([ { name: Sale.name, schema: SaleSchema }]),
    UsersModule
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService]
})
export class SalesModule {}
