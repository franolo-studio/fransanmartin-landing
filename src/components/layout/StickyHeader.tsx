import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/interactive/LocaleSwitcher';

export function StickyHeader() {
  const t = useTranslations();
  const email = t('contact.email');
  const subject = encodeURIComponent(t('cta.subject'));
  const mailtoHref = `mailto:${email}?subject=${subject}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6 lg:h-16">
        <span className="text-sm font-medium text-muted-foreground">Fran</span>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <Button asChild>
            <a href={mailtoHref} aria-label={t('cta.ariaLabel')}>
              <span className="hidden sm:inline">{t('cta.label')}</span>
              <span className="sm:hidden">{t('cta.shortLabel')}</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
