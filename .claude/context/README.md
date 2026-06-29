# Context (ephemeral)

Per-module working files written during the pipeline and consumed by agents. Overwritten/added per module — not long-term documentation (that lives in `../docs/modules/`).

| File | Written by | Consumed by |
|---|---|---|
| `<module>-design.md` | `@design-figma` (step 1) | `@fe-developer`, `@be-developer` |
| `<module>-review.md` | review agents (step 5) | `@qa-tester`, the module doc |

Safe to delete between modules. Keep the latest module's files until that module ships.
