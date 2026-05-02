import { setRequestLocale } from 'next-intl/server';
import { StickyHeader } from '@/components/layout/StickyHeader';
import { Hero } from '@/components/sections/Hero';
import { Footer } from '@/components/sections/Footer';
import { CursorSpotlight } from '@/components/interactive/CursorSpotlight';

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
      <StickyHeader />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
