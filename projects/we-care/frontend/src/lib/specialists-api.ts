import { api } from './axios'

export interface SpecialistsDirectoryItem {
  id: string
  full_name: string
  specialty: string
  hospital: string
  phone: string | null
  clinician_type: 'doctor' | 'specialist'
}

export async function getSpecialistsDirectory() {
  const response = await api.get<SpecialistsDirectoryItem[]>('/api/specialists')
  return response.data
}
