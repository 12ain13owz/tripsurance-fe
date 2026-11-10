import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { FadeIn, TextReveal } from '@/shared/components/motions'
import { Link } from '@/shared/i18n'
import { consumerRoutes } from '@/shared/routes'

export function HeroSection() {
  const t = useTranslations('HOME.HERO')
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
          text={t('TITLE')}
          locale={locale}
          className="max-w-3xl text-4xl leading-tight font-bold md:text-6xl"
        />
        <FadeIn delay={0.4} className="flex max-w-2xl flex-col gap-8">
          <p className="text-neutral-content/90 text-lg leading-relaxed md:text-xl">
            {t('SUBTITLE')}
          </p>
          <Link href={consumerRoutes.plans} className="btn btn-primary btn-lg self-start">
            {t('CTA')}
            <ArrowRight className="size-5" />
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}
