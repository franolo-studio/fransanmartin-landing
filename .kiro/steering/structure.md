# Project Structure

## Organization Philosophy

Flat and feature-light. This is a one-page site, so over-engineering the folder structure adds friction without payoff. Components live next to where they are used. Locale-scoped content lives in a dedicated `messages/` directory. Anything that does not fit one of the patterns below probably does not belong in v1.

## Directory Patterns

### App Router pages
**Location**: `/src/app/[locale]/`
**Purpose**: Locale-scoped routes. The single `page.tsx` renders the landing.
**Example**: `/src/app/[locale]/page.tsx`, `/src/app/[locale]/layout.tsx`

### Page sections
**Location**: `/src/components/sections/`
**Purpose**: Top-level page blocks (Hero, About, CTA, Footer). One section per file.
**Example**: `Hero.tsx`, `About.tsx`, `Cta.tsx`, `Footer.tsx`

### UI primitives
**Location**: `/src/components/ui/`
**Purpose**: shadcn/ui components copy-pasted into the repo. Generic, no business logic.
**Example**: `button.tsx`, `card.tsx`

### Locale messages
**Location**: `/messages/`
**Purpose**: One JSON catalog per locale, consumed by `next-intl`.
**Example**: `messages/en.json`, `messages/es.json`

### i18n config
**Location**: `/src/i18n/`
**Purpose**: `next-intl` request config + locale list constants.
**Example**: `src/i18n/request.ts`, `src/i18n/routing.ts`

### Static assets
**Location**: `/public/`
**Purpose**: Fran's photo, favicon, OG image, any static file referenced by URL.
**Example**: `public/fran.jpg`, `public/og.png`, `public/favicon.ico`

### Utilities
**Location**: `/src/lib/`
**Purpose**: Small pure helpers. Only create when the same logic is used in 2+ places.
**Example**: `cn.ts` (Tailwind class merger from shadcn).

## Naming Conventions

- **Component files**: `PascalCase.tsx` — `Hero.tsx`, `LocaleSwitcher.tsx`
- **shadcn/ui primitives**: `lowercase.tsx` (matches shadcn's own convention) — `button.tsx`
- **Non-component files**: `kebab-case.ts` — `site-config.ts`, `i18n-config.ts`
- **Components**: `PascalCase` exported names; one component per file; named exports preferred over default
- **Functions / variables**: `camelCase`
- **Constants**: `SCREAMING_SNAKE_CASE` only for true module-level constants
- **Message keys**: `dot.notation`, grouped by section — `hero.title`, `cta.button`

## Import Organization

```typescript
// 1. External packages
import { useTranslations } from 'next-intl'
import Image from 'next/image'

// 2. Internal absolute imports (via @/ alias)
import { Button } from '@/components/ui/button'
import { Hero } from '@/components/sections/Hero'

// 3. Relative imports (sibling files only)
import { localCopy } from './copy'
```

**Path Aliases**:
- `@/`: maps to `./src/`

Avoid relative imports that climb directories (`../../../`). If you need to climb, use the `@/` alias instead.

## Code Organization Principles

- **Server Components by default**: Only mark `"use client"` when interactivity is required (e.g., locale switcher dropdown). Static content stays on the server.
- **Co-locate small things**: A section's helper component or static copy can sit in the same file as the section, until it is reused. Then promote it.
- **No premature abstraction**: Three similar lines is fine. A `<SectionLayout>` wrapper is unnecessary until there are 3+ sections that genuinely share layout.
- **Content lives in `/messages/`, not in components**: All user-facing text goes through `useTranslations`. No hardcoded English strings in JSX (except aria-labels that are dynamic, etc.).
- **No global state**: There is nothing to manage globally. No Zustand, no Context, no Redux. The locale switch is handled by `next-intl` routing.

## What does NOT belong in v1

These directories should not exist yet — if you find yourself wanting to create one, stop and ask whether the feature is in scope:

- `/src/app/api/` (no API routes — `mailto:` covers contact)
- `/tests/` or `__tests__/` (no test suite for static content)
- `/src/hooks/` (no custom hooks needed)
- `/src/types/` (types live next to their consumers)
- `/src/services/` or `/src/db/` (no backend, no DB)

---
_New files following these patterns should not require steering updates. If a new pattern emerges (e.g., adding a blog), update this document — don't catalog every file._