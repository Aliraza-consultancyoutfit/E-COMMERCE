import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "../../../libs/shared/src/decorators";
import { CreateAdminDto, CustomerQueryDto } from "../../../libs/shared/src/dto";
import { RolesGuard } from "../../../libs/shared/src/guards";
import { UserRole } from "../../../libs/shared/src/schemas";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UsersService } from "./users.service";

@ApiTags("Customers")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("admins")
  @ApiOkResponse({ description: "List admin team members (admin only)." })
  listAdmins(@Query() query: CustomerQueryDto) {
    return this.usersService.getAdmins(query);
  }

  @Post("admins")
  @ApiCreatedResponse({ description: "Create another admin account (admin only)." })
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.usersService.createAdmin(dto);
  }

  @Get("customers")
  @ApiOkResponse({ description: "List customers with order count + spend (admin only)." })
  listCustomers(@Query() query: CustomerQueryDto) {
    return this.usersService.getCustomers(query);
  }

  @Get("customers/:id")
  @ApiOkResponse({ description: "Customer detail with stats + recent orders (admin only)." })
  getCustomer(@Param("id") id: string) {
    return this.usersService.getCustomerDetail(id);
  }
}
