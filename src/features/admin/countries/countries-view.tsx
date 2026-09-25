'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/core/session'
import { getCountryName } from '@/shared/utils'
import { getCountries, updateCountryStatus } from './lib/countries.api'
import type { Country } from './lib/countries.api'

export function CountriesView() {
  const { accessToken } = useSession()
  const [countries, setCountries] = useState<Country[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  useEffect(() => {
    getCountries()
      .then(setCountries)
      .catch(() => setError('Unable to load countries'))
  }, [])

  async function handleToggle(country: Country) {
    if (!accessToken || pendingId) {
      return
    }
    setPendingId(country.id)
    try {
      const updated = await updateCountryStatus(country.id, !country.isActive, accessToken)
      setCountries((prev) => prev?.map((c) => (c.id === updated.id ? updated : c)) ?? prev)
    } catch {
      setError('Unable to update country status')
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="bg-base-100 border-base-300 rounded-box flex flex-col gap-1 border p-4 shadow-sm sm:p-5">
      <div className="mt-2 overflow-x-auto">
        {error && <p className="text-error text-sm">{error}</p>}
        {!error && !countries && <p className="text-muted text-sm">Loading…</p>}
        {!error && countries && countries.length === 0 && (
          <p className="text-muted text-sm">No countries yet</p>
        )}
        {!error && countries && countries.length > 0 && (
          <table className="table-zebra table text-xs">
            <thead>
              <tr>
                <th>Country</th>
                <th>ISO code</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country) => (
                <tr key={country.id}>
                  <td className="text-base-content">{getCountryName(country.isoCode)}</td>
                  <td className="tabular-nums">{country.isoCode}</td>
                  <td className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      className="switch switch-primary"
                      id="switchType2"
                      checked={country.isActive}
                      disabled={pendingId === country.id}
                      onChange={() => void handleToggle(country)}
                      aria-label={`Toggle ${getCountryName(country.isoCode)} status`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
