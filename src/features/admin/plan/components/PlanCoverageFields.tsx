import { TextField } from '@/shared/components/forms'
import { planCoverageCategories, planCoverageCategoryLabels } from '../lib/plan.type'
import type { PlanFormValue } from '../schemas/plan-form.schema'
import type { Control } from 'react-hook-form'

interface PlanCoverageFieldsProps {
  control: Control<PlanFormValue>
}

export function PlanCoverageFields({ control }: PlanCoverageFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {planCoverageCategories.map((category) => (
        <TextField
          key={category}
          control={control}
          name={`coverages.${category}`}
          label={`${planCoverageCategoryLabels[category]} (฿)`}
          size="md"
        />
      ))}
    </div>
  )
}
