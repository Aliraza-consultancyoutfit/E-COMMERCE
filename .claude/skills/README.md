# Skills (slash commands)

Invoke with `/<name>`. These encode the module-by-module workflow so it runs the same way every time.

| Command | Purpose |
|---|---|
| `/module-build <module>` | **The headline workflow.** Runs all 8 steps for one module: design → backend → frontend → integrate → review → test → document → ship. |
| `/design-sync <module>` | Step 1 only — produce the design spec (`@design-figma`). |
| `/be-endpoint <feature>` | Scaffold a NestJS/Mongoose feature (schema → DTO → service → controller → Swagger). |
| `/fe-page <feature>` | Scaffold a themed page + section reusing shared components + the data layer. |
| `/module-test <module>` | Write + run meaningful tests; sets up the test runner the first time. |
| `/module-ship <module>` | Lint+build gate → write module doc → **ask permission** → commit + push → update roadmap. |
| `/refresh-structure` | Regenerate `PROJECT-STRUCTURE.md` after structural changes. |

Typical session: `/module-build` (it chains the rest). Use the granular skills when you only need one step.
