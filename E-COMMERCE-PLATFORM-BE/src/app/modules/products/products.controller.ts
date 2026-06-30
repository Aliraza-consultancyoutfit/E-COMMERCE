import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "../../../libs/shared/src/decorators";
import {
  CreateProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from "../../../libs/shared/src/dto";
import { RolesGuard } from "../../../libs/shared/src/guards";
import { UserRole } from "../../../libs/shared/src/schemas";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProductsService } from "./products.service";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOkResponse({
    description:
      "Public paginated product list with search, category/price filters, and sort.",
  })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get("categories")
  @ApiOkResponse({ description: "Distinct product categories with counts." })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get(":id")
  @ApiOkResponse({ description: "Public single product by id." })
  @ApiNotFoundResponse({ description: "Product not found." })
  findOne(@Param("id") id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Create a product (admin only)." })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Update a product (admin only)." })
  update(@Param("id") id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Delete a product (admin only)." })
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}
