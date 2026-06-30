import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ORDER_MODEL } from "../../../libs/shared/src/constants";
import {
  Order,
  OrderSchema,
  Product,
  ProductSchema,
} from "../../../libs/shared/src/schemas";
import { CartModule } from "../cart/cart.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    CartModule,
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: ORDER_MODEL,
      useValue: Order.name,
    },
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
