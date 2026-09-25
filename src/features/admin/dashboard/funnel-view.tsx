import { formatInt } from '@/shared/utils'
import { funnelStages } from './lib/mock-data'

const STAGE_COLORS = [
  'color-mix(in oklab, var(--color-primary) 35%, transparent)',
  'color-mix(in oklab, var(--color-primary) 55%, transparent)',
  'color-mix(in oklab, var(--color-primary) 78%, transparent)',
  'var(--color-primary)',
]

export function FunnelView() {
  const max = funnelStages[0].value
  const conversionRate = ((funnelStages[funnelStages.length - 1].value / funnelStages[0].value) * 100).toFixed(1)

  return (
    <div className="bg-base-100 border-base-300 rounded-box flex flex-col gap-1 border p-4 shadow-sm sm:p-5">
      <h2 className="text-base font-semibold">Purchase funnel</h2>
      <p className="text-muted text-sm">From quote request to completed purchase</p>

      <div className="mt-3 flex flex-col gap-2.5">
        {funnelStages.map((stage, index) => {
          const widthPct = ((stage.value / max) * 100).toFixed(1)
          const retainedPct = index === 0 ? null : ((stage.value / funnelStages[index - 1].value) * 100).toFixed(0)
          return (
            <div key={stage.stage} className="flex flex-col gap-1">
              {retainedPct !== null && (
                <p className="text-subtle text-center text-[11px] tabular-nums">↓ {retainedPct}% continued</p>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-base-content">{stage.stage}</span>
                <span className="tabular-nums">{formatInt(stage.value)}</span>
              </div>
              <div className="bg-base-200 h-4 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${widthPct}%`, backgroundColor: STAGE_COLORS[index] ?? 'var(--color-primary)' }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-base-300 mt-3 flex items-center justify-between border-t pt-3 text-xs">
        <span className="text-subtle">Overall conversion rate</span>
        <span className="text-success font-semibold tabular-nums">{conversionRate}%</span>
      </div>
    </div>
  )
}
