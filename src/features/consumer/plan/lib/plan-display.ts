import { getCountryName } from '@/shared/utils'
import type { PlanPriceTier } from './plan.type'

/** More countries than this → the card shows a globe instead of a plane */
export const WORLDWIDE_MIN_COUNTRIES = 50

/** Country names shown on the card before "and N more" */
export const VISIBLE_COUNTRIES = 3

/** Lowest price = first tier (tiers are ordered by minDays) */
export function getStartingPrice(tiers: PlanPriceTier[]): number {
  return tiers.at(0)?.pricePerTraveller ?? 0
}

/** The plan's max trip length = last tier's maxDays */
export function getMaxTripDays(tiers: PlanPriceTier[]): number {
  return tiers.at(-1)?.maxDays ?? 0
}

export interface CountryLabel {
  isoCode: string
  name: string
}

/** Localized names, sorted the way the locale sorts them (Thai order for th) */
export function getSortedCountries(isoCodes: string[], locale: string): CountryLabel[] {
  const collator = new Intl.Collator(locale)
  return isoCodes
    .map((isoCode) => ({ isoCode, name: getCountryName(isoCode, locale) }))
    .sort((a, b) => collator.compare(a.name, b.name))
}

/** The bits of next-intl's `t` these helpers need (scoped to 'PLANS' or 'ADDONS') */
interface ItemTranslator {
  (key: string): string
  has: (key: string) => boolean
}

/** Copy is keyed by code; a code with no copy yet shows the code, never a raw message key */
export function getItemName(t: ItemTranslator, code: string): string {
  const key = `ITEMS.${code}.NAME`
  return t.has(key) ? t(key) : code
}

export function getItemDescription(t: ItemTranslator, code: string): string | null {
  const key = `ITEMS.${code}.DESCRIPTION`
  return t.has(key) ? t(key) : null
}
