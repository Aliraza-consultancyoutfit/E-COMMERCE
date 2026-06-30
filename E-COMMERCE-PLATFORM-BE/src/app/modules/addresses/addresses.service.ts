import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model, Types } from "mongoose";
import {
  CreateAddressDto,
  UpdateAddressDto,
} from "../../../libs/shared/src/dto";
import { Address, AddressDocument } from "../../../libs/shared/src/schemas";

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
  ) {}

  async listMine(userId: string) {
    return this.addressModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean()
      .exec();
  }

  async create(userId: string, dto: CreateAddressDto) {
    const owner = new Types.ObjectId(userId);
    const count = await this.addressModel.countDocuments({ user: owner }).exec();
    const isDefault = count === 0 ? true : (dto.isDefault ?? false);

    if (isDefault) {
      await this.clearDefaults(userId);
    }

    const created = await this.addressModel.create({
      ...dto,
      user: owner,
      isDefault,
    });
    return created.toObject();
  }

  async update(userId: string, id: string, dto: UpdateAddressDto) {
    await this.assertOwned(userId, id);

    if (dto.isDefault === true) {
      await this.clearDefaults(userId);
    }

    const updated = await this.addressModel
      .findOneAndUpdate(
        { _id: id, user: new Types.ObjectId(userId) },
        dto,
        { new: true, runValidators: true },
      )
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException("Address not found");
    }
    return updated;
  }

  async remove(userId: string, id: string) {
    await this.assertOwned(userId, id);
    await this.addressModel
      .deleteOne({ _id: id, user: new Types.ObjectId(userId) })
      .exec();
    return { success: true };
  }

  async setDefault(userId: string, id: string) {
    await this.assertOwned(userId, id);
    await this.clearDefaults(userId);
    const updated = await this.addressModel
      .findOneAndUpdate(
        { _id: id, user: new Types.ObjectId(userId) },
        { isDefault: true },
        { new: true },
      )
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException("Address not found");
    }
    return updated;
  }

  private async clearDefaults(userId: string) {
    await this.addressModel
      .updateMany(
        { user: new Types.ObjectId(userId), isDefault: true },
        { isDefault: false },
      )
      .exec();
  }

  private async assertOwned(userId: string, id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException("Address not found");
    }
    const exists = await this.addressModel
      .exists({ _id: id, user: new Types.ObjectId(userId) })
      .exec();
    if (!exists) {
      throw new NotFoundException("Address not found");
    }
  }
}
