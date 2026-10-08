import type { CountryRow } from '../lib/country.type'

interface CountryTableProps {
  rows: CountryRow[]
  pendingId: string | null
  onToggle: (country: CountryRow) => void
}

export function CountryTable({ rows, pendingId, onToggle }: CountryTableProps) {
  if (rows.length === 0) {
    return <p className="text-muted py-6 text-center text-sm">No countries found</p>
  }

  return (
    <table className="table-striped table table-fixed">
      <thead>
        <tr>
          <th>Country</th>
          <th className="w-28 md:w-40">ISO code</th>
          <th className="w-24 md:w-40">Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td className="text-base-content">{row.name}</td>
            <td className="tabular-nums">{row.isoCode}</td>
            <td>
              <input
                type="checkbox"
                className="switch switch-primary"
                checked={row.isActive}
                disabled={pendingId === row.id}
                onChange={() => onToggle(row)}
                aria-label={`Toggle ${row.name} status`}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
