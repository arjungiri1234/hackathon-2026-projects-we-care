import { Users, CalendarClock, CheckCircle2, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { StatCard } from '../components/ui/StatCard'
import { AiInsightCard } from '../components/ui/AiInsightCard'
import { ReferralTable } from '../components/referrals/ReferralTable'
import type { Referral } from '../types/referral'

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

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
        <p className="text-sm text-muted mt-0.5">Overview of your referral network and patient flow.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Referrals"
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
          label="Pending"
          value="42"
          icon={<CalendarClock size={20} className="text-orange-500" />}
          sub={<span className="text-xs text-muted">requires action</span>}
        />
        <StatCard
          label="Accepted"
          value="856"
          icon={<CheckCircle2 size={20} className="text-accent" />}
          sub={<span className="text-xs text-muted">this month</span>}
        />
        <AiInsightCard>
          Cardiology wait times have increased by <strong>14%</strong>. Consider routing non-urgent
          cases to alternative specialists.
        </AiInsightCard>
      </div>

      <ReferralTable
        referrals={REFERRALS}
        total={1248}
        onView={(id) => navigate(`/referrals/${id}`)}
      />
    </div>
  )
}
