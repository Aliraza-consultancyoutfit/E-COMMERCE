import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Settings, SettingsSchema } from "../../../libs/shared/src/schemas";
import { SettingsController } from "./settings.controller";
import { SettingsService } from "./settings.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Settings.name, schema: SettingsSchema }]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
