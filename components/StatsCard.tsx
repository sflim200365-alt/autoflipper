type StatsCardProps = {
  label: string
  value: string
  valueColor?: string
}

export default function StatsCard({
  label,
  value,
  valueColor = 'text-white',
}: StatsCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl transition hover:border-white/15 hover:bg-slate-950/90">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </div>
      <div className={`mt-3 text-3xl font-bold tracking-tight ${valueColor}`}>
        {value}
      </div>
    </div>
  )
}