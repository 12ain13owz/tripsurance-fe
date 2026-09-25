import { formatInt } from '@/shared/utils'

interface BarListItem {
  key: string
  label: string
  value: number
  color: string
  secondaryLine?: string
}

export function BarList({ items }: { items: BarListItem[] }) {
  const max = Math.max(...items.map((item) => item.value))
  const total = items.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const widthPct = ((item.value / max) * 100).toFixed(1)
        const sharePct = ((item.value / total) * 100).toFixed(1)
        return (
          <div key={item.key} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-base-content">{item.label}</span>
              <span className="tabular-nums">
                {formatInt(item.value)} <span className="text-subtle">({sharePct}%)</span>
              </span>
            </div>
            <div className="bg-base-200 h-2 w-full overflow-hidden rounded-full">
              <div className="h-full rounded-full" style={{ width: `${widthPct}%`, backgroundColor: item.color }} />
            </div>
            {item.secondaryLine && <p className="text-subtle text-xs tabular-nums">{item.secondaryLine}</p>}
          </div>
        )
      })}
    </div>
  )
}
