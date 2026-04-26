export interface Specialist {
  id: string
  name: string
  initials: string
  subspecialty: string
  hospital: string
  phone: string
  available: boolean
}

export type AvailabilityStatus = 'available-now' | 'available-soon' | 'consulting' | 'in-surgery'

export interface DirectorySpecialist {
  id: string
  name: string
  initials: string
  credentials: string
  specialty: string
  location: string
  availabilityStatus: AvailabilityStatus
  availabilityLabel: string
}
