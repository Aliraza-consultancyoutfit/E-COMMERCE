# Module 1 — Auth

**Branch:** `feature/01-auth` (stacked on `feature/00-foundation`)
**Design source:** `Authentication.dc.html`
**Status:** built + verified, awaiting ship approval

## What was built

### Backend
- Added optional **`name`** to the `User` schema + `RegisterDto`/`CreateUserDto` so sign-up captures the full name. Flows through the existing `register` path (no service change — `register` already spreads the DTO). Login/`me` unchanged; role is already in the JWT.

### Frontend
- **Split auth shell** (`layouts/auth`) — gradient brand panel (`ui/auth/auth-brand-panel`, hidden below `md`) + centered form panel. Gradient/overlays derived from theme tokens via `alpha()`; no raw hex.
- **Sign In** (`ui/auth/sign-in`) — email + password (show/hide) + remember, RHF + yup, `useLoginMutation`.
- **Sign Up** (`ui/auth/sign-up`, route `/auth/sign-up`) — name/email/password/confirm/terms with a live password-rules checklist and match validation, `useRegisterMutation`.
- Both use the shared **`usePostAuth`** hook: persist token (cookie) → seed auth slice → success toast → redirect by role (`REDIRECTS.afterLogin`). Server errors are mapped onto fields (`setError`) and toasted.
- New shared **`RHFPasswordField`** wrapper (eye toggle) and **Star/Shield** icons (added to the icon barrel).
- **`GuestGuard`** wraps the `(auth)` route group — signed-in users are bounced to their role home.

## Decisions (also in NOTES.md)
- **Social login (Google/Apple), Forgot/Reset/Verify-email/OTP screens** shown in the design are **out of scope** — they need OAuth/email-delivery backends the assessment doesn't cover. Built the functional email/password core instead (coherent over complete). The brand panel keeps the social-proof visual.
- **`name` is a single field** now; the account module (6) can split first/last for the profile screen.
- **Remember-me** checkbox is retained from the design; the cookie TTL is the source of truth (currently 1 day) — left cosmetic to avoid scope creep.
- **Pre-existing note:** `POST /auth/login` returns `201` (Nest default for POST). Semantically `200`; left unchanged (auth controller predates this module) — candidate for the polish pass.

## Verification
- BE `lint` + `build` ✓.
- FE `lint` + `build` ✓ (`/auth/sign-in`, `/auth/sign-up` compiled).
- Live API (local Mongo):
  - `register` with `name` → JWT + user (`role:"user"`) ✓
  - duplicate email path / login of the new user ✓
  - invalid input → `400` with field message array (→ `getApiErrorMessage` shows the first) ✓
  - seeded admin/customer still log in ✓

## Tests
Deferred with the rest until the runner lands in Module 2; verified via build + live API checks here.
