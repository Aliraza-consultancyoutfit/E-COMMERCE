---
paths:
  - "E-COMMERCE-PLATFORM-FE/**"
---

# Forms

Stack: `react-hook-form` + **yup** (`@hookform/resolvers/yup`) + the existing `components/react-hook-form/*` wrappers. **Never use raw MUI inputs inside a form.**

## Pattern
```tsx
const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

const methods = useForm({ resolver: yupResolver(schema), defaultValues });

<FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
  <RhfTextField name="email" label="Email" />
  <RhfTextField name="password" type="password" label="Password" />
  <Button type="submit" disabled={methods.formState.isSubmitting}>Submit</Button>
</FormProvider>
```
Use the project's `FormProvider` wrapper from `components/react-hook-form/form-provider`.

## Available RHF wrappers (reuse — don't rebuild)
`rhf-text-field` · `rhf-autocomplete` · `rhf-checkbox` · `rhf-switch` · `rhf-date-picker` · `rhf-dropzone` (file upload) · `rhf-country-select` · `rhf-state-select` · `rhf-city-select`. If a field type is missing, add a new `rhf-*` wrapper in the same folder following the existing ones.

## Validation
- yup schema mirrors the **backend DTO** rules (same min lengths, ranges, required fields) so client and server agree.
- Show inline field errors (the wrappers do this via `formState.errors`).
- On submit: disable the button while `isSubmitting`; on server validation failure, map returned field errors back with `setError`.
- Reset the form on successful create and on modal close.

## Money & quantity inputs
- Quantity inputs clamp to `1..stock`; price/amount inputs are numeric and non-negative. But remember: **the server re-validates and recomputes** — the client form is convenience, not the gate.
