export function formatInt(value: number): string {
  return Math.round(value).toLocaleString('en-US')
}

export function formatThb(value: number): string {
  return `฿${formatInt(value)}`
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
