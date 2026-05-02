# Implementation Plan — personal-landing

## Foundation

- [ ] 1. Scaffold the project and toolchain
- [ ] 1.1 Initialize a Next.js 15 App Router project with TypeScript strict mode
  - Bootstrap a fresh Next.js 15 app inside the existing repository (do not overwrite `.kiro/`, `CLAUDE.md`, or `.git/`).
  - Enable `strict: true` in `tsconfig.json` and configure the `@/* → ./src/*` path alias.
  - Set up `package.json` scripts for `dev`, `build`, `start`, `lint`.
  - Pin Node 20+ via `engines` and add `.nvmrc`.
  - Done when `pnpm dev` boots without errors and serves the default Next.js page at `/`.
  - _Requirements: 6.5_

- [ ] 1.2 Configure Tailwind CSS, ESLint, and Prettier with the Tailwind sorting plugin
  - Install Tailwind, configure `tailwind.config.ts` with `content` covering `src/**/*.{ts,tsx}`, and define theme tokens that meet WCAG AA contrast against the chosen background.
  - Install Prettier with `prettier-plugin-tailwindcss` for automatic class sorting.
  - Configure ESLint with `next/core-web-vitals`.
  - Add a base type scale that keeps body and CTA copy readable at 320 px width without zoom.
  - Done when `pnpm lint` succeeds, an arbitrary Tailwind utility renders correctly in a smoke component, and the type scale's smallest body size is ≥ 16 px.
  - _Requirements: 4.6, 6.4, 7.1_

- [ ] 1.3 Add the `cn` Tailwind merger and the shadcn/ui Button primitive
  - Implement `src/lib/cn.ts` combining `clsx` and `tailwind-merge`.
  - Copy the shadcn/ui Button into `src/components/ui/button.tsx` (lowercase filename, named export, variant API supported).
  - Ensure the Button exposes a visible `:focus-visible` ring (default browser ring not suppressed) and respects a 44×44 px minimum touch target via Tailwind sizing tokens.
  - Done when both files compile under TypeScript strict and a smoke test page renders the Button with focus ring visible on Tab.
  - _Requirements: 4.5, 7.2_

- [ ] 2. Stand up the i18n foundation
- [ ] 2.1 Configure next-intl routing and the Next.js plugin wrapper
  - Install `next-intl` v4 and define `routing` in `src/i18n/routing.ts` with `locales: ['en', 'es']`, `defaultLocale: 'en'`, `localePrefix: 'as-needed'`, `localeDetection: false`.
  - Re-export typed navigation helpers (`Link`, `redirect`, `usePathname`, `useRouter`) via `createNavigation(routing)`.
  - Wrap `next.config.ts` with `createNextIntlPlugin('./src/i18n/request.ts')`.
  - Done when the routing config and plugin wrapper are in place and a build that imports `routing` typechecks under strict mode.
  - _Requirements: 3.1, 3.2, 3.5_

- [ ] 2.2 (P) Implement the per-request next-intl config
  - Create `src/i18n/request.ts` exporting a `getRequestConfig` that loads `messages/${locale}.json` per request and falls back to the default locale on an invalid locale param.
  - Done when a server component using `useTranslations` resolves locale-correct strings on `/` and `/es`.
  - _Requirements: 3.1, 3.2, 3.3_
  - _Boundary: src/i18n/request.ts_
  - _Depends: 2.1_

- [ ] 2.3 (P) Wire the next-intl middleware at the project root
  - Create `middleware.ts` exporting middleware created from `routing`; configure `matcher` to skip Next internals, `_next`, static assets, `/sitemap.xml`, `/robots.txt`, and `/api`.
  - Done when visiting `/` returns the EN page and `/es` returns the ES page; visiting `/` with `Accept-Language: es` does NOT redirect (verify with cURL `-H "Accept-Language: es"`).
  - _Requirements: 3.1, 3.2, 3.5_
  - _Boundary: middleware.ts_
  - _Depends: 2.1_

- [ ] 2.4 (P) Author the English and Spanish message catalogs with the canonical content
  - Create `messages/en.json` and `messages/es.json` with structurally parallel keys: `hero.name`, `hero.tagline`, `hero.pitch`, `hero.photoAlt`, `cta.label`, `cta.subject`, `cta.ariaLabel`, `cta.shortLabel` (used by sticky-header on viewports < 480 px), `contact.email`, `footer.copyright`, `meta.title`, `meta.description`, `meta.ogTitle`, `meta.ogDescription`, `localeSwitcher.toEnglish`, `localeSwitcher.toSpanish`, `notFound.heading`, `notFound.backToHome`.
  - Populate EN with the canonical content from `requirements.md` (name = `Fran Sanmartín`, tagline = `Helping you turn ideas into real, usable tech`, pitch verbatim, CTA label = `Contact me →`, subject = `Hi Fran`, contact email = `sanmartingoyanesfrancisco@gmail.com`, footer = `© Fran Sanmartín — All rights reserved`).
  - Populate ES with translations of equivalent intent for every key.
  - Done when both files exist with identical key sets (a key-diff returns empty), every value is non-empty, and the EN values match the canonical content verbatim.
  - _Requirements: 1.4, 2.2, 3.3, 3.7, 4.8, 7.3, 8.1_
  - _Boundary: messages/_
  - _Depends: 2.1_

## Core

- [ ] 3. Build the app shell and global styles
- [ ] 3.1 Create the locale-scoped root layout with self-hosted font and i18n provider
  - Implement `src/app/[locale]/layout.tsx` rendering `<html lang={locale}>` with `next/font` (self-hosted Google or local font) using `display: 'swap'` and `adjustFontFallback: true`.
  - Wrap children with `NextIntlClientProvider` populated via `getMessages()`.
  - Implement `generateStaticParams` returning both locales.
  - Add the conventional favicon at `src/app/icon.svg` so Next.js picks it up automatically.
  - Done when `/` renders `<html lang="en">`, `/es` renders `<html lang="es">`, the page's font asset is served from the same origin (no `fonts.googleapis.com` request in the Network tab), and the favicon appears in the browser tab.
  - _Requirements: 3.8, 6.4, 6.5, 7.5, 9.3_
  - _Depends: 2.2, 2.4_

- [ ] 3.2 (P) Author `src/app/globals.css` with Tailwind directives, the spotlight overlay rule, and global no-horizontal-scroll guard
  - Include `@tailwind base; @tailwind components; @tailwind utilities;`.
  - Define a `.cursor-spotlight` rule that paints a soft radial gradient using `var(--mx, 50%)` and `var(--my, 50%)`, sets `position: fixed; inset: 0; pointer-events: none;` and assigns a z-index strictly below the sticky header's z-index.
  - Apply `overflow-x: clip` (or equivalent) to the `<body>` to prevent any element from creating horizontal scroll.
  - Done when an empty `<div class="cursor-spotlight">` renders a non-blocking radial gradient centered on the viewport, and resizing the window from 1920 px to 320 px never produces a horizontal scrollbar.
  - _Requirements: 4.4, 5.1, 5.4_
  - _Boundary: src/app/globals.css_
  - _Depends: 1.2_

- [ ] 3.3 Implement the locale-aware `not-found.tsx` fallback
  - Create `src/app/[locale]/not-found.tsx` rendering a translated heading and a link back to the locale root using `next-intl/navigation` `Link`.
  - Done when visiting `/foo` and `/es/foo` each render a translated 404 page with a working "back to home" link, and both work with JavaScript disabled.
  - _Requirements: 3.1, 3.2, 6.7_
  - _Depends: 3.1, 2.4_

- [ ] 4. Implement the page sections
- [ ] 4.1 (P) Build the Hero section
  - Implement `src/components/sections/Hero.tsx` as a server component containing exactly one `<h1>` (Fran's name from `hero.name`), the tagline, the pitch paragraph, and the primary `Button` CTA whose `href` is a `mailto:` constructed from `contact.email` and `cta.subject`.
  - Render Fran's photo via `next/image` with `priority`, explicit `width`/`height`, descriptive `hero.photoAlt`, and a `sizes` attribute encoding the three breakpoints.
  - Compose the responsive layout with Tailwind utilities so the photo stacks above the textual content on viewports 320–767 px (with a full-width CTA), renders an intermediate proportional layout on 768–1023 px, and renders horizontally with the photo on the left on viewports ≥ 1024 px.
  - Pull every visible string from `useTranslations`; no hardcoded English in JSX.
  - Done when both `/` and `/es` show all five elements (name, tagline, pitch, photo, CTA) above the fold on a 1280×720 desktop viewport, the layout reflows correctly across breakpoints in DevTools live resize, and the photo's network response is the smallest viewport-appropriate variant on a 375 px viewport.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 4.1, 4.2, 4.3, 4.7, 6.1, 6.3, 6.6, 7.3, 7.4_
  - _Boundary: src/components/sections/Hero.tsx_
  - _Depends: 1.3, 2.4, 3.1_

- [ ] 4.2 (P) Build the Footer section with visible email fallback and copyright
  - Implement `src/components/sections/Footer.tsx` as a server component wrapped in `<footer>`, rendering an `<address>` with `contact.email` as visible selectable text and a small copyright line from `footer.copyright`.
  - Do not include a CTA button — the sticky header carries the persistent CTA.
  - Done when both `/` and `/es` show the email address as user-selectable text and the locale-translated copyright at the bottom of every viewport range.
  - _Requirements: 2.6, 4.8_
  - _Boundary: src/components/sections/Footer.tsx_
  - _Depends: 2.4_

- [ ] 5. Implement the interactive client islands
- [ ] 5.1 (P) Build the cursor spotlight client component
  - Implement `src/components/interactive/CursorSpotlight.tsx` as a `"use client"` component that mounts an overlay div consumed by the `.cursor-spotlight` CSS rule.
  - Attach a `pointermove` listener only when `window.matchMedia('(hover: hover) and (pointer: fine)').matches` is true AND `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is false; otherwise render nothing or a static (motionless) version.
  - Throttle every position update via `requestAnimationFrame`; write the latest `clientX`/`clientY` to `--mx` and `--my` on the overlay element.
  - Clean up the listener and any pending rAF handle on unmount.
  - Done when on a desktop browser the gradient follows the cursor smoothly, on iOS/Android emulation no `pointermove` listener is attached (verify in DevTools "Event Listeners" panel), enabling DevTools "Emulate CSS prefers-reduced-motion: reduce" stops the animation, and the Performance panel shows ≤ 16.6 ms per frame during continuous movement.
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - _Boundary: src/components/interactive/CursorSpotlight.tsx_
  - _Depends: 3.2_

- [ ] 5.2 (P) Build the locale switcher with a no-JS fallback
  - Implement `src/components/interactive/LocaleSwitcher.tsx` as a `"use client"` component using `useLocale`, `usePathname`, and `useRouter` from `next-intl/navigation`.
  - Render a focusable control that displays the inactive locale label (from `localeSwitcher.toEnglish` / `localeSwitcher.toSpanish`) and navigates to the equivalent page in the other locale on activation.
  - Provide a `<noscript>` fallback (or a server-rendered `<a>` pair revealed when JS is absent) with two plain anchors — one to `/`, one to `/es` — so locale navigation works without JavaScript.
  - Enforce a 44×44 px touch target and a visible `:focus-visible` ring.
  - Done when clicking the switcher on `/` lands on `/es` (and vice versa) with the URL updated, the focus indicator is visible on Tab, the touch target measures ≥ 44×44 in DevTools mobile profile, and disabling JavaScript still allows navigation between locales via the fallback anchors.
  - _Requirements: 3.4, 3.5, 4.5, 6.7, 7.2_
  - _Boundary: src/components/interactive/LocaleSwitcher.tsx_
  - _Depends: 1.3, 2.1_

- [ ] 6. Build the sticky-header layout shell
- [ ] 6.1 Implement the `StickyHeader` server component with persistent CTA
  - Implement `src/components/layout/StickyHeader.tsx` as a server component using `position: sticky; top: 0` and a z-index strictly higher than the spotlight overlay's z-index.
  - Cap height at ≤ 64 px on viewports ≥ 1024 px and ≤ 56 px on viewports < 1024 px.
  - Compose the bar with the `LocaleSwitcher` on the right and a `Button` CTA pointing at the same `mailto:` href as the Hero CTA (sourced from the same message keys).
  - Implement the < 480 px scaling rule: shrink the CTA label to `cta.shortLabel` (e.g., `Contact →`) or to an icon-only button while keeping a 44×44 px touch target and the full localized "Contact me" `aria-label`.
  - Ensure the header DOM order places the locale switcher before the CTA so the page Tab order reads: locale switcher → header CTA → hero CTA.
  - Done when on `/` and `/es` the header remains pinned at the top of the viewport across the full scroll range, the CTA is clickable at every scroll position, the computed `z-index` is higher than the spotlight overlay's in DevTools, the header still pins with JavaScript disabled, and on a 320 px viewport the CTA collapses to its short variant while exposing the full `aria-label`.
  - _Requirements: 2.3, 2.4, 3.4, 4.5, 4.7, 6.5, 6.7_
  - _Boundary: src/components/layout/StickyHeader.tsx_
  - _Depends: 1.3, 2.4, 5.2_

## Integration

- [ ] 7. Compose the landing page
- [ ] 7.1 Wire `src/app/[locale]/page.tsx` with StickyHeader, Hero, Footer, and CursorSpotlight
  - Import and compose the four components inside the locale page.
  - Place `StickyHeader` first, then `<main>` containing the Hero, then `<footer>` (rendered from `Footer`), with `CursorSpotlight` mounted as a sibling overlay to `<main>` so it does not affect the document flow.
  - Confirm `<main>` and `<footer>` are top-level siblings under the layout body, with a single `<h1>` inside `<main>` (from Hero).
  - Done when `/` and `/es` render the full composed page; semantic outline shows `<header>` (sticky) → `<main>` → `<footer>` with one `<h1>` inside `<main>`; no `"use client"` directive appears in `StickyHeader.tsx`, `Hero.tsx`, `Footer.tsx`, or `page.tsx`; and disabling JavaScript still renders all visible content with both CTAs activatable.
  - _Requirements: 1.1, 1.2, 6.5, 6.7, 7.4_
  - _Depends: 4.1, 4.2, 5.1, 6.1_

- [ ] 8. Implement SEO and link-share metadata
- [ ] 8.1 Implement `generateMetadata` per locale on the locale layout
  - Add a `generateMetadata({ params })` function in `src/app/[locale]/layout.tsx` returning the locale's `meta.title`, `meta.description`, Open Graph fields (title, description, image at `/og.png`, url, siteName), `alternates.canonical` per locale, and `alternates.languages` declaring `en` ↔ `es` so `hreflang` link tags render correctly.
  - Source the site URL from a single constant (env-derived if available, otherwise a hardcoded production URL) so all canonical and OG URLs stay consistent.
  - Done when View Source on `/` shows EN `<title>`, `<meta name="description">`, OG tags, `<link rel="canonical">`, and `<link rel="alternate" hreflang="en" />` plus `hreflang="es"`; the same on `/es` with ES copy and `/es` canonical.
  - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - _Depends: 3.1, 2.4_

- [ ] 8.2 (P) Add `sitemap.ts` and `robots.ts`
  - Implement `src/app/sitemap.ts` returning sitemap entries for `/` and `/es` with the canonical site URL and locale alternates.
  - Implement `src/app/robots.ts` returning `User-agent: *`, `Allow: /`, and a `Sitemap:` line pointing at `/sitemap.xml`.
  - Done when `/sitemap.xml` resolves with both locale URLs and `/robots.txt` resolves with the expected directives.
  - _Requirements: 8.3_
  - _Boundary: src/app/sitemap.ts, src/app/robots.ts_
  - _Depends: 2.1_

- [ ] 9. Stage static assets
- [ ] 9.1 (P) Add Fran's photo placeholder and the shared OG image
  - Place a placeholder JPEG at `public/fran.jpg` whose dimensions match the `width`/`height` props referenced by the Hero `next/image` element (final asset replaces the placeholder before launch — no re-implementation needed).
  - Place a 1200×630 PNG at `public/og.png` representing the brand (face + name suffices for v1; same image for both locales).
  - Done when both files exist at the expected paths, the Hero renders the photo without console warnings about dimensions, and the OG image is referenced by the metadata generated in 8.1.
  - _Requirements: 6.6, 8.2_
  - _Boundary: public/_

## Validation

- [ ] 10. Pre-launch verification
- [ ] 10.1 Execute the Pre-Launch Verification Checklist against a Vercel preview deploy
  - Run every item under "Pre-Launch Verification Checklist" in `design.md` against a production build deployed to a Vercel preview URL: Functional, Responsive, Spotlight, Accessibility, Performance, SEO and link share, and Privacy.
  - Run the catalog parity check programmatically (a one-off script that diffs key sets in `messages/en.json` and `messages/es.json`).
  - Run a Lighthouse mobile audit on the production preview and confirm Performance ≥ 90, LCP ≤ 2.0 s, CLS < 0.1, and zero render-blocking warnings.
  - Run an axe DevTools (or `@axe-core/cli`) scan on `/` and `/es` and confirm zero serious or critical violations.
  - Verify in the Network tab on a cold load that no third-party domains are contacted and no cookies/localStorage/sessionStorage entries are written.
  - Verify with JavaScript disabled in DevTools that the sticky header still pins, the visible email is selectable, and both CTAs activate the local mail client.
  - Done when every checkbox in the design.md checklist is ticked, all four audits pass their thresholds, and any failing item has been fixed and re-verified before promotion.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.3, 9.4_
  - _Depends: 7.1, 8.1, 8.2, 9.1_
