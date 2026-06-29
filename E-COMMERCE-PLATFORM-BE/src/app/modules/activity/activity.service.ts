import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  Order,
  OrderDocument,
  Product,
  ProductDocument,
  User,
  UserDocument,
  UserRole,
} from "../../../libs/shared/src/schemas";

const PER_SOURCE = 8;
const TOTAL = 20;

type ActivityType = "order" | "product" | "customer" | "admin";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  actor: string | null;
  action: string;
  target: string;
  createdAt: Date;
}

interface OrderEvt {
  _id: Types.ObjectId;
  createdAt: Date;
  user?: { name?: string; email?: string } | null;
}
interface ProductEvt {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
}
interface UserEvt {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  createdAt: Date;
}

const displayName = (name?: string, email?: string) =>
  name || email?.split("@")[0] || "Someone";

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /** Derive a recent-activity feed from orders, products and users. */
  async getRecent(): Promise<ActivityEvent[]> {
    const [orders, products, customers, admins] = await Promise.all([
      this.orderModel
        .find()
        .sort({ createdAt: -1 })
        .limit(PER_SOURCE)
        .populate("user", "name email")
        .lean<OrderEvt[]>(),
      this.productModel
        .find()
        .sort({ createdAt: -1 })
        .limit(PER_SOURCE)
        .select("name createdAt")
        .lean<ProductEvt[]>(),
      this.userModel
        .find({ role: UserRole.USER })
        .sort({ createdAt: -1 })
        .limit(PER_SOURCE)
        .select("name email createdAt")
        .lean<UserEvt[]>(),
      this.userModel
        .find({ role: UserRole.ADMIN })
        .sort({ createdAt: -1 })
        .limit(PER_SOURCE)
        .select("name email createdAt")
        .lean<UserEvt[]>(),
    ]);

    const events: ActivityEvent[] = [
      ...orders.map((o) => ({
        id: `order-${o._id.toString()}`,
        type: "order" as const,
        actor: displayName(o.user?.name, o.user?.email),
        action: "placed order",
        target: `#${o._id.toString().slice(-6).toUpperCase()}`,
        createdAt: o.createdAt,
      })),
      ...products.map((p) => ({
        id: `product-${p._id.toString()}`,
        type: "product" as const,
        actor: null,
        action: "New product added:",
        target: p.name,
        createdAt: p.createdAt,
      })),
      ...customers.map((c) => ({
        id: `customer-${c._id.toString()}`,
        type: "customer" as const,
        actor: displayName(c.name, c.email),
        action: "signed up as a customer",
        target: "",
        createdAt: c.createdAt,
      })),
      ...admins.map((a) => ({
        id: `admin-${a._id.toString()}`,
        type: "admin" as const,
        actor: displayName(a.name, a.email),
        action: "joined as an admin",
        target: "",
        createdAt: a.createdAt,
      })),
    ];

    return events
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, TOTAL);
  }
}
