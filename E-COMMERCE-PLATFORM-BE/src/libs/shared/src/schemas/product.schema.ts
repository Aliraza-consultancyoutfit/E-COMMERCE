import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: "" })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  /** Optional pre-discount price; shown struck-through when present. */
  @Prop({ min: 0, default: 0 })
  oldPrice: number;

  /** Cover image (base64 or URL). Empty → storefront renders a placeholder. */
  @Prop({ default: "" })
  image: string;

  /** Gallery images (base64 or URL); the cover is also kept in `image`. */
  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true, trim: true, index: true })
  category: string;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ min: 0, max: 5, default: 0 })
  rating: number;

  @Prop({ min: 0, default: 0 })
  reviews: number;
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });
