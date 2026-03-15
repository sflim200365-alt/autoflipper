type VehicleFormProps = {
  vin: string
  setVin: (value: string) => void
  year: string
  setYear: (value: string) => void
  make: string
  setMake: (value: string) => void
  model: string
  setModel: (value: string) => void
  mileage: string
  setMileage: (value: string) => void
  bidPrice: string
  setBidPrice: (value: string) => void
  fees: string
  setFees: (value: string) => void
  repairs: string
  setRepairs: (value: string) => void
  averageSellPrice: string
  setAverageSellPrice: (value: string) => void
  addVehicle: () => void
  loading: boolean
}

const inputClass =
  'rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400 outline-none'

export default function VehicleForm({
  vin,
  setVin,
  year,
  setYear,
  make,
  setMake,
  model,
  setModel,
  mileage,
  setMileage,
  bidPrice,
  setBidPrice,
  fees,
  setFees,
  repairs,
  setRepairs,
  averageSellPrice,
  setAverageSellPrice,
  addVehicle,
  loading,
}: VehicleFormProps) {
  return (
    <section className="mb-8 rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
      <h2 className="mb-5 text-3xl font-bold text-white">Add Vehicle</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <input
          className={inputClass}
          placeholder="VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Mileage"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Bid Price"
          value={bidPrice}
          onChange={(e) => setBidPrice(e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Fees"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Repair Cost"
          value={repairs}
          onChange={(e) => setRepairs(e.target.value)}
        />

        <input
          className={`${inputClass} sm:col-span-2 xl:col-span-2`}
          placeholder="Average Sell Price"
          value={averageSellPrice}
          onChange={(e) => setAverageSellPrice(e.target.value)}
        />
      </div>

      <button
        className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:opacity-70"
        onClick={addVehicle}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Add Vehicle'}
      </button>
    </section>
  )
}