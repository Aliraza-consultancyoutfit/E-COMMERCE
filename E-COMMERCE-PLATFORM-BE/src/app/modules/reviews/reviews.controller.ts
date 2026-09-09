import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../../../libs/shared/src/decorators";
import { CreateReviewDto } from "../../../libs/shared/src/dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ReviewsService } from "./reviews.service";

interface JwtUser {
  sub: string;
}

@ApiTags("Reviews")
@Controller("products/:productId/reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOkResponse({ description: "Public reviews for a product." })
  list(@Param("productId") productId: string) {
    return this.reviewsService.listForProduct(productId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: "Create a verified-purchase product review.",
  })
  create(
    @CurrentUser() user: JwtUser,
    @Param("productId") productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createForProduct(productId, user.sub, dto);
  }
}
