import { SignInForm } from './components/SignInForm'
import { SignInHeader } from './components/SignInHeader'

export function SignInView() {
  return (
    <div className="flex flex-col gap-6">
      <SignInHeader />
      <div className="divider" />
      <SignInForm />
    </div>
  )
}
