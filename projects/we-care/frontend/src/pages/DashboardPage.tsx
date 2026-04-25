import { Users, CalendarClock, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react'

type Urgency = 'HIGH' | 'ELEVATED' | 'ROUTINE'
type ReferralStatus = 'PENDING' | 'SENT' | 'ACCEPTED' | 'COMPLETED'

interface Referral {
  id: string
  patient: string
  diagnosis: string
  specialty: string
  specialist: string
  urgency: Urgency
  status: ReferralStatus
  date: string
}

const REFERRALS: Referral[] = [
  {
    id: '1',
    patient: 'Sarah Jenkins',
    diagnosis: 'Atypical chest pain',
    specialty: 'Cardiology',
    specialist: 'Dr. Robert Chen',
    urgency: 'HIGH',
    status: 'PENDING',
    date: 'Oct 24, 2023',
  },
  {
    id: '2',
    patient: 'Michael Chang',
    diagnosis: 'Chronic migraine evaluation',
    specialty: 'Neurology',
    specialist: 'Dr. Sarah Palmer',
    urgency: 'ROUTINE',
    status: 'ACCEPTED',
    date: 'Oct 23, 2023',
  },
  {
    id: '3',
    patient: 'Elena Rodriguez',
    diagnosis: 'Suspicious mole excision',
    specialty: 'Dermatology',
    specialist: 'Unassigned',
    urgency: 'ELEVATED',
    status: 'SENT',
    date: 'Oct 22, 2023',
  },
  {
    id: '4',
    patient: 'David Kim',
    diagnosis: 'Post-op physical therapy',
    specialty: 'Orthopedics',
    specialist: 'Dr. James Wilson',
    urgency: 'ROUTINE',
    status: 'COMPLETED',
    date: 'Oct 15, 2023',
  },
]

const URGENCY_CLASSES: Record<Urgency, string> = {
  HIGH: 'bg-red-100 text-red-700',
  ELEVATED: 'bg-orange-100 text-orange-700',
  ROUTINE: 'bg-slate-100 text-slate-600',
}

const STATUS_CLASSES: Record<ReferralStatus, string> = {
  PENDING: 'bg-orange-100 text-orange-700',
  SENT: 'bg-slate-100 text-slate-600',
  ACCEPTED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
}

const TABLE_TABS = ['All Referrals', 'Pending', 'Sent', 'Accepted', 'Completed']

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
        <p className="text-sm text-muted mt-0.5">Overview of your referral network and patient flow.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="TOTAL REFERRALS"
          value="1,248"
          icon={<Users size={20} className="text-accent" />}
          sub={
            <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
              <TrendingUp size={12} />
              12%
            </span>
          }
        />
        <StatCard
          label="PENDING"
          value="42"
          icon={<CalendarClock size={20} className="text-orange-500" />}
          sub={<span className="text-xs text-muted">requires action</span>}
        />
        <StatCard
          label="ACCEPTED"
          value="856"
          icon={<CheckCircle2 size={20} className="text-accent" />}
          sub={<span className="text-xs text-muted">this month</span>}
        />

        {/* AI Insights card */}
        <div className="rounded-xl border-l-4 border-l-ai border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold tracking-wide text-ai">AI INSIGHTS</p>
            <Sparkles size={16} className="text-ai" />
          </div>
          <p className="text-sm text-primary leading-relaxed">
            Cardiology wait times have increased by{' '}
            <strong>14%</strong>. Consider routing non-urgent cases to alternative specialists.
          </p>
        </div>
      </div>

      {/* Referrals table */}
      <div className="rounded-xl border border-border bg-surface shadow-sm">
        {/* Table tabs */}
        <div className="flex gap-1 border-b border-border px-4 pt-3">
          {TABLE_TABS.map((tab, i) => (
            <button
              key={tab}
              className={[
                'px-3 py-2 text-sm font-medium transition-colors',
                i === 0
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-muted hover:text-primary',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-muted uppercase">
              <th className="px-5 py-3">Patient Name</th>
              <th className="px-5 py-3">Diagnosis / Reason</th>
              <th className="px-5 py-3">Specialty</th>
              <th className="px-5 py-3">Specialist</th>
              <th className="px-5 py-3">Urgency</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {REFERRALS.map((r) => (
              <tr key={r.id} className="hover:bg-base transition-colors">
                <td className="px-5 py-4 font-medium text-primary">{r.patient}</td>
                <td className="px-5 py-4 text-muted">{r.diagnosis}</td>
                <td className="px-5 py-4 text-primary">{r.specialty}</td>
                <td className="px-5 py-4 text-primary">{r.specialist}</td>
                <td className="px-5 py-4">
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${URGENCY_CLASSES[r.urgency]}`}>
                    {r.urgency}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${STATUS_CLASSES[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted whitespace-nowrap">{r.date}</td>
                <td className="px-5 py-4">
                  <button className="text-accent text-sm font-medium hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <p className="text-xs text-muted">Showing 1-4 of 1,248 referrals</p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted disabled:opacity-40" disabled>
              Previous
            </button>
            <button className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-primary hover:bg-base transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  sub,
}: {
  label: string
  value: string
  icon: React.ReactNode
  sub: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold text-primary">{value}</p>
      <div className="mt-1">{sub}</div>
    </div>
  )
}
