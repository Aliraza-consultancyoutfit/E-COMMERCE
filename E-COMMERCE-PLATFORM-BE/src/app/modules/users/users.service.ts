import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserDto } from "../../../libs/shared/src/dto";
import { User, UserDocument } from "../../../libs/shared/src/schemas";
import { Model } from "mongoose";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
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
    };
  }

  async updateProfile(id: string, update: { name?: string }) {
    await this.userModel
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .exec();
    return this.getProfile(id);
  }
}
