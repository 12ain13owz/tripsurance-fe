import { OrderView } from '@/features/consumer'
import type { Metadata } from 'next'

// Funnel pages stay out of search results (DESIGN.md §4 Purchase stepper)
export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default async function ConsumerOrderPage({ searchParams }: PageProps<'/[locale]/order'>) {
  const { plan } = await searchParams
  return <OrderView plan={plan} />
}
