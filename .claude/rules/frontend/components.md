---
paths:
  - "E-COMMERCE-PLATFORM-FE/**"
---

# Shared Components — reuse first

There is a real, reusable library in `components/`. **Check it before building any UI.** Re-implementing something that already exists is a review finding.

## Inventory (what exists today)
| Need | Use |
|---|---|
| Form fields | `react-hook-form/` → `form-provider`, `rhf-text-field`, `rhf-autocomplete`, `rhf-checkbox`, `rhf-switch`, `rhf-date-picker`, `rhf-dropzone`, `rhf-country/state/city-select` |
| Data table | `table` (+ `use-table.ts`) |
| Pagination | `custom-pagination` |
| Charts | `chart` (ApexCharts; `chart.data.ts` config) |
| Loading | `skeletons` → `skeleton-table`, `skeleton-form`, `skeleton-chart`; `loader` |
| Empty state | `no-data` |
| Error state | `api-error-state` |
| Status pill | `chip-status` (order/product status) |
| Dialogs | `custom-common-dialog`, `alert-common-dialog` |
| Alerts/toasts | `app-alert`, `alert` (+ `react-hot-toast`) |
| Dropdown menu | `common-dropdown` |
| Tabs | `tabs`, `tabs-switcher` |
| OTP input | `custom-otp-input` |
| Date range | `date-range-picker-popup` |
| Notifications | `notification-menu` |
| Theme toggle | `theme-switch` |
| Label | `custom-label` |
| Text field (non-RHF) | `app-text-field` |

## Adding a new shared component (only when nothing fits)
- Folder `components/<kebab-name>/` with `index.tsx`, `<name>.interface.ts` (props type, exported), optional `use-<name>.ts` and `<name>.style.ts`.
- Themed strictly (see `mui-theming.md`) and accessible.
- Export it from `components/index.ts` (keep the barrel updated).
- Generic and reusable — feature-specific composition belongs in `ui/`, not `components/`.

## Quality bar
- Props typed in the sibling interface file; no `any`.
- Works in light **and** dark.
- No business/data logic inside a presentational component — pass data in via props.
