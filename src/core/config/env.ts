const normalizeBaseUrl = (value: string | undefined, fallback: string): string =>
  (value?.trim() || fallback).replace(/\/$/, '')

const publicApiUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL, 'http://localhost:3000')

export const env = {
  apiBaseUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL, 'http://localhost:3000'),
  apiServerUrl: normalizeBaseUrl(process.env.API_INTERNAL_URL, publicApiUrl),
  isDev: process.env.NODE_ENV === 'development',
} as const
