import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FadeIn } from '@/shared/components/motions'
import { Link } from '@/shared/i18n'
import { consumerRoutes } from '@/shared/routes'

export function CtaSection() {
  const t = useTranslations('HOME.CTA')

  return (
    <section className="py-16 md:py-24">
      <FadeIn className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="bg-primary text-primary-content rounded-box flex flex-col items-center gap-6 px-6 py-12 text-center md:py-16">
          <h2 className="text-3xl font-semibold md:text-4xl">{t('TITLE')}</h2>
          <p className="text-primary-content/85 max-w-xl text-lg leading-relaxed">
            {t('SUBTITLE')}
          </p>
          <Link
            href={consumerRoutes.plans}
            className="btn btn-lg bg-base-100 text-primary hover:bg-base-200 border-0"
          >
            {t('BUTTON')}
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </FadeIn>
    </section>
  )
}
