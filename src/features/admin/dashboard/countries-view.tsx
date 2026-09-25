import { getCountryName } from '@/shared/utils'
import { BarList } from './components/BarList'
import { topCountries } from './lib/mock-data'

const COUNTRY_COLORS = [
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--color-accent)',
  'var(--color-info)',
  'var(--color-success)',
  'var(--color-neutral)',
]

export function CountriesView() {
  const items = topCountries.map((country, index) => ({
    key: country.isoCode,
    label: getCountryName(country.isoCode),
    value: country.policies,
    color: COUNTRY_COLORS[index % COUNTRY_COLORS.length],
  }))

  return (
    <div className="bg-base-100 border-base-300 rounded-box flex flex-col gap-1 border p-4 shadow-sm sm:p-5">
      <h2 className="text-base font-semibold">Top destination countries</h2>
      <p className="text-muted text-sm">Policies sold this month, by destination</p>
      <div className="mt-2">
        <BarList items={items} />
      </div>
    </div>
  )
}
