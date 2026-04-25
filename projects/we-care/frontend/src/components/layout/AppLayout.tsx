import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserRound,
  BarChart2,
  Settings,
  HelpCircle,
  Plus,
  Bell,
  Search,
} from 'lucide-react'
import { Logo } from '../ui/Logo'
import { useAuthStore } from '../../stores/authStore'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/referrals', label: 'Referrals', icon: Users },
  { to: '/specialists', label: 'Specialists', icon: UserRound },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppLayout() {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  function handleLogout() {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen bg-base overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-60 flex-shrink-0 flex-col bg-sidebar text-white">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-6">
          <Logo size={32} />
          <div>
            <p className="text-sm font-bold leading-tight">RefAI Portal</p>
            <p className="text-xs text-slate-400 leading-tight">Medical Specialist</p>
          </div>
        </div>

        {/* New Referral */}
        <div className="px-4 pb-4">
          <button
            onClick={() => navigate('/referrals/new')}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
          >
            <Plus size={16} />
            New Referral
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                ].join(' ')
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Help Center */}
        <div className="border-t border-white/10 px-3 py-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
            <HelpCircle size={18} />
            Help Center
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b border-border bg-surface px-6 py-3">
          <h1 className="w-44 flex-shrink-0 text-sm font-semibold text-primary leading-tight">
            Referral<br />Management
          </h1>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Search patients..."
              className="h-9 w-full rounded-lg border border-border bg-base pl-9 pr-3 text-sm placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
            />
          </div>

          {/* Filter tabs */}
          <nav className="flex items-center gap-1 text-sm font-medium">
            {['Inbound', 'Outbound', 'Pending', 'Quick Search'].map((tab) => (
              <button
                key={tab}
                className="rounded px-3 py-1.5 text-muted hover:text-primary transition-colors first:text-accent first:font-semibold"
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
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-base hover:text-primary transition-colors"
              title="Settings / Logout"
            >
              <Settings size={18} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
              A
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
