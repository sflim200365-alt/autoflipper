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

  const rawName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'User'

  const displayName =
    rawName.charAt(0).toUpperCase() + rawName.slice(1)

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-5 rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-xl sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Welcome back, {displayName}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Auto Flipper Dashboard
              </h1>
              <p className="mt-2 truncate text-sm text-slate-400">
                {user.email}
              </p>
            </div>

            <div className="shrink-0">
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