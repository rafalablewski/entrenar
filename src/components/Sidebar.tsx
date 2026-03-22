"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types";

interface SidebarProps {
  user: User;
}

const trainerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "&#9776;" },
  { href: "/athletes", label: "Athletes", icon: "&#127947;" },
  { href: "/endeavours", label: "Endeavours", icon: "&#127942;" },
  { href: "/training-plans", label: "Training Plans", icon: "&#128196;" },
  { href: "/sessions", label: "Sessions", icon: "&#9201;" },
];

const athleteLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "&#9776;" },
  { href: "/endeavours", label: "My Endeavours", icon: "&#127942;" },
  { href: "/training-plans", label: "My Plans", icon: "&#128196;" },
  { href: "/sessions", label: "My Sessions", icon: "&#9201;" },
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
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600">
          Entrenar
        </Link>
        <p className="text-sm text-gray-500 mt-1 capitalize">{user.role}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              pathname === link.href
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span dangerouslySetInnerHTML={{ __html: link.icon }} />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-sm text-gray-500 hover:text-red-600 transition text-left px-3 py-1"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
