import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ProductQueryDto } from "../../../libs/shared/src/dto";
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
}
