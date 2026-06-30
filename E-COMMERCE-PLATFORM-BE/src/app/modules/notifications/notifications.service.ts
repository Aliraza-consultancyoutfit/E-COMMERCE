import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model, Types } from "mongoose";
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from "../../../libs/shared/src/schemas";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async listMine(userId: string) {
    return this.notificationModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async markAllRead(userId: string) {
    await this.notificationModel
      .updateMany(
        { user: new Types.ObjectId(userId), read: false },
        { read: true },
      )
      .exec();
    return this.listMine(userId);
  }

  async markRead(userId: string, id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException("Notification not found");
    }
    const updated = await this.notificationModel
      .findOneAndUpdate(
        { _id: id, user: new Types.ObjectId(userId) },
        { read: true },
        { new: true },
      )
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException("Notification not found");
    }
    return updated;
  }

  async createForUser(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
  ) {
    return this.notificationModel.create({
      user: new Types.ObjectId(userId),
      type,
      title,
      body,
    });
  }
}
