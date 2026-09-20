import { z } from 'zod'

export const ResetPasswordFormSchema = z
  .object({
    newPassword: z.string({ error: 'Password is required' }),
    confirmPassword: z.string({ error: 'Confirm password is required' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormValue = z.infer<typeof ResetPasswordFormSchema>
