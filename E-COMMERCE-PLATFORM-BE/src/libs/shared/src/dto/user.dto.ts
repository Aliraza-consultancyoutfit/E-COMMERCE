import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "../schemas";

export class CreateUserDto {
  @ApiPropertyOptional({ example: "Jane Cooper" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, example: "Password123" })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;
}

export class CustomerQueryDto {
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

  @ApiPropertyOptional({ example: "jane" })
  @IsOptional()
  @IsString()
  search?: string;
}

export class CreateAdminDto {
  @ApiPropertyOptional({ example: "Ravi Thomas" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: "ravi@company.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, example: "Password123" })
  @IsString()
  @MinLength(8)
  password: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: "Jane Cooper" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "Base64 data URL, or empty string to remove" })
  @IsOptional()
  @IsString()
  avatar?: string;
}
