---
alwaysApply: true
---

# Security & Data Integrity

Graded heavily. Applies to every module.

## Secrets
- Only in `.env` (per app), never committed. `.env.example` holds keys with placeholder values only.
- Read via `ConfigService` (BE). Never bake a secret into the FE bundle. Never log secrets/tokens/passwords.

## Authentication
- Passwords hashed with bcrypt via `libs/shared/src/utils/hash.util.ts`. Never store/return/log plaintext. Never return the `password` field in any response.
- JWT signed with `JWT_SECRET` from env, with `JWT_EXPIRES_IN`. Validate on protected routes with `JwtAuthGuard`.

## Authorization (the core risk for this app)
- **Role gate:** admin endpoints + admin panel are admin-only — enforce server-side with `RolesGuard` + `@Roles(UserRole.ADMIN)`. Hiding a UI button is not authorization.
- **Ownership (IDOR):** a customer may only read/modify **their own** cart and orders. Every such query/mutation is scoped by `@CurrentUser().sub` — never by an id taken from the request body/params alone. Treat "can user B reach user A's data by changing an id?" as the default thing to prevent and test.

## Input
- All input goes through a validated DTO; global `ValidationPipe({ whitelist, forbidNonWhitelisted, transform })` is on — keep it. Never build a Mongo query with raw user input that could inject operators (`$where`, `$gt`, etc.). Validate ranges (price ≥ 0, qty ≥ 1).
- Client-side: yup + RHF validation too — but the server is the source of truth.

## Money & stock integrity
- **Order totals are recomputed server-side** from stored prices. A client-supplied price/total is ignored.
- **Stock never oversells:** decrement with an atomic, guarded operation (`findOneAndUpdate({ _id, stock: { $gte: qty } }, { $inc: { stock: -qty } })`) and fail if no doc matched. No read-then-write race.
- **Order status** changes only via allowed transitions (`pending→processing→shipped→delivered`, plus `cancelled`); reject illegal jumps.

## Output
- Correct HTTP status codes; clean error messages; **no raw stack traces** to clients (handled by the global exception filter — see `error-handling.md`).
- No cross-user data in list endpoints.

## Frontend
- Attach the JWT from secure storage (`js-cookie`/`jwt-decode`) via the single API layer. No `dangerouslySetInnerHTML` with untrusted input. Guard `(user)`/`(admin)` routes.
