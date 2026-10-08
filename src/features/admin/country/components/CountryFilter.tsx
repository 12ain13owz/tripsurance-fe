import { Search } from 'lucide-react'
import { SelectField, TextField } from '@/shared/components/forms'
import type { SelectOption } from '@/shared/components/forms'
import { countryRegions } from '../lib/country.type'
import type { CountryFilters } from '../lib/country.type'
import type { Control } from 'react-hook-form'

const regionOptions: SelectOption[] = [
  { value: 'all', label: 'All regions' },
  ...countryRegions.map((region) => ({ value: region, label: region })),
]

const statusOptions: SelectOption[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

interface CountryFilterProps {
  control: Control<CountryFilters>
}

export function CountryFilter({ control }: CountryFilterProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,20rem)_10rem_10rem]">
      <TextField
        control={control}
        name="search"
        type="search"
        label="Search country or ISO code"
        icon={Search}
        size="md"
      />
      <SelectField
        control={control}
        name="region"
        label="Region"
        options={regionOptions}
        size="md"
      />
      <SelectField
        control={control}
        name="status"
        label="Status"
        options={statusOptions}
        size="md"
      />
    </div>
  )
}
