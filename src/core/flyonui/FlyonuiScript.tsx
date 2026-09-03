// FlyonuiScript.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

async function loadFlyonUI() {
  return import('flyonui/flyonui')
}

export default function FlyonuiScript() {
  const path = usePathname()

  useEffect(() => {
    const initFlyonUI = async () => {
      await loadFlyonUI()
    }

    void initFlyonUI()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (window.HSStaticMethods && typeof window.HSStaticMethods.autoInit === 'function') {
        window.HSStaticMethods.autoInit()
      }
    }, 100)
  }, [path])

  return null
}
