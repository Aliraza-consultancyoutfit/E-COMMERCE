import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ timestamps: true })
export class Wishlist {
  @Prop({ type: Types.ObjectId, ref: "User", required: true, unique: true, index: true })
  user: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Product" }], default: [] })
  products: Types.ObjectId[];
}

export type WishlistDocument = HydratedDocument<Wishlist>;
export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
