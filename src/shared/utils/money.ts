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

const bahtFormatters = new Map<string, Intl.NumberFormat>()

// One formatter per locale, built on first use and reused — a plan card formats ~15 amounts
function getBahtFormatter(locale: string): Intl.NumberFormat {
  let formatter = bahtFormatters.get(locale)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'THB',
      // "฿" in every locale; the default symbol would be "THB" in some (e.g. en-US)
      currencyDisplay: 'narrowSymbol',
      // Whole baht drop ".00" (฿290), but satang always show two digits (฿20.50, never ฿20.5)
      minimumFractionDigits: 2,
      trailingZeroDisplay: 'stripIfInteger',
    })
    bahtFormatters.set(locale, formatter)
  }
  return formatter
}

/** Consumer prices: 29000 → "฿290", 2050 → "฿20.50", in the given locale's digit grouping */
export function formatBaht(satang: number, locale: string): string {
  return getBahtFormatter(locale).format(satangToBaht(satang))
}
