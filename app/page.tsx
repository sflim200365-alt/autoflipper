'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

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

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  const [vin, setVin] = useState('')
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [mileage, setMileage] = useState('')
  const [bidPrice, setBidPrice] = useState('')
  const [fees, setFees] = useState('')
  const [repairs, setRepairs] = useState('')
  const [averageSellPrice, setAverageSellPrice] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadVehicles() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Error loading vehicles:', error)
      return
    }

    setVehicles(data || [])
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  async function addVehicle() {
    if (!vin || !make || !model) {
      alert('Please enter at least VIN, make, and model.')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('vehicles').insert([
      {
        vin,
        year: year ? Number(year) : null,
        make,
        model,
        mileage: mileage ? Number(mileage) : null,
        purchase_price: Number(bidPrice) || 0,
        transport_cost: Number(fees) || 0,
        repair_cost: Number(repairs) || 0,
        list_price: Number(averageSellPrice) || 0,
      },
    ])

    setLoading(false)

    if (error) {
      console.error('Error adding vehicle:', error)
      alert('Failed to save vehicle')
      return
    }

    setVin('')
    setYear('')
    setMake('')
    setModel('')
    setMileage('')
    setBidPrice('')
    setFees('')
    setRepairs('')
    setAverageSellPrice('')

    loadVehicles()
  }

  const summary = useMemo(() => {
    const totalVehicles = vehicles.length

    const totalInvested = vehicles.reduce((sum, car) => {
      return (
        sum +
        Number(car.purchase_price || 0) +
        Number(car.transport_cost || 0) +
        Number(car.repair_cost || 0)
      )
    }, 0)

    const totalProfit = vehicles.reduce((sum, car) => {
      const totalCost =
        Number(car.purchase_price || 0) +
        Number(car.transport_cost || 0) +
        Number(car.repair_cost || 0)

      return sum + (Number(car.list_price || 0) - totalCost)
    }, 0)

    const avgProfit = totalVehicles > 0 ? totalProfit / totalVehicles : 0

    return {
      totalVehicles,
      totalInvested,
      totalProfit,
      avgProfit,
    }
  }, [vehicles])

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0f172a_0%,#111827_45%,#0b1120_100%)] text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Auto Flipper Dashboard
          </h1>
          <p className="mt-3 text-sm text-slate-400 md:text-base">
            Track bid price, fees, repairs, total cost, and estimated profit in one place.
          </p>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-xl">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Total Vehicles</div>
            <div className="mt-3 text-3xl font-bold text-white">{summary.totalVehicles}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-xl">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Total Invested</div>
            <div className="mt-3 text-3xl font-bold text-white">
              ${summary.totalInvested.toLocaleString()}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-xl">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Total Estimated Profit</div>
            <div className={`mt-3 text-3xl font-bold ${summary.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${summary.totalProfit.toLocaleString()}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-xl">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Average Profit Per Car</div>
            <div className={`mt-3 text-3xl font-bold ${summary.avgProfit >= 0 ? 'text-sky-400' : 'text-red-400'}`}>
              ${Math.round(summary.avgProfit).toLocaleString()}
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
          <h2 className="mb-5 text-3xl font-bold text-white">Add Vehicle</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <input className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400 outline-none" placeholder="VIN" value={vin} onChange={(e) => setVin(e.target.value)} />
            <input className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400 outline-none" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
            <input className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400 outline-none" placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} />
            <input className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400 outline-none" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
            <input className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400 outline-none" placeholder="Mileage" value={mileage} onChange={(e) => setMileage(e.target.value)} />
            <input className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400 outline-none" placeholder="Bid Price" value={bidPrice} onChange={(e) => setBidPrice(e.target.value)} />
            <input className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400 outline-none" placeholder="Fees" value={fees} onChange={(e) => setFees(e.target.value)} />
            <input className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400 outline-none" placeholder="Repair Cost" value={repairs} onChange={(e) => setRepairs(e.target.value)} />
            <input className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400 outline-none sm:col-span-2 xl:col-span-2" placeholder="Average Sell Price" value={averageSellPrice} onChange={(e) => setAverageSellPrice(e.target.value)} />
          </div>

          <button
            className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:opacity-70"
            onClick={addVehicle}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Add Vehicle'}
          </button>
        </section>

        <section>
          <h2 className="mb-5 text-3xl font-bold text-white">Inventory</h2>

          {vehicles.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
              No vehicles added yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((car) => {
                const bidPriceValue = Number(car.purchase_price || 0)
                const feesValue = Number(car.transport_cost || 0)
                const repairValue = Number(car.repair_cost || 0)
                const sellValue = Number(car.list_price || 0)

                const totalCost = bidPriceValue + feesValue + repairValue
                const profit = sellValue - totalCost

                return (
                  <article
                    key={car.id}
                    className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-xl"
                  >
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
                        <span className="font-semibold text-white">${bidPriceValue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-300">Fees</span>
                        <span className="font-semibold text-white">${feesValue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-300">Repair Cost</span>
                        <span className="font-semibold text-white">${repairValue.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="my-4 h-px bg-white/10" />

                    <div className="space-y-2 text-base">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-300">Total Cost</span>
                        <span className="font-semibold text-white">${totalCost.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-300">Average Sell Price</span>
                        <span className="font-semibold text-white">${sellValue.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="my-4 h-px bg-white/10" />

                    <div className="flex items-center justify-between">
                      <span className={`text-xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        Profit
                      </span>
                      <span className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${profit.toLocaleString()}
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}