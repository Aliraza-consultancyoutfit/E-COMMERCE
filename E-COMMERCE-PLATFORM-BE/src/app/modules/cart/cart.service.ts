import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  Cart,
  CartDocument,
  Product,
  ProductDocument,
} from "../../../libs/shared/src/schemas";

const FREE_SHIPPING_THRESHOLD = 100;
const FLAT_SHIPPING = 8;
const TAX_RATE = 0.08;
const COUPONS: Record<string, number> = { WELCOME10: 0.1 };

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async getMyCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    return this.buildResponse(cart);
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await this.productModel.findById(productId).lean().exec();
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    if (product.stock < 1) {
      throw new BadRequestException("Product is out of stock");
    }

    const cart = await this.getOrCreateCart(userId);
    const existing = cart.items.find(
      (item) => item.product.toString() === productId,
    );
    const requested = (existing?.quantity ?? 0) + quantity;
    const clamped = Math.min(requested, product.stock);

    if (existing) {
      existing.quantity = clamped;
    } else {
      cart.items.push({
        product: new Types.ObjectId(productId),
        quantity: clamped,
      });
    }

    await cart.save();
    return this.buildResponse(cart);
  }

  async updateItem(userId: string, productId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find(
      (entry) => entry.product.toString() === productId,
    );
    if (!item) {
      throw new NotFoundException("Item not in cart");
    }

    const product = await this.productModel.findById(productId).lean().exec();
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    item.quantity = Math.min(Math.max(1, quantity), Math.max(1, product.stock));
    await cart.save();
    return this.buildResponse(cart);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );
    await cart.save();
    return this.buildResponse(cart);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = [];
    cart.coupon = "";
    await cart.save();
    return this.buildResponse(cart);
  }

  async applyCoupon(userId: string, code: string) {
    const normalized = code.trim().toUpperCase();
    if (!(normalized in COUPONS)) {
      throw new BadRequestException("Invalid coupon code");
    }
    const cart = await this.getOrCreateCart(userId);
    cart.coupon = normalized;
    await cart.save();
    return this.buildResponse(cart);
  }

  private async getOrCreateCart(userId: string): Promise<CartDocument> {
    return this.cartModel
      .findOneAndUpdate(
        { user: new Types.ObjectId(userId) },
        { $setOnInsert: { user: new Types.ObjectId(userId) } },
        { upsert: true, new: true },
      )
      .exec();
  }

  private async buildResponse(cart: CartDocument) {
    const productIds = cart.items.map((item) => item.product);
    const products = await this.productModel
      .find({ _id: { $in: productIds } })
      .lean()
      .exec();
    const byId = new Map(products.map((p) => [p._id.toString(), p]));

    const lines = cart.items
      .map((item) => {
        const product = byId.get(item.product.toString());
        if (!product) {
          return null;
        }
        return {
          product: {
            _id: product._id.toString(),
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice,
            image: product.image,
            category: product.category,
            stock: product.stock,
          },
          quantity: item.quantity,
          lineTotal: product.price * item.quantity,
        };
      })
      .filter((line): line is NonNullable<typeof line> => line !== null);

    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const couponRate = COUPONS[cart.coupon] ?? 0;
    const discount = Math.round(subtotal * couponRate);
    const taxable = subtotal - discount;
    const shipping =
      subtotal === 0 || taxable >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
    const tax = Math.round(taxable * TAX_RATE);
    const total = taxable + shipping + tax;

    return {
      items: lines,
      coupon: cart.coupon,
      summary: {
        itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
        subtotal,
        discount,
        shipping,
        tax,
        total,
      },
    };
  }
}
