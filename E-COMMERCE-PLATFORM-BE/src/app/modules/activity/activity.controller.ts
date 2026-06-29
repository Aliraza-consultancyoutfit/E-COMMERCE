import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "../../../libs/shared/src/decorators";
import { RolesGuard } from "../../../libs/shared/src/guards";
import { UserRole } from "../../../libs/shared/src/schemas";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ActivityService } from "./activity.service";

@ApiTags("Activity")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("activity")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOkResponse({ description: "Recent store activity feed (admin only)." })
  getRecent() {
    return this.activityService.getRecent();
  }
}
