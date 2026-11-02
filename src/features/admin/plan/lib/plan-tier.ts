/** A tier starts the day after the previous one ends; the first starts at day 1. null = previous end not entered yet */
export function getTierMinDays(tiers: { maxDays: string }[], index: number): number | null {
  if (index === 0) {
    return 1
  }

  const previousMaxDays = Number(tiers[index - 1].maxDays)
  return Number.isInteger(previousMaxDays) && previousMaxDays > 0 ? previousMaxDays + 1 : null
}
