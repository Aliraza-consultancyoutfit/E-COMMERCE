---
paths:
  - "E-COMMERCE-PLATFORM-BE/**"
---

# Mongoose Patterns

Match `libs/shared/src/schemas/user.schema.ts`.

## Schema definition
- File: `libs/shared/src/schemas/<name>.schema.ts`.
- `@Schema({ timestamps: true })` (always — gives `createdAt`/`updatedAt`).
- Typed `@Prop`s with constraints: `required`, `min`/`max`, `enum`, `default`, `index`, `ref` for relations (store `Types.ObjectId` + `ref: 'ModelName'`).
- Export: the class, `export type XDocument = HydratedDocument<X>`, and `export const XSchema = SchemaFactory.createForClass(X)`.
- Export domain enums from the same file (e.g. `OrderStatus`), like `UserRole`.
- Add `export * from './<name>.schema'` to `schemas/index.ts`.
- Add indexes for fields you filter/sort on at scale (e.g. product `category`, `price`, `createdAt`; order `user`).

## Models & injection
- Add a token in `constants/models.constants.ts` if following the token pattern (`export const PRODUCT_MODEL = 'PRODUCT_MODEL'`), or register via `MongooseModule.forFeature` and inject with `@InjectModel(Product.name)`. **Pick one approach and stay consistent** with how `users`/`auth` already do it.

## Queries
- Build filters from validated DTO fields only — never spread raw request bodies into a query (operator-injection risk).
- Use `.lean()` for read-only list queries (faster, plain objects).
- **Pagination:** `skip = (page - 1) * limit`, `.skip().limit()`, and return `{ records, meta: { total, page, limit, pages } }` so the FE table can page. Cap `limit` (e.g. ≤ 100).
- Sorting: map an allowed-list of sort keys (`price`, `createdAt`) to `.sort()` — never pass a raw client string.
- Projection: exclude `password` and internal fields from responses (`.select('-password')`).

## Mutations & integrity
- **Atomic stock decrement** (prevents overselling):
  ```ts
  const updated = await this.productModel.findOneAndUpdate(
    { _id: id, stock: { $gte: qty } },
    { $inc: { stock: -qty } },
    { new: true },
  );
  if (!updated) throw new BadRequestException('Insufficient stock');
  ```
- Recompute order totals from the product docs you just read — never from client input.
- Use `findByIdAndUpdate(..., { new: true, runValidators: true })` so schema validation runs on updates.
- For multi-document consistency at checkout, prefer guarded atomic ops; use a transaction/session only if running a replica set.
