import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model, Types } from "mongoose";
import {
  AdminOrderQueryDto,
  CheckoutDto,
} from "../../../libs/shared/src/dto";
import {
  Order,
  OrderDocument,
  OrderStatus,
  Product,
  ProductDocument,
} from "../../../libs/shared/src/schemas";
import { CartService } from "../cart/cart.service";

/** Mock gateway: cards starting 4000 decline (Stripe-style test decline). */
const DECLINE_PREFIX = "4000";

/** Allowed forward status transitions; everything else is rejected. */
const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.Pending]: [OrderStatus.Processing, OrderStatus.Cancelled],
  [OrderStatus.Processing]: [OrderStatus.Shipped, OrderStatus.Cancelled],
  [OrderStatus.Shipped]: [OrderStatus.Delivered],
  [OrderStatus.Delivered]: [],
  [OrderStatus.Cancelled]: [],
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly cartService: CartService,
  ) {}

  async checkout(userId: string, dto: CheckoutDto) {
    const cart = await this.cartService.getMyCart(userId);
    if (cart.items.length === 0) {
      throw new BadRequestException("Your cart is empty");
    }

    // Mock payment — evaluated before any stock change so a decline is a no-op.
    const cardDigits = dto.payment.cardNumber.replace(/\D/g, "");
    if (cardDigits.startsWith(DECLINE_PREFIX)) {
      throw new HttpException(
        "Payment was declined. No charge was made.",
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    // Atomic, guarded stock decrement with rollback on any shortfall.
    const decremented: { id: Types.ObjectId; quantity: number }[] = [];
    for (const line of cart.items) {
      const updated = await this.productModel.findOneAndUpdate(
        { _id: line.product._id, stock: { $gte: line.quantity } },
        { $inc: { stock: -line.quantity } },
      );
      if (!updated) {
        await Promise.all(
          decremented.map((entry) =>
            this.productModel.updateOne(
              { _id: entry.id },
              { $inc: { stock: entry.quantity } },
            ),
          ),
        );
        throw new BadRequestException(
          `Insufficient stock for ${line.product.name}`,
        );
      }
      decremented.push({
        id: new Types.ObjectId(line.product._id),
        quantity: line.quantity,
      });
    }

    const order = await this.orderModel.create({
      user: new Types.ObjectId(userId),
      items: cart.items.map((line) => ({
        product: new Types.ObjectId(line.product._id),
        name: line.product.name,
        price: line.product.price,
        quantity: line.quantity,
        lineTotal: line.lineTotal,
      })),
      shippingAddress: dto.shippingAddress,
      subtotal: cart.summary.subtotal,
      discount: cart.summary.discount,
      shipping: cart.summary.shipping,
      tax: cart.summary.tax,
      total: cart.summary.total,
      coupon: cart.coupon,
      paymentLast4: cardDigits.slice(-4),
      status: OrderStatus.Pending,
    });

    await this.cartService.clearCart(userId);

    return order.toObject();
  }

  async listMyOrders(userId: string) {
    return this.orderModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async getAllOrders(query: AdminOrderQueryDto) {
    const { page, limit, status } = query;
    const filter = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email")
        .lean()
        .exec(),
      this.orderModel.countDocuments(filter).exec(),
    ]);

    return {
      records,
      meta: { total, page, limit, pages: Math.ceil(total / limit) || 1 },
    };
  }

  async getOrderForAdmin(orderId: string) {
    if (!isValidObjectId(orderId)) {
      throw new NotFoundException("Order not found");
    }
    const order = await this.orderModel
      .findById(orderId)
      .populate("user", "name email")
      .lean()
      .exec();
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    return order;
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    if (!isValidObjectId(orderId)) {
      throw new NotFoundException("Order not found");
    }
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (order.status === status) {
      return order.toObject();
    }
    if (!STATUS_TRANSITIONS[order.status].includes(status)) {
      throw new BadRequestException(
        `Cannot change status from ${order.status} to ${status}`,
      );
    }

    order.status = status;
    await order.save();
    return order.toObject();
  }

  async getMyOrder(userId: string, orderId: string) {
    if (!isValidObjectId(orderId)) {
      throw new NotFoundException("Order not found");
    }
    const order = await this.orderModel.findById(orderId).lean().exec();
    if (!order || order.user.toString() !== userId) {
      throw new NotFoundException("Order not found");
    }
    return order;
  }
}
