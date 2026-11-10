import { getTranslations } from 'next-intl/server'
import { PlanView } from '@/features/consumer'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('PLANS.META')
  return { title: t('TITLE'), description: t('DESCRIPTION') }
}

export default function ConsumerPlansPage() {
  return <PlanView />
}
