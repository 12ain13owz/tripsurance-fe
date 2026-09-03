const normalizeBaseUrl = (value: string | undefined, fallback: string): string =>
  (value?.trim() || fallback).replace(/\/$/, '')

export const env = {
  apiBaseUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL, 'http://localhost:3000'),
} as const
