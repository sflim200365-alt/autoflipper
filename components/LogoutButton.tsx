'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-slate-700"
    >
      Logout
    </button>
  )
}