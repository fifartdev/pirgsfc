"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/club-admin/actions";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Trophy,
  MapPin,
  Newspaper,
  UserCog,
  Shield,
  BookOpen,
  ListOrdered,
  LogOut,
  ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/club-admin/dashboard", label: "Πίνακας Ελέγχου", icon: LayoutDashboard },
  { href: "/club-admin/seasons", label: "Σεζόν", icon: Calendar },
  { href: "/club-admin/teams", label: "Ομάδες", icon: Shield },
  { href: "/club-admin/leagues", label: "Διοργανώσεις", icon: Trophy },
  { href: "/club-admin/players", label: "Παίκτες", icon: Users },
  { href: "/club-admin/rosters", label: "Ρόστερ", icon: BookOpen },
  { href: "/club-admin/venues", label: "Γήπεδα", icon: MapPin },
  { href: "/club-admin/matches", label: "Αγώνες", icon: Trophy },
  { href: "/club-admin/standings", label: "Βαθμολογία", icon: ListOrdered },
  { href: "/club-admin/news", label: "Νέα", icon: Newspaper },
  { href: "/club-admin/staff", label: "Προσωπικό", icon: UserCog },
];

interface SidebarProps {
  userName?: string;
}

export function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-white/10 bg-[#0d0d0d]">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white">
          P
        </div>
        <div>
          <p className="text-sm font-bold text-white">PYRGOS AFC</p>
          <p className="text-[11px] text-gray-500">Διαχείριση</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || (href !== "/club-admin/dashboard" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-red-600 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight className="h-3 w-3 opacity-70" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User / Logout */}
      <div className="border-t border-white/10 px-4 py-4">
        {userName && (
          <p className="mb-3 truncate px-2 text-xs text-gray-500">{userName}</p>
        )}
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Αποσύνδεση
          </button>
        </form>
      </div>
    </aside>
  );
}
