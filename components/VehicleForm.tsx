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
  status: string
  setStatus: (value: string) => void
  soldPrice: string
  setSoldPrice: (value: string) => void
  addVehicle: () => void
  loading: boolean
  editing: boolean
  cancelEdit: () => void
}

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-slate-500'

const labelClass =
  'mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'

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
  status,
  setStatus,
  soldPrice,
  setSoldPrice,
  addVehicle,
  loading,
  editing,
  cancelEdit,
}: VehicleFormProps) {
  return (
    <section className="mb-8 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl md:p-7">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          {editing ? 'Edit Vehicle' : 'Add Vehicle'}
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Enter the vehicle details, costs, and expected sale numbers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className={labelClass}>VIN</label>
          <input
            className={inputClass}
            placeholder="Enter VIN"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Year</label>
          <input
            className={inputClass}
            placeholder="Enter year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Make</label>
          <input
            className={inputClass}
            placeholder="Enter make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Model</label>
          <input
            className={inputClass}
            placeholder="Enter model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Mileage</label>
          <input
            className={inputClass}
            placeholder="Enter mileage"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Buy Price</label>
          <input
            className={inputClass}
            placeholder="What you paid"
            value={bidPrice}
            onChange={(e) => setBidPrice(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Fees</label>
          <input
            className={inputClass}
            placeholder="Auction or transport fees"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Repair Cost</label>
          <input
            className={inputClass}
            placeholder="Repair total"
            value={repairs}
            onChange={(e) => setRepairs(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Expected Sale Price</label>
          <input
            className={inputClass}
            placeholder="Expected sale amount"
            value={averageSellPrice}
            onChange={(e) => setAverageSellPrice(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Bought">Bought</option>
            <option value="Repairing">Repairing</option>
            <option value="Listed">Listed</option>
            <option value="Sold">Sold</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Sold Price</label>
          <input
            className={inputClass}
            placeholder="Final sold amount"
            value={soldPrice}
            onChange={(e) => setSoldPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
          onClick={addVehicle}
          disabled={loading}
        >
          {loading
            ? editing
              ? 'Updating...'
              : 'Saving...'
            : editing
            ? 'Update Vehicle'
            : 'Add Vehicle'}
        </button>

        {editing && (
          <button
            type="button"
            onClick={cancelEdit}
            className="rounded-2xl border border-white/10 bg-slate-800 px-6 py-3 font-bold text-white transition hover:bg-slate-700"
          >
            Cancel
          </button>
        )}
      </div>
    </section>
  )
}