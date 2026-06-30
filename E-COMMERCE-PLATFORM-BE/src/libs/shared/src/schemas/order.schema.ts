import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export enum OrderStatus {
  Pending = "pending",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: "Product", required: true })
  product: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  lineTotal: number;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
export class ShippingAddress {
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop({ required: true }) street: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: true }) zip: string;
}
export const ShippingAddressSchema =
  SchemaFactory.createForClass(ShippingAddress);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: "User", required: true, index: true })
  user: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ type: ShippingAddressSchema, required: true })
  shippingAddress: ShippingAddress;

  @Prop({ required: true, min: 0 }) subtotal: number;
  @Prop({ required: true, min: 0, default: 0 }) discount: number;
  @Prop({ required: true, min: 0 }) shipping: number;
  @Prop({ required: true, min: 0 }) tax: number;
  @Prop({ required: true, min: 0 }) total: number;

  @Prop({ default: "" }) coupon: string;

  /** Last 4 digits of the card used — never the full number. */
  @Prop({ default: "" }) paymentLast4: string;

  /** Stripe PaymentIntent id — bound to the order so it can't be reused. */
  @Prop({ default: "", index: true }) paymentIntentId: string;

  @Prop({ enum: OrderStatus, default: OrderStatus.Pending, index: true })
  status: OrderStatus;
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);
