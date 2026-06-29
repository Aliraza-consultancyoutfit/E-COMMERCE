import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model, Types } from "mongoose";
import {
  Product,
  ProductDocument,
  Wishlist,
  WishlistDocument,
} from "../../../libs/shared/src/schemas";

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name)
    private readonly wishlistModel: Model<WishlistDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async getMyWishlist(userId: string) {
    await this.getOrCreate(userId);
    return this.populatedProducts(userId);
  }

  async addProduct(userId: string, productId: string) {
    if (!isValidObjectId(productId)) {
      throw new NotFoundException("Product not found");
    }
    const product = await this.productModel.exists({ _id: productId });
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    await this.getOrCreate(userId);
    await this.wishlistModel
      .updateOne(
        { user: new Types.ObjectId(userId) },
        { $addToSet: { products: new Types.ObjectId(productId) } },
      )
      .exec();

    return this.populatedProducts(userId);
  }

  async removeProduct(userId: string, productId: string) {
    await this.getOrCreate(userId);
    if (isValidObjectId(productId)) {
      await this.wishlistModel
        .updateOne(
          { user: new Types.ObjectId(userId) },
          { $pull: { products: new Types.ObjectId(productId) } },
        )
        .exec();
    }
    return this.populatedProducts(userId);
  }

  private async getOrCreate(userId: string): Promise<WishlistDocument> {
    return this.wishlistModel
      .findOneAndUpdate(
        { user: new Types.ObjectId(userId) },
        { $setOnInsert: { user: new Types.ObjectId(userId) } },
        { upsert: true, new: true },
      )
      .exec();
  }

  private async populatedProducts(userId: string) {
    const wishlist = await this.wishlistModel
      .findOne({ user: new Types.ObjectId(userId) })
      .populate("products")
      .lean()
      .exec();
    return wishlist?.products ?? [];
  }
}
