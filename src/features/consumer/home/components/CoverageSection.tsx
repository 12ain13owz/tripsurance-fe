import { CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FadeIn } from '@/shared/components/motions'
import { SectionHeading } from './SectionHeading'
import { coverageHighlights } from '../lib/home-content'

export function CoverageSection() {
  const t = useTranslations('HOME.COVERAGE')
  const tCoverage = useTranslations('PLANS.COVERAGE')

  return (
    <section className="bg-base-200 py-16 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:gap-12 md:px-6">
        <FadeIn>
          <SectionHeading title={t('TITLE')} subtitle={t('SUBTITLE')} />
        </FadeIn>
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {coverageHighlights.map(({ key, icon: Icon }, index) => (
            <FadeIn key={key} delay={index * 0.06} className="flex gap-4">
              <span className="text-primary mt-1 shrink-0">
                <Icon className="size-6" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="flex items-center gap-2 font-semibold">
                  {tCoverage(key)}
                  <CheckCircle2 className="text-success size-4" />
                </h3>
                <p className="text-subtle text-sm leading-relaxed">{t(`ITEMS.${key}`)}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
