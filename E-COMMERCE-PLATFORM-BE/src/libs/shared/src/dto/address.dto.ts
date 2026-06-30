import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class CreateAddressDto {
  @ApiProperty({ example: "Home" })
  @IsString()
  @MinLength(1)
  label: string;

  @ApiProperty({ example: "Jane" })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ example: "Cooper" })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({ example: "123 Market Street" })
  @IsString()
  @MinLength(1)
  street: string;

  @ApiProperty({ example: "San Francisco" })
  @IsString()
  @MinLength(1)
  city: string;

  @ApiProperty({ example: "94103" })
  @IsString()
  @MinLength(1)
  zip: string;

  @ApiPropertyOptional({ example: "+1 415 555 0132" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
