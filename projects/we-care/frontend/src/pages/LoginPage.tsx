import { useState } from 'react'
import { loginSchema, type LoginForm } from '../types/auth'

type FormErrors = { email?: string; password?: string }

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setLoading(true)
    try {
      // TODO: wire to auth API
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-1">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="6" fill="#2563EB" />
              <path d="M14 7v14M7 14h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-2xl font-bold text-[#0F172A] tracking-tight">RefAI</span>
          </div>
          <p className="text-sm text-[#64748B]">Secure Clinician Portal</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-[#64748B]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="doctor@hospital.org"
              value={form.email}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-widest text-[#64748B]">
                Password
              </label>
              <button type="button" className="text-xs text-[#2563EB] hover:underline">
                Forgot Password?
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {loading ? 'Signing in…' : <>Sign In <span>→]</span></>}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#E2E8F0] text-center">
          <p className="text-sm text-[#64748B]">
            Don't have an account?{' '}
            <button type="button" className="text-[#2563EB] font-medium hover:underline">
              Create an account
            </button>
          </p>
        </div>
      </div>

      <p className="mt-6 text-xs text-[#94A3B8]">
        For emergency technical support, contact IT at Ext. 4992
      </p>
    </div>
  )
}
