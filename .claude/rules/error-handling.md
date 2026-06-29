---
alwaysApply: true
---

# Error Handling

## Backend (NestJS)
- Throw **typed exceptions**, never generic `Error`, for expected failures:
  - `NotFoundException` (404) — resource missing
  - `BadRequestException` (400) — bad input / business rule violation (e.g. qty > stock)
  - `ConflictException` (409) — duplicates (e.g. email already registered)
  - `ForbiddenException` (403) — authenticated but not allowed
  - `UnauthorizedException` (401) — not authenticated
- Validation errors come from the global `ValidationPipe` automatically (400) — don't hand-roll them.
- Add a **global exception filter** (module 0) so unexpected errors return a clean JSON shape `{ statusCode, message, error }` and **never leak a stack trace**. Log the full error server-side only.
- Catch only to **add context**, then rethrow a typed exception. No empty `catch {}`. Always `await` async calls (a missing `await` swallows errors).

## Frontend (Next.js/MUI)
- **Queries:** render the four states — loading (`components/skeletons`), empty (`components/no-data`), error (`components/api-error-state`), data. Never a blank screen.
- **Mutations:** wrap in try/catch (or RTK Query `.unwrap()`), show a `react-hot-toast` error on failure and a success toast on success; surface server field errors back onto the RHF fields.
- Show user-friendly messages, not raw API error objects. Keep technical detail in the console.
- Use the route-level `not-found.tsx` / `loading.tsx` and an error boundary for unexpected failures.
