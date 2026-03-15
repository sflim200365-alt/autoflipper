'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Vehicle = {
  id?: number
  vin: string
  purchase_price: number
  repair_cost: number
  list_price: number
}

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vin, setVin] = useState('')
  const [purchase, setPurchase] = useState('')
  const [repairs, setRepairs] = useState('')
  const [sale, setSale] = useState('')

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
    if (!vin) return

    const { error } = await supabase.from('vehicles').insert([
      {
        vin,
        purchase_price: Number(purchase) || 0,
        repair_cost: Number(repairs) || 0,
        list_price: Number(sale) || 0,
      },
    ])

    if (error) {
      console.error('Error adding vehicle:', error)
      alert('Failed to save vehicle')
      return
    }

    setVin('')
    setPurchase('')
    setRepairs('')
    setSale('')
    loadVehicles()
  }

  return (
    <main style={{ padding: '40px', color: 'black', background: 'white' }}>
      <h1>Auto Flipper Dashboard</h1>

      <h2 style={{ marginTop: '30px' }}>Add Vehicle</h2>

      <input
        placeholder="VIN"
        value={vin}
        onChange={(e) => setVin(e.target.value)}
      />
      <br />
      <br />

      <input
        placeholder="Purchase Price"
        value={purchase}
        onChange={(e) => setPurchase(e.target.value)}
      />
      <br />
      <br />

      <input
        placeholder="Repair Cost"
        value={repairs}
        onChange={(e) => setRepairs(e.target.value)}
      />
      <br />
      <br />

      <input
        placeholder="Estimated Sale Price"
        value={sale}
        onChange={(e) => setSale(e.target.value)}
      />
      <br />
      <br />

      <button onClick={addVehicle}>Add Vehicle</button>

      <h2 style={{ marginTop: '40px' }}>Inventory</h2>

      {vehicles.length === 0 && <p>No vehicles added yet.</p>}

      {vehicles.map((car) => {
        const total = Number(car.purchase_price) + Number(car.repair_cost)
        const profit = Number(car.list_price) - total

        return (
          <div
            key={car.id}
            style={{
              marginBottom: '20px',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              maxWidth: '400px',
            }}
          >
            <strong>{car.vin}</strong>
            <br />
            Purchase: ${car.purchase_price}
            <br />
            Repairs: ${car.repair_cost}
            <br />
            Total Cost: ${total}
            <br />
            Estimated Sale Price: ${car.list_price}
            <br />
            Estimated Profit: ${profit}
          </div>
        )
      })}
    </main>
  )
}