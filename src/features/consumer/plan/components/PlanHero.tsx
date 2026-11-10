import { useLocale, useTranslations } from 'next-intl'
import { TextReveal } from '@/shared/components/motions'

export function PlanHero() {
  const t = useTranslations('PLANS.PAGE')
  const locale = useLocale()

  return (
    // pt clears the fixed header; the extra bottom room is what the cards overlap
    <section className="from-primary/10 to-secondary/10 bg-linear-to-br pt-20 pb-20 md:pt-24 md:pb-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-8 md:px-6 md:pt-12">
        <TextReveal
          text={t('TITLE')}
          locale={locale}
          className="text-3xl leading-tight font-semibold md:text-4xl"
        />
        <p className="text-subtle leading-relaxed">{t('SUBTITLE')}</p>
      </div>
    </section>
  )
}
