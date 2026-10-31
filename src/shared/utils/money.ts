const SATANG_PER_BAHT = 100

/** Baht as an admin types it (≤ 2 decimals) → integer satang, the only money unit the API accepts */
export function bahtToSatang(baht: number): number {
  return Math.round(baht * SATANG_PER_BAHT)
}

export function satangToBaht(satang: number): number {
  return satang / SATANG_PER_BAHT
}

/** 2050 → "฿20.50" */
export function formatSatang(satang: number): string {
  const baht = satangToBaht(satang).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `฿${baht}`
}
