import { z } from 'zod'

export const ForgotPasswordFormSchema = z.object({
  email: z.email('Invalid email address').min(1, 'Email is required'),
})

export type ForgotPasswordFormValue = z.infer<typeof ForgotPasswordFormSchema>
