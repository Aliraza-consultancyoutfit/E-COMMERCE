# Agents

Specialist subagents that the **`@orchestrator`** delegates to during the module-by-module build. Invoke an agent with `@<name>` or via the Agent tool. The orchestrator runs the pipeline; the rest do one job well.

| Agent | When it runs | Responsibility |
|---|---|---|
| `orchestrator` | Always — it drives | Scopes the active module, delegates, **verifies each output**, gates on review, asks before shipping, keeps `MODULES.md` + docs current. |
| `design-figma` | Step 1 of every module | Pulls/derives the Figma design → build-ready spec mapped to **our theme tokens + shared components**. |
| `be-developer` | Step 2 | NestJS + Mongoose: schema, model token, DTOs, service, controller, guards, Swagger. |
| `fe-developer` | Step 3–4 | Next.js/MUI section + thin page, data layer, forms, tables, charts — themed (light+dark), reusing `components/`. |
| `code-reviewer` | Step 5 (always) | Main gate: correctness, maintainability, project patterns. |
| `security-reviewer` | Step 5 (always) | Authn/authz, IDOR/ownership, secrets, injection, money/stock integrity. |
| `api-reviewer` | Step 5 (when controllers/DTOs change) | REST conventions, status codes, Swagger accuracy, validation completeness. |
| `accessibility-reviewer` | Step 5 (when UI changes) | WCAG 2.1 AA, keyboard, contrast in both themes. |
| `responsiveness-reviewer` | Step 5 (when UI changes) | Responsive layout across breakpoints — no overflow, fluid sizing, mobile-adapted tables/charts/modals, touch targets, both themes. |
| `qa-tester` | Step 6 | Meaningful behavior tests (Jest BE, Vitest/Playwright FE); sets up runners first time. |

## Principles baked into every agent

- **Read the cached map, not the repo** — agents start from `../PROJECT-STRUCTURE.md`.
- **Don't duplicate rules** — agents reference `../rules/*`, they don't restate them.
- **Verify, don't trust** — the orchestrator checks diffs, runs lint/build, and exercises the feature before moving on.
- **Dev agents never commit/push** — shipping is gated through `/module-ship` with the user's permission.
- **Theme + reuse are non-negotiable** on the frontend.
