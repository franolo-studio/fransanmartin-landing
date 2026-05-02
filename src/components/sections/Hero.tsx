import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

// Final photo is 3000×4000 (3:4 portrait, cropped from 3000×4500 source).
// width/height props only need to preserve the aspect ratio for CLS.
const HERO_PHOTO_WIDTH = 600;
const HERO_PHOTO_HEIGHT = 800;

export function Hero() {
  const t = useTranslations();
  const email = t('contact.email');
  const subject = encodeURIComponent(t('cta.subject'));
  const mailtoHref = `mailto:${email}?subject=${subject}`;

  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-10 px-6 py-16 md:flex-row md:items-center md:gap-12 md:py-20 lg:gap-16 lg:py-24"
    >
      <div className="w-full max-w-sm shrink-0 md:w-2/5 lg:w-1/2">
        <Image
          src="/fran.jpg"
          alt={t('hero.photoAlt')}
          width={HERO_PHOTO_WIDTH}
          height={HERO_PHOTO_HEIGHT}
          priority
          sizes="(max-width: 767px) 24rem, (max-width: 1023px) 40vw, 540px"
          className="h-auto w-full rounded-2xl border border-border object-cover"
        />
      </div>

      <div className="flex flex-col items-center gap-6 text-center md:w-3/5 md:items-start md:text-left lg:w-1/2 lg:gap-8">
        <h1
          id="hero-heading"
          className="text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl"
        >
          {t('hero.name')}
        </h1>
        <p className="text-balance text-lg text-muted-foreground md:text-xl lg:text-2xl">
          {t('hero.tagline')}
        </p>
        <p className="max-w-prose text-pretty text-base text-zinc-300 md:text-lg">
          {t('hero.pitch')}
        </p>
        <Button asChild size="lg" className="w-full md:w-auto">
          <a href={mailtoHref} aria-label={t('cta.ariaLabel')}>
            {t('cta.label')}
          </a>
        </Button>
      </div>
    </section>
  );
}
