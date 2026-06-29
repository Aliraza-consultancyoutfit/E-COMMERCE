import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  Max,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export const PRODUCT_SORTS = [
  "price_asc",
  "price_desc",
  "newest",
  "top_rated",
] as const;

export type ProductSort = (typeof PRODUCT_SORTS)[number];

export class ProductQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ example: 12, default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 12;

  @ApiPropertyOptional({ example: "headphones" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: "Audio" })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ enum: PRODUCT_SORTS, example: "newest" })
  @IsOptional()
  @IsEnum(PRODUCT_SORTS)
  sort?: ProductSort;
}

export class CreateProductDto {
  @ApiProperty({ example: "Aero Wireless Headphones" })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ example: "Adaptive noise cancellation, 40h battery." })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 199 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 249, description: "Pre-discount price" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  oldPrice?: number;

  @ApiPropertyOptional({ example: "https://…/headphones.jpg" })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: "Audio" })
  @IsString()
  @MinLength(1)
  category: string;

  @ApiProperty({ example: 128 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: 4.8 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ example: 212 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  reviews?: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
