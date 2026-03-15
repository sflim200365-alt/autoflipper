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
}

type VehicleCardProps = {
  car: Vehicle
}

export default function VehicleCard({ car }: VehicleCardProps) {
  const bidPriceValue = Number(car.purchase_price || 0)
  const feesValue = Number(car.transport_cost || 0)
  const repairValue = Number(car.repair_cost || 0)
  const sellValue = Number(car.list_price || 0)

  const totalCost = bidPriceValue + feesValue + repairValue
  const profit = sellValue - totalCost

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
      <h3 className="text-3xl font-bold leading-tight text-white">
        {car.year ? `${car.year} ` : ''}
        {car.make} {car.model}
      </h3>

      <p className="mt-2 text-sm text-slate-400">
        VIN: {car.vin} • Mileage: {car.mileage ?? 'N/A'}
      </p>

      <div className="my-4 h-px bg-white/10" />

      <div className="space-y-2 text-base">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-300">Bid Price</span>
          <span className="font-semibold text-white">
            ${bidPriceValue.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-300">Fees</span>
          <span className="font-semibold text-white">
            ${feesValue.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-300">Repair Cost</span>
          <span className="font-semibold text-white">
            ${repairValue.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="my-4 h-px bg-white/10" />

      <div className="space-y-2 text-base">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-300">Total Cost</span>
          <span className="font-semibold text-white">
            ${totalCost.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-300">
            Average Sell Price
          </span>
          <span className="font-semibold text-white">
            ${sellValue.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="my-4 h-px bg-white/10" />

      <div className="flex items-center justify-between">
        <span
          className={`text-xl font-bold ${
            profit >= 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          Profit
        </span>
        <span
          className={`text-2xl font-bold ${
            profit >= 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          ${profit.toLocaleString()}
        </span>
      </div>
    </article>
  )
}