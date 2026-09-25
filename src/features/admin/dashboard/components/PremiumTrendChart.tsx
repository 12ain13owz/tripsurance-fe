'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { monthlyRevenue } from '../lib/mock-data'

const WIDTH = 640
const HEIGHT = 220
const PAD_LEFT = 44
const PAD_RIGHT = 12
const PAD_TOP = 16
const PAD_BOTTOM = 28
const MAX_VALUE = 4000
const PLOT_WIDTH = WIDTH - PAD_LEFT - PAD_RIGHT
const PLOT_HEIGHT = HEIGHT - PAD_TOP - PAD_BOTTOM
const GRID_VALUES = [0, 1000, 2000, 3000, 4000]

function xAt(index: number) {
  return PAD_LEFT + (index * PLOT_WIDTH) / (monthlyRevenue.length - 1)
}

function yAt(value: number) {
  return PAD_TOP + ((MAX_VALUE - value) / MAX_VALUE) * PLOT_HEIGHT
}

export function PremiumTrendChart() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [wrapperSize, setWrapperSize] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) {
      return
    }
    const updateSize = () => setWrapperSize({ width: el.clientWidth, height: el.clientHeight })
    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const points = useMemo(() => monthlyRevenue.map((d, i) => [xAt(i), yAt(d.value)] as const), [])
  const linePath = useMemo(
    () => points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' '),
    [points]
  )
  const areaPath = useMemo(() => {
    const first = points[0]
    const last = points[points.length - 1]
    const baseline = (PAD_TOP + PLOT_HEIGHT).toFixed(1)
    return `${linePath} L${last[0].toFixed(1)},${baseline} L${first[0].toFixed(1)},${baseline} Z`
  }, [linePath, points])

  const hoverPoint = hoverIndex !== null ? points[hoverIndex] : null
  const tooltipLeft =
    hoverPoint && wrapperSize
      ? Math.min(Math.max((hoverPoint[0] / WIDTH) * wrapperSize.width, 40), wrapperSize.width - 40)
      : 0
  const tooltipTop =
    hoverPoint && wrapperSize ? Math.max((hoverPoint[1] / HEIGHT) * wrapperSize.height - 40, 0) : 0

  return (
    <div className="bg-base-100 border-base-300 rounded-box flex flex-col gap-3 border p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-semibold">Monthly premium revenue</h2>
          <p className="text-muted text-sm">Oct 2025 – Sep 2026 · THB, millions</p>
        </div>
        <div className="text-subtle flex shrink-0 items-center gap-1.5 text-xs">
          <span className="bg-primary inline-block size-2.5 rounded-full" />
          Premium revenue
        </div>
      </div>

      <div className="relative" ref={wrapperRef}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full">
          <defs>
            <linearGradient id="premiumTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {GRID_VALUES.map((value) => {
            const y = yAt(value)
            return (
              <g key={value}>
                <line
                  x1={PAD_LEFT}
                  x2={WIDTH - PAD_RIGHT}
                  y1={y}
                  y2={y}
                  className="stroke-base-300"
                  strokeWidth={1}
                />
                <text
                  x={PAD_LEFT - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-base-content/40 text-[10px] tabular-nums"
                >
                  {(value / 1000).toFixed(1)}M
                </text>
              </g>
            )
          })}

          <path d={areaPath} fill="url(#premiumTrendFill)" stroke="none" />
          <path
            d={linePath}
            fill="none"
            className="stroke-primary"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {points.map((point, i) => (
            <circle
              key={monthlyRevenue[i].month}
              cx={point[0]}
              cy={point[1]}
              r={hoverIndex === i ? 5 : i === points.length - 1 ? 4 : 3}
              className="fill-base-100 stroke-primary"
              strokeWidth={2}
            />
          ))}

          {hoverPoint && (
            <line
              x1={hoverPoint[0]}
              x2={hoverPoint[0]}
              y1={PAD_TOP}
              y2={PAD_TOP + PLOT_HEIGHT}
              className="stroke-base-300"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
          )}

          {monthlyRevenue.map((d, i) =>
            i % 2 === 0 ? (
              <text
                key={d.month}
                x={xAt(i)}
                y={HEIGHT - 8}
                textAnchor="middle"
                className="fill-base-content/40 text-[10px]"
              >
                {d.month}
              </text>
            ) : null
          )}

          {monthlyRevenue.map((_, i) => {
            const x0 = i === 0 ? PAD_LEFT : (xAt(i - 1) + xAt(i)) / 2
            const x1 = i === monthlyRevenue.length - 1 ? WIDTH - PAD_RIGHT : (xAt(i) + xAt(i + 1)) / 2
            return (
              <rect
                key={monthlyRevenue[i].month}
                x={x0}
                y={PAD_TOP}
                width={x1 - x0}
                height={PLOT_HEIGHT}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            )
          })}
        </svg>

        {hoverPoint && hoverIndex !== null && (
          <div
            className="bg-neutral text-neutral-content rounded-box pointer-events-none absolute px-2.5 py-1.5 text-xs whitespace-nowrap"
            style={{ left: tooltipLeft, top: tooltipTop, transform: 'translate(-50%, 0)' }}
          >
            <strong className="tabular-nums">{(monthlyRevenue[hoverIndex].value / 1000).toFixed(2)}M</strong>{' '}
            {monthlyRevenue[hoverIndex].month}
          </div>
        )}
      </div>
    </div>
  )
}
