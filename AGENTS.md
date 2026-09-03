<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Guidance for AI assistants working in **tripsurance-fe** (consumer + admin Next.js app, travel insurance only). If anything here conflicts with the actual code, the code wins — update this file (and [DESIGN.md](DESIGN.md) for visual changes) in the same change.

## When to read what

| Task                                                 | Read                    |
| ---------------------------------------------------- | ----------------------- |
| Any code change                                      | This file (`AGENTS.md`) |
| Tailwind/FlyonUI classes, colors, layout, components | [DESIGN.md](DESIGN.md)  |
| Commit style / git workflow                          | §§ below                |

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
