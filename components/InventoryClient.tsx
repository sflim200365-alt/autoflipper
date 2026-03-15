'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabase/client'
import VehicleCard from './VehicleCard'
import VehicleForm from './VehicleForm'
import type { Vehicle } from './types'

type InventoryClientProps = {
  initialVehicles: Vehicle[]
}

export default function InventoryClient({
  initialVehicles,
}: InventoryClientProps) {
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

  const saveVehicle = async () => {
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

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-xl">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Inventory
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Search, filter, edit, and manage your vehicles.
        </p>
      </section>

      {editingId !== null && (
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
          addVehicle={saveVehicle}
          loading={loading}
          editing={editingId !== null}
          cancelEdit={resetForm}
        />
      )}

      <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-xl md:p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Search and Filter</h2>
          <p className="mt-1 text-sm text-slate-400">
            Find vehicles by VIN, make, model, year, or status.
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
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Vehicles</h2>
            <p className="mt-1 text-sm text-slate-400">
              Your current inventory and deal progress.
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