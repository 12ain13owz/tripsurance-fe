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
| `accent`            | `#F59E0B` (amber-500) | `bg-accent`, `text-accent`                  | Sparingly: "Recommended" badge, promo ribbon, highlight chip — never a button color     |
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
- Need a lighter tint on a background/border/icon? Use opacity modifiers on the token (`bg-primary/10`, `border-primary/20`), not a different palette class.
- For body-text ink hierarchy (title vs. subtitle vs. helper text), don't reach for raw `text-base-content/NN` opacity — use the semantic text utilities in §3 (`text-subtle`, `text-muted`, `text-disabled`) instead, so the same three levels stay consistent everywhere instead of each component picking its own fraction. Raw opacity on `text-base-content` is still fine for transient/decorative states that aren't part of the static content hierarchy — e.g. `hover:text-base-content/70`.
- Don't invent a parallel token system (e.g. a PrimeNG-style `primary/secondary/success/danger/help/info/contrast` set). Map 1:1 onto FlyonUI's 8 existing roles instead — `danger` → `error`, `help` → `info`, `contrast` → `neutral` or `btn-outline`. FlyonUI already generates `btn-primary`, `text-error`, etc. from these roles; a second naming scheme buys nothing and forces hand-written CSS.

---

## 3. Typography rules

- **Font:** IBM Plex Sans Thai (`font-sans`, loaded via `next/font/google` in `src/core/layout/BaseLayout.tsx`, which both root layouts render; weights 100–700). One family covers Thai + Latin — do not add a second display font.
- **Numbers/prices:** `tabular-nums` for premiums, coverage amounts, and dates so digits align in tables and pricing cards.

| Role                   | Classes                                        |
| ---------------------- | ---------------------------------------------- |
| Hero H1                | `text-4xl md:text-6xl font-bold leading-tight` |
| Section H2             | `text-3xl md:text-4xl font-semibold`           |
| Card / subsection H3   | `text-xl font-semibold`                        |
| Body                   | `text-base text-base-content leading-relaxed`  |
| Subtitle / nav item    | `text-subtle`                                  |
| Helper / meta          | `text-sm text-muted`                           |
| Disabled / placeholder | `text-disabled`                                |
| Price / amount         | `text-2xl font-semibold tabular-nums`          |

**Text ink hierarchy — `text-subtle` / `text-muted` / `text-disabled`:** three semantic utilities defined in `globals.css` (`@utility`, each a `color-mix()` of `--color-base-content` at 70% / 60% / 40%). They replace ad hoc `text-base-content/70`, `/60`, `/40` for anything that's a static part of the content hierarchy (title vs. subtitle vs. helper vs. disabled text) — same visual result, but the name tells you which level to reach for instead of having to remember a fraction, and every use stays in sync since all three still derive from the one `base-content` token. Full-strength title/body text stays plain `text-base-content` (no utility needed). Don't use these for interactive/decorative states like `hover:` or `focus:` tints — raw opacity is still correct there (see §2 Rules).

**Thai-specific rules:**

- Never use `uppercase` or negative `tracking-*` (letter-spacing) on Thai copy — Thai has no case, and tight tracking clips stacked vowel/tone marks.
- Keep `leading-relaxed` / `leading-loose` on Thai body text — stacked vowels and tone marks need more vertical room than Latin text at the same size.
- `en` and `th` copy must stay the same visual weight/size — never bold one locale to compensate for shorter string length; adjust container width instead.

---

## 4. Component stylings

Use **FlyonUI's native classes directly** (`btn`, `input`, `select`, `card`, `steps`, `table`, `alert`, `badge`, `modal`, `dropdown`, `tooltip`). Do not add shadcn/Radix — FlyonUI already covers every primitive this app needs.

**No hand-written CSS/SCSS** unless the effect is genuinely impossible with Tailwind + FlyonUI utilities (a multi-layer gradient-rim animation, a shimmer keyframe — not "I didn't feel like looking up the FlyonUI class"). Reach for utilities first; a new `@layer components` rule is the rare exception, not the default tool.

### Buttons

| Role             | Class                     | Examples                                                                              |
| ---------------- | ------------------------- | ------------------------------------------------------------------------------------- |
| Primary action   | `btn btn-primary`         | Buy now, Continue, Pay, Submit claim                                                  |
| Secondary / back | `btn btn-outline`         | Back, Change plan, Cancel (non-destructive)                                           |
| Quiet / icon     | `btn btn-text btn-square` | Shell chrome (menu, account), pagination, qty stepper                                 |
| Destructive      | `btn btn-error`           | Cancel policy, delete admin record — always behind a confirm step, never a bare click |

Sizes: `btn-sm` (dense admin rows/tables), default (consumer forms), `btn-lg` (primary purchase CTAs, mobile tap targets).

**Icon-only buttons** put a lucide icon (`size-4` in `btn-sm`) inside a FlyonUI button; the icon takes the button's color through `currentColor`, so never color the icon itself. Always give an `aria-label` that names the action and the row (`Edit baggage-plus`). FlyonUI has no `btn-ghost` — the quiet variant is `btn-text`.

| Icon button (admin) | Class                                           |
| ------------------- | ----------------------------------------------- |
| Row action (edit)   | `btn btn-soft btn-primary btn-square btn-sm`    |
| Drag handle         | `btn btn-outline btn-primary btn-square btn-sm` |
| Modal close         | `btn btn-primary btn-square btn-sm`             |

### Forms

- Floating-label inputs: `input-floating` wrapper + `input input-lg` + `input-floating-label` (pattern already proven in the `travel-insurance/frontend` prototype — reuse the shape, not the hardcoded colors).
- Error state: `is-invalid` on the input, message in `text-error text-sm`.
- Selects and date pickers use FlyonUI's native `select` component and `flatpickr` (already a dependency) — do not reach for a headless-UI combobox that styles differently from the rest of the form.

### Feedback: toast vs inline alert

- **Toast** — Notyf (FlyonUI's toast plugin), via `notify` from `@/core/notify`. Colors come from the theme (`--color-success` / `--color-error`). Success stays 3s; error stays 6s and is dismissible. Use for results the user doesn't need to act on in place: a background action failed, a sign-in succeeded.
- **Inline alert** — `alert alert-error text-sm` under the form or in place of the content. Use when the user must read the error to fix it (form submits) or the page has nothing else to show (initial load failed). A toast disappears; these errors must not.
- Never show both for the same error.
- Don't use FlyonUI's `icon-[tabler--…]` Notyf examples — the project uses lucide and has no iconify plugin; Notyf's built-in icons are used instead.

### Cards (plans, policies, quotes)

```html
<div
  class="bg-base-100 border-base-300 rounded-box border shadow-sm transition-shadow duration-300 hover:shadow-lg"
></div>
```

- Recommended plan (`isFeatured`): `ring-2 ring-primary/40` + a badge (`bg-accent text-accent-content`) labelled "Recommended" / "แนะนำ" — never "Popular" / "ยอดนิยม": it is an admin's merchandising choice, not sales data (BE `plan.md` rule 22). Replaces the old draft's hardcoded `ring-blue-400/50`.
- Policy/claim status badges: `badge badge-success` / `badge-warning` / `badge-error` / `badge-info` — never a custom colored `<span>`.

#### Plan cards (consumer plan listing)

Reference: `plans-mock.html` (v3) in the workspace root.

`/plans` is an **overview to compare plans, not a shop**: nothing is selected or bought there. Every card leads into the purchase funnel at `/order` (§4 Purchase stepper), which asks for the trip first and only then offers the plans that fit it, at the trip's real price.

- **One tone for every plan:** `primary`. Plans are told apart by name, price and coverage — not by a per-plan color. The recommended plan differs only by the ring + badge above.
- **Equal height, aligned sections:** the grid (`grid gap-6 md:grid-cols-2 lg:grid-cols-3`) gives each card `grid grid-rows-subgrid row-span-6`, so the same section starts at the same height on every card in a row, whatever its content.
- **Six sections, in this order**, separated by `border-t border-base-300`:
  1. Header band — `bg-linear-to-br from-primary to-primary/80 text-primary-content`: icon chip, plan name (H3), one-line description.
  2. Price — "from ฿X / person" (`text-2xl font-semibold tabular-nums text-primary`); just "฿X / person" when the plan has a single tier. Below it: the "incl. stamp duty & VAT" note (`text-sm text-muted`) and a pill with the tier count + max trip length. This is the **starting** price (cheapest tier) so plans can be compared at a glance; the price for a real trip only ever comes from the BE quote inside `/order`.
  3. Coverage — **all 10 categories** in `planCoverageCategories` order on every card, so rows line up across cards. A category the plan doesn't cover stays in the list as "Not covered" in `text-disabled`, never hidden.
  4. Countries — count + the first 3 names (sorted by localized name) + "and N more".
  5. Add-ons — `bg-primary/10 text-primary` pills, or a muted "no add-ons" line.
  6. Actions — pinned to the bottom (`self-end`), **one button only**: `btn btn-primary` "Check your premium" / "เช็กราคาเบี้ยประกัน", a link to `/order?plan=<code>` (the funnel pre-selects that plan if it fits the trip). Above it, a quiet `btn btn-text` link "Price table & all countries" opens the details modal (tier table, add-on prices, full country list). Never two equal-weight buttons, and no disabled "coming soon" button.
- Copy comes from i18n keyed by `code`; a code without copy shows the code itself (`t.has`), never a raw message key.
- Prices never animate (§4 Motion). The card surface is a `SpotlightCard`.

### Loading states

| What is loading                     | Show                                                                                     |
| ----------------------------------- | ---------------------------------------------------------------------------------------- |
| A page's / section's content        | `Skeleton` (`@/shared/components/ui`) shaped like the real layout (same grid, same rows) |
| An action the user started (submit) | `loading loading-spinner loading-sm` inside the button, button disabled                  |
| The admin session check on boot     | `SplashScreen`                                                                           |

- A feature-shaped skeleton (e.g. a plan card) lives in that feature and is built from the shared `Skeleton` primitive; don't put feature-shaped skeletons in `shared/`.
- Keep the page chrome (header, page heading) real and only skeleton the part that waits for data, so the layout doesn't jump when it arrives.
- Never skeleton a price with a fake number — use a plain bar.

### Disclosure (FAQ, "more info")

- Use native `<details>` / `<summary>` — keyboard and screen-reader support for free, works without JS, and the content stays in the server HTML for SEO.
- Style with Tailwind utilities only: `group` on `<details>`, hide the default marker on `<summary>` (`list-none [&::-webkit-details-marker]:hidden`), rotate the chevron with `group-open:rotate-180` — no JS state. Reference: home `FaqSection`.

### Purchase stepper

The purchase funnel lives at `/order` (one name across route, `features/consumer/order/` and the BE `Order`). It starts from the trip, the way insurers' "check your premium" flows do (reference: MSIG Travel Easy):

1. **Trip** — destination + departure/return dates.
2. **Plan** — only the plans that cover that destination and trip length, each with the trip's real price from the BE quote; a `?plan=<code>` from `/plans` is pre-selected when it fits.
3. **Travellers** — traveller details + add-ons.
4. **Payment** — Stripe Checkout.

The chosen plan is one field of the order the FE submits (`planCode`, trip, travellers, `addonCodes`); the FE never sends a price — the BE quotes and snapshots it. Funnel pages are `noindex`, have no marketing motion (§4 Motion) and one primary action per step. Every "check your premium" entry point (home hero, header, home CTA, plan cards) links here.

Rebuild the old draft's 3-tier stepper (it hand-rolled separate mobile/tablet/desktop components) on top of FlyonUI's `steps` component:

- `lg:` and up — `steps steps-horizontal` across the full flow (Trip → Plan → Travellers → Payment).
- `md` — condensed step pills (icon + short label only).
- `<md` — a single "Step X of N" progress bar (`progress`/`progress-primary`) instead of rendering all steps.

### Admin shell

- Sidebar: `bg-base-200 border-r border-base-300`; active nav item `bg-primary/10 text-primary font-medium`.
- No marketing motion (Framer/GSAP-style entrance animation) anywhere in `/admin` — dense and fast, not expressive.

### Admin data lists (table ≥ `md`, cards < `md`)

Every admin list — countries, add-ons, plans, … — renders through one shared data-table component, so layout, empty state, reordering and pagination look the same everywhere. Features describe their columns once; they never write their own `<table>` or card markup.

- **`md` and up — table:** FlyonUI `table` (`table-striped table table-fixed`), helper/empty text `text-muted text-sm`, numbers `text-end tabular-nums`, row actions as icon buttons in the last column.
- **Below `md` — cards:** one card per row (`border-base-300 rounded-box border`), title field at the top, actions top-right, the remaining fields as label/value pairs. Don't fall back to a horizontally scrolling table on mobile: a 6–7 column admin table is unreadable at phone width, and dragging inside a sideways-scrolling table is unusable.
- **Reordering is per list, opt-in.** Lists ordered by the admin (`sortOrder`: add-ons, plans) get a drag handle as the first column/card element; lists with a natural order (countries, by name) don't. Only the handle starts a drag, so row text stays selectable for copying. While the list is filtered — or a reorder/toggle is still saving — the handle is disabled with a hint, because a reorder must send every row.
- **Pagination is per list, opt-in, and never combined with reordering.** Long reference lists (countries) paginate with the shared `Pagination` plus a `Showing X–Y of N` line; reorderable lists show every row on one page, since a row can't be dragged across pages and the reorder request needs the full list.

### Consumer navigation

The header is `fixed` (`h-16`, over the page). It is transparent only on the **home page, at the top, with the mobile menu closed** — sitting over the dark hero photo; everywhere else it is a solid bar. framer-motion's `useScroll` drives the switch, with tokens instead of literals:

```
bg-base-100/90 text-base-content backdrop-blur-sm shadow-sm   /* default: other pages, scrolled, or menu open */
bg-transparent text-neutral-content                           /* home, top of hero */
```

Because the header is fixed, every page except home clears it with `pt-20 md:pt-24` (§5); the home hero runs full-bleed underneath it instead.

### Motion

Animation library: **framer-motion**, through the primitives in `@/shared/components/motions` —
reach for those before writing a one-off `motion.*` element.

| Primitive        | Use for                                                                  |
| ---------------- | ------------------------------------------------------------------------ |
| `MotionProvider` | Wraps the consumer layout once (`reducedMotion="user"`)                  |
| `TextReveal`     | Hero / page headings: word-by-word blur-in                               |
| `FadeIn`         | Marketing sections: fade up once when scrolled into view                 |
| `SpotlightCard`  | Interactive cards (plans): pointer-following glow from `--color-primary` |

- **Where:** consumer marketing pages only (home, plan listing). No motion in `/admin` or the
  purchase funnel beyond FlyonUI's own transitions (§1).
- **What never moves:** prices and coverage amounts — no count-up, no number animation.
- **Reduced motion:** `MotionProvider` sets `reducedMotion="user"`; don't add per-component checks.
- **Thai text:** split text by word with `Intl.Segmenter`, never by character — character splits
  tear vowels and tone marks off their consonant.
- **One easing:** `EASE_OUT` for entrances; durations 0.3–0.7s.

---

## 5. Layout principles

- **Consumer container:** `max-w-6xl mx-auto px-4 md:px-6` for marketing and purchase pages. Page content clears the fixed navbar with `pt-20 md:pt-24`.
- **Admin shell:** full-bleed (no `max-w` cap) so data tables get the space they need; content padding `p-6`.
- **Section spacing (consumer):** marketing pages are a stack of full-width `<section>` bands, each with its own `py-16 md:py-24` and alternating `bg-base-200` / plain background; inside a band, the `max-w-6xl` column spaces its blocks with `flex flex-col gap-8 md:gap-12`. Home order: hero → why → coverage → steps → FAQ → CTA. No testimonials, stats or other claims that aren't real data.
- **Hero bleed:** hero background/image may go full-width; hero copy still sits inside the `max-w-6xl` inner column.
- Mobile-first; breakpoints follow Tailwind defaults (`md` 768px, `lg` 1024px, `xl` 1280px) — FlyonUI ships the same scale, don't override it.

### Layout primitives: flex/grid + gap only

Build every layout with `flex` (+ `flex-col`, `grid-cols-*`) and `gap-*` — **never** `space-y-*` / `space-x-*`. One spacing mechanism, everywhere, consumer and admin alike.

Standard gap scale:

| Context                                    | Class             |
| ------------------------------------------ | ----------------- |
| Between marketing/page sections            | `gap-8 md:gap-12` |
| Between fields in a form / items in a card | `gap-4`           |
| Tight clusters (icon + label, badge row)   | `gap-2`           |

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
- **DON'T** toast an error the user has to fix in a form, or a success the UI already makes obvious (a toggled switch) — see §4 Feedback.

---

## 8. Responsive behavior

- Breakpoints: `sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280 (Tailwind/FlyonUI defaults — don't override).
- **Consumer nav:** inline nav from `md` up → below `md`, a menu button (`btn btn-text btn-square`) toggles a slide-down menu (framer-motion height animation); opening it turns the header solid (§4 Consumer navigation).
- **Purchase stepper:** see §4 — horizontal steps ≥`lg`, condensed pills on `md`, single progress bar `<md`.
- **Admin sidebar:** collapses to icon-only or an off-canvas drawer `<lg`.
- **Admin data lists:** table from `md` up, one card per row below `md` — see §4 Admin data lists.
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
- "Add a policy list through the shared data-table: `btn btn-soft btn-primary btn-square btn-sm` row actions; wrap delete in the confirm pattern and use `btn-error` only inside that confirm."
- "Add a claim status badge using `badge-warning` for pending and `badge-error` for rejected — don't invent a new color."

This file is the single design source of truth for `tripsurance-fe`. Read it alongside [AGENTS.md](AGENTS.md) before writing any UI code.
