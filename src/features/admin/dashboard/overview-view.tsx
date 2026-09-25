import { KpiCards } from './components/KpiCards'
import { PremiumTrendChart } from './components/PremiumTrendChart'

export function OverviewView() {
  return (
    <div className="flex flex-col gap-6">
      <KpiCards />
      <PremiumTrendChart />
    </div>
  )
}
