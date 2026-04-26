export const queryKeys = {
  dashboard: ['dashboard'] as const,
  doctorProfile: ['doctor-profile'] as const,
  doctorById: (doctorId: string) => ['doctor-profile', doctorId] as const,
  doctorLookups: ['doctor-lookups'] as const,
  specialistsDirectory: ['specialists-directory'] as const,
}
