/**
 * Canonical site URL used for metadata, sitemap, robots, and OG fields.
 * Override via NEXT_PUBLIC_SITE_URL in deployment environments (e.g. Vercel
 * preview deploys can point to their preview URL); defaults to production.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fransanmartin.com';

export const SITE_NAME = 'Fran Sanmartín';
