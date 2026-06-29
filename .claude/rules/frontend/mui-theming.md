---
paths:
  - "E-COMMERCE-PLATFORM-FE/**"
---

# MUI Theming — STRICT (light + dark)

The theme system is already built and both modes are first-class. **This is non-negotiable and graded.**

## The one rule
**Never hardcode a color, spacing value, font size, radius, or shadow.** Every visual value comes from the theme. If you type a `#hex`, a raw `px` for spacing, or a `style={{}}` with literal colors, it's wrong.

## How the theme works
- `theme/theme.ts` → `createTheme({ paletteMode })` merges `base/` + (`dark/` or `light/`) options.
- Mode is driven by the settings system: `providers/settings-provider.tsx` → `consumers/settings-consumer.ts`, toggled by `components/theme-switch`. Read mode with `theme.palette.mode` or `PALETTE_MODE` from `@/constants/strings`.
- Per-mode values live in `theme/dark/create-palette.ts` and `theme/light/create-palette.ts`; component overrides in each mode's `create-components.ts`; type scale in `base/create-typography.ts`.

## Available tokens (use these)
- `theme.palette.primary[50..900]`, `secondary`, `error`, `warning`, `success`, `grey`
- `theme.palette.common.white`, `theme.palette.common.stroke`
- `theme.palette.darkShades[*]`, `theme.palette.tertiary`, `theme.palette.extraColorsA/B/C`, `theme.palette.nonPaletteColors`
- `theme.palette.gradients.a … gradients.q`
- `theme.spacing(n)` for spacing, `theme.shape.borderRadius`, `theme.shadows[...]`, typography variants (`variant="h4"` etc.)

## How to apply styles (in order of preference)
1. MUI component props + `sx` referencing the theme:
   ```tsx
   <Box sx={{ bgcolor: 'background.paper', color: 'text.primary', p: 2, borderRadius: 2 }} />
   <Typography variant="h5" color="primary.main" />
   ```
2. `styled()` with the theme callback (see `components/theme-switch` for the real pattern):
   ```tsx
   const Card = styled(Box)(({ theme }) => ({
     backgroundColor: theme.palette.mode === PALETTE_MODE.LIGHT
       ? theme.palette.common.white
       : theme.palette.darkShades.main,
     border: `1px solid ${theme.palette.common.stroke}`,
   }));
   ```
3. Never inline literal colors/spacing in `style={{}}`.

## Adding a new token
If a needed color/shade doesn't exist, add it to **both** `theme/dark/create-palette.ts` **and** `theme/light/create-palette.ts` (and declare it in the `theme.ts` module augmentation if it's a new key). Adding to only one mode is a defect.

## Layout
- Use MUI layout primitives (`Stack`, `Box`, `Grid`) — not raw `<div>` with flexbox.
- Respect the existing breakpoints; design mobile-first; `max-width:100%` on media.

## Definition of done (theming)
Every screen is verified in **both** light and dark (toggle via `theme-switch`): readable contrast, correct surfaces, no invisible text, no hardcoded value. The reviewer greps new files for `#[0-9a-fA-F]{3,6}` and `style={{` — keep them clean.
