import StatsCard from './StatsCard'
import type { Vehicle } from './types'

type DashboardStatsProps = {
  vehicles: Vehicle[]
}

export default function DashboardStats({ vehicles }: DashboardStatsProps) {
  const totalUnits = vehicles.length

  const totalInvested = vehicles.reduce((sum, car) => {
    return (
      sum +
      Number(car.purchase_price || 0) +
      Number(car.transport_cost || 0) +
      Number(car.repair_cost || 0)
    )
  }, 0)

  const soldUnits = vehicles.filter((car) => car.status === 'Sold').length
  const listedUnits = vehicles.filter((car) => car.status === 'Listed').length

  const actualProfit = vehicles.reduce((sum, car) => {
    if (car.status !== 'Sold' || car.sold_price == null) return sum

    const totalCost =
      Number(car.purchase_price || 0) +
      Number(car.transport_cost || 0) +
      Number(car.repair_cost || 0)

    return sum + (Number(car.sold_price || 0) - totalCost)
  }, 0)

  const pipelineProfit = vehicles.reduce((sum, car) => {
    if (car.status === 'Sold') return sum

    const totalCost =
      Number(car.purchase_price || 0) +
      Number(car.transport_cost || 0) +
      Number(car.repair_cost || 0)

    return sum + (Number(car.list_price || 0) - totalCost)
  }, 0)

  const totalProfit = actualProfit + pipelineProfit
  const averageProfit = totalUnits > 0 ? totalProfit / totalUnits : 0

  const averageRoi =
    vehicles.length > 0
      ? vehicles.reduce((sum, car) => {
          const totalCost =
            Number(car.purchase_price || 0) +
            Number(car.transport_cost || 0) +
            Number(car.repair_cost || 0)

          const profit =
            car.status === 'Sold' && car.sold_price != null
              ? Number(car.sold_price || 0) - totalCost
              : Number(car.list_price || 0) - totalCost

          const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0
          return sum + roi
        }, 0) / vehicles.length
      : 0

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-2xl">
        <div className="flex flex-col gap-6 p-6 md:p-8 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Auto Flipper Dashboard
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Track every deal without the clutter
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              See your numbers fast, then jump straight into adding vehicles or
              checking inventory.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Vehicles
              </p>
              <p className="mt-2 text-2xl font-bold text-white">{totalUnits}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Sold
              </p>
              <p className="mt-2 text-2xl font-bold text-white">{soldUnits}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Listed
              </p>
              <p className="mt-2 text-2xl font-bold text-white">{listedUnits}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Avg ROI
              </p>
              <p
                className={`mt-2 text-2xl font-bold ${
                  averageRoi >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {averageRoi.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Key Numbers</h2>
          <p className="mt-1 text-sm text-slate-400">
            Quick view of inventory, performance, and profit.
          </p>
        </div>

        <section className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
          <StatsCard
            label="Total Units"
            value={totalUnits.toString()}
            valueColor="text-white"
          />
          <StatsCard
            label="Total Invested"
            value={`$${totalInvested.toLocaleString()}`}
            valueColor="text-white"
          />
          <StatsCard
            label="Sold Units"
            value={soldUnits.toString()}
            valueColor="text-white"
          />
          <StatsCard
            label="Listed Units"
            value={listedUnits.toString()}
            valueColor="text-white"
          />
          <StatsCard
            label="Actual Profit"
            value={`$${actualProfit.toLocaleString()}`}
            valueColor={actualProfit >= 0 ? 'text-green-400' : 'text-red-400'}
          />
          <StatsCard
            label="Pipeline Profit"
            value={`$${pipelineProfit.toLocaleString()}`}
            valueColor={pipelineProfit >= 0 ? 'text-green-400' : 'text-red-400'}
          />
          <StatsCard
            label="Average ROI"
            value={`${averageRoi.toFixed(1)}%`}
            valueColor={averageRoi >= 0 ? 'text-green-400' : 'text-red-400'}
          />
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StatsCard
            label="Total Profit"
            value={`$${totalProfit.toLocaleString()}`}
            valueColor={totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}
          />
          <StatsCard
            label="Average Profit"
            value={`$${averageProfit.toLocaleString()}`}
            valueColor={averageProfit >= 0 ? 'text-green-400' : 'text-red-400'}
          />
        </section>
      </section>
    </div>
  )
}