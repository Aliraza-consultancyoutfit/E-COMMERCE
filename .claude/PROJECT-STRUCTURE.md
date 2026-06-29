# Project Structure (Cached Map)

> **Read this instead of re-scanning the repo.** It is the single source of truth for where things live.
> Regenerate after structural changes with `/refresh-structure`. Last generated for the initial scaffold.

This repo is **two apps in one git repository** (no submodules, single root `.git`):

```
E-Commerce-Platform/
├── .claude/                     # agentic config (this folder)
├── E-COMMERCE-PLATFORM-BE/      # NestJS 11 + Mongoose 8 (MongoDB) API
└── E-COMMERCE-PLATFORM-FE/      # Next.js 15 (App Router) + MUI 6 storefront + admin
```

Each app has its own `package.json` / `node_modules`. **Always `cd` into the app dir before running its commands.**

---

## Backend — `E-COMMERCE-PLATFORM-BE/`

**Stack:** NestJS 11 · Mongoose 8 (MongoDB) · passport-jwt · `@nestjs/swagger` · class-validator/class-transformer · bcrypt.

**Runtime facts (verified in source):**
- Global prefix `api` → all routes are `/api/...` ([main.ts](../E-COMMERCE-PLATFORM-BE/src/main.ts))
- Swagger UI at **`/api/docs`**, bearer auth enabled
- Global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`
- CORS enabled; default port `5000`
- DB via `MongooseModule.forRootAsync` reading `MONGODB_URI`
- **No path aliases configured** — shared libs are imported with relative paths (`../../../libs/shared/src/...`)
- **No test runner installed yet** — `@nestjs/testing` is a devDependency but Jest is not configured (see `/module-test`)

```
src/
├── main.ts                      # bootstrap: prefix, CORS, ValidationPipe, Swagger
├── app/
│   ├── app.module.ts            # ConfigModule(global) + MongooseModule + feature modules
│   └── modules/
│       ├── auth/                # register/login/me — JWT (DONE, extend for roles)
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── auth.module.ts
│       │   ├── guards/jwt-auth.guard.ts
│       │   └── strategies/jwt.strategy.ts
│       ├── users/               # users.service + module
│       └── health/              # health check
└── libs/shared/src/             # shared building blocks (relative-imported)
    ├── schemas/                 # Mongoose @Schema classes  (user.schema.ts → UserRole enum)
    ├── dto/                     # class-validator + Swagger DTOs (auth.dto.ts, user.dto.ts)
    ├── decorators/              # @CurrentUser(), barrel index
    ├── constants/               # models.constants.ts (e.g. USER_MODEL injection tokens)
    └── utils/                   # hash.util.ts (bcrypt)
```

**Conventions already in use:**
- Schemas: `@Schema({ timestamps: true })`, enums exported alongside (e.g. `UserRole { ADMIN, USER }`).
- DI tokens for models live in `constants/models.constants.ts` (string tokens like `USER_MODEL`).
- DTOs carry both `class-validator` decorators **and** `@ApiProperty()/@ApiPropertyOptional()` with `example`.
- Controllers return service results directly (no envelope wrapper today).

**`.env` keys** (`.env.example`): `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`.

**Scripts:** `build` · `start` · `start:dev` (watch) · `start:prod` · `lint` · `format`.

---

## Frontend — `E-COMMERCE-PLATFORM-FE/`

**Stack:** Next.js 15 (App Router, Turbopack) · React 19 · MUI 6 (+ Emotion) · Redux Toolkit + react-redux · react-hook-form + **yup** + `@hookform/resolvers` · ApexCharts (`react-apexcharts`) · `@tanstack/react-table` · framer-motion · js-cookie · jwt-decode · react-hot-toast · nprogress · `@mui/x-date-pickers` · react-dropzone · country-state-city.

**Path alias:** `@/*` → `src/*`.

**Theme is first-class — dark + light both implemented. NEVER hardcode colors.** (See `rules/frontend/mui-theming.md`.)

```
src/
├── app/                         # App Router
│   ├── layout.tsx               # Root: Work_Sans font + <RootLayout>
│   ├── page.tsx  loading.tsx  not-found.tsx  globals.css
│   ├── (admin)/admin/           # admin route group  (layout.tsx + page.tsx)
│   ├── (auth)/auth/             # guest route group  (sign-in/page.tsx)
│   └── (user)/user/             # customer route group (layout.tsx + page.tsx)
├── layouts/                     # root · admin · auth · user  (shell layouts)
├── ui/                          # page-level feature sections, mirrors routes
│   ├── admin/dashboard/         # admin-dashboard.data.ts + index.tsx
│   ├── auth/sign-in/
│   ├── user/dashboard/
│   ├── home/  loading/  not-found/
├── components/                  # SHARED component library — REUSE THESE FIRST
│   ├── react-hook-form/         # ★ form wrappers: form-provider + rhf-text-field,
│   │                            #   rhf-autocomplete, rhf-checkbox, rhf-switch,
│   │                            #   rhf-date-picker, rhf-dropzone, rhf-country/state/city-select
│   ├── table/                   # TanStack table wrapper + use-table.ts + styles
│   ├── chart/                   # ApexCharts wrapper (data/interface/style/index)
│   ├── custom-pagination/       # server-pagination control
│   ├── skeletons/               # skeleton-table / skeleton-form / skeleton-chart
│   ├── chip-status/             # status pill (orders/products)
│   ├── api-error-state/  no-data/  loader/  app-alert/  alert/
│   ├── custom-common-dialog/  alert-common-dialog/  common-dropdown/
│   ├── custom-otp-input/  app-text-field/  custom-label/  tabs/  tabs-switcher/
│   ├── date-range-picker-popup/  notification-menu/
│   └── theme-switch/            # dark/light toggle (drives SettingsConsumer)
├── theme/                       # MUI theme system  — source of all design tokens
│   ├── theme.ts                 # createTheme(config) → base + (dark|light) options
│   ├── colors.ts                # raw color palette
│   ├── base/                    # create-options · create-components · create-typography
│   ├── dark/                    # create-palette · create-components · create-shadows · create-options
│   └── light/                   # create-palette · create-components · create-shadows · create-options
├── providers/                   # theme-provider · settings-provider · client-only
├── consumers/                   # settings-consumer (render-prop for paletteMode + handleUpdate)
├── context/                     # settings-context
├── constants/strings.ts         # PALETTE_MODE, COOKIES_KEYS, DATE_RANGE_INITIAL_VALUE
├── interface/index.ts           # shared TS types (Settings, ThemeConfig, LayoutProps, ...)
├── utils/                       # theme.ts (updateSettings) · px-to-rem · get-font-value · index
└── assets/                      # brand.ts · icons/common/*.tsx (incl. MoonIcon/SunIcon) · images/common/*
```

**Theme tokens available** (declared in [theme.ts](../E-COMMERCE-PLATFORM-FE/src/theme/theme.ts)):
`palette.primary[50..900]`, `palette.common.{white,stroke}`, `palette.darkShades[*]`, `palette.tertiary`,
`palette.extraColorsA/B/C`, `palette.nonPaletteColors`, `palette.gradients.{a..q}`, plus standard MUI roles.
Read current mode with `theme.palette.mode` (`'light' | 'dark'`) and `PALETTE_MODE` from `@/constants/strings`.

**Not built yet (create per module):** a Redux `store/`, an API/services layer (RTK Query base or fetch client + `jwt-decode`/`js-cookie` token handling), route-constants file, and auth guards for `(admin)`/`(user)`/`(auth)` groups. Decide the API layer in the first product module and keep it consistent.

**Scripts:** `dev` (turbopack) · `build` · `start` · `lint`.

---

## Where new code goes (quick reference)

| You are adding… | Backend | Frontend |
|---|---|---|
| A new feature/module | `src/app/modules/<name>/` (controller, service, module) | `ui/<area>/<feature>/` section + `app/(<group>)/.../page.tsx` |
| A DB model | `libs/shared/src/schemas/<name>.schema.ts` + token in `constants/models.constants.ts` | — |
| Validation shape | `libs/shared/src/dto/<name>.dto.ts` | yup schema co-located with the form |
| A reusable UI piece | — | `components/<kebab-name>/` (only if not already there) |
| A data table | — | use `components/table` + `components/custom-pagination` |
| A chart | — | use `components/chart` (ApexCharts) |
| A form | — | `components/react-hook-form/*` wrappers inside `<FormProvider>` |
| Colors / spacing / typography | — | extend `theme/{dark,light}/create-palette.ts` etc. — never inline |
