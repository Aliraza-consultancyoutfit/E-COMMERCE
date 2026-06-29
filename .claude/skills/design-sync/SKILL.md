---
name: design-sync
description: Produce the design spec for a module (step 1 of the module pipeline) by pulling from Figma or deriving an original design, mapped to the project's theme tokens and shared components. Use when the user says "design the <X>", "/design-sync <X>", or "pull the Figma for <X>".
---

# /design-sync <module>

Delegate to **`@design-figma`** to produce `../../context/<module>-design.md`. This is step 1 of `/module-build`; run it standalone when you only need the design.

## Steps
1. Read the module scope from `../../MODULES.md` and the existing design language: `E-COMMERCE-PLATFORM-FE/src/theme/`, `src/components/`, `src/layouts/`, `src/ui/`.
2. **Figma access:** check `../../settings.local.json` for `FIGMA_TOKEN` + a file/frame URL. If present, fetch frames via the Figma REST API (`https://api.figma.com/v1/files/<key>`, header `X-Figma-Token`) using `WebFetch`/`Bash`, or the `DesignSync` tool (load via ToolSearch). If absent, ask the user for the frame link — or derive an original design and note that it was generated (for NOTES.md "design workflow").
3. Produce the spec with the sections required in `agents/design-figma.md`: screens & layout, component plan (reuse-first), **theme mapping (tokens only, both modes)**, states (loading/empty/error/success), responsive, accessibility, and an explicit light+dark check.

## Output
`../../context/<module>-design.md` — the contract `@fe-developer` builds against.

## Guardrails
- Tokens only, never hardcoded values. New tokens specified for **both** dark and light palettes.
- Reuse shared components; justify anything new.
- Keep the look consistent with already-built screens — one coherent product.
