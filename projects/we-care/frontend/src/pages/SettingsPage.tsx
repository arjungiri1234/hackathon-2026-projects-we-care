import { useState, useRef } from 'react'
import { UserCircle2, ChevronDown, ArrowRight } from 'lucide-react'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'

const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Urology',
]

interface ProfileForm {
  fullName: string
  licenseNumber: string
  specialty: string
  hospital: string
}

const TOTAL_STEPS = 3

export default function SettingsPage() {
  const [step, setStep] = useState(1)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [form, setForm] = useState<ProfileForm>({
    fullName: 'Dr. Jameson',
    licenseNumber: '',
    specialty: '',
    hospital: '',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  function update(field: keyof ProfileForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setAvatarUrl(URL.createObjectURL(file))
  }

  function handleContinue() {
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
  }

  const inputCls = 'w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1'
  const selectCls = `${inputCls} cursor-pointer appearance-none pr-9`

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Welcome, {form.fullName}</h2>
        <p className="text-sm text-muted mt-1">Please complete your professional profile to start using RefAI.</p>
      </div>

      <ProgressBar total={TOTAL_STEPS} current={step} />

      <div className="rounded-xl border border-border bg-surface shadow-sm">
        {/* Profile picture */}
        <div className="flex items-start gap-5 border-b border-border p-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors overflow-hidden"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <UserCircle2 size={40} className="text-slate-400" />
            )}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          <div>
            <p className="text-base font-semibold text-primary">Profile Picture</p>
            <p className="text-sm text-muted mt-0.5">Upload a professional headshot for your clinician profile.</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-sm font-medium text-accent hover:underline"
            >
              Choose Image
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Full Name</label>
              <input
                className={inputCls}
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                placeholder="Dr. Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Medical License Number</label>
              <input
                className={inputCls}
                value={form.licenseNumber}
                onChange={(e) => update('licenseNumber', e.target.value)}
                placeholder="Enter license number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Specialty</label>
              <div className="relative">
                <select
                  className={selectCls}
                  value={form.specialty}
                  onChange={(e) => update('specialty', e.target.value)}
                >
                  <option value="">Select a specialty...</option>
                  {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Hospital / Clinic Name</label>
              <input
                className={inputCls}
                value={form.hospital}
                onChange={(e) => update('hospital', e.target.value)}
                placeholder="Primary affiliation"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border px-6 py-4">
          <Button onClick={handleContinue}>
            Save and Continue
            <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  )
}
