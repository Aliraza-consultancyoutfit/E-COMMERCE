import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Schema({ timestamps: true })
export class User {
  @Prop({ trim: true, default: "" })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  /** Profile picture as a base64 data URL (small, resized client-side). */
  @Prop({ default: "" })
  avatar: string;

  @Prop({ default: true })
  notifyOrders: boolean;

  @Prop({ default: true })
  notifyPromotions: boolean;

  @Prop({ default: false })
  notifyRecommendations: boolean;

  // NOTE: stored UI flag, not enforced (no real TOTP)
  @Prop({ default: false })
  twoFactorEnabled: boolean;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
