import { Notyf } from 'notyf'

let instance: Notyf | null = null

function getNotyf(): Notyf | null {
  if (typeof window === 'undefined') {
    return null
  }

  instance ??= new Notyf({
    position: { x: 'right', y: 'top' },
    types: [
      { type: 'success', background: 'var(--color-success)', duration: 3000 },
      { type: 'error', background: 'var(--color-error)', duration: 6000, dismissible: true },
    ],
  })

  return instance
}

export const notify = {
  success: (message: string) => getNotyf()?.success(message),
  error: (message: string) => getNotyf()?.error(message),
}
