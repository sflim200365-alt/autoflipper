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
    <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-xl">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <div className={`mt-3 text-3xl font-bold ${valueColor}`}>{value}</div>
    </div>
  )
}