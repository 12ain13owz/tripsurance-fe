import { useTranslations } from 'next-intl'
import { FadeIn } from '@/shared/components/motions'
import { SectionHeading } from './SectionHeading'
import { steps } from '../lib/home-content'

export function StepsSection() {
  const t = useTranslations('HOME.STEPS')

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:gap-12 md:px-6">
        <FadeIn>
          <SectionHeading title={t('TITLE')} />
        </FadeIn>
        <ol className="grid gap-8 md:grid-cols-3">
          {steps.map(({ key, icon: Icon }, index) => (
            <FadeIn key={key} delay={index * 0.1}>
              <li className="flex flex-col items-center gap-4 text-center">
                <span className="bg-primary text-primary-content relative flex size-16 items-center justify-center rounded-full">
                  <Icon className="size-7" />
                  <span className="bg-accent text-accent-content absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full text-xs font-semibold">
                    {index + 1}
                  </span>
                </span>
                <h3 className="text-xl font-semibold">{t(`ITEMS.${key}.TITLE`)}</h3>
                <p className="text-subtle max-w-xs leading-relaxed">
                  {t(`ITEMS.${key}.DESCRIPTION`)}
                </p>
              </li>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  )
}
