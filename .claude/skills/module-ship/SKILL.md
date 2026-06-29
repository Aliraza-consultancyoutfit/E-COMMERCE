---
name: module-ship
description: Finish a module — lint+build gate, write the module doc, then ASK THE USER for permission and commit + push, then update the roadmap. Use when the user says "ship the <X> module", "push this module", or "/module-ship <X>".
---

# /module-ship <module>

The gate between modules. **Never push without explicit user permission.**

## 1. Quality gate
For each app changed:
```bash
cd E-COMMERCE-PLATFORM-BE && npm run lint && npm run build   # if BE changed
cd E-COMMERCE-PLATFORM-FE && npm run lint && npm run build   # if FE changed
```
Tests for the module must be passing (`/module-test`). If anything is red, stop and fix — don't ship broken.

## 2. Write the module doc
Create `../../docs/modules/<nn>-<module>.md` using the template below. This is a graded deliverable (supervision/verification + handling ambiguity).

```markdown
# Module <nn>: <Module Name>

**Status:** shipped · **Branch:** feature/<nn>-<module> · **Date:** <YYYY-MM-DD>

## What was built
- Backend: <endpoints, schema, guards — with paths>
- Frontend: <screens, sections, components reused — with paths>

## Design
- Source: <Figma frame / derived>. Spec: `.claude/context/<module>-design.md`.
- Theme: confirmed in light **and** dark. New tokens added: <list or none>.

## Decisions on ambiguity
- <decision + reasoning> (e.g. payment = Stripe test mode; image = URL; recommendation = …)

## Agent supervision & verification
- What each agent did and **what I verified** (lint/build output, Swagger check, flow walkthrough).
- **Mistakes the agent made and how I caught/corrected them:** <this is explicitly valued — be specific>

## Tests
- <files> — <what behavior they cover>. Result: <X passed>.

## Data integrity / security notes
- <stock atomicity, server-computed totals, ownership scoping, role gate — as relevant>

## Follow-ups / known gaps
- <anything deferred + what you'd do with more time>
```

## 3. Commit (incremental, conventional)
Ensure on `feature/<nn>-<module>` (branch if not). Stage logically and commit in increments — never one dump:
```bash
git add <related files> && git commit -m "feat(<module>): <part>"
# ... repeat for schema/dto, service/controller, FE section, tests, docs ...
```
Append to each message:
```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

## 4. ASK, then push
> "Module <X> is lint+build green, tested, reviewed, and documented. May I push `feature/<nn>-<module>` to origin?"

Only on a clear **yes**:
```bash
git push -u origin feature/<nn>-<module>
```
(Hooks block `main`/force pushes regardless.) If the user wants a PR, use `gh pr create` with a body summarizing the module doc.

## 5. Update the roadmap & hand off
- In `../../MODULES.md`: set the module `✅ shipped` and record the commit/branch.
- If structural files changed materially, run `/refresh-structure`.
- Offer to start the next module via `/module-build`.
