import { cn, formatInt, formatThb, getCountryName } from '@/shared/utils'
import { topRoutes } from './lib/mock-data'

function claimRateTone(claimRate: number) {
  if (claimRate < 7) {
    return 'text-success'
  }
  if (claimRate < 12) {
    return 'text-warning'
  }
  return 'text-error'
}

export function RoutesView() {
  const rows = [...topRoutes].sort((a, b) => b.policies - a.policies)

  return (
    <div className="bg-base-100 border-base-300 rounded-box flex flex-col gap-1 border p-4 shadow-sm sm:p-5">
      <h2 className="text-base font-semibold">Top routes</h2>
      <p className="text-muted text-sm">Claim rate against average premium per policy</p>

      <div className="mt-2 overflow-x-auto">
        <table className="table table-zebra text-xs">
          <thead>
            <tr>
              <th>Destination</th>
              <th className="text-right">Policies</th>
              <th className="text-right">Avg premium</th>
              <th className="text-right">Total revenue</th>
              <th className="text-right">Claim rate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((route) => (
              <tr key={route.isoCode}>
                <td className="text-base-content">{getCountryName(route.isoCode)}</td>
                <td className="text-right tabular-nums">{formatInt(route.policies)}</td>
                <td className="text-right tabular-nums">{formatThb(route.avgPremium)}</td>
                <td className="text-right tabular-nums">{formatThb(route.policies * route.avgPremium)}</td>
                <td className="text-right">
                  <span
                    className={cn('inline-flex items-center gap-1.5 tabular-nums', claimRateTone(route.claimRate))}
                  >
                    <span className="size-2 rounded-full bg-current" />
                    {route.claimRate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
