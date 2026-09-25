const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

export function getCountryName(isoCode: string): string {
  return regionNames.of(isoCode) ?? isoCode
}
