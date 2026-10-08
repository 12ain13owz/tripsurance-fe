<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Guidance for AI assistants working in **tripsurance-fe** (consumer + admin Next.js app, travel insurance only). If anything here conflicts with the actual code, the code wins — update this file (and [DESIGN.md](DESIGN.md) for visual changes) in the same change.

## When to read what

| Task                                                    | Read                                                        |
| ------------------------------------------------------- | ----------------------------------------------------------- |
| Any code change                                         | This file (`AGENTS.md`)                                     |
| Where a file/module belongs, core vs features vs shared | Architecture & layering below                               |
| Tailwind/FlyonUI classes, colors, layout, components    | [DESIGN.md](DESIGN.md)                                      |
| BE response shape / auth contract                       | `tripsurance-be` `AGENTS.md` §4 (response & error contract) |
| Commit style / git workflow                             | §§ below                                                    |

## Architecture & layering

Same reasoning as `tripsurance-be`'s `AGENTS.md` §2, applied to a Next.js App Router frontend instead of an Express API.

```
src/
  app/            # Next.js App Router — routes only, thin, no business logic
    [locale]/       # consumer routes (next-intl locale segment: en/th)
    admin/          # admin routes — excluded from locale prefixing (see proxy.ts matcher)
  core/           # Infrastructure, app-wide. Knows nothing about specific features.
    config/         # env loading (NEXT_PUBLIC_API_URL, ...)
    flyonui/        # FlyonUI JS init script
    api/            # fetch client (apiClient, ApiError) — see "API & session contract" below
    session/        # admin session state + auth endpoints — see "API & session contract" below
  features/       # Business features. One folder per feature. May import core + shared.
    consumer/       # public storefront: home, plans, purchase flow
    admin/          # admin screens: auth, shell, dashboard, country, ...
  shared/         # Pure building blocks. No feature/business logic.
    components/     # reusable UI (forms/, ...)
    i18n/           # next-intl routing, messages
    routes/         # route path constants (adminRoutes, ...)
    utils/          # cn(), other framework-agnostic helpers
```

Dependency direction (never break this — identical rule to the backend):

```
app (routes)  ->  features  ->  core / shared
features      ->  shared
```

- `shared/` must not import from `core/` or `features/` — it must stay usable by any feature or by `core/` itself without knowing either exists (e.g. `shared/utils/cn.ts` doesn't know about `plans` or `admin`).
- `core/` must not import from `features/` — infrastructure (env config, the API client, session storage) is app-wide and must not know about a specific business domain, same as `tripsurance-be`'s `core/config`/`core/error` knowing nothing about its `auth`/`health` features.
- Features must not import from other features. `features/consumer/*` and `features/admin/*` are separate audiences (public vs internal staff) — if both need the same logic, lift it into `shared/` (framework-agnostic) or `core/` (infrastructure), never import one feature into another.
- `app/` route files stay thin — import and render a feature view, nothing else. This mirrors the backend's "thin controller" rule, applied to route files instead of controllers: `app/[locale]/page.tsx` renders `HomeView` from `features/consumer`; it does not itself contain markup or business logic.

### Feature folder shape

Reference shape: `features/admin/auth/forgot-password/`.

```
features/<domain>/
  index.ts                     # the domain's only barrel — exports the views that app/ routes render
  <feature>/
    <feature>-view.tsx         # the feature's entry point: composes components, owns data + side effects
    components/                # presentational only, PascalCase file per component (ForgotPasswordForm.tsx)
    lib/                       # <feature>.api.ts (endpoint calls), static data, helpers
    schemas/                   # zod form schemas (<name>-form.schema.ts)
```

Add `lib/`, `schemas/`, `hooks/` only once the feature needs them — don't pre-build them empty. Same "skip files you don't need, keep the naming when you do add one" rule as the backend's file-naming convention (`tripsurance-be` `AGENTS.md` §3).

**View vs components — the view is the only file that talks to the outside world:**

- `<feature>-view.tsx` is the only file in the feature that calls `lib/*.api.ts`, `@/core/api`, or `@/core/session` (`useSession`, `signOut`, ...). It owns loading/error/pending state and passes data down.
- Files in `components/` receive data and callbacks through props only (`onSubmit`, `onToggle`, `onSignOut`, ...). They may import `@/shared/*`, `lib/` static data/helpers, `schemas/`, and **types** from `lib/*.api.ts` — never an API function, `@/core/api`, or `@/core/session`.
- Local UI state (a dropdown open flag, a controlled input before submit) is fine inside a component — the rule is about network calls and session, not about being stateless.

Reason: one file per feature holds every side effect, so data flow is readable top-down and components stay reusable and testable with plain props — the same split as `tripsurance-be`'s controller (I/O) vs service.

### Barrel exports (index.ts)

Mirrors `tripsurance-be`'s `AGENTS.md` §3 file-naming table (`Barrel | index.ts | re-exports the public surface`), adapted for this frontend's folder shapes.

- Only two kinds of folder get an `index.ts`: folders under `shared/` and `core/` (imported by features), and `features/<domain>/` (imported by `app/` routes). Add it from the moment the folder is created — don't wait until it "grows". Same as `tripsurance-be`'s `shared/utils/`, `core/mailer/templates/`, `features/docs/`, which barrel a single file each from day one.
- **Folders inside a feature never get a barrel** (`<feature>/`, `components/`, `lib/`, `schemas/`). Their only consumer is the feature's own view, which imports files directly (`./components/ForgotPasswordForm`, `./lib/forgot-password.api`). ESLint's `no-restricted-imports` (`@/features/*/*`) already blocks anything outside the feature from reaching in, so a barrel there would have no consumer.
- **Single level only, never nested.** A folder's `index.ts` re-exports the files that live directly inside it — it never re-exports another folder's `index.ts`. Don't chain barrels (e.g. a `shared/components/index.ts` re-exporting `shared/components/forms/index.ts`); import straight from the folder that actually holds the files (`@/shared/components/forms`, not `@/shared/components`). Same shape as `kixly-deck-admin`'s `shared/components/forms/index.ts`, `shared/components/ui/index.ts`, `shared/components/icons/index.ts` — each a flat, standalone entry point, no parent aggregator over them.
- `shared/` and `core/` folders barrel **everything** in the folder (`export * from './x'` for every file) — the whole folder is public surface, same as `tripsurance-be`'s `shared/utils/index.ts`.
- `features/<domain>/index.ts` stays **selective** — export only the views that routes render (e.g. `export { CountryView } from './country/country-view'`), same as `tripsurance-be`'s `features/auth/index.ts` exporting just the router, never the service/schema/type files. It points at view files directly, never at another `index.ts`.
- Exception: a file referenced by external tooling as a literal disk path rather than a JS import (e.g. `shared/i18n/request.ts`, passed as a string to the `next-intl` Next.js plugin config) is left out of any barrel — that's forced by the framework, not a style choice.

### API & session contract

- **`core/api/`** — `apiClient` mirrors `tripsurance-be`'s response envelope exactly; don't invent a different one on the frontend. Read `tripsurance-be` `AGENTS.md` §4 before changing it.
  ```ts
  { message: string, timestamp: string, data?: T }
  ```
- **`core/session/`** — admin session state (`useSession`) and auth endpoints, built around `tripsurance-be`'s shape: a JWT access token returned in the response body and sent as a `Bearer` header, plus a refresh token in an httpOnly cookie. Don't introduce a second token model.
- Feature-specific endpoints live in that feature's `lib/<feature>.api.ts` and go through `apiClient` — never call `fetch` directly from a feature.

### API payload boundaries

When calling a `core/api`/`core/session` function with data that comes from component/form state, always construct the payload as a fresh object literal naming only the fields the endpoint needs — never forward the form-state object straight through, even when the shapes currently match field-for-field.

```ts
// Do
const data = await signIn({ email: value.email, password: value.password })

// Don't
const data = await signIn(value)
```

Reason: TypeScript's excess-property check only fires on object literals, not on variables — passing a form-state variable through type-checks fine even after the form gains a UI-only field (e.g. `rememberMe`), and that field will silently leak into the real HTTP request body via `JSON.stringify`. Building the payload as its own literal is what actually prevents this, not the type annotation on the function signature.

## Design & styling

- Read [DESIGN.md](DESIGN.md) before writing any Tailwind or FlyonUI classes — it is the single source of truth for colors, typography, components, and layout.
- Stack: **Tailwind CSS v4 + FlyonUI** only (no shadcn/Radix). One light theme (`tripsurance`, defined in `src/app/globals.css`) shared by consumer and admin — **no dark mode, no theme switcher**.
- Never hardcode a raw Tailwind palette class (`bg-blue-600`, `text-gray-500`) — always use the semantic FlyonUI tokens documented in DESIGN.md (`btn-primary`, `bg-base-200`, `text-base-content/70`, …).

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/) with a bullet-list body — same convention as `tripsurance-be`.

**Title** (≤72 chars, imperative, English):

```
<type>(<scope>): <summary>
```

| Type       | Use for                         |
| ---------- | ------------------------------- |
| `feat`     | New user-facing behavior        |
| `fix`      | Bug fix                         |
| `refactor` | Code change, no behavior change |
| `test`     | Tests only                      |
| `chore`    | Tooling, deps, config           |
| `docs`     | Documentation only              |

**Scope:** feature or area — `ui`, `i18n`, `consumer`, `admin`, `config`, `shared`, `core`, `docker`, `tooling`, …

**Body:** bullet list (`-`), one meaningful change per line. Focus on _why_ and impact, not every file touched. Omit body for trivial one-line fixes.

```
feat(i18n): configure next-intl routing and locale middleware

- Add locale routing config and message catalogs under src/shared/i18n
- Wire next-intl's Next.js plugin into next.config.ts
- Add proxy.ts (locale-detection middleware), excluding /admin from locale prefixing
```

**Do:** match existing repo style; group related changes in one commit; write title as a command ("add", "fix", "remove").

**Don't:** paste full diffs; list every renamed method; use past tense ("added", "fixed"); commit secrets (`.env`, credentials).

## Change approval

- Before editing any code, list the specific changes you plan to make and wait for explicit go-ahead — don't start editing on your own initiative just because a request implies a code change.
- Exception: if the user's message already gives the go-ahead ("confirm, go ahead", "fix it", "implement this"), proceed without a separate list-first round.
- **"draft code" means reply with the proposed code as text/code blocks in the conversation only — never call Edit/Write on the file.** The user reviews the draft, decides what to keep, and applies it themselves. Reason: once a change is actually written to disk, review narrows to one file's diff at a time and loses sight of the full set of proposed changes across files — seeing everything up front in chat makes it easier to decide what to change before anything is written for real.
- **"commit message" means reply with the title + body text only (Commit messages format above) — never run `git add`/`git commit` for it.** The user stages and commits it themselves after reviewing both the code and the message together.
- This covers all code changes, not just git actions — see Git workflow below for commit/push-specific rules.
- **If not explicitly asked for, don't do it — ask first, every time.** This includes actions taken only to "verify" or "try out" an idea (running a script, renaming/moving/deleting a file to simulate some condition, installing something) — not just feature edits. A question ("how do I get X working?") is a request for an answer, not a request to go implement or experiment with X.
- Never rename, move, or delete a file — even "temporarily," even inside a cleanup/`finally` step — unless the user asked for that specific file to be touched. This already happened once in `tripsurance-be`: a local CI-simulation experiment nobody asked for deleted `.env.prod`, an untracked file with real production secrets that couldn't be recovered. Verify behavior by reading/inspecting or working in a disposable scratch copy, never by modifying real project files and "restoring" them after.

## Git workflow

- Work **one logical change per commit** — small, reviewable slices; do not batch unrelated changes.
- **Do NOT run `git commit` or `git push`** unless the user explicitly asks.
- When the user wants to commit themselves, provide a suggested commit message (see above) instead of committing.
