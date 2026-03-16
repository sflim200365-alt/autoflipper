import { redirect, notFound } from 'next/navigation'
import { createClient } from '../../../utils/supabase/server'
import LogoutButton from '../../../components/LogoutButton'
import AppNav from '../../../components/AppNav'
import VehicleBreakdownClient from '../../../components/VehicleBreakdownClient'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function VehicleBreakdownPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: vehicle, error: vehicleError } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (vehicleError || !vehicle) {
    notFound()
  }

  const { data: items, error: itemsError } = await supabase
    .from('vehicle_cost_items')
    .select('*')
    .eq('vehicle_id', id)
    .eq('user_id', user.id)
    .order('id', { ascending: false })

  if (itemsError) {
    console.error(itemsError)
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-5 rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-xl sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Vehicle Breakdown
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {vehicle.year ? `${vehicle.year} ` : ''}
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="mt-2 truncate text-sm text-slate-400">
                VIN: {vehicle.vin}
              </p>
            </div>

            <div className="w-full sm:w-auto">
              <LogoutButton />
            </div>
          </div>
        </div>

        <AppNav />

        <VehicleBreakdownClient
          vehicle={vehicle}
          initialItems={items ?? []}
        />
      </div>
    </main>
  )
}