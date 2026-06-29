import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../../libs/shared/src/decorators";
import {
  AddToCartDto,
  ApplyCouponDto,
  UpdateCartItemDto,
} from "../../../libs/shared/src/dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CartService } from "./cart.service";

interface JwtUser {
  sub: string;
}

@ApiTags("Cart")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getMyCart(@CurrentUser() user: JwtUser) {
    return this.cartService.getMyCart(user.sub);
  }

  @Post("items")
  addItem(@CurrentUser() user: JwtUser, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(user.sub, dto.productId, dto.quantity);
  }

  @Patch("items/:productId")
  updateItem(
    @CurrentUser() user: JwtUser,
    @Param("productId") productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(user.sub, productId, dto.quantity);
  }

  @Delete("items/:productId")
  removeItem(
    @CurrentUser() user: JwtUser,
    @Param("productId") productId: string,
  ) {
    return this.cartService.removeItem(user.sub, productId);
  }

  @Post("coupon")
  applyCoupon(@CurrentUser() user: JwtUser, @Body() dto: ApplyCouponDto) {
    return this.cartService.applyCoupon(user.sub, dto.code);
  }

  @Delete()
  clearCart(@CurrentUser() user: JwtUser) {
    return this.cartService.clearCart(user.sub);
  }
}
