'use client'

import { AlertCircle, PiggyBank, Receipt, ShieldCheck, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { cn, formatInt, formatPercent, formatThb } from '@/shared/utils'
import { kpiByPeriod, periodOptions } from '../lib/mock-data'
import type { Period } from '../lib/mock-data'

function claimRateStatus(claimRate: number) {
  if (claimRate < 13) {
    return { label: 'Normal', tone: 'badge-success' } as const
  }
  if (claimRate < 16) {
    return { label: 'Watch', tone: 'badge-warning' } as const
  }
  return { label: 'High', tone: 'badge-error' } as const
}

function DeltaLabel({ value, invert = false, unit }: { value: number; invert?: boolean; unit: '%' | 'pp' }) {
  const isGood = invert ? value <= 0 : value >= 0
  const sign = value >= 0 ? '+' : ''
  const suffix = unit === 'pp' ? ' pp' : '%'
  return (
    <p className={cn('flex items-center gap-1.5 text-xs tabular-nums', isGood ? 'text-success' : 'text-error')}>
      <span>
        {value >= 0 ? '▲' : '▼'} {sign}
        {value.toFixed(1)}
        {suffix}
      </span>
      <span className="text-subtle">vs prior period</span>
    </p>
  )
}

export function KpiCards() {
  const [period, setPeriod] = useState<Period>('month')
  const kpi = kpiByPeriod[period]
  const claimStatus = claimRateStatus(kpi.claimRate)

  return (
    <section className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-1.5">
        <div className="border-base-300 bg-base-200 inline-flex w-fit gap-1 rounded-full border p-1">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPeriod(option.value)}
              className={cn('btn btn-sm rounded-full', period === option.value ? 'btn-primary' : 'btn-text')}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-muted text-xs">{kpi.label}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="bg-base-100 border-base-300 rounded-box flex flex-col gap-1.5 border p-4 shadow-sm">
          <span className="text-subtle flex items-center gap-1.5 text-xs font-medium">
            <PiggyBank className="size-3.5" /> Premium revenue
          </span>
          <span className="text-xl font-semibold tabular-nums">{formatThb(kpi.revenue)}</span>
          <DeltaLabel value={kpi.revenueDelta} unit="%" />
        </div>

        <div className="bg-base-100 border-base-300 rounded-box flex flex-col gap-1.5 border p-4 shadow-sm">
          <span className="text-subtle flex items-center gap-1.5 text-xs font-medium">
            <ShieldCheck className="size-3.5" /> Policies sold
          </span>
          <span className="text-xl font-semibold tabular-nums">{formatInt(kpi.policies)}</span>
          <DeltaLabel value={kpi.policiesDelta} unit="%" />
        </div>

        <div className="bg-base-100 border-base-300 rounded-box flex flex-col gap-1.5 border p-4 shadow-sm">
          <span className="text-subtle flex items-center gap-1.5 text-xs font-medium">
            <Receipt className="size-3.5" /> Avg premium / policy
          </span>
          <span className="text-xl font-semibold tabular-nums">{formatThb(kpi.avgPremium)}</span>
          <DeltaLabel value={kpi.avgPremiumDelta} unit="%" />
        </div>

        <div className="bg-base-100 border-base-300 rounded-box flex flex-col gap-1.5 border p-4 shadow-sm">
          <span className="text-subtle flex items-center gap-1.5 text-xs font-medium">
            <AlertCircle className="size-3.5" /> Claim rate
          </span>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-xl font-semibold tabular-nums">{formatPercent(kpi.claimRate)}</span>
            <span className={cn('badge badge-sm', claimStatus.tone)}>{claimStatus.label}</span>
          </div>
          <DeltaLabel value={kpi.claimRateDelta} invert unit="pp" />
        </div>

        <div className="bg-base-100 border-base-300 rounded-box flex flex-col gap-1.5 border p-4 shadow-sm">
          <span className="text-subtle flex items-center gap-1.5 text-xs font-medium">
            <TrendingUp className="size-3.5" /> Conversion rate
          </span>
          <span className="text-xl font-semibold tabular-nums">{formatPercent(kpi.conversionRate)}</span>
          <DeltaLabel value={kpi.conversionRateDelta} unit="pp" />
        </div>
      </div>
    </section>
  )
}
