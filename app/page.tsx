'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import StatsCard from '../components/StatsCard'
import VehicleCard from '../components/VehicleCard'
import VehicleForm from '../components/VehicleForm'

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
            Track bid price, fees, repairs, total cost, and estimated profit in
            one place.
          </p>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            label="Total Vehicles"
            value={String(summary.totalVehicles)}
          />

          <StatsCard
            label="Total Invested"
            value={`$${summary.totalInvested.toLocaleString()}`}
          />

          <StatsCard
            label="Total Estimated Profit"
            value={`$${summary.totalProfit.toLocaleString()}`}
            valueColor={summary.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}
          />

          <StatsCard
            label="Average Profit Per Car"
            value={`$${Math.round(summary.avgProfit).toLocaleString()}`}
            valueColor={summary.avgProfit >= 0 ? 'text-sky-400' : 'text-red-400'}
          />
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
          addVehicle={addVehicle}
          loading={loading}
        />

        <section>
          <h2 className="mb-5 text-3xl font-bold text-white">Inventory</h2>

          {vehicles.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
              No vehicles added yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((car) => (
                <VehicleCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}