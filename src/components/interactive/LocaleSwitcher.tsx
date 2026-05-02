'use client';

import NextLink from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { routing, usePathname } from '@/i18n/routing';

export function LocaleSwitcher() {
  const t = useTranslations('localeSwitcher');
  const locale = useLocale();
  const pathname = usePathname();
  const nextLocale = locale === 'en' ? 'es' : 'en';

  // Construct the target href manually so we don't add a redundant
  // /en prefix for the default locale (which would 307-redirect).
  const targetHref =
    nextLocale === routing.defaultLocale ? pathname : `/${nextLocale}${pathname}`;

  return (
    <NextLink
      href={targetHref}
      hrefLang={nextLocale}
      aria-label={t('switchTo')}
      className="inline-flex h-11 min-w-11 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {t('shortLabel')}
    </NextLink>
  );
}
