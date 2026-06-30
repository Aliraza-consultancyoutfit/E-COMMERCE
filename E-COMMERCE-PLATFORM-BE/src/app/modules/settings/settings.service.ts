import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UpdateSettingsDto } from "../../../libs/shared/src/dto";
import { Settings, SettingsDocument } from "../../../libs/shared/src/schemas";

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
  ) {}

  private sanitize(doc: Partial<Settings>) {
    return {
      storeName: doc.storeName,
      supportEmail: doc.supportEmail,
      currency: doc.currency,
      timezone: doc.timezone,
      showOutOfStock: doc.showOutOfStock,
      enableReviews: doc.enableReviews,
      requireAccountToCheckout: doc.requireAccountToCheckout,
    };
  }

  /** Returns the single settings document, creating defaults on first read. */
  async getSettings() {
    const existing = await this.settingsModel.findOne().lean();
    if (existing) {
      return this.sanitize(existing);
    }
    const created = await this.settingsModel.create({});
    return this.sanitize(created.toObject());
  }

  async updateSettings(dto: UpdateSettingsDto) {
    const updated = await this.settingsModel
      .findOneAndUpdate({}, { $set: dto }, { new: true, upsert: true, runValidators: true })
      .lean();
    return this.sanitize(updated);
  }
}
