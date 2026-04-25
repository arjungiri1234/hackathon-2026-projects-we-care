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
    <div className="flex min-h-screen flex-col items-center justify-center bg-base px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-1 flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="6" fill="#2563EB" />
              <path d="M14 7v14M7 14h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-primary">RefAI</span>
          </div>
          <p className="text-sm text-muted">Secure Clinician Portal</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-muted">
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
              className="h-10 w-full rounded-lg border border-border px-3 text-sm text-primary placeholder:text-placeholder focus:border-transparent focus:ring-2 focus:ring-accent focus:outline-none"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-widest text-muted">
                Password
              </label>
              <button type="button" className="text-xs text-accent hover:underline">
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
              className="h-10 w-full rounded-lg border border-border px-3 text-sm text-primary placeholder:text-placeholder focus:border-transparent focus:ring-2 focus:ring-accent focus:outline-none"
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {loading ? 'Signing in…' : <>Sign In <span>→]</span></>}
          </button>
        </form>

        <div className="mt-6 border-t border-border pt-5 text-center">
          <p className="text-sm text-muted">
            Don't have an account?{' '}
            <button type="button" className="font-medium text-accent hover:underline">
              Create an account
            </button>
          </p>
        </div>
      </div>

      <p className="mt-6 text-xs text-subtle">
        For emergency technical support, contact IT at Ext. 4992
      </p>
    </div>
  )
}
