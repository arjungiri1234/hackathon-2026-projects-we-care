import type { LucideIcon } from "lucide-react";
import {
  HelpCircle,
  LayoutDashboard,
  Plus,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../ui/Logo";
import { SidebarNavItem } from "./SidebarNavItem";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/referrals", label: "Referrals", icon: Users },
  { to: "/specialists", label: "Specialists", icon: UserRound },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-sidebar text-white">
      <div className="flex items-center gap-3 px-5 py-6">
        <Logo size={32} />
        <div>
          <p className="text-sm font-bold leading-tight">RefAI Portal</p>
          <p className="text-xs text-slate-400 leading-tight">
            Medical Specialist
          </p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={() => navigate("/referrals/new")}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
        >
          <Plus size={16} />
          New Referral
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.to} {...item} />
        ))}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
          <HelpCircle size={18} />
          Help Center
        </button>
      </div>
    </aside>
  );
}
