export const UNEXPECTED_ERROR_MESSAGE = 'Something went wrong, please try again'

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : UNEXPECTED_ERROR_MESSAGE
}
