interface BaseSpecialist {
  id: string
  name: string
  initials: string
}

export interface Specialist extends BaseSpecialist {
  subspecialty: string
  hospital: string
  phone: string
  available: boolean
}

export type ClinicianType = 'doctor' | 'specialist'

export interface DirectorySpecialist extends BaseSpecialist {
  credentials: string
  specialty: string
  location: string
  clinicianType: ClinicianType
}
