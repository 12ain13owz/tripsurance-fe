import { Search } from 'lucide-react'
import { SelectField, TextField } from '@/shared/components/forms'
import type { SelectOption } from '@/shared/components/forms'
import type { AddonFilters } from '../lib/addon.type'
import type { Control } from 'react-hook-form'

const statusOptions: SelectOption[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

interface AddonFilterProps {
  control: Control<AddonFilters>
  hasFilters: boolean
  onClear: () => void
}

export function AddonFilter({ control, hasFilters, onClear }: AddonFilterProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,20rem)_10rem_auto] sm:items-center">
      <TextField
        control={control}
        name="search"
        type="search"
        label="Search code"
        icon={Search}
        size="md"
      />
      <SelectField
        control={control}
        name="status"
        label="Status"
        options={statusOptions}
        size="md"
      />
      {hasFilters && (
        <button type="button" className="btn btn-outline" onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  )
}
