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
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <SidebarWrapper user={user} />
      <main className="flex-1 px-10 py-8 max-w-5xl">{children}</main>
    </div>
  );
}
