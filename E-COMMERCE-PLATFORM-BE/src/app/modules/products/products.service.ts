import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, isValidObjectId, Model, SortOrder } from "mongoose";
import { ProductQueryDto, ProductSort } from "../../../libs/shared/src/dto";
import { Product, ProductDocument } from "../../../libs/shared/src/schemas";
import { escapeRegex } from "../../../libs/shared/src/utils";

const SORT_MAP: Record<ProductSort, Record<string, SortOrder>> = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  newest: { createdAt: -1 },
  top_rated: { rating: -1 },
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async findAll(query: ProductQueryDto) {
    const { page, limit, search, category, minPrice, maxPrice, sort } = query;

    const filter: FilterQuery<ProductDocument> = {};

    if (search) {
      filter.name = { $regex: escapeRegex(search), $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (minPrice !== undefined) priceFilter.$gte = minPrice;
      if (maxPrice !== undefined) priceFilter.$lte = maxPrice;
      filter.price = priceFilter;
    }

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort(SORT_MAP[sort ?? "newest"])
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return {
      records,
      meta: { total, page, limit, pages: Math.ceil(total / limit) || 1 },
    };
  }

  async findById(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException("Product not found");
    }

    const product = await this.productModel.findById(id).lean().exec();
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async getCategories() {
    const grouped = await this.productModel
      .aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ])
      .exec();

    return grouped.map((entry) => ({
      category: entry._id,
      count: entry.count,
    }));
  }
}
