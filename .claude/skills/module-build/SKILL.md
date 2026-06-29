---
name: module-build
description: The headline workflow. Build one e-commerce module end-to-end — design → backend → frontend → integrate → review → test → document → ship — driven by the orchestrator, one module fully shipped before the next. Use when the user says "build the <X> module", "/module-build <X>", or "start the next module".
---

# /module-build <module>

Run the full module pipeline for **one** module from [`../../MODULES.md`](../../MODULES.md). Finish and ship it before starting another.

## 0. Set up
1. Read `../../PROJECT-STRUCTURE.md` (don't re-scan), `../../CLAUDE.md`, and the module's row in `../../MODULES.md`.
2. If no module name was given, pick the first non-`✅` row in `MODULES.md`.
3. Create a `TodoWrite` list with the 8 steps below so the user can follow along. Set the module to `🟡 in-progress` in `MODULES.md`.
4. Create the feature branch: `git checkout -b feature/<nn>-<module>` (off `main`).

## 1. DESIGN  →  `@design-figma`
Delegate. It checks Figma (token/URL in `settings.local.json`, else asks) or derives an original design, and writes `../../context/<module>-design.md` mapped to theme tokens + shared components. **Verify** the spec names real components and tokens before continuing.

## 2. BACKEND  →  `@be-developer`
Delegate with the design spec + scope. It builds schema → model token → DTOs → service → controller → guards → Swagger.
**Verify:** `cd E-COMMERCE-PLATFORM-BE && npm run lint && npm run build`; check the route in `/api/docs`; skim the diff. Fix or re-delegate if off.

## 3. FRONTEND  →  `@fe-developer`
Delegate with the design spec + the real API shapes from step 2. It builds the `ui/` section + thin page, data layer, forms/tables/charts — themed light+dark, reusing `components/`.
**Verify:** `cd E-COMMERCE-PLATFORM-FE && npm run lint && npm run build`; grep new files for hardcoded color/`style={{`; confirm both themes considered.

## 4. INTEGRATE
Wire FE ↔ BE (real base URL, token attach). Run **both** apps and walk the actual flow (e.g. browse → add to cart → checkout). Confirm validation + error states behave. Capture anything that broke for the module doc.

## 5. REVIEW (parallel)  →  reviewers
Spawn in **one message**: `@code-reviewer` + `@security-reviewer` always; add `@api-reviewer` if controllers/DTOs changed, and `@accessibility-reviewer` + `@responsiveness-reviewer` if UI changed. They write `../../context/<module>-review.md`.
**Gate:** no critical → proceed. Critical → present to user: auto-fix (re-delegate with findings) / skip-with-reason / stop. Recommend auto-fix.

## 6. TEST  →  `@qa-tester`
Delegate. It sets up the test runner if first time, writes meaningful behavior tests (money, stock, auth/ownership, transitions, validation, the module's core logic), and runs them. **All tests must pass.** Show counts.

## 7. DOCUMENT
Write `../../docs/modules/<nn>-<module>.md` using the template in `/module-ship`. Include: what was built, endpoints + screens, **decisions on ambiguity**, **mistakes the agents made and how you caught/fixed them**, how you verified, tests added. Mirror any ambiguity decision into `MODULES.md` notes (and later NOTES.md).

## 8. SHIP  →  `/module-ship <module>`
Lint+build gate → ensure doc written → **ask the user for permission** → on approval, incremental commits + push the branch. Update `MODULES.md` (status `✅`, commit hash). Then offer to start the next module.

## Rules
- One module in flight. Don't begin the next before this one ships.
- Verify every sub-agent's output — never accept blind. Verification evidence is part of the deliverable.
- Respect every non-negotiable in `CLAUDE.md` (theme, reuse, validation, security, integrity).
