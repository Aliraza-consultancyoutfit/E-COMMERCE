import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model, Types } from "mongoose";
import { CreateReviewDto } from "../../../libs/shared/src/dto";
import {
  Order,
  OrderDocument,
  OrderStatus,
  Product,
  ProductDocument,
  Review,
  ReviewDocument,
  User,
  UserDocument,
} from "../../../libs/shared/src/schemas";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async listForProduct(productId: string) {
    if (!isValidObjectId(productId)) {
      throw new NotFoundException("Product not found");
    }

    const product = await this.productModel.exists({ _id: productId });
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return this.reviewModel
      .find({ product: new Types.ObjectId(productId) })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async createForProduct(productId: string, userId: string, dto: CreateReviewDto) {
    if (!isValidObjectId(productId)) {
      throw new NotFoundException("Product not found");
    }

    const productObjectId = new Types.ObjectId(productId);
    const userObjectId = new Types.ObjectId(userId);

    const [product, user, purchased, existing] = await Promise.all([
      this.productModel.exists({ _id: productObjectId }),
      this.userModel.findById(userObjectId).select("name email").lean().exec(),
      this.orderModel.exists({
        user: userObjectId,
        status: { $ne: OrderStatus.Cancelled },
        "items.product": productObjectId,
      }),
      this.reviewModel.exists({ product: productObjectId, user: userObjectId }),
    ]);

    if (!product) {
      throw new NotFoundException("Product not found");
    }
    if (!purchased) {
      throw new BadRequestException("Only customers who bought this product can review it");
    }
    if (existing) {
      throw new ConflictException("You already reviewed this product");
    }

    const review = await this.reviewModel.create({
      product: productObjectId,
      user: userObjectId,
      userName: user?.name || user?.email || "Verified customer",
      rating: dto.rating,
      title: dto.title,
      comment: dto.comment,
    });

    await this.refreshProductRating(productObjectId);

    return review.toObject();
  }

  private async refreshProductRating(productId: Types.ObjectId) {
    const [stats] = await this.reviewModel.aggregate<{
      _id: Types.ObjectId;
      rating: number;
      reviews: number;
    }>([
      { $match: { product: productId } },
      {
        $group: {
          _id: "$product",
          rating: { $avg: "$rating" },
          reviews: { $sum: 1 },
        },
      },
    ]);

    await this.productModel.updateOne(
      { _id: productId },
      {
        $set: {
          rating: stats ? Number(stats.rating.toFixed(1)) : 0,
          reviews: stats?.reviews ?? 0,
        },
      },
    );
  }
}
