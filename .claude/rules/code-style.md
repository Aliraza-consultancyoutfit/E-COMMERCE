---
alwaysApply: true
---

# Code Style (both apps)

TypeScript everywhere, `strict` on. This complements the global `code-quality.md` — don't duplicate it; this file is the project-specific delta.

## Naming
- **Files:** kebab-case for everything in both apps — matches the existing tree (`auth.service.ts`, `rhf-text-field/index.tsx`, `user.schema.ts`). React components are still PascalCase *exports* from a kebab-case file/dir.
- **Backend:** Nest classes PascalCase + suffix (`ProductService`, `ProductController`, `CreateProductDto`, `ProductSchema`). DI tokens `SCREAMING_SNAKE` (`PRODUCT_MODEL`). Enums PascalCase members (`UserRole.ADMIN`, `OrderStatus.Pending`).
- **Frontend:** components PascalCase, hooks `useXxx`, RHF wrappers `RhfXxx`, interfaces in a sibling `*.interface.ts`, column/chart config in `*.data.ts` / `*.data.tsx`.
- Booleans `is/has/should/can`; handlers `handleX` internally / `onX` as props; constants `SCREAMING_SNAKE`.

## Imports
- **Backend:** no path aliases configured — use the existing relative style (`../../../libs/shared/src/...`). Group: node builtins → `@nestjs/*` & external → shared libs → relative. `import type` for type-only.
- **Frontend:** always use `@/` alias (`@/components`, `@/theme`, `@/constants/strings`) — never deep `../../`. `import type` for type-only imports.

## Structure
- One component/class per file; export at declaration; named exports preferred (barrels via `index.ts` already exist — keep them updated).
- Functions do one thing. Controllers stay thin (delegate to services); React `page.tsx` stays thin (delegate to `ui/` sections).
- No magic values — extract to named constants (route strings, status enums, pagination defaults, limits).
- No dead/commented-out code. Comments explain **why**, not what.

## Markers
`TODO(author): desc (#issue)` / `FIXME(...)` / `NOTE: ...` only. Don't commit a TODO you can do now.
