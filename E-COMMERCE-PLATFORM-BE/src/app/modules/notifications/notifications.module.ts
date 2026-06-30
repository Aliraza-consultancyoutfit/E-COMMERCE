import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NOTIFICATION_MODEL } from "../../../libs/shared/src/constants";
import {
  Notification,
  NotificationSchema,
} from "../../../libs/shared/src/schemas";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    {
      provide: NOTIFICATION_MODEL,
      useValue: Notification.name,
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
