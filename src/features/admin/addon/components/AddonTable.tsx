import { Pencil } from 'lucide-react'
import { DataTable } from '@/shared/components/ui'
import type { DataTableColumn } from '@/shared/components/ui'
import { formatSatang } from '@/shared/utils'
import { addonPricingTypeLabels } from '../lib/addon.type'
import type { Addon } from '../lib/addon.type'

interface AddonTableProps {
  rows: Addon[]
  emptyMessage: string
  reorderDisabled: boolean
  /** Why reordering is off, shown on the drag handle */
  reorderHint?: string
  pendingId: string | null
  onReorder: (rows: Addon[]) => void
  onToggle: (addon: Addon) => void
  onEdit: (addon: Addon) => void
}

export function AddonTable({
  rows,
  emptyMessage,
  reorderDisabled,
  reorderHint,
  pendingId,
  onReorder,
  onToggle,
  onEdit,
}: AddonTableProps) {
  const columns: DataTableColumn<Addon>[] = [
    {
      key: 'code',
      header: 'Code',
      cell: (row) => row.code,
      className: 'text-base-content truncate',
      card: 'title',
    },
    {
      key: 'pricing',
      header: 'Pricing',
      cell: (row) => addonPricingTypeLabels[row.pricingType],
      className: 'w-48',
    },
    {
      key: 'price',
      header: 'Price',
      cell: (row) => formatSatang(row.price),
      className: 'w-32 tabular-nums',
      align: 'end',
    },
    {
      key: 'coverage',
      header: 'Coverage',
      cell: (row) =>
        row.coverageAmount === null ? (
          <span className="text-muted">—</span>
        ) : (
          formatSatang(row.coverageAmount)
        ),
      className: 'w-32 tabular-nums',
      align: 'end',
    },
    {
      key: 'active',
      header: 'Active',
      cell: (row) => (
        <input
          type="checkbox"
          className="switch switch-primary"
          checked={row.isActive}
          disabled={pendingId === row.id}
          onChange={() => onToggle(row)}
          aria-label={`Toggle ${row.code} status`}
        />
      ),
      className: 'w-24',
      card: 'action',
    },
    {
      key: 'edit',
      header: 'Actions',
      hideHeader: true,
      cell: (row) => (
        <button
          type="button"
          className="btn btn-soft btn-primary btn-square btn-sm"
          aria-label={`Edit ${row.code}`}
          onClick={() => onEdit(row)}
        >
          <Pencil className="size-4" />
        </button>
      ),
      className: 'w-16',
      card: 'action',
    },
  ]

  return (
    <DataTable
      rows={rows}
      columns={columns}
      emptyMessage={emptyMessage}
      reorder={{
        onReorder,
        getRowLabel: (row) => row.code,
        disabled: reorderDisabled,
        disabledHint: reorderHint,
      }}
    />
  )
}
