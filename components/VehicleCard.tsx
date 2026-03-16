'use client'

import Link from 'next/link'

type Vehicle = {
  id?: number
  vin: string
  year: number | null
  make: string
  model: string
  mileage: number | null
  purchase_price: number
  repair_cost: number
  transport_cost: number
  list_price: number
  status?: string | null
  sold_price?: number | null
}

type VehicleCardProps = {
  car: Vehicle
  onDelete?: (id: number) => void
  onEdit?: (car: Vehicle) => void
  deleting?: boolean
}

export default function VehicleCard({
  car,
  onDelete,
  onEdit,
  deleting = false,
}: VehicleCardProps) {
  const bidPriceValue = Number(car.purchase_price || 0)
  const feesValue = Number(car.transport_cost || 0)
  const repairValue = Number(car.repair_cost || 0)
  const estimatedSellValue = Number(car.list_price || 0)
  const soldValue = Number(car.sold_price || 0)

  const totalCost = bidPriceValue + feesValue + repairValue

  const profit =
    car.status === 'Sold' && car.sold_price != null
      ? soldValue - totalCost
      : estimatedSellValue - totalCost

  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0
  const currentStatus = car.status ?? 'Bought'

  return (
    <article className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl transition hover:border-white/15 hover:bg-slate-950/90">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
              {car.year ? `${car.year} ` : ''}
              {car.make} {car.model}
            </h3>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
              {currentStatus}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                VIN
              </p>
              <p className="mt-1 truncate text-sm font-medium text-white">
                {car.vin}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Mileage
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {car.mileage ?? 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {car.id && (
            <Link
              href={`/inventory/${car.id}`}
              className="rounded-xl border border-blue-500/20 bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Breakdown
            </Link>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(car)}
              className="rounded-xl border border-amber-400/20 bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400"
            >
              Edit
            </button>
          )}

          {car.id != null && onDelete && (
  <button
    onClick={() => onDelete(car.id!)}
    disabled={deleting}
    className="rounded-xl border border-red-500/20 bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {deleting ? 'Deleting...' : 'Delete'}
  </button>
)}
        </div>
      </div>

      <div className="my-5 h-px bg-white/10" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <p className="mb-3 text-sm font-semibold text-white">Costs</p>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Buy Price</span>
              <span className="font-semibold text-white">
                ${bidPriceValue.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Fees</span>
              <span className="font-semibold text-white">
                ${feesValue.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Repair Cost</span>
              <span className="font-semibold text-white">
                ${repairValue.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
              <span className="font-semibold text-slate-300">Total Invested</span>
              <span className="font-bold text-white">
                ${totalCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <p className="mb-3 text-sm font-semibold text-white">Sale Outlook</p>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Expected Sale Price</span>
              <span className="font-semibold text-white">
                ${estimatedSellValue.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Sold Price</span>
              <span className="font-semibold text-white">
                {car.sold_price != null ? `$${soldValue.toLocaleString()}` : 'N/A'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">ROI</span>
              <span
                className={`font-semibold ${
                  roi >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {roi.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between gap-4">
          <span
            className={`text-lg font-bold ${
              profit >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {car.status === 'Sold' ? 'Actual Profit' : 'Estimated Profit'}
          </span>

          <span
            className={`text-2xl font-bold tracking-tight ${
              profit >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            ${profit.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  )
}