---
name: be-endpoint
description: Scaffold a backend feature in the NestJS/Mongoose API — schema, model token, DTOs, service, controller, guards, and Swagger — following project patterns. Use when the user says "create the <X> endpoint/module/API" or "/be-endpoint <X>".
---

# /be-endpoint <feature>

Delegate to **`@be-developer`** (or do it directly for a tiny change). Builds one backend feature end to end. Working dir: `E-COMMERCE-PLATFORM-BE/`.

## Order of operations
1. **Schema** — `libs/shared/src/schemas/<feature>.schema.ts` (`@Schema({ timestamps: true })`, typed props + constraints, enums, `XDocument`, `XSchema`). Export from `schemas/index.ts`. Add indexes for filtered/sorted fields.
2. **Model token / registration** — token in `constants/models.constants.ts` and/or `MongooseModule.forFeature` in the feature module (match how `users`/`auth` do it).
3. **DTOs** — `libs/shared/src/dto/<feature>.dto.ts`: `Create/Update/Query` DTOs, every prop with class-validator **and** Swagger decorator; query DTO with paginate/filter/sort defaults. Export from `dto/index.ts`.
4. **Service** — `src/app/modules/<feature>/<feature>.service.ts`: business logic, typed exceptions, **server-side money/stock**, atomic stock ops.
5. **Controller** — `<feature>.controller.ts`: `@ApiTags`, correct verbs/status codes, `JwtAuthGuard`/`RolesGuard` as needed, ownership scoping via `@CurrentUser().sub`.
6. **Module** — `<feature>.module.ts`; register in `app/app.module.ts`.
7. **Verify** — `npm run lint && npm run build`; confirm in `/api/docs`.

## References
`rules/backend/nestjs-patterns.md`, `mongoose-patterns.md`, `dto-validation.md`, `auth-authorization.md`, `rules/security.md`, `rules/error-handling.md`. Don't commit/push.
