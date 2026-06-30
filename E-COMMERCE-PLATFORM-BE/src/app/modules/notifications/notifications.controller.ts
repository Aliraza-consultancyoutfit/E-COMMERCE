import { Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../../libs/shared/src/decorators";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { NotificationsService } from "./notifications.service";

interface JwtUser {
  sub: string;
}

@ApiTags("Notifications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOkResponse({ description: "The current user's notifications (newest first)." })
  listMine(@CurrentUser() user: JwtUser) {
    return this.notificationsService.listMine(user.sub);
  }

  @Patch("read-all")
  @ApiOkResponse({ description: "Mark all the user's notifications as read." })
  markAllRead(@CurrentUser() user: JwtUser) {
    return this.notificationsService.markAllRead(user.sub);
  }

  @Patch(":id/read")
  @ApiOkResponse({ description: "Mark a single notification as read." })
  markRead(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.notificationsService.markRead(user.sub, id);
  }
}
