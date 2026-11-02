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
  return `1–${maxDays} days`
}

function formatPriceRange(plan: Plan): string {
  const prices = plan.tiers.map((tier) => tier.pricePerTraveller)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return min === max ? formatSatang(min) : `${formatSatang(min)} – ${formatSatang(max)}`
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
}

export function PlanTable({
  rows,
  emptyMessage,
  reorderDisabled,
  reorderHint,
  pendingId,
  onReorder,
  onToggle,
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
      className: 'w-32',
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
      cell: formatPriceRange,
      className: 'w-56 tabular-nums',
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
      className: 'w-28',
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
