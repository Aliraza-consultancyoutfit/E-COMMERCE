import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { CurrentUser, Roles } from "../../../libs/shared/src/decorators";
import {
  AdminOrderQueryDto,
  CheckoutDto,
  UpdateOrderStatusDto,
} from "../../../libs/shared/src/dto";
import { RolesGuard } from "../../../libs/shared/src/guards";
import { UserRole } from "../../../libs/shared/src/schemas";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OrdersService } from "./orders.service";

interface JwtUser {
  sub: string;
}

@ApiTags("Orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("payment-intent")
  @ApiCreatedResponse({
    description: "Create a Stripe PaymentIntent for the user's cart total.",
  })
  createPaymentIntent(@CurrentUser() user: JwtUser) {
    return this.ordersService.createPaymentIntent(user.sub);
  }

  @Post("checkout")
  @ApiCreatedResponse({
    description:
      "Create an order from the user's cart after confirming the Stripe payment. 402 if not completed.",
  })
  checkout(@CurrentUser() user: JwtUser, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(user.sub, dto);
  }

  @Get()
  @ApiOkResponse({ description: "List the current user's orders (newest first)." })
  listMine(@CurrentUser() user: JwtUser) {
    return this.ordersService.listMyOrders(user.sub);
  }

  @Get("all")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ description: "List all orders (admin only)." })
  listAll(@Query() query: AdminOrderQueryDto) {
    return this.ordersService.getAllOrders(query);
  }

  @Get("stats")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ description: "Dashboard analytics (admin only)." })
  getStats() {
    return this.ordersService.getStats();
  }

  @Get("admin/:id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ description: "Get any order by id (admin only)." })
  getForAdmin(@Param("id") id: string) {
    return this.ordersService.getOrderForAdmin(id);
  }

  @Patch(":id/status")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ description: "Update order status (admin only)." })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }

  @Get(":id")
  getOne(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.ordersService.getMyOrder(user.sub, id);
  }
}
