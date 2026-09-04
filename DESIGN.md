# DESIGN.md — Tripsurance Design System

> Read this before writing Tailwind/FlyonUI classes or building any UI. These rules override AI defaults.
> For architecture, TypeScript, i18n, and git workflow, see [AGENTS.md](AGENTS.md).

Tripsurance sells one thing: **travel insurance**, to two audiences — the **consumer** storefront (marketing → plan selection → purchase) and the internal **admin** dashboard (policies, claims, customers). Both share **one** design system, **one** light theme, and **one** component library (FlyonUI). There is no dark mode and no theme switcher anywhere in this app.

This file follows the [DESIGN.md / getdesign.md](https://getdesign.md/what-is-design-md) convention so any AI coding agent can load it as a standalone design reference.

---

## 1. Visual theme & atmosphere

Travel insurance is a **considered purchase**, not impulse retail — the buyer is often mid-trip-planning, sometimes anxious (medical/cancellation cover). The UI should read as **calm, trustworthy, and clear**, closer to a bank/airline checkout than a gaming or DTC storefront:

- Generous whitespace, restrained motion, high-contrast body text — nothing should make coverage terms or prices harder to scan.
- Marketing pages (home, plan comparison) can be spacious and a little more expressive; the purchase funnel and admin console are **transactional** — minimal motion, clear single primary action per screen.
- **Light only.** No `dark:` variants, no `next-themes`, no `prefersdark` theme, no theme toggle in the UI. `globals.css` defines exactly one FlyonUI theme (`tripsurance`).
- One brand, two densities — consumer and admin pull from the **same** token set below. Admin is denser (tables, forms) and calmer (no marketing motion), never a different palette.

---

## 2. Color palette & roles

All colors are defined once, as FlyonUI theme CSS variables, in [`src/app/globals.css`](src/app/globals.css) (`@plugin "flyonui/theme"`, theme name `tripsurance`). Everywhere else, use the semantic Tailwind/FlyonUI utilities in the right-hand column — never a raw palette class.

### Brand

| Token               | Hex                   | Utility examples                            | Use for                                                                                 |
| ------------------- | --------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------- |
| `primary`           | `#2563EB` (blue-600)  | `btn-primary`, `text-primary`, `bg-primary` | Main CTAs (Buy, Continue, Pay), links, active nav/tab, focus state                      |
| `primary-content`   | `#FFFFFF`             | `text-primary-content`                      | Text/icons on solid `bg-primary`                                                        |
| `secondary`         | `#0891B2` (cyan-600)  | `btn-secondary`, `text-secondary`           | Secondary CTAs, supporting accents (sky/sea = travel)                                   |
| `secondary-content` | `#FFFFFF`             | `text-secondary-content`                    | Text on solid `bg-secondary`                                                            |
| `accent`            | `#F59E0B` (amber-500) | `bg-accent`, `text-accent`                  | Sparingly: "Popular" badge, promo ribbon, highlight chip — never a default button color |
| `accent-content`    | `#0F172A`             | `text-accent-content`                       | Text on solid `bg-accent`                                                               |
| `neutral`           | `#334155` (slate-700) | `bg-neutral`, `text-neutral`                | Dark chrome: footer, admin sidebar accents                                              |
| `neutral-content`   | `#F8FAFC`             | `text-neutral-content`                      | Text on solid `bg-neutral`                                                              |

**Why blue + cyan, not FlyonUI's default purple/pink:** blue reads as safety/trust across the insurance and travel industry, and matches the earlier `travel-insurance/frontend` prototype's brand color. Cyan gives a distinguishable second hue (sky/sea, travel-adjacent) without competing with `primary` the way a second blue would. Amber is kept as a small **accent only** (badges/highlights) — it is intentionally not a button color so it never gets confused with `warning`.

### Surfaces

| Token          | Hex                   | Utility examples    | Use for                                                 |
| -------------- | --------------------- | ------------------- | ------------------------------------------------------- |
| `base-100`     | `#FFFFFF`             | `bg-base-100`       | Page background, card surfaces                          |
| `base-200`     | `#F8FAFC` (slate-50)  | `bg-base-200`       | Alternating section background, admin sidebar           |
| `base-300`     | `#E2E8F0` (slate-200) | `border-base-300`   | Borders, dividers, input borders                        |
| `base-content` | `#1E293B` (slate-800) | `text-base-content` | Body text (use `/70`, `/60` opacity for secondary text) |

### Feedback (policy & claim states)

| Token     | Hex                     | Utility examples                | Use for                                                                          |
| --------- | ----------------------- | ------------------------------- | -------------------------------------------------------------------------------- |
| `info`    | `#0EA5E9` (sky-500)     | `text-info`, `bg-info/10`       | Coverage tooltips, informational banners                                         |
| `success` | `#10B981` (emerald-500) | `text-success`, `bg-success/10` | Active policy, payment succeeded, approved claim                                 |
| `warning` | `#FBBF24` (amber-400)   | `text-warning`, `bg-warning/10` | Policy expiring soon, pending claim, incomplete purchase step                    |
| `error`   | `#EF4444` (red-500)     | `text-error`, `btn-error`       | Expired/cancelled policy, rejected claim, form errors, destructive admin actions |

### Rules

- **Do not** use raw Tailwind palette classes (`bg-blue-600`, `text-gray-500`, `border-blue-300`, `ring-blue-400/50`) anywhere in the app. The earlier `travel-insurance/frontend` draft did this ad hoc (hardcoded logo/border/ring colors) — that is exactly what this file replaces. Every color must resolve through a `tripsurance` theme token.
- Need a lighter tint? Use opacity modifiers on the token (`bg-primary/10`, `border-primary/20`), not a different palette class.
- Don't invent a parallel token system (e.g. a PrimeNG-style `primary/secondary/success/danger/help/info/contrast` set). Map 1:1 onto FlyonUI's 8 existing roles instead — `danger` → `error`, `help` → `info`, `contrast` → `neutral` or `btn-outline`. FlyonUI already generates `btn-primary`, `text-error`, etc. from these roles; a second naming scheme buys nothing and forces hand-written CSS.

---

## 3. Typography rules

- **Font:** IBM Plex Sans Thai (`font-sans`, loaded via `next/font/google` in `src/app/layout.tsx`, weights 100–700). One family covers Thai + Latin — do not add a second display font.
- **Numbers/prices:** `tabular-nums` for premiums, coverage amounts, and dates so digits align in tables and pricing cards.

| Role                 | Classes                                        |
| -------------------- | ---------------------------------------------- |
| Hero H1              | `text-4xl md:text-6xl font-bold leading-tight` |
| Section H2           | `text-3xl md:text-4xl font-semibold`           |
| Card / subsection H3 | `text-xl font-semibold`                        |
| Body                 | `text-base text-base-content leading-relaxed`  |
| Helper / meta        | `text-sm text-base-content/60`                 |
| Price / amount       | `text-2xl font-semibold tabular-nums`          |

**Thai-specific rules:**

- Never use `uppercase` or negative `tracking-*` (letter-spacing) on Thai copy — Thai has no case, and tight tracking clips stacked vowel/tone marks.
- Keep `leading-relaxed` / `leading-loose` on Thai body text — stacked vowels and tone marks need more vertical room than Latin text at the same size.
- `en` and `th` copy must stay the same visual weight/size — never bold one locale to compensate for shorter string length; adjust container width instead.

---

## 4. Component stylings

Use **FlyonUI's native classes directly** (`btn`, `input`, `select`, `card`, `steps`, `table`, `alert`, `badge`, `modal`, `dropdown`, `tooltip`). Do not add shadcn/Radix — FlyonUI already covers every primitive this app needs.

**No hand-written CSS/SCSS** unless the effect is genuinely impossible with Tailwind + FlyonUI utilities (a multi-layer gradient-rim animation, a shimmer keyframe — not "I didn't feel like looking up the FlyonUI class"). Reach for utilities first; a new `@layer components` rule is the rare exception, not the default tool.

### Buttons

| Role             | Class                      | Examples                                                                              |
| ---------------- | -------------------------- | ------------------------------------------------------------------------------------- |
| Primary action   | `btn btn-primary`          | Buy now, Continue, Pay, Submit claim                                                  |
| Secondary / back | `btn btn-outline`          | Back, Change plan, Cancel (non-destructive)                                           |
| Quiet / icon     | `btn btn-ghost btn-square` | Qty stepper, close icon, table row actions                                            |
| Destructive      | `btn btn-error`            | Cancel policy, delete admin record — always behind a confirm step, never a bare click |

Sizes: `btn-sm` (dense admin rows/tables), default (consumer forms), `btn-lg` (primary purchase CTAs, mobile tap targets).

### Forms

- Floating-label inputs: `input-floating` wrapper + `input input-lg` + `input-floating-label` (pattern already proven in the `travel-insurance/frontend` prototype — reuse the shape, not the hardcoded colors).
- Error state: `is-invalid` on the input, message in `text-error text-sm`.
- Selects and date pickers use FlyonUI's native `select` component and `flatpickr` (already a dependency) — do not reach for a headless-UI combobox that styles differently from the rest of the form.

### Cards (plans, policies, quotes)

```html
<div
  class="bg-base-100 border-base-300 rounded-box border shadow-sm transition-shadow duration-300 hover:shadow-lg"
></div>
```

- "Popular"/recommended plan: `ring-2 ring-primary/40` + a badge (`bg-accent text-accent-content`) — replaces the old draft's hardcoded `ring-blue-400/50`.
- Policy/claim status badges: `badge badge-success` / `badge-warning` / `badge-error` / `badge-info` — never a custom colored `<span>`.

### Purchase stepper

Rebuild the old draft's 3-tier stepper (it hand-rolled separate mobile/tablet/desktop components) on top of FlyonUI's `steps` component:

- `lg:` and up — `steps steps-horizontal` across the full flow (Personal info → Travel details → Coverage → Payment).
- `md` — condensed step pills (icon + short label only).
- `<md` — a single "Step X of N" progress bar (`progress`/`progress-primary`) instead of rendering all steps.

### Admin shell

- Sidebar: `bg-base-200 border-r border-base-300`; active nav item `bg-primary/10 text-primary font-medium`.
- Data tables: FlyonUI `table` (`table table-zebra` for long lists), row actions as ghost icon buttons, wrap in `overflow-x-auto` rather than reflowing to cards.
- No marketing motion (Framer/GSAP-style entrance animation) anywhere in `/admin` — dense and fast, not expressive.

### Consumer navigation

Sticky header transitions from transparent-over-hero to a solid bar on scroll (reuse the old draft's scroll-listener pattern), but with tokens instead of literals:

```
bg-base-100/90 backdrop-blur-sm shadow-sm   /* scrolled or menu open */
bg-transparent                              /* top of hero */
```

---

## 5. Layout principles

- **Consumer container:** `max-w-6xl mx-auto px-4 md:px-6` for marketing and purchase pages. Page content clears the fixed navbar with `pt-20 md:pt-24`.
- **Admin shell:** full-bleed (no `max-w` cap) so data tables get the space they need; content padding `p-6`.
- **Section spacing (consumer):** `flex flex-col gap-8 md:gap-12` between marketing blocks (hero → coverage → plans → testimonials → FAQ → CTA), matching the section order already proven in `travel-insurance/frontend`.
- **Hero bleed:** hero background/image may go full-width; hero copy still sits inside the `max-w-6xl` inner column.
- Mobile-first; breakpoints follow Tailwind defaults (`md` 768px, `lg` 1024px, `xl` 1280px) — FlyonUI ships the same scale, don't override it.

### Layout primitives: flex/grid + gap only

Build every layout with `flex` (+ `flex-col`, `grid-cols-*`) and `gap-*` — **never** `space-y-*` / `space-x-*`. One spacing mechanism, everywhere, consumer and admin alike.

Standard gap scale:

| Context                                          | Class          |
| ------------------------------------------------- | -------------- |
| Between marketing/page sections                   | `gap-8 md:gap-12` |
| Between fields in a form / items in a card         | `gap-4`        |
| Tight clusters (icon + label, badge row)           | `gap-2`        |

Default to `flex flex-col gap-*`; switch to a row only where the design calls for it. The standard responsive-stack pattern is `flex flex-col gap-3 sm:flex-row sm:items-center` — mobile stacks vertically, desktop goes horizontal.

### Utility class discipline: omit Tailwind defaults

Don't write a utility class that only restates the Tailwind default — `flex-row` (flex's default direction), `justify-start`, `items-stretch`, `flex-nowrap`. They're noise and hide which classes actually do something.

- **Exception:** once a breakpoint variant changes the value, write the base value explicitly so the rule reads as one pair — `flex-col md:flex-row`, not a bare `md:flex-row` with an implied default underneath.
- This does **not** apply to values that already differ from default — `flex-col`, `grid`, `items-center` etc. are not defaults, so write them whenever used.

---

## 6. Depth & elevation

- **Flat by default:** theme sets `--depth: 0` and `--noise: 0` — no FlyonUI 3D button bevel, no texture. This is a corporate/trustworthy surface, not a playful one.
- **Shadow scale:** `shadow-sm` default card resting state → `shadow-lg` on hover/focus for interactive cards → `shadow-xl` reserved for modals, dropdowns, and popovers only.
- **Radius scale** (set once in the theme, don't override per component):

| Variable            | Value     | Applies to               |
| ------------------- | --------- | ------------------------ |
| `--radius-selector` | `1rem`    | Badges, pills, toggles   |
| `--radius-field`    | `0.5rem`  | Buttons, inputs, selects |
| `--radius-box`      | `0.75rem` | Cards, modals, panels    |

Don't reach for ad hoc `rounded-full` / `rounded-xl` overrides outside this scale, except true pills/avatars.

---

## 7. Do's and don'ts

- **DO** use FlyonUI semantic utilities (`bg-primary`, `text-base-content/70`, `btn-*`, `badge-*`) exclusively for color — never a raw Tailwind palette class.
- **DO** keep the app light-only. No `dark:` variants, no theme switcher UI, no second theme in `globals.css`.
- **DO** reuse the exact same tokens across consumer and admin — one brand, two densities.
- **DO** route every status color (policy, claim, payment) through `success` / `warning` / `error` / `info` — never a one-off color per feature.
- **DO** build layout with `flex`/`grid` + `gap-*` only — never `space-y-*` / `space-x-*`.
- **DO** omit Tailwind utility classes that just restate the default (`flex-row`, `justify-start`, `items-stretch`) unless they're paired with a breakpoint override (`flex-col md:flex-row`).
- **DON'T** add shadcn/Radix components — FlyonUI covers buttons, inputs, selects, modals, dropdowns, steps, tables, alerts, badges, tooltips.
- **DON'T** write custom CSS/SCSS for anything Tailwind + FlyonUI utilities can already do — hand-written CSS is the rare exception (e.g. a gradient-rim animation), not the default tool.
- **DON'T** hardcode palette classes (`bg-blue-600`, `text-gray-400`, `border-blue-300`, `ring-blue-400/50`) — this is the #1 regression risk copied from the old prototype.
- **DON'T** build a second, parallel color-role naming scheme (PrimeNG-style `primary/secondary/success/danger/help/info/contrast`). Map onto FlyonUI's 8 roles instead (see §2).
- **DON'T** add a dark-mode toggle, even for an admin "power user" request — that requires a product decision first, not just an AI default.
- **DON'T** add heavy marketing motion (parallax, staggered reveals) to the purchase funnel or admin — those are transactional surfaces.

---

## 8. Responsive behavior

- Breakpoints: `sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280 (Tailwind/FlyonUI defaults — don't override).
- **Consumer nav:** inline desktop nav → slide-down mobile menu (`menu-button` → `mobile-nav` pattern from the old draft; port the structure, replace literal colors with tokens).
- **Purchase stepper:** see §4 — horizontal steps ≥`lg`, condensed pills on `md`, single progress bar `<md`.
- **Admin sidebar:** collapses to icon-only or an off-canvas drawer `<lg`; tables scroll horizontally in `overflow-x-auto` rather than reflowing into cards.
- **Touch targets:** ≥44px on mobile forms and buttons — use `btn-lg` / `input-lg` on primary purchase-flow controls.

---

## 9. Agent prompt guide

Quick reference when generating UI:

| Say this                 | Not this                                   |
| ------------------------ | ------------------------------------------ |
| `btn btn-primary`        | `bg-blue-600 text-white rounded px-4 py-2` |
| `bg-base-200`            | `bg-gray-50` / `bg-slate-50`               |
| `text-base-content/70`   | `text-gray-500`                            |
| `border-primary/40`      | `border-blue-400/50`                       |
| `badge badge-success`    | a custom green `<span>`                    |
| `ring-2 ring-primary/40` | `ring-2 ring-blue-400/50`                  |
| `flex flex-col gap-4`    | `space-y-4`                                |
| `flex-col md:flex-row`   | bare `flex-row` with no breakpoint pairing |

Example prompts that fit this system:

- "Add a new consumer marketing section: `bg-base-200` alternating background, `btn btn-primary btn-lg` CTA, no dark mode variant."
- "Build an admin policy table row with `btn btn-ghost btn-square` icon actions; wrap delete in the confirm pattern and use `btn-error` only inside that confirm."
- "Add a claim status badge using `badge-warning` for pending and `badge-error` for rejected — don't invent a new color."

This file is the single design source of truth for `tripsurance-fe`. Read it alongside [AGENTS.md](AGENTS.md) before writing any UI code.
