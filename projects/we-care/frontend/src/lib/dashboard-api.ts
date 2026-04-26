import { api } from './axios'
import type { Referral } from '../types/referral'

export interface DashboardSummary {
  kpis: {
    totalReferrals: number
    pendingReferrals: number
    completedReferrals: number
    acceptedReferrals: number
    averageResponseHours: number
  }
  monthlyTrend: Array<{ month: string; referrals: number }>
  bySpecialty: Array<{ specialty: string; count: number }>
  statusDistribution: Array<{ name: string; value: number; color: string }>
  recentReferrals: Referral[]
  aiInsight: string
}

export async function getDashboardSummary() {
  const response = await api.get<DashboardSummary>('/api/dashboard')
  return response.data
}
