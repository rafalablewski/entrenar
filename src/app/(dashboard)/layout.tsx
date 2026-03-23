import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import SidebarWrapper from "./SidebarWrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-depth-1)" }}>
      <SidebarWrapper user={user} />
      <main className="flex-1 px-12 py-10 max-w-6xl">
        {children}
      </main>
    </div>
  );
}
