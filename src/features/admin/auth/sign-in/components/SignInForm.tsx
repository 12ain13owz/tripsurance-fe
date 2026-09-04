'use client'

import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-4">
        <div className="input-floating">
          <input
            id="email"
            type="email"
            placeholder="Email address"
            className="input input-lg ps-11"
            autoComplete="email"
          />
          <Mail className="text-base-content/40 pointer-events-none absolute inset-s-4 top-1/2 size-5 -translate-y-1/2" />
          <label htmlFor="email" className="input-floating-label ps-7.5">
            Email address
          </label>
        </div>

        <div className="input-floating">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="input input-lg px-11"
            autoComplete="current-password"
          />
          <Lock className="text-base-content/40 pointer-events-none absolute inset-s-4 top-1/2 size-5 -translate-y-1/2" />
          <label htmlFor="password" className="input-floating-label ps-7.5">
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="text-base-content/40 hover:text-base-content/70 absolute inset-e-4 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" />
          <span className="text-base-content/70 text-sm">Remember me</span>
        </label>

        <Link
          href="/admin/forgot-password"
          className="text-primary text-sm font-medium hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <button type="submit" className="btn btn-primary btn-lg w-full">
        Sign in
      </button>
    </form>
  )
}
