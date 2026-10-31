import { Pencil } from 'lucide-react'
import { SortableRow, SortableTable } from '@/shared/components/ui'
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
  if (rows.length === 0) {
    return <p className="text-muted py-6 text-center text-sm">{emptyMessage}</p>
  }

  return (
    <SortableTable items={rows} disabled={reorderDisabled} onReorder={onReorder}>
      <table className="table-striped table min-w-2xl table-fixed">
        <thead>
          <tr>
            <th className="w-12">
              <span className="sr-only">Reorder</span>
            </th>
            <th>Code</th>
            <th className="w-48">Pricing</th>
            <th className="w-32 text-end">Price</th>
            <th className="w-32 text-end">Coverage</th>
            <th className="w-24">Active</th>
            <th className="w-16">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <SortableRow
              key={row.id}
              id={row.id}
              handleLabel={`Reorder ${row.code}`}
              disabledHint={reorderHint}
            >
              <td className="text-base-content truncate">{row.code}</td>
              <td>{addonPricingTypeLabels[row.pricingType]}</td>
              <td className="text-end tabular-nums">{formatSatang(row.price)}</td>
              <td className="text-end tabular-nums">
                {row.coverageAmount === null ? (
                  <span className="text-muted">—</span>
                ) : (
                  formatSatang(row.coverageAmount)
                )}
              </td>
              <td>
                <input
                  type="checkbox"
                  className="switch switch-primary"
                  checked={row.isActive}
                  disabled={pendingId === row.id}
                  onChange={() => onToggle(row)}
                  aria-label={`Toggle ${row.code} status`}
                />
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-soft btn-primary btn-square btn-sm"
                  aria-label={`Edit ${row.code}`}
                  onClick={() => onEdit(row)}
                >
                  <Pencil className="size-4" />
                </button>
              </td>
            </SortableRow>
          ))}
        </tbody>
      </table>
    </SortableTable>
  )
}
