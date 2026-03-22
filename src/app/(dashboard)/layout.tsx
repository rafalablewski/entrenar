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
    <div className="flex min-h-screen">
      <SidebarWrapper user={user} />
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
