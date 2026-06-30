import { IsInt, IsMongoId, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddToCartDto {
  @ApiProperty({ example: "6a4298a13655bbcb05051ce5" })
  @IsMongoId()
  productId: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class ApplyCouponDto {
  @ApiProperty({ example: "WELCOME10" })
  @IsString()
  code: string;
}
