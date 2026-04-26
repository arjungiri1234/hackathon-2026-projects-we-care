import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, Clock, CheckCircle2 } from 'lucide-react'
import { StatCard } from '../components/ui/StatCard'

const MONTHLY_TREND = [
  { month: 'May', referrals: 78 },
  { month: 'Jun', referrals: 95 },
  { month: 'Jul', referrals: 88 },
  { month: 'Aug', referrals: 112 },
  { month: 'Sep', referrals: 134 },
  { month: 'Oct', referrals: 156 },
  { month: 'Nov', referrals: 142 },
  { month: 'Dec', referrals: 168 },
  { month: 'Jan', referrals: 185 },
  { month: 'Feb', referrals: 172 },
  { month: 'Mar', referrals: 198 },
  { month: 'Apr', referrals: 220 },
]

const BY_SPECIALTY = [
  { specialty: 'Cardiology', count: 312 },
  { specialty: 'Neurology', count: 248 },
  { specialty: 'Orthopedics', count: 196 },
  { specialty: 'Dermatology', count: 154 },
  { specialty: 'Oncology', count: 132 },
  { specialty: 'Psychiatry', count: 98 },
]

const STATUS_DIST = [
  { name: 'Completed', value: 856, color: '#22c55e' },
  { name: 'Accepted', value: 214, color: '#3b82f6' },
  { name: 'Pending', value: 112, color: '#f97316' },
  { name: 'Sent', value: 66, color: '#94a3b8' },
]

const TOTAL_STATUS = STATUS_DIST.reduce((s, d) => s + d.value, 0)

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Analytics</h2>
        <p className="text-sm text-muted mt-0.5">Referral network performance and trends.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Referrals"
          value="1,248"
          icon={<TrendingUp size={20} className="text-accent" />}
          sub={<span className="text-xs text-green-600 font-medium">↑ 12% vs last month</span>}
        />
        <StatCard
          label="Acceptance Rate"
          value="87%"
          icon={<CheckCircle2 size={20} className="text-green-500" />}
          sub={<span className="text-xs text-green-600 font-medium">↑ 3% vs last month</span>}
        />
        <StatCard
          label="Avg Response Time"
          value="4.2 hrs"
          icon={<Clock size={20} className="text-orange-500" />}
          sub={<span className="text-xs text-green-600 font-medium">↓ 18 min improvement</span>}
        />
        <StatCard
          label="Completion Rate"
          value="68%"
          icon={<TrendingDown size={20} className="text-muted" />}
          sub={<span className="text-xs text-muted">856 of 1,248 completed</span>}
        />
      </div>

      {/* Trend chart */}
      <SectionCard title="Referrals Over Time (12 months)">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={MONTHLY_TREND} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="refGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
              labelStyle={{ fontWeight: 600, color: '#0F172A' }}
            />
            <Area type="monotone" dataKey="referrals" stroke="#2563EB" strokeWidth={2} fill="url(#refGrad)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      <div className="grid grid-cols-2 gap-4">
        {/* By specialty */}
        <SectionCard title="Referrals by Specialty">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={BY_SPECIALTY} layout="vertical" margin={{ top: 0, right: 8, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="specialty" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
                cursor={{ fill: '#F8FAFC' }}
              />
              <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Status distribution */}
        <SectionCard title="Status Distribution">
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={STATUS_DIST} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                  {STATUS_DIST.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {STATUS_DIST.map((d) => (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-xs font-medium text-primary">{d.name}</span>
                    </div>
                    <span className="text-xs text-muted">{d.value} ({Math.round(d.value / TOTAL_STATUS * 100)}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${d.value / TOTAL_STATUS * 100}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
