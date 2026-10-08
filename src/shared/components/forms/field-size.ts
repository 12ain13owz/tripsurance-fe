export const fieldSizeClass = {
  xs: { input: 'input-xs gap-1.5', icon: 'size-3.5', label: 'text-xs' },
  sm: { input: 'input-sm gap-2', icon: 'size-4', label: 'text-sm' },
  md: { input: 'input-md gap-2.5', icon: 'size-4.5', label: 'text-base' },
  lg: { input: 'input-lg gap-3', icon: 'size-5', label: 'text-lg' },
  xl: { input: 'input-xl gap-3', icon: 'size-6', label: 'text-xl' },
} as const

export type FieldSize = keyof typeof fieldSizeClass
export type FieldVariant = 'default' | 'floating'
