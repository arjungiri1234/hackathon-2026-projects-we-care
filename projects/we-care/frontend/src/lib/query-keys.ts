export const queryKeys = {
  doctorProfile: ['doctor-profile'] as const,
  doctorById: (doctorId: string) => ['doctor-profile', doctorId] as const,
  doctorLookups: ['doctor-lookups'] as const,
  specialistsDirectory: ['specialists-directory'] as const,
}
