# Technology Stack

## Architecture

Single-page, statically rendered Next.js site. No backend, no database, no auth. The contact CTA is a `mailto:` link — no API route required. Two locales (EN default, ES) served via path prefix routing (`/` and `/es`).

## Core Technologies

- **Language**: TypeScript (strict mode, `any` forbidden)
- **Framework**: Next.js 15 (App Router)
- **Runtime**: Node.js 20+
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (copy-paste primitives, owned in-repo)
- **i18n**: `next-intl` with path-prefix routing (EN at `/`, ES at `/es`)
- **Hosting**: Vercel (static / edge)
- **DNS / CDN**: Cloudflare in front

## Key Libraries

Only libraries that influence patterns are listed here. Everything else is incidental.

- `next-intl` — locale routing + message catalogs
- `tailwindcss` — utility-first styling, no separate CSS modules
- `lucide-react` — icon set used by shadcn/ui

## Development Standards

### Type Safety

- TypeScript `strict: true` in `tsconfig.json`
- `any` is forbidden — use `unknown` + narrowing, or define the type
- Props interfaces co-located with components

### Code Quality

- ESLint with `next/core-web-vitals` config
- Prettier with Tailwind plugin (class sorting)
- One component per file, named exports preferred

### Testing

- No test suite in v1 — the page is static content. Visual review is the test.
- If interactive features are added later, introduce Vitest + React Testing Library at that point, not before.

### Accessibility

- Semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`)
- Images have meaningful `alt` text (Fran's photo: descriptive, not decorative)
- Color contrast meets WCAG AA
- Locale switcher reachable via keyboard

## Development Environment

### Required Tools

- Node.js 20+
- pnpm (preferred) or npm

### Common Commands

```bash
# Dev server
pnpm dev

# Production build
pnpm build

# Start production build locally
pnpm start

# Lint
pnpm lint
```

## Key Technical Decisions

### Why no backend / no Supabase

The page does one thing: introduce Fran and trigger an email. A `mailto:` link covers this with zero infrastructure. Adding Supabase, an API route, or a form handler would add maintenance and an attack surface for zero user benefit. **Revisit only if** we need analytics on submissions, spam protection on a real form, or persistence (none required in v1).

### Why Next.js (and not pure HTML or Astro)

- Already in Fran's default stack — no learning cost
- App Router + `next-intl` gives clean i18n routing for free
- Vercel deploy is one command; preview URLs per branch
- Easy upgrade path if the site grows (blog, case studies)

Pure HTML would be lighter but adds friction for i18n, components, and future growth. Astro would also work but is not in the default stack.

### Why `mailto:` over a contact form

Forms add: backend, validation, spam protection, deliverability concerns, a database or email service. The user explicitly does not want a form. A `mailto:` link opens the visitor's email client with a prefilled subject line — it converts at least as well for high-intent visitors and costs zero to maintain.

### Why path-prefix i18n (`/es`) over subdomain or query param

- SEO-friendly (each locale is a distinct URL Google can index)
- `next-intl` defaults to this pattern
- No DNS changes needed (subdomain would require Cloudflare config)

### Image strategy

- Fran's photo served via `next/image` for automatic optimization
- Original asset stored in `/public/` — committed to the repo (it's small, it's the brand)

---
_If a dependency is not on this list, it should not be added without a one-line justification tied to a user-facing need._