import { useTranslations } from 'next-intl'
import { FadeIn } from '@/shared/components/motions'
import { SectionHeading } from './SectionHeading'
import { whyItems } from '../lib/home-content'

export function WhySection() {
  const t = useTranslations('HOME.WHY')

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:gap-12 md:px-6">
        <FadeIn>
          <SectionHeading title={t('TITLE')} subtitle={t('SUBTITLE')} />
        </FadeIn>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map(({ key, icon: Icon }, index) => (
            <FadeIn key={key} delay={index * 0.08}>
              <div className="bg-base-100 border-base-300 rounded-box flex h-full flex-col gap-4 border p-6 shadow-sm">
                <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
                  <Icon className="size-6" />
                </span>
                <h3 className="text-xl font-semibold">{t(`ITEMS.${key}.TITLE`)}</h3>
                <p className="text-subtle leading-relaxed">{t(`ITEMS.${key}.DESCRIPTION`)}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
