'use client'

import { RotateCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { useRouter } from '@/shared/i18n'

// Retry = re-render the server view (router.refresh), which fetches the plans again.
// The view is a server component and can't hand down an onRetry callback, so it lives here
export function PlansLoadError() {
  const t = useTranslations('PLANS.PAGE')
  const router = useRouter()
  const [isRetrying, startRetry] = useTransition()

  return (
    <div
      role="alert"
      className="alert alert-error flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <span>{t('LOAD_ERROR')}</span>
      <button
        type="button"
        className="btn btn-sm"
        disabled={isRetrying}
        onClick={() => startRetry(() => router.refresh())}
      >
        {isRetrying ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <RotateCw className="size-4" aria-hidden />
        )}
        {t('RETRY')}
      </button>
    </div>
  )
}
