'use client'

import { useMemo, useState } from 'react'
import { createClient } from '../utils/supabase/client'

type Vehicle = {
  id: number
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
  notes?: string | null
}

type CostItem = {
  id: number
  vehicle_id: number
  user_id: string
  item_type: 'fee' | 'part' | 'labor' | 'paint' | 'misc'
  name: string
  amount: number
  item_status?: 'needed' | 'ordered' | 'received' | 'installed' | 'done' | null
  notes?: string | null
  purchased_date?: string | null
  created_at?: string
}

type VehicleBreakdownClientProps = {
  vehicle: Vehicle
  initialItems: CostItem[]
}

export default function VehicleBreakdownClient({
  vehicle,
  initialItems,
}: VehicleBreakdownClientProps) {
  const supabase = createClient()

  const [items, setItems] = useState(initialItems)
  const [itemType, setItemType] = useState<'fee' | 'part' | 'labor' | 'paint' | 'misc'>('part')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [itemStatus, setItemStatus] = useState<'needed' | 'ordered' | 'received' | 'installed' | 'done'>('needed')
  const [notes, setNotes] = useState('')
  const [purchasedDate, setPurchasedDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const feeTotal = useMemo(() => {
    return items
      .filter((item) => item.item_type === 'fee')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)
  }, [items])

  const repairItemsTotal = useMemo(() => {
    return items
      .filter((item) => item.item_type !== 'fee')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)
  }, [items])

  const allItemsTotal = feeTotal + repairItemsTotal
  const totalInvested = Number(vehicle.purchase_price || 0) + allItemsTotal

  const projectedProfit =
    vehicle.status === 'Sold' && vehicle.sold_price != null
      ? Number(vehicle.sold_price || 0) - totalInvested
      : Number(vehicle.list_price || 0) - totalInvested

  const resetForm = () => {
    setItemType('part')
    setName('')
    setAmount('')
    setItemStatus('needed')
    setNotes('')
    setPurchasedDate('')
  }

  const addItem = async () => {
    if (!name.trim()) {
      alert('Item name is required.')
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
      vehicle_id: vehicle.id,
      user_id: user.id,
      item_type: itemType,
      name: name.trim(),
      amount: amount ? Number(amount) : 0,
      item_status: itemStatus,
      notes: notes.trim() || null,
      purchased_date: purchasedDate || null,
    }

    const { data, error } = await supabase
      .from('vehicle_cost_items')
      .insert([payload])
      .select()
      .single()

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    if (data) {
      setItems((prev) => [data as CostItem, ...prev])
    }

    resetForm()
  }

  const deleteItem = async (id: number) => {
    const confirmed = window.confirm('Delete this item?')
    if (!confirmed) return

    setDeletingId(id)

    const { error } = await supabase
      .from('vehicle_cost_items')
      .delete()
      .eq('id', id)

    setDeletingId(null)

    if (error) {
      alert(error.message)
      return
    }

    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Buy Price
          </p>
          <p className="mt-3 text-3xl font-bold text-white">
            ${Number(vehicle.purchase_price || 0).toLocaleString()}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Fees Total
          </p>
          <p className="mt-3 text-3xl font-bold text-white">
            ${feeTotal.toLocaleString()}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Repair Items Total
          </p>
          <p className="mt-3 text-3xl font-bold text-white">
            ${repairItemsTotal.toLocaleString()}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Total Invested
          </p>
          <p className="mt-3 text-3xl font-bold text-white">
            ${totalInvested.toLocaleString()}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">Add Cost Item</h2>
          <p className="mt-2 text-sm text-slate-400">
            Track fees, parts, labor, paint, and other costs for this vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Type
            </label>
            <select
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-slate-500"
              value={itemType}
              onChange={(e) =>
                setItemType(
                  e.target.value as 'fee' | 'part' | 'labor' | 'paint' | 'misc'
                )
              }
            >
              <option value="fee">Fee</option>
              <option value="part">Part</option>
              <option value="labor">Labor</option>
              <option value="paint">Paint</option>
              <option value="misc">Misc</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Item Name
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-slate-500"
              placeholder="Ex. Left headlight"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Amount
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-slate-500"
              placeholder="Ex. 425"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Status
            </label>
            <select
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-slate-500"
              value={itemStatus}
              onChange={(e) =>
                setItemStatus(
                  e.target.value as
                    | 'needed'
                    | 'ordered'
                    | 'received'
                    | 'installed'
                    | 'done'
                )
              }
            >
              <option value="needed">Needed</option>
              <option value="ordered">Ordered</option>
              <option value="received">Received</option>
              <option value="installed">Installed</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Purchased Date
            </label>
            <input
              type="date"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-slate-500"
              value={purchasedDate}
              onChange={(e) => setPurchasedDate(e.target.value)}
            />
          </div>

          <div className="xl:col-span-3">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Notes
            </label>
            <textarea
              className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-slate-500"
              placeholder="Optional notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={addItem}
            disabled={loading}
            className="rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Saving...' : 'Add Item'}
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Cost Breakdown</h2>
            <p className="mt-2 text-sm text-slate-400">
              Every cost item for this vehicle.
            </p>
          </div>

          <div className="text-sm text-slate-400">
            {items.length} item{items.length === 1 ? '' : 's'}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center">
            <p className="text-lg font-semibold text-white">No cost items yet</p>
            <p className="mt-2 text-sm text-slate-400">
              Add your first fee, part, labor, or paint item above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                        {item.item_type}
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                        {item.item_status ?? 'needed'}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-white">
                      {item.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400">
                      <span>
                        Amount: ${Number(item.amount || 0).toLocaleString()}
                      </span>
                      <span>
                        Date: {item.purchased_date ? item.purchased_date : 'N/A'}
                      </span>
                    </div>

                    {item.notes && (
                      <p className="mt-3 text-sm text-slate-300">{item.notes}</p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
                    disabled={deletingId === item.id}
                    className="rounded-xl border border-red-500/20 bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === item.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white">Profit Snapshot</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Expected Sale Price
            </p>
            <p className="mt-2 text-2xl font-bold text-white">
              ${Number(vehicle.list_price || 0).toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Sold Price
            </p>
            <p className="mt-2 text-2xl font-bold text-white">
              {vehicle.sold_price != null
                ? `$${Number(vehicle.sold_price || 0).toLocaleString()}`
                : 'N/A'}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {vehicle.status === 'Sold' ? 'Actual Profit' : 'Projected Profit'}
            </p>
            <p
              className={`mt-2 text-2xl font-bold ${
                projectedProfit >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              ${projectedProfit.toLocaleString()}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}