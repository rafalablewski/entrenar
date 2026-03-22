"use client";

import Sidebar from "@/components/Sidebar";
import { User } from "@/types";

export default function SidebarWrapper({ user }: { user: User }) {
  return <Sidebar user={user} />;
}
