import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PRODUCT_MODEL } from "../../../libs/shared/src/constants";
import { Product, ProductSchema } from "../../../libs/shared/src/schemas";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCT_MODEL,
      useValue: Product.name,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
