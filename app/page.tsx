import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import LogoutButton from '../components/LogoutButton'
import AppNav from '../components/AppNav'
import DashboardStats from '../components/DashboardStats'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    console.error(error)
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-5 rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-xl sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Welcome Back
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Auto Flipper Dashboard
              </h1>
              <p className="mt-2 truncate text-sm text-slate-400">
                {user.email}
              </p>
            </div>

            <div className="w-full sm:w-auto">
              <LogoutButton />
            </div>
          </div>
        </div>

        <AppNav />
        <DashboardStats vehicles={vehicles ?? []} />
      </div>
    </main>
  )
}