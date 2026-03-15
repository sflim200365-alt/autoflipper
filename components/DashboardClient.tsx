'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabase/client'
import VehicleForm from './VehicleForm'
import VehicleCard from './VehicleCard'
import StatsCard from './StatsCard'

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

type DashboardClientProps = {
  initialVehicles: Vehicle[]
}

export default function DashboardClient({
  initialVehicles,
}: DashboardClientProps) {
  const router = useRouter()
  const supabase = createClient()

  const vehicles = initialVehicles

  const [vin, setVin] = useState('')
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [mileage, setMileage] = useState('')
  const [bidPrice, setBidPrice] = useState('')
  const [fees, setFees] = useState('')
  const [repairs, setRepairs] = useState('')
  const [averageSellPrice, setAverageSellPrice] = useState('')
  const [status, setStatus] = useState('Bought')
  const [soldPrice, setSoldPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const resetForm = () => {
    setVin('')
    setYear('')
    setMake('')
    setModel('')
    setMileage('')
    setBidPrice('')
    setFees('')
    setRepairs('')
    setAverageSellPrice('')
    setStatus('Bought')
    setSoldPrice('')
    setEditingId(null)
  }

  const startEdit = (car: Vehicle) => {
    setEditingId(car.id ?? null)
    setVin(car.vin ?? '')
    setYear(car.year != null ? String(car.year) : '')
    setMake(car.make ?? '')
    setModel(car.model ?? '')
    setMileage(car.mileage != null ? String(car.mileage) : '')
    setBidPrice(car.purchase_price != null ? String(car.purchase_price) : '')
    setFees(car.transport_cost != null ? String(car.transport_cost) : '')
    setRepairs(car.repair_cost != null ? String(car.repair_cost) : '')
    setAverageSellPrice(car.list_price != null ? String(car.list_price) : '')
    setStatus(car.status ?? 'Bought')
    setSoldPrice(car.sold_price != null ? String(car.sold_price) : '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const addVehicle = async () => {
    if (!vin || !make || !model) {
      alert('VIN, make, and model are required.')
      return
    }

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('You must be logged in.')
      setLoading(false)
      return
    }

    const payload = {
      vin,
      year: year ? Number(year) : null,
      make,
      model,
      mileage: mileage ? Number(mileage) : null,
      purchase_price: bidPrice ? Number(bidPrice) : 0,
      repair_cost: repairs ? Number(repairs) : 0,
      transport_cost: fees ? Number(fees) : 0,
      list_price: averageSellPrice ? Number(averageSellPrice) : 0,
      status,
      sold_price: soldPrice ? Number(soldPrice) : null,
      user_id: user.id,
    }

    const query = editingId
      ? supabase.from('vehicles').update(payload).eq('id', editingId)
      : supabase.from('vehicles').insert([payload])

    const { error } = await query

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    resetForm()
    router.refresh()
  }

  const deleteVehicle = async (id: number) => {
    const confirmed = window.confirm('Delete this vehicle?')
    if (!confirmed) return

    setDeletingId(id)

    const { error } = await supabase.from('vehicles').delete().eq('id', id)

    setDeletingId(null)

    if (error) {
      alert(error.message)
      return
    }

    if (editingId === id) {
      resetForm()
    }

    router.refresh()
  }

  const filteredVehicles = vehicles.filter((car) => {
    const searchText = search.toLowerCase()

    const matchesSearch =
      car.vin.toLowerCase().includes(searchText) ||
      car.make.toLowerCase().includes(searchText) ||
      car.model.toLowerCase().includes(searchText) ||
      `${car.year ?? ''}`.includes(searchText)

    const matchesStatus =
      statusFilter === 'All' ? true : (car.status ?? 'Bought') === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalUnits = filteredVehicles.length

  const totalInvested = filteredVehicles.reduce((sum, car) => {
    return (
      sum +
      Number(car.purchase_price || 0) +
      Number(car.transport_cost || 0) +
      Number(car.repair_cost || 0)
    )
  }, 0)

  const soldUnits = filteredVehicles.filter(
    (car) => car.status === 'Sold'
  ).length

  const listedUnits = filteredVehicles.filter(
    (car) => car.status === 'Listed'
  ).length

  const actualProfit = filteredVehicles.reduce((sum, car) => {
    if (car.status !== 'Sold' || car.sold_price == null) return sum

    const totalCost =
      Number(car.purchase_price || 0) +
      Number(car.transport_cost || 0) +
      Number(car.repair_cost || 0)

    return sum + (Number(car.sold_price || 0) - totalCost)
  }, 0)

  const pipelineProfit = filteredVehicles.reduce((sum, car) => {
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
    filteredVehicles.length > 0
      ? filteredVehicles.reduce((sum, car) => {
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
        }, 0) / filteredVehicles.length
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
              Keep your inventory, invested money, projected profit, and sold
              results in one place so you can make faster decisions and stop
              guessing.
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

      <VehicleForm
        vin={vin}
        setVin={setVin}
        year={year}
        setYear={setYear}
        make={make}
        setMake={setMake}
        model={model}
        setModel={setModel}
        mileage={mileage}
        setMileage={setMileage}
        bidPrice={bidPrice}
        setBidPrice={setBidPrice}
        fees={fees}
        setFees={setFees}
        repairs={repairs}
        setRepairs={setRepairs}
        averageSellPrice={averageSellPrice}
        setAverageSellPrice={setAverageSellPrice}
        status={status}
        setStatus={setStatus}
        soldPrice={soldPrice}
        setSoldPrice={setSoldPrice}
        addVehicle={addVehicle}
        loading={loading}
        editing={editingId !== null}
        cancelEdit={resetForm}
      />

      <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-xl md:p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Search and Filter</h2>
          <p className="mt-1 text-sm text-slate-400">
            Find vehicles fast by VIN, make, model, year, or status.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-slate-500"
            placeholder="Search by VIN, make, model, or year"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-slate-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Bought">Bought</option>
            <option value="Repairing">Repairing</option>
            <option value="Listed">Listed</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Key Numbers</h2>
          <p className="mt-1 text-sm text-slate-400">
            Quick view of your inventory and performance.
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

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Inventory</h2>
            <p className="mt-1 text-sm text-slate-400">
              Your vehicles, costs, and progress at a glance.
            </p>
          </div>

          <div className="text-sm text-slate-400">
            {filteredVehicles.length} result{filteredVehicles.length === 1 ? '' : 's'}
          </div>
        </div>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {filteredVehicles.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center text-slate-300 shadow-xl">
              <p className="text-lg font-semibold text-white">
                No vehicles found
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            filteredVehicles.map((car) => (
              <VehicleCard
                key={car.id ?? car.vin}
                car={car}
                onEdit={startEdit}
                onDelete={deleteVehicle}
                deleting={deletingId === car.id}
              />
            ))
          )}
        </section>
      </section>
    </div>
  )
}