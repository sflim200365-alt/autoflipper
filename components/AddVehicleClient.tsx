'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabase/client'
import VehicleForm from './VehicleForm'

export default function AddVehicleClient() {
  const router = useRouter()
  const supabase = createClient()

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

    const { error } = await supabase.from('vehicles').insert([payload])

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    resetForm()
    router.push('/inventory')
    router.refresh()
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-xl">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Add Vehicle
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Add a new unit with purchase, repair, and pricing details.
        </p>
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
        editing={false}
        cancelEdit={resetForm}
      />
    </div>
  )
}