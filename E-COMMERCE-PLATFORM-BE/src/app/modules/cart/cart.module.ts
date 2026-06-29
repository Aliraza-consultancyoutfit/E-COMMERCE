import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CART_MODEL } from "../../../libs/shared/src/constants";
import {
  Cart,
  CartSchema,
  Product,
  ProductSchema,
} from "../../../libs/shared/src/schemas";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: CART_MODEL,
      useValue: Cart.name,
    },
  ],
  exports: [CartService],
})
export class CartModule {}
