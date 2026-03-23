"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types";

interface SidebarProps {
  user: User;
}

const trainerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/athletes", label: "Athletes", icon: "users" },
  { href: "/endeavours", label: "Endeavours", icon: "target" },
  { href: "/training-plans", label: "Plans", icon: "calendar" },
  { href: "/sessions", label: "Sessions", icon: "activity" },
  { href: "/health", label: "Health", icon: "heart" },
  { href: "/exercises", label: "Exercise Atlas", icon: "anatomy" },
];

const athleteLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/endeavours", label: "Endeavours", icon: "target" },
  { href: "/training-plans", label: "Plans", icon: "calendar" },
  { href: "/sessions", label: "Sessions", icon: "activity" },
  { href: "/health", label: "Health", icon: "heart" },
  { href: "/exercises", label: "Exercise Atlas", icon: "anatomy" },
];

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? "#00F0FF" : "rgba(255,255,255,0.3)";
  const props = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (icon) {
    case "grid":
      return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
    case "users":
      return <svg {...props}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
    case "target":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
    case "calendar":
      return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
    case "activity":
      return <svg {...props}><polyline points="22,12 18,12 15,21 9,3 6,12 2,12" /></svg>;
    case "heart":
      return <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
    case "anatomy":
      return <svg {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M12 6v12M8 8c0 2 1.5 3 4 3s4-1 4-3M8 16c0-2 1.5-3 4-3s4 1 4 3" /></svg>;
    default:
      return null;
  }
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const links = user.role === "trainer" ? trainerLinks : athleteLinks;

  async function handleLogout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/");
  }

  return (
    <aside className="w-[260px] h-screen sticky top-0 flex flex-col"
      style={{
        background: "linear-gradient(180deg, rgba(10,10,20,0.95) 0%, rgba(5,5,10,0.98) 100%)",
        borderRight: "1px solid rgba(255,255,255,0.04)",
        backdropFilter: "blur(40px)",
      }}>

      {/* Logo */}
      <div className="px-7 pt-8 pb-7">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00F0FF, #4D7CFF)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-[15px] font-bold tracking-[-0.02em]" style={{ color: "rgba(255,255,255,0.9)" }}>
            ENTRENAR
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 h-11 px-4 rounded-xl text-[13px] font-medium transition-all duration-200"
                style={{
                  background: active ? "rgba(0, 240, 255, 0.06)" : "transparent",
                  color: active ? "#00F0FF" : "rgba(255,255,255,0.45)",
                  borderLeft: active ? "2px solid #00F0FF" : "2px solid transparent",
                }}
              >
                <NavIcon icon={link.icon} active={active} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="px-5 py-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold"
            style={{
              background: "linear-gradient(135deg, rgba(0,240,255,0.15), rgba(77,124,255,0.15))",
              color: "#00F0FF",
              border: "1px solid rgba(0,240,255,0.1)",
            }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate" style={{ color: "rgba(255,255,255,0.85)" }}>
              {user.name}
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.05em] truncate" style={{ color: "rgba(255,255,255,0.25)" }}>
              {user.role}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-[12px] font-medium transition-colors"
          style={{ color: "rgba(255,255,255,0.25)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B5C")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
