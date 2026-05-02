import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero';
import { Footer } from '@/components/sections/Footer';
import { CursorSpotlight } from '@/components/interactive/CursorSpotlight';
import { LocaleSwitcher } from '@/components/interactive/LocaleSwitcher';

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CursorSpotlight />
      {/* Temporary loose header — T6.1 will absorb LocaleSwitcher into StickyHeader. */}
      <header className="mx-auto flex w-full max-w-6xl justify-end px-6 pt-4">
        <LocaleSwitcher />
      </header>
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
