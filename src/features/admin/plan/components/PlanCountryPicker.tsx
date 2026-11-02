'use client'

import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { countryRegions, getCountryName, getCountryRegion } from '@/shared/utils'
import type { CountryRegion } from '@/shared/utils'
import type { PlanCountryOption } from '../lib/plan.type'
import type { KeyboardEvent } from 'react'

// Enter in the search box would otherwise submit the whole plan form
function preventSubmitOnEnter(event: KeyboardEvent<HTMLInputElement>) {
  if (event.key === 'Enter') {
    event.preventDefault()
  }
}

interface PlanCountryPickerProps {
  countries: PlanCountryOption[]
  /** Selected country ids */
  value: string[]
  onChange: (ids: string[]) => void
}

export function PlanCountryPicker({ countries, value, onChange }: PlanCountryPickerProps) {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState<CountryRegion | 'all'>('all')
  const [selectedOnly, setSelectedOnly] = useState(false)
  const selected = useMemo(() => new Set(value), [value])

  const rows = useMemo(
    () =>
      countries
        .map((country) => ({
          ...country,
          name: getCountryName(country.isoCode),
          region: getCountryRegion(country.isoCode),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [countries]
  )

  const query = search.trim().toLowerCase()
  const visibleRows = rows.filter(
    (row) =>
      (query === '' ||
        row.name.toLowerCase().includes(query) ||
        row.isoCode.toLowerCase().includes(query)) &&
      (region === 'all' || row.region === region) &&
      (!selectedOnly || selected.has(row.id))
  )

  function toggle(id: string) {
    onChange(selected.has(id) ? value.filter((selectedId) => selectedId !== id) : [...value, id])
  }

  function selectShown() {
    onChange([...new Set([...value, ...visibleRows.map((row) => row.id)])])
  }

  function clearShown() {
    const shown = new Set(visibleRows.map((row) => row.id))
    onChange(value.filter((id) => !shown.has(id)))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem]">
        <label className="input input-md gap-2.5">
          <Search aria-hidden className="text-disabled my-auto size-4.5 shrink-0" />
          <input
            type="search"
            className="grow"
            placeholder="Search name or code"
            aria-label="Search countries"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={preventSubmitOnEnter}
          />
        </label>
        <select
          className="select select-md"
          aria-label="Region"
          value={region}
          onChange={(event) => setRegion(event.target.value as CountryRegion | 'all')}
        >
          <option value="all">All regions</option>
          {countryRegions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="text-muted">{value.length} selected</span>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={selectedOnly}
            onChange={(event) => setSelectedOnly(event.target.checked)}
          />
          Selected only
        </label>
        <button
          type="button"
          className="btn btn-text btn-sm"
          disabled={visibleRows.length === 0}
          onClick={selectShown}
        >
          Select shown ({visibleRows.length})
        </button>
        <button
          type="button"
          className="btn btn-text btn-sm"
          disabled={visibleRows.length === 0}
          onClick={clearShown}
        >
          Clear shown
        </button>
      </div>

      <div className="border-base-300 rounded-box max-h-72 overflow-y-auto border p-2">
        {visibleRows.length === 0 ? (
          <p className="text-muted p-2 text-sm">No countries found</p>
        ) : (
          <ul className="grid sm:grid-cols-2">
            {visibleRows.map((row) => (
              <li key={row.id}>
                <label className="hover:bg-base-200 rounded-box flex items-center gap-2 px-2 py-1.5 text-sm">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={selected.has(row.id)}
                    onChange={() => toggle(row.id)}
                  />
                  <span className="truncate">{row.name}</span>
                  <span className="text-muted">{row.isoCode}</span>
                  {!row.isActive && (
                    <span className="badge badge-soft badge-sm ms-auto">Inactive</span>
                  )}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
