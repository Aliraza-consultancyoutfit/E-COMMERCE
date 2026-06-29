---
paths:
  - "E-COMMERCE-PLATFORM-BE/**"
---

# NestJS Patterns

Match the existing `auth`/`users`/`health` modules. Stack: NestJS 11, Mongoose, passport-jwt, Swagger.

## Module layout
A feature lives in `src/app/modules/<name>/`:
```
<name>/
├── <name>.controller.ts
├── <name>.service.ts
├── <name>.module.ts
├── dto/            # or reuse libs/shared/src/dto
└── guards/ strategies/   # only if module-specific
```
Register the feature module in `src/app/app.module.ts`. Import the model with `MongooseModule.forFeature([{ name: X.name, schema: XSchema }])` (or via the existing model-token pattern in `constants/models.constants.ts`).

## Controllers (thin)
- `@ApiTags('<Resource>')` + `@Controller('<resource>')`.
- One responsibility per handler; delegate immediately to the service. No business logic, no DB access in controllers.
- Protected routes: `@UseGuards(JwtAuthGuard)` + `@ApiBearerAuth()`. Admin routes: also `RolesGuard` + `@Roles(UserRole.ADMIN)`.
- Read the user with the existing `@CurrentUser()` decorator. Scope customer data by `user.sub`.
- Return service results directly (keep the response shape consistent with the rest of the API — decide envelope vs raw once, in module 0, and stick to it).
- Correct status codes (`@HttpCode(201)` for create if needed) — see `error-handling.md`.

## Services (the logic)
- Inject the Mongoose model; implement all business rules here. Throw typed exceptions.
- Keep methods small and named by intent (`createProduct`, `decrementStock`, `getMyOrders`).
- No `ClientRMQ`/transport concerns — this is a single REST app, not microservices.

## Guards & decorators
- `JwtAuthGuard` already exists. Add a `RolesGuard` + `@Roles()` decorator in module 0 (shared) — read `UserRole` from the JWT payload.
- Shared, cross-module helpers go in `libs/shared/src` (decorators, utils, constants), not copied per module.

## Config
- All env via `ConfigService` (ConfigModule is global). Never `process.env.X` scattered in services — inject config.
