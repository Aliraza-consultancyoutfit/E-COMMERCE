import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../../../libs/shared/src/decorators";
import { CheckoutDto } from "../../../libs/shared/src/dto";
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

  @Post("checkout")
  @ApiCreatedResponse({
    description:
      "Create an order from the user's cart after a mock payment. 402 if declined.",
  })
  checkout(@CurrentUser() user: JwtUser, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(user.sub, dto);
  }

  @Get()
  @ApiOkResponse({ description: "List the current user's orders (newest first)." })
  listMine(@CurrentUser() user: JwtUser) {
    return this.ordersService.listMyOrders(user.sub);
  }

  @Get(":id")
  getOne(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.ordersService.getMyOrder(user.sub, id);
  }
}
