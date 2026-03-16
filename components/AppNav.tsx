'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/add-vehicle', label: 'Add Vehicle' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/bid-calculator', label: 'Bid Calculator' },
]

export default function AppNav() {
  const pathname = usePathname()

  return (
    <nav className="mb-5 rounded-3xl border border-white/10 bg-slate-950/70 p-2 shadow-xl">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {navItems.map((item) => {
          const active = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-4 py-3 text-center text-sm font-semibold transition ${
                active
                  ? 'bg-white text-slate-950'
                  : 'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}