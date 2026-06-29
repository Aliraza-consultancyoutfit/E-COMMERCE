---
name: refresh-structure
description: Regenerate the cached PROJECT-STRUCTURE.md from the current repo tree so agents never need to re-scan. Use after structural changes (new modules, new components, new dirs) or when the map looks stale, or "/refresh-structure".
---

# /refresh-structure

Keep `../../PROJECT-STRUCTURE.md` accurate so agents read it instead of scanning the repo.

## Steps
1. Scan both apps, excluding noise:
   ```bash
   cd "d:/ali's/E-Commerce-Platform"
   find E-COMMERCE-PLATFORM-BE/src -type f | sed 's|E-COMMERCE-PLATFORM-BE/||'
   find E-COMMERCE-PLATFORM-FE/src -type f -not -path '*/assets/icons/*' -not -path '*/assets/images/*' | sed 's|E-COMMERCE-PLATFORM-FE/||'
   ```
   (Skip `node_modules`, `.next`, `dist`, `.git`.)
2. Diff against the current `PROJECT-STRUCTURE.md`. Update **only what changed** — preserve the prose explanations, the token list, the "where new code goes" table, and the runtime-facts notes. Don't bloat it with every icon file.
3. If new conventions appeared (a `store/`, a services layer, route constants, a new shared component, a new module), document them in the right section and reflect them in the relevant rule file too.
4. Keep it skimmable: directory tree + short annotations, not a file dump.

## When to run
- After shipping a module that added directories/conventions.
- When an agent reports the map is out of date.
- Before a clean-clone dry run / submission.
