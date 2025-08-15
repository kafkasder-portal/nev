import { type ReactNode } from 'react'

type Props = {
  title: string
  value: string | number
  accentClass?: string
  icon?: ReactNode
  subtitle?: string
}

export function StatCard({ title, value, accentClass = 'bg-corporate-light', icon, subtitle }: Props) {
  return (
    <div className="corporate-card-elevated p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-corporate-gray uppercase tracking-wide mb-2">{title}</div>
          <div className="text-3xl font-semibold text-corporate-slate mb-1">{value}</div>
          {subtitle && (
            <div className="text-xs text-corporate-gray flex items-center gap-1">
              {subtitle}
            </div>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentClass} group-hover:scale-105 transition-transform duration-200`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
