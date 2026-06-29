---
name: module-test
description: Write and run meaningful test cases for a module — Jest/@nestjs/testing for backend, Vitest/Testing Library (+ Playwright for key flows) for frontend — setting up the runner the first time. Use when the user says "write tests for <X>" or "/module-test <X>".
---

# /module-test <module>

Delegate to **`@qa-tester`**. Quality over quantity — test the tricky, high-value behavior.

## Steps
1. Read `../../context/<module>-design.md` and `../../context/<module>-review.md` (turn flagged edge cases into tests). Find changes with `git diff --name-only`; read the implementation.
2. **First-time runner setup** (once, then reuse):
   - BE: `cd E-COMMERCE-PLATFORM-BE && npm i -D jest ts-jest @types/jest` + a ts-jest config + `"test": "jest"`. Add `supertest` only for HTTP E2E.
   - FE: `cd E-COMMERCE-PLATFORM-FE && npm i -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react` + `vitest.config.ts` (jsdom, `@`→`./src`) + `"test": "vitest run"`. Add `@playwright/test` for one key flow.
3. **Write tests** for this module's core logic (see `agents/qa-tester.md` for the per-module checklist): auth/ownership, search/filter/sort/paginate, cart totals, **qty>stock rejection + atomic stock**, **server-computed totals**, valid status transitions, recommendation relevance + fallback, form validation, list states.
4. **Run** — `npm test` in each app. Report pass/fail. Don't hide failures.

## Rules
Behavior not implementation; mock only at boundaries; one assertion per test; AAA; names `should <X> when <Y>`; check mock call args; no `expect(true)`. Only touch test files/config — never production source. Don't commit/push. (`rules/testing.md`.)
