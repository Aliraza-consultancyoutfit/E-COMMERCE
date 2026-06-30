import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

/** Single-document store configuration. */
@Schema({ timestamps: true })
export class Settings {
  @Prop({ default: "EliteCart", trim: true })
  storeName: string;

  @Prop({ default: "support@elitecart.com", trim: true, lowercase: true })
  supportEmail: string;

  @Prop({ default: "USD" })
  currency: string;

  @Prop({ default: "America/New_York" })
  timezone: string;

  @Prop({ default: true })
  showOutOfStock: boolean;

  @Prop({ default: true })
  enableReviews: boolean;

  @Prop({ default: false })
  requireAccountToCheckout: boolean;
}

export type SettingsDocument = HydratedDocument<Settings>;
export const SettingsSchema = SchemaFactory.createForClass(Settings);
