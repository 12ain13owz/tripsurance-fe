// global.d.ts
import type { IStaticMethods } from 'flyonui/flyonui'

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods
  }
}

export {}
