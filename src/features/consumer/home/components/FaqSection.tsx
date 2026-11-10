import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FadeIn } from '@/shared/components/motions'
import { SectionHeading } from './SectionHeading'
import { faqKeys } from '../lib/home-content'

// Native <details>: server-rendered, keyboard accessible, no FlyonUI JS init needed
export function FaqSection() {
  const t = useTranslations('HOME.FAQ')

  return (
    <section className="bg-base-200 py-16 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 md:gap-12 md:px-6">
        <FadeIn>
          <SectionHeading title={t('TITLE')} />
        </FadeIn>
        <FadeIn className="flex flex-col gap-3">
          {faqKeys.map((key) => (
            <details
              key={key}
              className="group bg-base-100 border-base-300 rounded-box border shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-medium [&::-webkit-details-marker]:hidden">
                {t(`ITEMS.${key}.QUESTION`)}
                <ChevronDown className="text-muted size-5 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="text-subtle px-5 pb-5 leading-relaxed">{t(`ITEMS.${key}.ANSWER`)}</p>
            </details>
          ))}
        </FadeIn>
      </div>
    </section>
  )
}
