import { type ReactNode } from 'react'

type Props = {
  title: string
  value: string | number
  accentClass?: string
  icon?: ReactNode
  subtitle?: string
}

export function StatCard({ title, value, accentClass = 'bg-gray-200', icon, subtitle }: Props) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded ${accentClass}`}>{icon}</div>
        <div className="flex-1">
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="text-xl font-semibold">{value}</div>
          {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
        </div>
      </div>
    </div>
  )
}
