import { Bell, Settings, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

const FILTER_TABS = ['Inbound', 'Outbound', 'Pending', 'Quick Search']

export function Topbar() {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  function handleLogout() {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex items-center gap-4 border-b border-border bg-surface px-6 py-3">
      <h1 className="w-44 flex-shrink-0 text-sm font-semibold text-primary leading-tight">
        Referral<br />Management
      </h1>

      <div className="relative flex-1 max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Search patients..."
          className="h-9 w-full rounded-lg border border-border bg-base pl-9 pr-3 text-sm placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
        />
      </div>

      <nav className="flex items-center gap-1 text-sm font-medium">
        {FILTER_TABS.map((tab, i) => (
          <button
            key={tab}
            className={[
              'rounded px-3 py-1.5 transition-colors',
              i === 0 ? 'text-accent font-semibold' : 'text-muted hover:text-primary',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-base hover:text-primary transition-colors">
          <Bell size={18} />
        </button>
        <button
          onClick={handleLogout}
          title="Settings / Logout"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-base hover:text-primary transition-colors"
        >
          <Settings size={18} />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
          A
        </button>
      </div>
    </header>
  )
}
