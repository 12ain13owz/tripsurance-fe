'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Pagination, Panel } from '@/shared/components/ui'
import { getCountryName } from '@/shared/utils'
import { CountryFilter } from './components/CountryFilter'
import { CountryTable } from './components/CountryTable'
import { getCountryRegion } from './lib/country-region'
import { getCountries, updateCountryStatus } from './lib/country.api'
import type { Country, CountryFilters, CountryRow } from './lib/country.type'

const PAGE_SIZE = 20

const defaultFilters: CountryFilters = { search: '', region: 'all', status: 'all' }

export function CountryView() {
  const [countries, setCountries] = useState<Country[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const { control } = useForm<CountryFilters>({ defaultValues: defaultFilters })
  const [search, region, status] = useWatch({ control, name: ['search', 'region', 'status'] })

  const filterKey = `${search}|${region}|${status}`
  const [pageState, setPageState] = useState({ filterKey, page: 1 })
  const page = pageState.filterKey === filterKey ? pageState.page : 1

  function setPage(nextPage: number) {
    setPageState({ filterKey, page: nextPage })
  }

  useEffect(() => {
    getCountries()
      .then(setCountries)
      .catch(() => setLoadError('Unable to load countries'))
  }, [])

  const rows = useMemo<CountryRow[]>(
    () =>
      (countries ?? [])
        .map((country) => ({
          ...country,
          name: getCountryName(country.isoCode),
          region: getCountryRegion(country.isoCode),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [countries]
  )

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()

    return rows.filter(
      (row) =>
        (query === '' ||
          row.name.toLowerCase().includes(query) ||
          row.isoCode.toLowerCase().includes(query)) &&
        (region === 'all' || row.region === region) &&
        (status === 'all' || row.isActive === (status === 'active'))
    )
  }, [rows, search, region, status])

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageRows = filteredRows.slice(pageStart, pageStart + PAGE_SIZE)

  async function handleToggle(country: Country) {
    if (pendingId) {
      return
    }

    setPendingId(country.id)
    setLoadError(null)
    try {
      const updated = await updateCountryStatus(country.id, !country.isActive)
      setCountries((prev) => prev?.map((c) => (c.id === updated.id ? updated : c)) ?? prev)
    } catch {
      setLoadError('Unable to update country status')
    } finally {
      setPendingId(null)
    }
  }

  return (
    <Panel className="gap-4 sm:max-h-[calc(100svh-var(--spacing-admin-topbar)-3rem)]">
      {loadError && <p className="text-error text-sm">{loadError}</p>}
      {!loadError && !countries && <p className="text-muted text-sm">Loading…</p>}
      {countries && (
        <>
          <CountryFilter control={control} />
          <div className="min-h-0 flex-1 overflow-auto">
            <CountryTable
              rows={pageRows}
              pendingId={pendingId}
              onToggle={(country) => void handleToggle(country)}
            />
          </div>
          {filteredRows.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-muted text-sm tabular-nums">
                Showing {pageStart + 1}–{pageStart + pageRows.length} of {filteredRows.length}
              </p>
              <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </Panel>
  )
}
