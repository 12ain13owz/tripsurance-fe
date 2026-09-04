'use client'

import { useState } from 'react'
import { SignInForm } from './components/SignInForm'
import { SignInHeader } from './components/SignInHeader'
import type { SignInFormValue } from './schemas/sign-in-form.schema'

export function SignInView() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(value: SignInFormValue) {
    setIsSubmitting(true)
    // TODO: wire to core/session once the admin auth API is implemented

    setTimeout(() => {
      setIsSubmitting(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <SignInHeader />
      <div className="divider" />
      <SignInForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </div>
  )
}
