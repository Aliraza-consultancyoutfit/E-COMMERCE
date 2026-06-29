import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../../libs/shared/src/decorators";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { WishlistService } from "./wishlist.service";

interface JwtUser {
  sub: string;
}

@ApiTags("Wishlist")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("wishlist")
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOkResponse({ description: "The current user's wishlist products (populated)." })
  getMine(@CurrentUser() user: JwtUser) {
    return this.wishlistService.getMyWishlist(user.sub);
  }

  @Post(":productId")
  @ApiOkResponse({ description: "Add a product to the wishlist (idempotent)." })
  add(@CurrentUser() user: JwtUser, @Param("productId") productId: string) {
    return this.wishlistService.addProduct(user.sub, productId);
  }

  @Delete(":productId")
  @ApiOkResponse({ description: "Remove a product from the wishlist." })
  remove(@CurrentUser() user: JwtUser, @Param("productId") productId: string) {
    return this.wishlistService.removeProduct(user.sub, productId);
  }
}
