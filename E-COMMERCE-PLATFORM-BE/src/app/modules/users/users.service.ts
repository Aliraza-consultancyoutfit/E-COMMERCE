import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  CreateAdminDto,
  CreateUserDto,
  CustomerQueryDto,
  UpdateProfileDto,
} from "../../../libs/shared/src/dto";
import {
  Order,
  OrderDocument,
  User,
  UserDocument,
  UserRole,
} from "../../../libs/shared/src/schemas";
import { compareHash, hashValue } from "../../../libs/shared/src/utils";
import { isValidObjectId, Model, Types } from "mongoose";

interface CustomerOrder {
  _id: Types.ObjectId;
  total: number;
  status: string;
  createdAt: Date;
  shippingAddress: unknown;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.exists({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    return this.userModel.create(createUserDto);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async getProfile(id: string) {
    const user = await this.userModel.findById(id).select("-password").lean();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      notifyOrders: user.notifyOrders,
      notifyPromotions: user.notifyPromotions,
      notifyRecommendations: user.notifyRecommendations,
      twoFactorEnabled: user.twoFactorEnabled,
    };
  }

  async updateProfile(id: string, update: UpdateProfileDto) {
    await this.userModel
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .exec();
    return this.getProfile(id);
  }

  async changePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const isCurrentValid = await compareHash(currentPassword, user.password);
    if (!isCurrentValid) {
      throw new BadRequestException("Current password is incorrect");
    }
    user.password = await hashValue(newPassword);
    await user.save();
    return { success: true };
  }

  /** Admin: paginated customers (role=user) with order count + lifetime spend. */
  async getCustomers(query: CustomerQueryDto) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const match: Record<string, unknown> = { role: UserRole.USER };
    if (search) {
      match.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [records, total] = await Promise.all([
      this.userModel.aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "user",
            as: "orders",
          },
        },
        {
          $addFields: {
            orderCount: { $size: "$orders" },
            spent: { $sum: "$orders.total" },
          },
        },
        { $project: { name: 1, email: 1, avatar: 1, createdAt: 1, orderCount: 1, spent: 1 } },
      ]),
      this.userModel.countDocuments(match),
    ]);

    return {
      records,
      meta: { total, page, limit, pages: Math.ceil(total / limit) || 1 },
    };
  }

  /** Admin: paginated team members (role=admin). */
  async getAdmins(query: CustomerQueryDto) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const match: Record<string, unknown> = { role: UserRole.ADMIN };
    if (search) {
      match.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [records, total] = await Promise.all([
      this.userModel
        .find(match)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("name email avatar role createdAt")
        .lean(),
      this.userModel.countDocuments(match),
    ]);

    return {
      records,
      meta: { total, page, limit, pages: Math.ceil(total / limit) || 1 },
    };
  }

  /** Admin: create another admin account. */
  async createAdmin(dto: CreateAdminDto) {
    const password = await hashValue(dto.password);
    const user = await this.create({
      name: dto.name,
      email: dto.email,
      password,
      role: UserRole.ADMIN,
    });
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  /** Admin: a single customer with stats, default address and recent orders. */
  async getCustomerDetail(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException("Customer not found");
    }
    const user = await this.userModel
      .findOne({ _id: id, role: UserRole.USER })
      .select("-password")
      .lean<{ _id: Types.ObjectId; name: string; email: string; avatar: string; createdAt: Date }>();
    if (!user) {
      throw new NotFoundException("Customer not found");
    }

    const orders = await this.orderModel
      .find({ user: new Types.ObjectId(id) })
      .sort({ createdAt: -1 })
      .lean<CustomerOrder[]>();

    const spent = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      orderCount,
      spent,
      avgOrder: orderCount ? spent / orderCount : 0,
      defaultAddress: orders[0]?.shippingAddress ?? null,
      recentOrders: orders.slice(0, 5).map((order) => ({
        _id: order._id.toString(),
        createdAt: order.createdAt,
        status: order.status,
        total: order.total,
      })),
    };
  }
}
