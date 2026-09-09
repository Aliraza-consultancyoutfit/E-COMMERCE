import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateReviewDto {
  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: "Excellent build quality" })
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  title: string;

  @ApiProperty({
    example: "Arrived quickly, matched the product page, and feels premium.",
  })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  comment: string;
}
