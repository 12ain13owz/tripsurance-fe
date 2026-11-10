import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FadeIn } from '@/shared/components/motions'
import { Link } from '@/shared/i18n'
import { consumerRoutes } from '@/shared/routes'

export function CtaSection() {
  const tHome = useTranslations('HOME.CTA')
  const tOrder = useTranslations('ORDER')

  return (
    // Full-bleed band (DESIGN.md §5); only the copy fades in, so the band never slides
    <section className="from-primary to-secondary text-primary-content bg-linear-to-br py-16 md:py-24">
      <FadeIn className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center md:px-6">
        <h2 className="text-3xl font-semibold md:text-4xl">{tHome('TITLE')}</h2>
        <p className="text-primary-content/85 max-w-xl text-lg leading-relaxed">
          {tHome('SUBTITLE')}
        </p>
        <Link
          href={consumerRoutes.order}
          className="btn btn-lg bg-base-100 text-primary hover:bg-base-200 border-0"
        >
          {tOrder('CHECK_PREMIUM')}
          <ArrowRight className="size-5" />
        </Link>
      </FadeIn>
    </section>
  )
}
