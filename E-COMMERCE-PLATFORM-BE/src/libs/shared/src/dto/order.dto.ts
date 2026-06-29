import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { OrderStatus } from "../schemas";

export class ShippingAddressDto {
  @ApiProperty({ example: "Jane" }) @IsString() @MinLength(1) firstName: string;
  @ApiProperty({ example: "Cooper" }) @IsString() @MinLength(1) lastName: string;
  @ApiProperty({ example: "2118 Thornridge Cir" })
  @IsString()
  @MinLength(1)
  street: string;
  @ApiProperty({ example: "Syracuse" }) @IsString() @MinLength(1) city: string;
  @ApiProperty({ example: "13202" }) @IsString() @MinLength(1) zip: string;
}

export class CheckoutDto {
  @ApiProperty({ type: ShippingAddressDto })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiProperty({ example: "pi_3Xxx", description: "Stripe PaymentIntent id (confirmed client-side)" })
  @IsString()
  @MinLength(1)
  paymentIntentId: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.Processing })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class AdminOrderQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
