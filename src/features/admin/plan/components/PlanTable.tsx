import { Pencil } from 'lucide-react'
import { DataTable } from '@/shared/components/ui'
import type { DataTableColumn } from '@/shared/components/ui'
import { formatSatang } from '@/shared/utils'
import type { Plan } from '../lib/plan.type'

function formatCount(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}

// The last tier's maxDays is the plan's max trip length
function formatTripLength(plan: Plan): string {
  const maxDays = plan.tiers.at(-1)?.maxDays ?? 0
  return `Up to ${maxDays} days`
}

// Lowest tier price, as the storefront shows it; every tier is in the edit form
function formatStartingPrice(plan: Plan): string {
  return `From ${formatSatang(Math.min(...plan.tiers.map((tier) => tier.pricePerTraveller)))}`
}

interface PlanTableProps {
  rows: Plan[]
  emptyMessage: string
  reorderDisabled: boolean
  /** Why reordering is off, shown on the drag handle */
  reorderHint?: string
  pendingId: string | null
  onReorder: (rows: Plan[]) => void
  onToggle: (plan: Plan) => void
  onEdit: (plan: Plan) => void
}

export function PlanTable({
  rows,
  emptyMessage,
  reorderDisabled,
  reorderHint,
  pendingId,
  onReorder,
  onToggle,
  onEdit,
}: PlanTableProps) {
  const columns: DataTableColumn<Plan>[] = [
    {
      key: 'code',
      header: 'Code',
      cell: (row) => row.code,
      className: 'text-base-content truncate',
      card: 'title',
    },
    {
      key: 'countries',
      header: 'Countries',
      cell: (row) => formatCount(row.countries.length, 'country', 'countries'),
      // Secondary: hidden in the table until xl so it fits beside the sidebar; cards still show it
      className: 'hidden w-28 xl:table-cell',
    },
    {
      key: 'tripLength',
      header: 'Trip length',
      cell: formatTripLength,
      className: 'w-32',
    },
    {
      key: 'price',
      header: 'Price / traveller',
      cell: formatStartingPrice,
      className: 'w-36 tabular-nums',
      align: 'end',
    },
    {
      key: 'addons',
      header: 'Add-ons',
      cell: (row) =>
        row.addons.length === 0 ? (
          <span className="text-muted">—</span>
        ) : (
          formatCount(row.addons.length, 'add-on', 'add-ons')
        ),
      className: 'hidden w-24 xl:table-cell',
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
      className: 'w-20',
      card: 'action',
    },
    {
      key: 'edit',
      header: '',
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
