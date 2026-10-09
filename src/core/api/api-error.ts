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

export const SESSION_EXPIRED_MESSAGE = 'Your session has expired, please sign in again'

/** Thrown when a 401 couldn't be fixed by refreshing; the session has already been cleared */
export class SessionExpiredError extends ApiError {
  constructor() {
    super(SESSION_EXPIRED_MESSAGE, 401)
    this.name = 'SessionExpiredError'
  }
}
