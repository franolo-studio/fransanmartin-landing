# Requirements Document

## Project Description (Input)

**Who has the problem.** Non-technical founders, PMs, and operators who hear about Fran Sanmartín from LinkedIn, a referral, a business card, or an outbound message, and who have ideas, workflows, or rough product plans they cannot ship alone. They need a canonical URL to learn who Fran is and how to reach him.

**Current situation.** Fran has no public landing page. There is no canonical place to send a prospect, no credibility anchor for referrals, and no soft CTA target for outbound messages. The repository contains only steering documents — no source code yet.

**What should change.** Ship a one-page, statically rendered bilingual site (English default at `/`, Spanish at `/es`) that:

- Communicates Fran's value proposition in under 5 seconds above the fold (StoryBrand frame: visitor is the hero, Fran is the guide).
- Converts visitors to a single frictionless action — a `Contact me →` button that opens the visitor's mail client with `sanmartingoyanesfrancisco@gmail.com` and a prefilled subject — with no forms, no funnels, no calendar embeds, no newsletter.
- Stays within v1 scope: not a portfolio, not a blog, not multi-page. Two locales, one page, one CTA.
- Renders correctly on mobile, tablet, and desktop, with a subtle cursor-following spotlight on desktop, a strong WCAG AA accessibility baseline, and clean social-share previews.

## Introduction

This specification defines the v1 personal landing page for Fran Sanmartín. The page exists to convert a single high-intent action: a warm visitor — arriving from LinkedIn, a referral, or a business card — should understand within seconds who Fran is and click one button to email him. Every requirement below serves that conversion. Anything that does not directly support "introduce Fran and trigger an email in two languages" is explicitly out of scope for v1.

## Boundary Context

- **In scope**: One static landing page rendered in English at `/` (default) and Spanish at `/es`; above-the-fold value proposition with Fran's name, tagline, photo, and pitch; a single `mailto:` contact action exposed above the fold and repeated near the page bottom; a locale switcher reachable on every render; a footer with copyright line; a cursor-following spotlight visual on desktop; Open Graph metadata for link unfurling; semantic landmarks and WCAG 2.1 AA accessibility baseline.
- **Out of scope (v1)**: Portfolio, case studies, or client-logo wall; blog, CMS, or any content surface beyond the static page; lead-capture forms, newsletter signup, or scheduling embeds; third-party analytics, tracking, or marketing tags; backend services, authentication, persistence, or API routes; additional pages or routes beyond the two locale roots.
- **Adjacent expectations**: Domain routing, TLS, and CDN are handled by the deployment platform and are not owned by this feature. Email delivery is handled by the visitor's local mail client once the `mailto:` link is activated; the Site does not send mail itself.

## Canonical Content (English source of truth)

The Site renders the following exact English strings. Spanish translations live in the locale message catalog and convey the same intent.

- **Name (page heading):** `Fran Sanmartín`
- **Tagline:** `Helping you turn ideas into real, usable tech`
- **Pitch:** `I help you turn ideas, workflows, or vague product plans into working digital tools. Fast, lean, and user-focused.`
- **Primary CTA label:** `Contact me →`
- **CTA target (English locale):** `mailto:sanmartingoyanesfrancisco@gmail.com?subject=Hi%20Fran`
- **CTA target (Spanish locale):** same recipient `sanmartingoyanesfrancisco@gmail.com` with the `subject` parameter translated to Spanish as defined in the locale message catalog
- **Photo asset:** `/public/fran.jpg` (placeholder acceptable during v1 implementation; final asset replaces the placeholder before launch)
- **Footer (English):** `© Fran Sanmartín — All rights reserved`

## Requirements

### Requirement 1: Above-the-fold value proposition (5-second test)

**Objective:** As a visitor arriving from LinkedIn, a referral, or a business card, I want to immediately understand who Fran is and what he offers, so that I can decide within 5 seconds whether he is relevant to my problem.

#### Acceptance Criteria

1. When the landing URL is opened on a 1280×720 desktop viewport, the Site shall render — above the fold without scroll — Fran's name, the tagline, the pitch paragraph, Fran's photo, and the primary contact CTA.
2. When the landing URL is opened on a 375×667 mobile viewport, the Site shall render Fran's name, tagline, photo, and the primary CTA reachable in at most one short scroll gesture.
3. The Site shall present the page narrative using a StoryBrand structure that names the visitor as the hero, Fran as the guide, the problem the visitor faces, the plan Fran offers, and the contact CTA as the next step.
4. The Site shall render the canonical tagline and pitch text defined in Canonical Content (English at `/`, translated equivalents at `/es`) without paraphrase or substitution.
5. The Site shall communicate the value proposition in plain language understandable to a non-technical founder, PM, or operator without requiring prior knowledge of Fran's industry or stack.

### Requirement 2: Single contact action (frictionless email CTA)

**Objective:** As a visitor who decides Fran is relevant, I want to contact him in one click, so that I do not have to fill a form, schedule a meeting, or copy an address manually.

#### Acceptance Criteria

1. When the visitor activates the primary contact button, the Site shall open the visitor's default email client with `sanmartingoyanesfrancisco@gmail.com` pre-populated as the recipient and a locale-appropriate subject pre-filled.
2. When the active locale is English, the Site shall set the `mailto:` subject to `Hi Fran`. When the active locale is Spanish, the Site shall set the `mailto:` subject to its Spanish translation as defined in the locale message catalog.
3. The Site shall render the contact CTA as a button labeled `Contact me →` in English and its locale-translated equivalent in Spanish.
4. The Site shall expose the primary contact CTA above the fold and repeat an identical CTA pointing to the same `mailto:` target near the bottom of the page.
5. The Site shall not collect visitor data through forms, newsletter inputs, calendar embeds, or any input control on the page.
6. If the visitor has no default email client configured, then the Site shall still render `sanmartingoyanesfrancisco@gmail.com` as visible, selectable text on the page so it can be copied manually.
7. The Site shall not introduce intermediate steps (modals, lead-capture forms, scheduling widgets) between the contact button and the visitor's email client.

### Requirement 3: Bilingual content (English default, Spanish secondary)

**Objective:** As a visitor whose preferred language is English or Spanish, I want to read Fran's introduction in my language, so that the value proposition lands without translation friction.

#### Acceptance Criteria

1. When the visitor requests `/`, the Site shall serve all visible page content in English.
2. When the visitor requests `/es`, the Site shall serve the equivalent page content translated into Spanish, with the same structure, sections, and CTA behavior as the English page.
3. The Site shall translate every user-facing string between locales, including the page narrative, the CTA button label, the footer copyright line, the page metadata (title, description), and the `mailto:` `subject` parameter.
4. The Site shall expose a locale switcher visible and reachable on every page render; the exact placement (header top-right, footer, or other) is decided in the design phase but shall remain reachable in all viewport ranges.
5. When the visitor activates the locale switcher, the Site shall navigate to the equivalent page in the other locale and update the URL accordingly (`/` ↔ `/es`).
6. The Site shall not auto-redirect between locales based on browser language in v1; a non-default locale is reached only via explicit URL or via the locale switcher.
7. The Site shall present the same value proposition, the same StoryBrand structure, and the same CTA target in both locales — translation only, not divergent positioning.
8. When the active locale is rendered, the Site shall declare the active locale on the root HTML `lang` attribute (`en` for `/`, `es` for `/es`) so screen readers and search engines treat the content correctly.

### Requirement 4: Responsive layout across viewport sizes

**Objective:** As a visitor on phone, tablet, or desktop, I want the page to lay out correctly for my device, so that all content is readable and the CTA is reachable without horizontal scrolling or pinch-to-zoom.

#### Acceptance Criteria

1. While the viewport width is between 320px and 767px (mobile), the Site shall render a vertical stack with Fran's photo placed above the textual content and a full-width primary CTA button.
2. While the viewport width is between 768px and 1023px (tablet), the Site shall render an intermediate layout with proportional sizing for the photo and content (neither a strict mobile vertical stack nor a strict desktop horizontal split).
3. While the viewport width is 1024px or wider (desktop), the Site shall render a horizontal layout with Fran's photo on the left and the textual content (name, tagline, pitch, CTA) on the right.
4. The Site shall not produce horizontal scroll at any viewport width from 320px upward.
5. While rendered on a touch input device, the Site shall expose every interactive element (primary CTA, locale switcher, any other tappable control) at no less than 44×44 CSS pixels.
6. The Site shall render body copy and the CTA label at a size readable without pinch-to-zoom on the smallest supported viewport (320px width).
7. When the visitor resizes the browser window in real time, the Site shall reflow content fluidly without layout breakage as the viewport crosses the 768px and 1024px breakpoints.
8. The Site shall render the page footer with the canonical footer text at the bottom of the page in all three viewport ranges (English at `/`, translated at `/es`).

### Requirement 5: Cursor spotlight animation (desktop only)

**Objective:** As a desktop visitor, I want a subtle visual flourish that makes the page feel intentional, so that the site reads as crafted without distracting from the message or hindering interaction.

#### Acceptance Criteria

1. While the visitor uses a fine pointer (mouse) on a desktop-sized viewport, the Site shall render a soft radial-gradient glow that follows the cursor position in real time.
2. While the visitor is on a touch-only device with no hover capability, the Site shall not render the spotlight effect.
3. While the visitor's environment indicates `prefers-reduced-motion: reduce`, the Site shall not animate the spotlight (it shall either omit the effect entirely or render a static visual without motion).
4. The Site shall keep the spotlight non-blocking — the visitor shall be able to read every text element and activate the contact CTA at every cursor position the spotlight occupies (the effect shall not capture pointer events).
5. While the spotlight is active and the visitor moves the cursor at typical speed on modern hardware, the Site shall maintain a perceived 60fps update rate without visible jank.

### Requirement 6: Performance and delivery

**Objective:** As a visitor on a mobile network or a poor connection, I want the page to load quickly, so that I do not bounce before the value proposition appears.

#### Acceptance Criteria

1. When the landing URL is opened on a cold cache over a typical 4G mobile profile, the Site shall achieve a Largest Contentful Paint of 2.0 seconds or less for the above-the-fold content.
2. The production build of the Site shall achieve a Lighthouse Performance score of 90 or higher when audited on a mobile profile.
3. The Site shall keep Cumulative Layout Shift below 0.1 across the full page load.
4. The Site shall not include render-blocking CSS or JavaScript that delays the first contentful paint.
5. The Site shall server-render the value proposition, photo, locale switcher, and contact CTA so they appear in the initial HTML response without waiting for client-side hydration.
6. The Site shall deliver Fran's photo in a format and resolution matched to the visitor's viewport (no full-resolution original served to a small mobile screen).
7. The Site shall remain functional with JavaScript disabled to the extent that the value proposition, photo, locale links, and `mailto:` CTA are still readable and activatable.

### Requirement 7: Accessibility (WCAG 2.1 AA)

**Objective:** As a visitor using a screen reader, keyboard navigation, or with low vision, I want to read Fran's introduction and trigger the contact CTA, so that the page is usable regardless of input method or visual ability.

#### Acceptance Criteria

1. The Site shall meet WCAG 2.1 AA color-contrast ratios for all body copy, headings, CTA label, and locale-switcher text against their backgrounds.
2. When the visitor navigates with a keyboard only, the Site shall expose the locale switcher and the primary contact CTA via Tab order with a visible focus indicator on each.
3. The Site shall provide meaningful descriptive alternative text for Fran's photo (not empty, not decorative-only).
4. The Site shall expose page structure via semantic HTML — at minimum a single `<h1>` (carrying Fran's name or the tagline), a `<main>` landmark wrapping the page content, and a `<footer>` landmark wrapping the footer.
5. When the active locale changes, the Site shall update the document `lang` attribute so screen readers pronounce content in the correct language.

### Requirement 8: SEO and link-share preview

**Objective:** As Fran sharing the URL on LinkedIn, in an outbound message, or via a business card QR code, I want the link to render a clear preview, so that recipients see who he is before they click.

#### Acceptance Criteria

1. The Site shall provide a unique, locale-appropriate page title and meta description for each locale (`/` in English, `/es` in Spanish) that summarize Fran's value proposition.
2. The Site shall expose Open Graph metadata (title, description, preview image, URL, site name) for both locales so link unfurling renders a card with image and copy.
3. The Site shall declare locale alternates (`hreflang`) linking the English and Spanish versions to one another, so search engines and social previews surface the correct language for the visitor.
4. The Site shall declare a canonical URL per locale to avoid duplicate-content indexing across the two locale roots.

### Requirement 9: Privacy and tracking discipline

**Objective:** As Fran owning the site, I want a credible "no-funnel, no-tracking" promise, so that visitors trust the page and the site stays maintenance-free.

#### Acceptance Criteria

1. The Site shall not load third-party analytics, advertising, or marketing tags from the page.
2. The Site shall not set cookies, local storage, or session storage to track visitor identity or behavior across visits.
3. The Site shall not send visitor data to any external endpoint as a side effect of page load or interaction.
4. The Site shall not require a cookie banner or consent dialog, because no tracked data is collected or transferred.
