"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types";

interface SidebarProps {
  user: User;
}

const trainerLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/athletes", label: "Athletes" },
  { href: "/endeavours", label: "Endeavours" },
  { href: "/training-plans", label: "Plans" },
  { href: "/sessions", label: "Sessions" },
  { href: "/exercises", label: "Exercises" },
];

const athleteLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/endeavours", label: "Endeavours" },
  { href: "/training-plans", label: "Plans" },
  { href: "/sessions", label: "Sessions" },
  { href: "/exercises", label: "Exercises" },
];

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
    <aside className="w-[240px] h-screen sticky top-0 flex flex-col border-r border-[rgba(0,0,0,0.06)] bg-white/80 backdrop-blur-xl">
      <div className="px-6 pt-7 pb-6">
        <span className="text-[15px] font-semibold tracking-tight text-[#1A1A1A]">
          entrenar
        </span>
      </div>

      <nav className="flex-1 px-3">
        <div className="space-y-0.5">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center h-9 px-3 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  active
                    ? "bg-[#F5F5F5] text-[#1A1A1A]"
                    : "text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#FAFAFA]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-4 py-5 border-t border-[rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#F0F0F0] flex items-center justify-center text-[12px] font-semibold text-[#6B6B6B]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[#1A1A1A] truncate">{user.name}</p>
            <p className="text-[11px] text-[#9CA3AF] truncate">{user.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-[12px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
