import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model, Types } from "mongoose";
import Stripe from "stripe";
import {
  AdminOrderQueryDto,
  CheckoutDto,
  ShippingAddressDto,
} from "../../../libs/shared/src/dto";
import {
  NotificationType,
  Order,
  OrderDocument,
  OrderStatus,
  Product,
  ProductDocument,
} from "../../../libs/shared/src/schemas";
import { CartService } from "../cart/cart.service";
import { NotificationsService } from "../notifications/notifications.service";

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
  private readonly stripe: Stripe;
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly cartService: CartService,
    private readonly config: ConfigService,
    private readonly notificationsService: NotificationsService,
  ) {
    this.stripe = new Stripe(this.config.getOrThrow<string>("STRIPE_SECRET_KEY"));
  }

  /** Create a Stripe PaymentIntent for the server-computed cart total. */
  async createPaymentIntent(userId: string) {
    const cart = await this.cartService.getMyCart(userId);
    if (cart.items.length === 0) {
      throw new BadRequestException("Your cart is empty");
    }
    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(cart.summary.total * 100),
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { userId },
    });
    return { clientSecret: intent.client_secret, amount: cart.summary.total };
  }

  async checkout(userId: string, dto: CheckoutDto) {
    const cart = await this.cartService.getMyCart(userId);
    if (cart.items.length === 0) {
      throw new BadRequestException("Your cart is empty");
    }

    // Verify the Stripe payment succeeded for this user + this exact amount
    // before touching stock. A failed/declined intent is a no-op.
    const intent = await this.stripe.paymentIntents.retrieve(dto.paymentIntentId, {
      expand: ["latest_charge"],
    });
    if (intent.metadata?.userId !== userId) {
      throw new BadRequestException("Payment does not belong to this account");
    }
    if (intent.status !== "succeeded") {
      throw new HttpException(
        "Payment was not completed. No charge was made.",
        HttpStatus.PAYMENT_REQUIRED,
      );
    }
    if (
      intent.amount_received !== Math.round(cart.summary.total * 100) ||
      intent.currency !== "usd"
    ) {
      throw new BadRequestException("Payment amount does not match the cart");
    }
    const alreadyUsed = await this.orderModel.exists({
      paymentIntentId: dto.paymentIntentId,
    });
    if (alreadyUsed) {
      throw new BadRequestException("This payment was already used for an order");
    }
    const last4 =
      (intent.latest_charge as Stripe.Charge | null)?.payment_method_details
        ?.card?.last4 ?? "••••";

    return this.finalizeOrder(
      userId,
      cart,
      dto.shippingAddress,
      dto.paymentIntentId,
      last4,
    );
  }

  /** Stripe-hosted Checkout: create a session and return its redirect URL. */
  async createCheckoutSession(userId: string, shippingAddress: ShippingAddressDto) {
    const cart = await this.cartService.getMyCart(userId);
    if (cart.items.length === 0) {
      throw new BadRequestException("Your cart is empty");
    }
    const frontendUrl =
      this.config.get<string>("FRONTEND_URL") ?? "http://localhost:3000";
    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(cart.summary.total * 100),
            product_data: {
              name: `EliteCart order · ${cart.items.length} item(s)`,
            },
          },
        },
      ],
      success_url: `${frontendUrl}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout?canceled=1`,
      metadata: { userId, shippingAddress: JSON.stringify(shippingAddress) },
    });
    return { url: session.url };
  }

  /** Complete a Stripe-hosted Checkout session → create the order (idempotent). */
  async completeCheckoutSession(userId: string, sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent.latest_charge"],
    });
    if (session.metadata?.userId !== userId) {
      throw new BadRequestException("Payment does not belong to this account");
    }
    const intent = session.payment_intent as Stripe.PaymentIntent | null;
    const paymentIntentId = intent?.id ?? "";

    // Idempotent: the success page may fire twice — return the existing order.
    const existing = await this.orderModel
      .findOne({ paymentIntentId })
      .lean();
    if (existing) {
      return existing;
    }
    if (session.payment_status !== "paid") {
      throw new HttpException(
        "Payment was not completed. No charge was made.",
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    const cart = await this.cartService.getMyCart(userId);
    if (cart.items.length === 0) {
      throw new BadRequestException("Your cart is empty");
    }
    const shippingAddress = JSON.parse(
      session.metadata?.shippingAddress ?? "{}",
    ) as ShippingAddressDto;
    const last4 =
      (intent?.latest_charge as Stripe.Charge | null)?.payment_method_details
        ?.card?.last4 ?? "••••";

    return this.finalizeOrder(
      userId,
      cart,
      shippingAddress,
      paymentIntentId,
      last4,
    );
  }

  /** Atomic, guarded stock decrement (rollback on shortfall) + order creation. */
  private async finalizeOrder(
    userId: string,
    cart: Awaited<ReturnType<CartService["getMyCart"]>>,
    shippingAddress: ShippingAddressDto,
    paymentIntentId: string,
    last4: string,
  ) {
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
      shippingAddress,
      subtotal: cart.summary.subtotal,
      discount: cart.summary.discount,
      shipping: cart.summary.shipping,
      tax: cart.summary.tax,
      total: cart.summary.total,
      coupon: cart.coupon,
      paymentLast4: last4,
      paymentIntentId,
      status: OrderStatus.Pending,
    });

    await this.cartService.clearCart(userId);

    await this.notifyOrderPlaced(userId, order.id, order.total);

    return order.toObject();
  }

  /** Notify the buyer their order was placed. Never breaks checkout. */
  private async notifyOrderPlaced(
    userId: string,
    orderId: string,
    total: number,
  ) {
    try {
      await this.notificationsService.createForUser(
        userId,
        NotificationType.Order,
        "Order placed",
        `Your order #${orderId} for $${total.toFixed(2)} has been placed.`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create order-placed notification for ${orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
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

  async getStats() {
    const [facet] = await this.orderModel.aggregate([
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                revenue: { $sum: "$total" },
                orders: { $sum: 1 },
              },
            },
          ],
          statusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          monthly: [
            {
              $group: {
                _id: {
                  y: { $year: "$createdAt" },
                  m: { $month: "$createdAt" },
                },
                revenue: { $sum: "$total" },
              },
            },
            { $sort: { "_id.y": 1, "_id.m": 1 } },
            { $limit: 12 },
          ],
          categoryMix: [
            { $unwind: "$items" },
            {
              $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "product",
              },
            },
            { $unwind: "$product" },
            {
              $group: {
                _id: "$product.category",
                revenue: { $sum: "$items.lineTotal" },
                units: { $sum: "$items.quantity" },
              },
            },
            { $sort: { revenue: -1 } },
          ],
          topProducts: [
            { $unwind: "$items" },
            {
              $group: {
                _id: "$items.name",
                units: { $sum: "$items.quantity" },
                revenue: { $sum: "$items.lineTotal" },
              },
            },
            { $sort: { units: -1 } },
            { $limit: 4 },
          ],
        },
      },
    ]);

    const totals = facet?.totals?.[0] ?? { revenue: 0, orders: 0 };
    const statusCounts = Object.fromEntries(
      Object.values(OrderStatus).map((s) => [s, 0]),
    ) as Record<OrderStatus, number>;
    for (const row of facet?.statusCounts ?? []) {
      statusCounts[row._id as OrderStatus] = row.count;
    }

    const MONTH_LABELS = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthly = (facet?.monthly ?? []).map(
      (row: { _id: { m: number }; revenue: number }) => ({
        label: MONTH_LABELS[row._id.m - 1],
        revenue: row.revenue,
      }),
    );

    const mixTotal =
      (facet?.categoryMix ?? []).reduce(
        (sum: number, row: { revenue: number }) => sum + row.revenue,
        0,
      ) || 1;
    const categoryMix = (facet?.categoryMix ?? [])
      .slice(0, 6)
      .map((row: { _id: string; revenue: number; units: number }) => ({
        category: row._id,
        revenue: row.revenue,
        units: row.units,
        pct: Math.round((row.revenue / mixTotal) * 100),
      }));

    const topProducts = (facet?.topProducts ?? []).map(
      (row: { _id: string; units: number; revenue: number }) => ({
        name: row._id,
        units: row.units,
        revenue: row.revenue,
      }),
    );

    const lowStock = await this.productModel
      .find()
      .sort({ stock: 1 })
      .limit(4)
      .select("name stock category")
      .lean()
      .exec();

    return {
      totalRevenue: totals.revenue,
      totalOrders: totals.orders,
      avgOrderValue: totals.orders ? totals.revenue / totals.orders : 0,
      pendingCount: statusCounts[OrderStatus.Pending],
      statusCounts,
      monthly,
      categoryMix,
      topProducts,
      lowStock,
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

    await this.notifyStatusChange(order.user.toString(), order.id, status);

    return order.toObject();
  }

  /** Notify the buyer their order status changed. Never breaks the update. */
  private async notifyStatusChange(
    userId: string,
    orderId: string,
    status: OrderStatus,
  ) {
    try {
      await this.notificationsService.createForUser(
        userId,
        NotificationType.Order,
        `Order #${orderId} is now ${status}`,
        `Your order #${orderId} status has been updated to ${status}.`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create status-change notification for ${orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
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
