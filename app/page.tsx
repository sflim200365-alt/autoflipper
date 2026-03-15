'use client'

import { useEffect, useState } from 'react'
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

  return (
    <main style={{ padding: '40px', color: 'black', background: 'white' }}>
      <h1>Auto Flipper Dashboard</h1>

      <h2 style={{ marginTop: '30px' }}>Add Vehicle</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(220px, 280px))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <input
          placeholder="VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
        />

        <input
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <input
          placeholder="Make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />

        <input
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <input
          placeholder="Mileage"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
        />

        <input
          placeholder="Bid Price"
          value={bidPrice}
          onChange={(e) => setBidPrice(e.target.value)}
        />

        <input
          placeholder="Fees"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
        />

        <input
          placeholder="Repair Cost"
          value={repairs}
          onChange={(e) => setRepairs(e.target.value)}
        />

        <input
          placeholder="Average Sell Price"
          value={averageSellPrice}
          onChange={(e) => setAverageSellPrice(e.target.value)}
        />
      </div>

      <button onClick={addVehicle}>Add Vehicle</button>

      <h2 style={{ marginTop: '40px' }}>Inventory</h2>

      {vehicles.length === 0 && <p>No vehicles added yet.</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
          marginTop: '20px',
        }}
      >
        {vehicles.map((car) => {
          const bidPriceValue = Number(car.purchase_price || 0)
          const feesValue = Number(car.transport_cost || 0)
          const repairValue = Number(car.repair_cost || 0)
          const sellValue = Number(car.list_price || 0)

          const totalCost = bidPriceValue + feesValue + repairValue
          const profit = sellValue - totalCost

          return (
            <div
              key={car.id}
              style={{
                padding: '16px',
                border: '1px solid #ccc',
                borderRadius: '12px',
                background: '#f8f8f8',
              }}
            >
              <h3 style={{ marginTop: 0 }}>
                {car.year || ''} {car.make} {car.model}
              </h3>

              <p style={{ margin: '6px 0' }}>
                <strong>VIN:</strong> {car.vin}
              </p>

              <p style={{ margin: '6px 0' }}>
                <strong>Mileage:</strong> {car.mileage ?? 'N/A'}
              </p>

              <p style={{ margin: '6px 0' }}>
                <strong>Bid Price:</strong> ${bidPriceValue}
              </p>

              <p style={{ margin: '6px 0' }}>
                <strong>Fees:</strong> ${feesValue}
              </p>

              <p style={{ margin: '6px 0' }}>
                <strong>Repair Cost:</strong> ${repairValue}
              </p>

              <p style={{ margin: '6px 0' }}>
                <strong>Total Cost:</strong> ${totalCost}
              </p>

              <p style={{ margin: '6px 0' }}>
                <strong>Average Sell Price:</strong> ${sellValue}
              </p>

              <p
                style={{
                  margin: '6px 0',
                  fontWeight: 'bold',
                  color: profit >= 0 ? 'green' : 'red',
                }}
              >
                Profit: ${profit}
              </p>
            </div>
          )
        })}
      </div>
    </main>
  )
}