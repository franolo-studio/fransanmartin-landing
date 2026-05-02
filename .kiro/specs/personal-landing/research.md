# Research & Design Decisions

## Summary

- **Feature**: `personal-landing`
- **Discovery Scope**: New Feature (greenfield) with locked stack — discovery is **light**, focused on integration patterns and one component-level decision (cursor spotlight). No external services, no migrations, no codebase to integrate with.
- **Key Findings**:
  - `next-intl` v4 with App Router path-prefix routing satisfies bilingual routing; `localeDetection: false` is required to honor R3.5 (no auto-redirect).
  - The cursor spotlight is small enough to build as a thin client island using CSS custom properties + `requestAnimationFrame`, gated by `(hover: hover) and (pointer: fine)` and `prefers-reduced-motion`. No animation library needed.
  - Vercel Analytics, Plausible, Google Fonts CDN, and similar third-party endpoints conflict with R9 (no tracking, no external endpoints). Use `next/font` (self-hosted) and ship without analytics in v1.

## Research Log

### Locale routing (next-intl v4 vs alternatives)

- **Context**: R3 requires path-prefix routing (`/` for EN, `/es` for ES), a locale switcher on every render, and explicitly **no auto-redirect** based on browser language (R3.5).
- **Sources Consulted**: next-intl v4 App Router docs (path-prefix middleware, `localePrefix: 'as-needed'`, `localeDetection` flag); steering `tech.md` (next-intl is the locked default).
- **Findings**:
  - `next-intl` provides middleware-based locale routing with `localePrefix: 'as-needed'`, which serves the default locale at `/` and prefixes other locales (`/es`).
  - `localeDetection: true` (the default) negotiates Accept-Language and redirects. Setting `localeDetection: false` disables that redirect — exactly what R3.5 requires.
  - The `Link` and `useRouter` helpers exposed by `next-intl/navigation` handle locale-aware routing in the LocaleSwitcher without manual URL math.
- **Implications**: Configure `i18n/routing.ts` with `locales: ['en', 'es']`, `defaultLocale: 'en'`, `localePrefix: 'as-needed'`, `localeDetection: false`.

### not-found.tsx fallback strategy (T3 deviation)

- **Context**: T3.3 requires a translated 404 page for unknown routes within both `/` and `/es`. Standard pattern: `[locale]/not-found.tsx` reads translations via `useTranslations('notFound')` or `getTranslations` after the layout calls `setRequestLocale`.
- **Issue surfaced during T3**: With `[locale]` as the dynamic root segment (no `app/layout.tsx`), Next.js 15 routes unmatched paths through the global `app/not-found.tsx` rather than `app/[locale]/not-found.tsx`. `getTranslations` from `next-intl/server` raises "No intl context found" because `setRequestLocale` is never invoked for unmatched routes. `useTranslations` in `[locale]/not-found.tsx` similarly never executes because the segment match fails before the layout chain runs.
- **Selected workaround**: `app/not-found.tsx` renders a bilingual hardcoded fallback ("Page not found · Página no encontrada") with two locale-specific back-home links (`/` and `/es`). The page renders without depending on the i18n provider, ships in the initial HTML, and works with JavaScript disabled. `[locale]/not-found.tsx` is kept as a future-ready placeholder using the `useTranslations` hook in case Next.js + next-intl resolves the segment routing in a future version, but it is not currently activated.
- **Trade-off**: Visitors hitting an unknown URL see both languages side-by-side instead of a single locale-matched page. Acceptable for a personal landing where 404s should be rare and the bilingual fallback is informative. Reconsider if/when next-intl publishes an officially-supported pattern for `[locale]/not-found.tsx` under a dynamic root segment.
- **Follow-up**: Re-test once next-intl ships a v4.x release that adjusts this behavior, or migrate to a different routing pattern (e.g., a non-dynamic root with locale rewrites) if the bilingual fallback becomes user-facing problematic.

### LocaleSwitcher uses Next.js Link with manually-computed href (T5 deviation)

- **Context**: Design.md called for the LocaleSwitcher to use `next-intl/navigation` helpers. The straightforward `<Link href={pathname} locale={nextLocale} />` from next-intl produces `href="/en"` when switching to the default locale, which the middleware then 307-redirects to `/` (because `localePrefix: 'as-needed'`). Functionally correct but adds a redirect roundtrip.
- **Selected**: Use Next.js `Link` directly with a manually-computed href: `nextLocale === routing.defaultLocale ? pathname : '/' + nextLocale + pathname`. `usePathname` from `next-intl/navigation` still provides the locale-stripped path.
- **Rationale**: Eliminates the redundant 307 hop; clicking the switcher lands on the target locale in a single request. Keeps the no-JS fallback intact (server-rendered `<a>` with the correct href).
- **Trade-off**: The component now hard-codes the prefix-construction logic. If `localePrefix` ever changes (e.g., to `'always'`), this needs revisiting. Mitigated because `localePrefix` is a load-bearing routing decision that already requires reviewing all locale-aware code.

### Middleware location and matcher refinement (T2 deviations)

- **Context**: T2 implementation surfaced two practical refinements to the middleware setup not pinned in the original design.
- **1. Middleware lives at `src/middleware.ts`, not the project root.**
  - **Reason**: With Next.js 15 + `src/` directory, Next.js looks for middleware inside `src/`. A `middleware.ts` at the repository root is silently ignored when `src/` is in use.
  - **Trade-off**: Minor deviation from the design.md File Structure Plan, which read "middleware.ts at project root". Updated the design's file structure to reflect `src/middleware.ts`.

- **2. Matcher uses three patterns instead of one.**
  - **Reason**: The single catch-all matcher `'/((?!api|_next|_vercel|.*\\..*).*)'` did not consistently match the bare `/` request in dev/Turbopack. Switched to the canonical next-intl recommendation: an explicit `'/'`, an explicit locale-prefix matcher (`'/(en|es)/:path*'`), and the catch-all for any other path. This is the pattern shown in next-intl v4 official examples.
  - **Trade-off**: Three lines instead of one; semantically identical for our two locales but more robust at the root path. If a third locale is added later, the locale-prefix matcher must list it (revalidation trigger).

### Cursor spotlight implementation pattern

- **Context**: R5 requires a soft radial-gradient glow following the cursor on desktop, disabled on touch devices, respecting `prefers-reduced-motion`, never blocking interaction, and sustaining ~60fps.
- **Sources Consulted**: CSS `@media (hover: ...)` and `(pointer: ...)` specs; CSS custom properties as DOM-mutation target; `requestAnimationFrame` throttling.
- **Findings**:
  - The 60fps target rules out per-`mousemove` style writes. The standard pattern is: capture the latest pointer position in a closure, schedule a single rAF tick that writes two CSS custom properties (`--mx`, `--my`) onto a fixed-position overlay element. The browser composites the radial gradient from the variables.
  - Touch-device gating via `window.matchMedia('(hover: hover) and (pointer: fine)')` avoids attaching listeners on mobile/tablet, satisfying R5.2.
  - Reduced-motion gating via `window.matchMedia('(prefers-reduced-motion: reduce)')` prevents the animation entirely; the overlay can still render statically without violating R5.3.
  - `pointer-events: none` on the overlay div guarantees text and the CTA remain clickable through it (R5.4).
- **Implications**: Build `CursorSpotlight.tsx` as a small client component (≈40 LOC). No third-party dependency. The overlay's gradient is defined via Tailwind utilities + a single CSS rule consuming `var(--mx)` / `var(--my)`.

### Image optimization for LCP

- **Context**: R6.1 requires LCP ≤ 2.0s on 4G mobile; R6.6 requires viewport-matched image delivery; R1 places Fran's photo above the fold.
- **Sources Consulted**: Next.js `next/image` docs (priority loading, AVIF/WebP, sizes attribute); Web Vitals LCP guidance.
- **Findings**:
  - `next/image` with `priority` skips lazy-loading and emits `<link rel="preload">` for the resource — appropriate for the hero photo since it is the LCP element.
  - The `sizes` attribute lets the browser pick the right responsive variant. For our breakpoints (mobile vertical, tablet intermediate, desktop horizontal), `sizes` should encode each viewport's expected image width.
  - Explicit `width` and `height` props on `next/image` reserve layout space and prevent CLS (R6.3).
  - Vercel auto-converts to AVIF/WebP at request time — no manual format work.
- **Implications**: Serve `/public/fran.jpg` via `next/image` with `priority`, explicit dimensions, and a `sizes` attribute matching our three breakpoints.

### Privacy/tracking baseline

- **Context**: R9 prohibits third-party tracking, cookies/storage for tracking, and external data exfil during page load or interaction.
- **Sources Consulted**: Vercel Analytics behavior, Google Fonts privacy implications, `next/font` self-hosting docs.
- **Findings**:
  - Vercel Analytics sends events to Vercel endpoints from the visitor's browser. Strict reading of R9.3 (no external endpoints as a side effect of page load) excludes it.
  - Google Fonts loaded from `fonts.googleapis.com` reveals visitor IPs to Google. `next/font/google` self-hosts the font assets at build time, eliminating the third-party request. `next/font/local` is also acceptable.
  - No cookies, `localStorage`, or `sessionStorage` are required by the spec; none should be set.
- **Implications**: Ship without analytics in v1. Use `next/font` (Google or local — Inter via `next/font/google` self-hosted is a sensible default). No cookie banner needed because no consented data is collected.

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Server-rendered React with minimal client islands | All sections are server components; only `CursorSpotlight` and `LocaleSwitcher` are client components | Smallest JS payload, best LCP, JS-disabled fallback works | None for this scope | Selected |
| Fully static export (`output: 'export'`) | Build to a static directory, deploy anywhere | No server runtime, deployable to any CDN | Loses Next.js Image Optimization unless a custom loader is added | Rejected — Vercel's default static rendering keeps image optimization "for free" |
| Pure HTML + Tailwind, no framework | Hand-written HTML with Tailwind | Smallest possible payload | Loses i18n routing, image optimization, font self-hosting, future flexibility | Rejected per steering (Next.js is the default stack) |

## Design Decisions

### Decision: next-intl middleware with `localeDetection: false`

- **Context**: Need path-prefix bilingual routing without auto-redirect (R3.5).
- **Alternatives Considered**:
  1. `localeDetection: true` (default) — auto-redirects EN browsers to `/`, ES browsers to `/es`. **Rejected**: violates R3.5.
  2. Subdomain routing (`fr.example.com` / `es.example.com`) — **Rejected**: requires DNS/Cloudflare changes per locale, violates steering's path-prefix decision.
  3. Query parameter routing (`?lang=es`) — **Rejected**: poor SEO, not next-intl's default pattern.
- **Selected Approach**: next-intl middleware with `localePrefix: 'as-needed'`, `localeDetection: false`, `defaultLocale: 'en'`, `locales: ['en', 'es']`.
- **Rationale**: Matches steering, matches R3 exactly, requires no infra changes.
- **Trade-offs**: Visitors with Spanish browsers landing on `/` see English by default until they click the switcher. This is the explicit choice in R3.5.
- **Follow-up**: Verify locale switcher uses `next-intl/navigation` helpers so URL transitions stay locale-aware across both routes.

### Decision: Build CursorSpotlight in-house (no animation library)

- **Context**: R5 requires a small visual flourish with strict gating and 60fps performance.
- **Alternatives Considered**:
  1. Framer Motion — overkill (~50KB gzipped) for a single radial-gradient effect; adds dependency for one component.
  2. CSS-only with `:hover` mouse tracking — limited to element-level hover, cannot follow the cursor across the page.
  3. In-house rAF + CSS custom properties — minimal code, zero dependency.
- **Selected Approach**: In-house client component using `requestAnimationFrame` to write `--mx` / `--my` CSS variables on a fixed overlay. Gated by `matchMedia` for hover/pointer and reduced-motion.
- **Rationale**: Fits steering's "no dependencies without a one-line justification". Component is ≈40 LOC; the cost to maintain is lower than the cost to evaluate and update a library dependency.
- **Trade-offs**: Custom code to maintain. Mitigated by the simplicity of the pattern.
- **Follow-up**: Validate 60fps in Chrome DevTools Performance panel during implementation. Confirm no jank with rapid cursor movement.

### Decision: No analytics, no third-party fonts CDN, no tracking surfaces in v1

- **Context**: R9 prohibits third-party tracking, cookies/storage tracking, and external endpoints as side effects.
- **Alternatives Considered**:
  1. Vercel Analytics — strict reading of R9.3 excludes it; rejected for v1.
  2. Plausible (cookieless analytics) — still sends external requests; rejected for v1.
  3. No analytics — accepted.
- **Selected Approach**: Ship v1 without any analytics or tracking SDK. Use `next/font` to self-host fonts so no font CDN request leaks visitor IPs.
- **Rationale**: Honors R9 literally and earns the "no cookie banner" simplicity.
- **Trade-offs**: No visit data. Acceptable for a low-volume personal landing where the success metric is "Fran got an email", not "X% scrolled past the fold".
- **Follow-up**: Reconsider in a future spec if measurement becomes valuable.

### Decision: Static `/public/og.png` over per-locale programmatic OG image

- **Context**: R8.2 requires Open Graph imagery for both locales.
- **Alternatives Considered**:
  1. `app/[locale]/opengraph-image.tsx` — programmatic per-locale OG card with localized text overlay. **Rejected**: extra code path, the OG image carries brand (face + name) more than locale-specific copy.
  2. Single shared `/public/og.png` with brand-level imagery; per-locale `<title>` and meta description still translate the link unfurl text. **Selected**.
- **Selected Approach**: One static OG image; localization happens in `<title>` / `<meta name="description">` via `generateMetadata` per locale.
- **Rationale**: Smaller surface, less code, the photo + name in the OG image read identically in both locales.
- **Trade-offs**: OG image text (if any text overlay is added) stays in one language. Acceptable — keep the OG image to imagery only or to brand-language.

### Decision: Sticky header with persistent CTA (replacing the bottom-of-page repeat)

- **Context**: R2.4 originally called for the CTA above-the-fold AND a repeat near the bottom of the page. The intent is "ensure the visitor can reach the CTA at any moment." Several patterns satisfy that intent; selecting one shapes the page composition.
- **Alternatives Considered**:
  1. Above-the-fold CTA + bottom-of-page repeat (the original design) — visitor must scroll back up if they reach the bottom and lose interest mid-pitch.
  2. Floating action button (FAB) at a corner — visually obtrusive on a minimal landing page, less familiar pattern for non-technical visitors arriving from LinkedIn.
  3. Scroll-triggered CTA reveal — requires JavaScript scroll listeners; fails silently with JS disabled and violates R6.7.
  4. Sticky top header with persistent CTA — always visible, always reachable, integrates the locale switcher in the same surface, works without JavaScript via CSS `position: sticky`.
- **Selected Approach**: Sticky top header (`components/layout/StickyHeader.tsx`) hosting the locale switcher and a persistent contact CTA. The Hero retains its prominent CTA below the pitch as the primary visual conversion point. The Footer no longer carries a CTA — only the visible email fallback and the copyright line.
- **Rationale**:
  1. Familiar pattern for non-technical visitors arriving from LinkedIn.
  2. Integrates the locale switcher and CTA in a single Tab-reachable surface, keeping focus order predictable.
  3. Needs zero JavaScript to work — CSS `position: sticky` covers the full mechanic, satisfying R6.7 by construction.
  4. Strictly more reachable than a footer repeat — the visitor never has to scroll to find the CTA.
- **Trade-offs**:
  - Reduces above-the-fold real estate by 56 px (mobile) / 64 px (desktop). Mitigated by capping header height and keeping the Hero compact.
  - On viewports < 480 px the header CTA label may need to shrink to `Contact →` or to an icon-only button while preserving 44×44 px touch targets and the full localized `aria-label`.
  - z-index ordering must place the sticky header above the `CursorSpotlight` overlay so the CTA is never visually obscured.
- **Follow-up**:
  - During implementation, validate header height does not crowd the Hero on 320 px width.
  - Verify sticky behavior with JS disabled on at least Chrome and Safari.
  - Confirm Tab order: locale switcher → header CTA → hero CTA (when scrolled).

### Decision: Locale switcher placement = top-right of the header

- **Context**: R3.4 requires the locale switcher visible and reachable on every render; placement is design's call.
- **Alternatives Considered**:
  1. Footer — reachable but requires scrolling on mobile after long content; visitors may not realize translation exists.
  2. Top-right header — convention for bilingual sites, immediately visible, reachable via Tab navigation early in the focus order.
- **Selected Approach**: Top-right header on all viewports.
- **Rationale**: Convention + immediate discoverability. Honors R3.4 and R7.2 (keyboard reachability).
- **Trade-offs**: Adds a thin header layer to the page composition. Negligible cost.

### Decision: T1 toolchain modernizations (Tailwind v4, ESLint CLI, format script, telemetry disable)

- **Context**: T1 implementation surfaced four toolchain choices that were not pinned in the original design but materially affect day-to-day work. Logged here so the spec stays the source of truth.
- **1. Tailwind v4 with theme tokens in `globals.css` via `@theme`** (deviates from design.md File Structure Plan).
  - **Alternatives**: Tailwind v3 with classic `tailwind.config.ts`; or Tailwind v4 with a JS config bridge (legacy mode).
  - **Selected**: v4 with theme tokens declared inline in CSS via `@theme`. Content paths auto-detected. No `tailwind.config.ts`.
  - **Rationale**: v4 is the current default for new Next.js 15 projects, ships with `@tailwindcss/postcss` integration, and colocates tokens with the global stylesheet — fewer files to keep in sync. The architectural intent of the design (semantic tokens, content scoping) is preserved; only the location moves.
  - **Trade-offs**: Tokens live in CSS rather than TS, so they cannot be imported by JS code — but no component in this spec needs that. Recipes online for v3 do not always translate cleanly to v4. Mitigated by the small surface (one stylesheet).

- **2. ESLint CLI directly (`eslint .`) instead of `next lint`**.
  - **Context**: `next lint` is deprecated in Next.js 15.x and scheduled for removal in 16.x. The `lint` script needed to keep working past the next major bump.
  - **Selected**: Run ESLint via its native CLI (`eslint .`) using the existing flat config. Added `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `@typescript-eslint/*` as explicit devDependencies because pnpm strict resolution does not auto-pull `eslint-config-next` peer plugins.
  - **Rationale**: One change now, future-proof against Next.js 16. No deprecation warnings.
  - **Trade-offs**: One extra-explicit peer-dep dance. Mitigated by pinning the plugin versions.

- **3. `pnpm format` script (Prettier write)**.
  - **Selected**: Added `format: 'prettier --write .'` to `package.json` so contributors (and Claude) can format consistently from a single command. Prettier itself was already in the design via `prettier-plugin-tailwindcss` for class sorting.
  - **Rationale**: Matches the level of standardization already in `lint` and `dev`. Cost: one line of `package.json`.

- **4. Next.js telemetry disabled via `next telemetry disable`**.
  - **Context**: R9 prohibits third-party endpoints as a side effect of build or runtime. `next telemetry` is anonymous but still beacons to Vercel from the local build environment.
  - **Selected**: Run `pnpm exec next telemetry disable` once during T1; the disable flag persists in the user's Next.js config dir. Added a checklist item to the design.md Pre-Launch Verification Checklist (Privacy section) so future deploys re-verify the status.
  - **Rationale**: Strict reading of R9.1 / R9.3 excludes telemetry pings even in the build environment. Cheap to disable, easy to verify, no downside.
  - **Follow-up**: When deploying on a fresh CI/Vercel environment, ensure the `NEXT_TELEMETRY_DISABLED=1` env var is set so the disable persists per build.

## Risks & Mitigations

- **Spotlight drops below 60fps on low-end laptops** — Mitigation: rAF throttle ensures at most one style write per frame; if profiling reveals jank, fall back to a static gradient when the device's `navigator.hardwareConcurrency` is below a threshold. Defer this fallback unless real measurements demand it.
- **LCP regression from web fonts** — Mitigation: `next/font` with `display: 'swap'` and a system-font fallback metric matched via Next.js's `adjustFontFallback`. Re-measure after font choice is finalized.
- **Vercel build adds tracking by default** — Mitigation: do not opt into Vercel Analytics; verify `<head>` of the deployed page contains no `va.js`, `vitals.js`, or third-party scripts.
- **`mailto:` not honored by webmail-default OS configs** — Mitigation: R2.6 already requires the address to be visible as selectable text in the footer, providing a copy-paste fallback regardless of mail-client availability.

## References

- [next-intl App Router docs](https://next-intl-docs.vercel.app/docs/getting-started/app-router) — locale routing, middleware, `localeDetection` flag.
- [Next.js `next/image`](https://nextjs.org/docs/app/api-reference/components/image) — `priority`, `sizes`, AVIF/WebP.
- [Next.js `next/font`](https://nextjs.org/docs/app/api-reference/components/font) — self-hosted Google Fonts.
- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — accessibility gating for animations.
- [MDN: `pointer` and `hover` media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) — touch-device gating.
- [Web Vitals: LCP](https://web.dev/articles/lcp) — largest-contentful-paint definition and optimization tactics.
