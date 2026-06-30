import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WISHLIST_MODEL } from "../../../libs/shared/src/constants";
import {
  Product,
  ProductSchema,
  Wishlist,
  WishlistSchema,
} from "../../../libs/shared/src/schemas";
import { WishlistController } from "./wishlist.controller";
import { WishlistService } from "./wishlist.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wishlist.name, schema: WishlistSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [WishlistController],
  providers: [
    WishlistService,
    {
      provide: WISHLIST_MODEL,
      useValue: Wishlist.name,
    },
  ],
  exports: [WishlistService],
})
export class WishlistModule {}
