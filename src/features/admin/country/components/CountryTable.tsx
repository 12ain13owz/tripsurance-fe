import { DataTable } from '@/shared/components/ui'
import type { DataTableColumn, DataTablePagination } from '@/shared/components/ui'
import type { CountryRow } from '../lib/country.type'

interface CountryTableProps {
  rows: CountryRow[]
  pagination: DataTablePagination
  pendingId: string | null
  onToggle: (country: CountryRow) => void
}

export function CountryTable({ rows, pagination, pendingId, onToggle }: CountryTableProps) {
  const columns: DataTableColumn<CountryRow>[] = [
    {
      key: 'name',
      header: 'Country',
      cell: (row) => row.name,
      className: 'text-base-content',
      card: 'title',
    },
    {
      key: 'isoCode',
      header: 'ISO code',
      cell: (row) => row.isoCode,
      className: 'w-40 tabular-nums',
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <input
          type="checkbox"
          className="switch switch-primary"
          checked={row.isActive}
          disabled={pendingId === row.id}
          onChange={() => onToggle(row)}
          aria-label={`Toggle ${row.name} status`}
        />
      ),
      className: 'w-40',
      card: 'action',
    },
  ]

  return (
    <DataTable
      rows={rows}
      columns={columns}
      emptyMessage="No countries found"
      pagination={pagination}
    />
  )
}
