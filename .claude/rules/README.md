# Rules

Modular instruction files Claude loads automatically. They extend `CLAUDE.md` without bloating it. Agents reference these by path instead of restating them.

- `alwaysApply: true` — loaded every session.
- `paths: [...]` — loaded only when touching matching files.

## Cross-cutting (always)
- `code-style.md` — TypeScript & naming conventions for both apps.
- `security.md` — secrets, auth, authorization/IDOR, injection, money/stock integrity.
- `error-handling.md` — Nest exceptions + HTTP codes (BE), query/mutation error UX (FE).
- `git-workflow.md` — branch-per-module, conventional commits, push-with-permission, history quality.

## Backend (`E-COMMERCE-PLATFORM-BE/**`)
- `backend/nestjs-patterns.md` — module/controller/service structure, guards, DI.
- `backend/mongoose-patterns.md` — schemas, model tokens, queries, atomic stock ops, pagination.
- `backend/dto-validation.md` — class-validator + Swagger decorators, query/pagination DTOs.
- `backend/auth-authorization.md` — JWT, roles guard, ownership scoping.

## Frontend (`E-COMMERCE-PLATFORM-FE/**`)
- `frontend/nextjs-react.md` — App Router, route groups, layouts vs sections, components/hooks.
- `frontend/mui-theming.md` — **strict** theme-token usage, light+dark, adding tokens.
- `frontend/redux-data.md` — Redux Toolkit store + the single API/token layer.
- `frontend/forms.md` — react-hook-form + yup + the `rhf-*` wrappers.
- `frontend/tables.md` — `components/table` + server pagination via `components/custom-pagination`.
- `frontend/components.md` — reuse-first policy + the shared component inventory.
