import { useLocale, useTranslations } from 'next-intl'
import { Modal } from '@/shared/components/ui'
import { formatBaht } from '@/shared/utils'
import { getItemName, getSortedCountries } from '../lib/plan-display'
import type { PublicPlan } from '../lib/plan.type'
import type { ReactNode } from 'react'

interface PlanDetailsModalProps {
  plan: PublicPlan
  onClose: () => void
}

export function PlanDetailsModal({ plan, onClose }: PlanDetailsModalProps) {
  const t = useTranslations('PLANS')
  const tAddons = useTranslations('ADDONS')
  const locale = useLocale()
  const isSinglePrice = plan.tiers.length === 1

  return (
    <Modal
      open
      title={getItemName(t, plan.code)}
      closeLabel={t('DETAILS.CLOSE')}
      onClose={onClose}
      size="lg"
    >
      <div className="flex flex-col gap-6">
        <DetailsSection title={t('DETAILS.TIERS_TITLE')}>
          <table className="table tabular-nums">
            <thead>
              <tr>
                <th>{t('DETAILS.TIER_DAYS_HEADER')}</th>
                <th className="text-end">{t('DETAILS.TIER_PRICE_HEADER')}</th>
              </tr>
            </thead>
            <tbody>
              {plan.tiers.map((tier) => (
                <tr key={tier.minDays}>
                  <td>{t('DETAILS.TIER_RANGE', { min: tier.minDays, max: tier.maxDays })}</td>
                  <td className="text-end font-medium">
                    {formatBaht(tier.pricePerTraveller, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-muted text-sm">
            {isSinglePrice
              ? t('CARD.TAX_NOTE')
              : `${t('DETAILS.BAND_NOTE')} · ${t('CARD.TAX_NOTE')}`}
          </p>
        </DetailsSection>

        {plan.addons.length > 0 && (
          <DetailsSection title={t('DETAILS.ADDONS_TITLE')}>
            <ul className="divide-base-300 flex flex-col divide-y">
              {plan.addons.map((addon) => (
                <li key={addon.code} className="flex justify-between gap-4 py-2">
                  <div className="flex flex-col">
                    <span>{getItemName(tAddons, addon.code)}</span>
                    {addon.coverageAmount !== null && (
                      <span className="text-muted text-sm">
                        {t('DETAILS.ADDON_EXTRA_COVERAGE', {
                          amount: formatBaht(addon.coverageAmount, locale),
                        })}
                      </span>
                    )}
                  </div>
                  <span className="whitespace-nowrap tabular-nums">
                    {formatBaht(addon.price, locale)}{' '}
                    <span className="text-muted text-sm">
                      {tAddons(`PRICING.${addon.pricingType}`)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </DetailsSection>
        )}

        <DetailsSection title={t('DETAILS.COUNTRIES_TITLE', { count: plan.countries.length })}>
          <div className="flex flex-wrap gap-2">
            {getSortedCountries(plan.countries, locale).map((country) => (
              <span key={country.isoCode} className="badge badge-soft">
                {country.name}
              </span>
            ))}
          </div>
        </DetailsSection>
      </div>
    </Modal>
  )
}

interface DetailsSectionProps {
  title: string
  children: ReactNode
}

function DetailsSection({ title, children }: DetailsSectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <h4 className="text-muted text-sm font-medium">{title}</h4>
      {children}
    </section>
  )
}
