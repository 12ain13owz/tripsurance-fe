// Same shape as Plan.code in the BE (lowercase kebab-case, max 50) — anything else in the URL is ignored
const PLAN_CODE_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
const PLAN_CODE_MAX_LENGTH = 50

/** `?plan=` from a plan card; null when missing or not a plan code */
export function parsePlanCode(value: string | string[] | undefined): string | null {
  if (typeof value !== 'string' || value.length > PLAN_CODE_MAX_LENGTH) {
    return null
  }
  return PLAN_CODE_PATTERN.test(value) ? value : null
}
