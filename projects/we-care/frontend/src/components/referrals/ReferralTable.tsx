import { useState, useEffect } from 'react'
import { ReferralTableRow } from './ReferralTableRow'
import type { Referral, ReferralStatus } from '../../types/referral'

interface Tab {
  label: string
  filter: ReferralStatus | null
}

const TABS: Tab[] = [
  { label: 'All Referrals', filter: null },
  { label: 'Pending', filter: 'PENDING' },
  { label: 'Sent', filter: 'SENT' },
  { label: 'Accepted', filter: 'ACCEPTED' },
  { label: 'Completed', filter: 'COMPLETED' },
]

const COLUMNS = [
  'Patient Name',
  'Diagnosis / Reason',
  'Specialty',
  'Specialist',
  'Urgency',
  'Status',
  'Date',
  'Actions',
]

interface ReferralTableProps {
  referrals: Referral[]
  total: number
  onView: (id: string) => void
  initialFilter?: ReferralStatus | null
}

export function ReferralTable({ referrals, total, onView, initialFilter = null }: ReferralTableProps) {
  const [activeFilter, setActiveFilter] = useState<ReferralStatus | null>(initialFilter)

  useEffect(() => {
    setActiveFilter(initialFilter ?? null)
  }, [initialFilter])

  const visible = activeFilter ? referrals.filter((r) => r.status === activeFilter) : referrals

  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm">
      <div className="flex gap-1 border-b border-border px-4 pt-3">
        {TABS.map(({ label, filter }) => (
          <button
            key={label}
            onClick={() => setActiveFilter(filter)}
            className={[
              'px-3 py-2 text-sm font-medium transition-colors',
              activeFilter === filter
                ? 'border-b-2 border-accent text-accent'
                : 'text-muted hover:text-primary',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-muted uppercase">
            {COLUMNS.map((col) => (
              <th key={col} className="px-5 py-3">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {visible.map((r) => (
            <ReferralTableRow key={r.id} referral={r} onView={onView} />
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <p className="text-xs text-muted">
          Showing 1–{visible.length} of {total.toLocaleString()} referrals
        </p>
        <div className="flex gap-2">
          <button disabled className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted disabled:opacity-40">
            Previous
          </button>
          <button className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-primary hover:bg-base transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
