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
      .slice(0, 5)
      .map((row: { _id: string; revenue: number }) => ({
        category: row._id,
        revenue: row.revenue,
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
