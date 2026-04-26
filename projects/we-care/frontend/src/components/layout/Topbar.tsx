import { useRef } from 'react'
import { Bell, Search, Settings } from 'lucide-react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

interface FilterTab {
  label: string
  filter: string // maps to ?filter= value
}

const FILTER_TABS: FilterTab[] = [
  { label: 'Inbound', filter: 'ACCEPTED' },
  { label: 'Outbound', filter: 'SENT' },
  { label: 'Pending', filter: 'PENDING' },
]

export function Topbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const searchRef = useRef<HTMLInputElement>(null)

  const activeFilter = searchParams.get('filter')

  function handleTabClick(filter: string) {
    navigate(`/referrals?filter=${filter}`)
  }

  function handleQuickSearch() {
    searchRef.current?.focus()
  }

  function handleLogout() {
    clearAuth()
    navigate('/login', { replace: true })
  }

  const isTabActive = (filter: string) =>
    pathname === '/referrals' && activeFilter === filter

  return (
    <header className="flex items-center gap-4 border-b border-border bg-surface px-6 py-3">
      <h1 className="w-44 shrink-0 text-sm font-semibold text-primary leading-tight">
        Referral<br />Management
      </h1>

      <div className="relative flex-1 max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          ref={searchRef}
          type="search"
          placeholder="Search patients..."
          className="h-9 w-full rounded-lg border border-border bg-base pl-9 pr-3 text-sm placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
        />
      </div>

      <nav className="flex items-center gap-1 text-sm font-medium">
        {FILTER_TABS.map(({ label, filter }) => (
          <button
            key={label}
            onClick={() => handleTabClick(filter)}
            className={[
              'rounded px-3 py-1.5 transition-colors',
              isTabActive(filter)
                ? 'text-accent font-semibold'
                : 'text-muted hover:text-primary',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
        <button
          onClick={handleQuickSearch}
          className="rounded px-3 py-1.5 text-muted transition-colors hover:text-primary"
        >
          Quick Search
        </button>
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
