import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
  // Disable the NEXT_LOCALE cookie (R9.2: no cookies / no client-side
  // storage). With localeDetection already false, the cookie is unused
  // anyway — visitors switch locales via explicit URL only.
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
