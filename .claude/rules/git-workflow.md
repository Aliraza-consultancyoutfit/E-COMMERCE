---
alwaysApply: true
---

# Git Workflow

The git history is part of what's reviewed. Make it tell the story of the build.

## Branching
- One feature branch per module: `feature/<nn>-<module>` (e.g. `feature/02-product-catalog`). Branch off `main`.
- Never commit directly to `main`. Never force-push. (Hooks enforce both.)

## Commits — small, logical, conventional
- Format: `type(scope): summary` → `feat(catalog): product list with search, filter, sort, pagination`.
- Types: `feat` · `fix` · `refactor` · `test` · `docs` · `chore`.
- Commit **as you go**, in increments that each make sense on their own (schema+dto, then service+controller, then FE section, then tests, then docs). **Never** end with a single "final commit" dump.
- Reference the module in the scope so history maps to `MODULES.md`.

## Pushing — only with permission
- `git push` happens **only at the ship step and only after the user approves** (see `/module-ship`). The dev/review agents never push.
- Append to commit messages:
  ```
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  ```

## Before any commit
- The module's app must be lint-clean and build-green (`npm run lint && npm run build` in the changed app(s)).
- Don't stage `.env`, `node_modules`, `.next`, `dist`, or lock-file churn unrelated to the change.

## Per-module ship sequence
1. `git checkout -b feature/<nn>-<module>` (if not already on it)
2. stage + incremental commits
3. write `docs/modules/<nn>-<module>.md`
4. **ask the user** → on approval, `git push -u origin feature/<nn>-<module>`
5. update `MODULES.md` (status + commit), then start the next module.
