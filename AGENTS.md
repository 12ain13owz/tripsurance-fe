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
    api/            # not wired up yet — see below
    session/        # not wired up yet — see below
  features/       # Business features. One folder per feature. May import core + shared.
    consumer/       # public storefront: home, plans, purchase flow
    admin/          # not split out yet — see below
  shared/         # Pure building blocks. No feature/business logic.
    i18n/           # next-intl routing, messages
    utils/          # cn(), other framework-agnostic helpers
```

Dependency direction (never break this — identical rule to the backend):

```
app (routes)  ->  features  ->  core / shared
features      ->  shared
```

- `shared/` must not import from `core/` or `features/` — it must stay usable by any feature or by `core/` itself without knowing either exists (e.g. `shared/utils/cn.ts` doesn't know about `plans` or `admin`).
- `core/` must not import from `features/` — infrastructure (env config, the future API client, session storage) is app-wide and must not know about a specific business domain, same as `tripsurance-be`'s `core/config`/`core/error` knowing nothing about its `auth`/`health` features.
- Features must not import from other features. `features/consumer/*` and the future `features/admin/*` are separate audiences (public vs internal staff) — if both need the same logic, lift it into `shared/` (framework-agnostic) or `core/` (infrastructure), never import one feature into another.
- `app/` route files stay thin — import and render a feature view, nothing else. This mirrors the backend's "thin controller" rule, applied to route files instead of controllers: `app/[locale]/page.tsx` renders `HomeView` from `features/consumer`; it does not itself contain markup or business logic.

### Feature folder shape

The only feature built so far, `features/consumer/home/`, is the reference shape:

```
features/<domain>/<feature>/
  index.ts               # barrel — re-exports the public view (see features/consumer/index.ts)
  <feature>-view.tsx      # page orchestration ('use client' only when hooks/browser APIs are needed)
  components/              # presentational, one concern per file
```

Add `hooks/`, `lib/`, `models/` to a feature folder only once it actually calls an API — don't pre-build them empty. Same "skip files you don't need, keep the naming when you do add one" rule as the backend's file-naming convention (`tripsurance-be` `AGENTS.md` §3).

### Not wired up yet — build when a feature actually needs it

Matching the backend's own principle ("don't pre-build speculatively" — see its §1 on i18n): these exist as a **planned shape**, not code to write ahead of demand.

- **`core/api/`** — fetch client. When built, mirror `tripsurance-be`'s response envelope exactly, since that side is already fixed:
  ```ts
  { message: string, timestamp: string, data?: T }
  ```
  Don't invent a different envelope on the frontend. Read `tripsurance-be` `AGENTS.md` §4 first.
- **`core/session/`** — auth/session state for `/admin`. `tripsurance-be` issues a JWT access token (returned in the response body, expected as a `Bearer` header) plus a refresh token in an httpOnly cookie — build the FE session layer around that shape, not a new one. Land this alongside the first real `admin/(auth)/login` implementation (currently a stub).
- **`features/admin/*`** — today `/admin` routes are thin stubs living directly in `app/admin/**/page.tsx`. Once dashboard/policy/claims screens get real logic, extract into `features/admin/<domain>/` mirroring `features/consumer/`'s shape above — don't let business logic accumulate inside `app/admin/`.

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

## Git workflow

- Work **one logical change per commit** — small, reviewable slices; do not batch unrelated changes.
- **Do NOT run `git commit` or `git push`** unless the user explicitly asks.
- When the user wants to commit themselves, provide a suggested commit message (see above) instead of committing.
