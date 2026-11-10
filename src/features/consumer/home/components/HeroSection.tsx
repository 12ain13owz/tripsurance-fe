import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { FadeIn, TextReveal } from '@/shared/components/motions'
import { Link } from '@/shared/i18n'
import { consumerRoutes } from '@/shared/routes'

export function HeroSection() {
  const tHome = useTranslations('HOME.HERO')
  const tOrder = useTranslations('ORDER')
  const locale = useLocale()

  return (
    // Full-bleed under the transparent header, so no top padding offset here
    <section className="relative isolate flex min-h-[85svh] items-center">
      <Image
        src="/images/main.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Darkens the photo so the light text and the transparent header stay readable */}
      <div className="from-neutral/85 via-neutral/60 to-neutral/20 absolute inset-0 -z-10 bg-linear-to-r" />

      <div className="text-neutral-content mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-24 pb-16 md:px-6">
        <TextReveal
          text={tHome('TITLE')}
          locale={locale}
          className="max-w-3xl text-4xl leading-tight font-bold md:text-6xl"
        />
        <FadeIn delay={0.4} className="flex max-w-2xl flex-col gap-8">
          <p className="text-neutral-content/90 text-lg leading-relaxed md:text-xl">
            {tHome('SUBTITLE')}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={consumerRoutes.order} className="btn btn-primary btn-lg">
              {tOrder('CHECK_PREMIUM')}
              <ArrowRight className="size-5" />
            </Link>
            <Link
              href={consumerRoutes.plans}
              className="btn btn-outline btn-lg border-neutral-content/70 text-neutral-content hover:border-neutral-content hover:bg-neutral-content/10"
            >
              {tHome('COMPARE_PLANS')}
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
