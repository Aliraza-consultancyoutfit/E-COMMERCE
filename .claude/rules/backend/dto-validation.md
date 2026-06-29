---
paths:
  - "E-COMMERCE-PLATFORM-BE/**"
---

# DTOs & Validation

Match `libs/shared/src/dto/auth.dto.ts`. Every endpoint's input is a DTO; the global `ValidationPipe` enforces it.

## Rules
- One DTO per operation: `CreateXDto`, `UpdateXDto` (often `PartialType(CreateXDto)`), `XQueryDto`. Put them in `libs/shared/src/dto/<name>.dto.ts`, export from `dto/index.ts`.
- **Every property** carries:
  - a `class-validator` decorator with bounds: `@IsString()`, `@IsEmail()`, `@IsInt()`, `@IsNumber()`, `@Min(0)`, `@IsPositive()`, `@MinLength()`, `@IsEnum()`, `@IsMongoId()`, `@IsOptional()`, `@IsArray()`…
  - **and** a Swagger decorator: `@ApiProperty({ example })` or `@ApiPropertyOptional({ example })`, with `enum:` for enums.
- Use `@Type(() => Number)` / `@Type(() => Boolean)` on query params so string query values coerce (works with `transform: true`).
- Don't accept fields the client shouldn't set (e.g. `role` on public register unless intended, `userId` on cart — derive from the token). `forbidNonWhitelisted` will 400 unknown fields — rely on it.

## Query / pagination DTO shape
```ts
export class ProductQueryDto {
  @ApiPropertyOptional({ example: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page = 1;

  @ApiPropertyOptional({ example: 12 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit = 12;

  @ApiPropertyOptional({ example: 'shoes' }) @IsOptional() @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'electronics' }) @IsOptional() @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 10 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 500 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ enum: ['price_asc', 'price_desc', 'newest'], example: 'newest' })
  @IsOptional() @IsEnum(['price_asc', 'price_desc', 'newest'] as const)
  sort?: 'price_asc' | 'price_desc' | 'newest';
}
```
Provide defaults; constrain `sort` to an allow-list; cap `limit`.
