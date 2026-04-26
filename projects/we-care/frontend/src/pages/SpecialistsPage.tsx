import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { SpecialistTableRow } from '../components/specialists/SpecialistTableRow'
import type { DirectorySpecialist, AvailabilityStatus } from '../types/specialist'

const SPECIALISTS: DirectorySpecialist[] = [
  { id: '1', name: 'Dr. Sarah Adams', initials: 'SA', credentials: 'MD, FACC', specialty: 'Cardiology', location: 'Memorial Hospital, West Wing', availabilityStatus: 'available-now', availabilityLabel: 'Available Now' },
  { id: '2', name: 'Dr. Marcus Chen', initials: 'MC', credentials: 'MD, PhD', specialty: 'Neurology', location: 'Central Clinic, Floor 3', availabilityStatus: 'available-soon', availabilityLabel: 'Available in 2 hrs' },
  { id: '3', name: 'Dr. Elena Rodriguez', initials: 'ER', credentials: 'DO, FAAP', specialty: 'Pediatrics', location: "Children's Care Center", availabilityStatus: 'consulting', availabilityLabel: 'Consulting' },
  { id: '4', name: 'Dr. James Patel', initials: 'JP', credentials: 'MD, FACS', specialty: 'Orthopedics', location: 'Sports Medicine Inst.', availabilityStatus: 'in-surgery', availabilityLabel: 'In Surgery' },
  { id: '5', name: 'Dr. Linda Kim', initials: 'LK', credentials: 'MD', specialty: 'Oncology', location: 'Memorial Hospital, East Wing', availabilityStatus: 'available-now', availabilityLabel: 'Available Now' },
]

const TOTAL = 24
const COLUMNS = ['Specialist Name', 'Specialty', 'Location', 'Availability Status', 'Actions']

const AVAILABILITY_OPTIONS: Array<{ label: string; value: AvailabilityStatus | '' }> = [
  { label: 'All Availability', value: '' },
  { label: 'Available Now', value: 'available-now' },
  { label: 'Available Soon', value: 'available-soon' },
  { label: 'Consulting', value: 'consulting' },
  { label: 'In Surgery', value: 'in-surgery' },
]

const selectCls = 'cursor-pointer appearance-none rounded-full border border-border bg-surface pl-4 pr-8 py-2 text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1'

export default function SpecialistsPage() {
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityStatus | ''>('')

  const specialties = useMemo(
    () => ['All Specialties', ...Array.from(new Set(SPECIALISTS.map((s) => s.specialty)))],
    []
  )

  const visible = useMemo(() => {
    return SPECIALISTS.filter((s) => {
      if (specialtyFilter && specialtyFilter !== 'All Specialties' && s.specialty !== specialtyFilter) return false
      if (availabilityFilter && s.availabilityStatus !== availabilityFilter) return false
      return true
    })
  }, [specialtyFilter, availabilityFilter])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-primary">Specialists Directory</h2>
          <p className="text-sm text-muted mt-0.5">Comprehensive network of verified medical professionals.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className={selectCls}
            >
              {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>

          <div className="relative">
            <select className={selectCls}>
              <option>Location</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>

          <div className="relative">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as AvailabilityStatus | '')}
              className={selectCls}
            >
              {AVAILABILITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-muted uppercase">
              {COLUMNS.map((col) => (
                <th key={col} className={`px-5 py-3 ${col === 'Actions' ? 'text-right' : ''}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visible.map((s) => (
              <SpecialistTableRow key={s.id} specialist={s} onViewProfile={() => {}} />
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <p className="text-xs text-muted">
            Showing 1 to {visible.length} of {TOTAL} specialists
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
    </div>
  )
}
