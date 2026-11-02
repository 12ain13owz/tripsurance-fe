import { formatSatang } from '@/shared/utils'
import { planAddonPricingLabels } from '../lib/plan.type'
import type { PlanAddonOption } from '../lib/plan.type'

interface PlanAddonPickerProps {
  addons: PlanAddonOption[]
  /** Selected add-on ids */
  value: string[]
  onChange: (ids: string[]) => void
}

export function PlanAddonPicker({ addons, value, onChange }: PlanAddonPickerProps) {
  if (addons.length === 0) {
    return <p className="text-muted text-sm">No add-ons yet. Create them under Add-ons first.</p>
  }

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((selectedId) => selectedId !== id) : [...value, id])
  }

  return (
    <ul className="border-base-300 rounded-box flex flex-col border p-2">
      {addons.map((addon) => (
        <li key={addon.id}>
          <label className="hover:bg-base-200 rounded-box flex items-center gap-2 px-2 py-1.5 text-sm">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              checked={value.includes(addon.id)}
              onChange={() => toggle(addon.id)}
            />
            <span className="text-base-content truncate">{addon.code}</span>
            <span className="text-muted tabular-nums">
              {formatSatang(addon.price)} {planAddonPricingLabels[addon.pricingType]}
            </span>
            {!addon.isActive && <span className="badge badge-soft badge-sm ms-auto">Inactive</span>}
          </label>
        </li>
      ))}
    </ul>
  )
}
