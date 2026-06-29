import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "../../../libs/shared/src/decorators";
import { UpdateSettingsDto } from "../../../libs/shared/src/dto";
import { RolesGuard } from "../../../libs/shared/src/guards";
import { UserRole } from "../../../libs/shared/src/schemas";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { SettingsService } from "./settings.service";

@ApiTags("Settings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOkResponse({ description: "Get store settings (admin only)." })
  get() {
    return this.settingsService.getSettings();
  }

  @Put()
  @ApiOkResponse({ description: "Update store settings (admin only)." })
  update(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(dto);
  }
}
