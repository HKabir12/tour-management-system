"use client";

import React, { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";

import DashboardSidebar from "@/components/layout/Sidebar";
import SidebarIcon from "@/components/utilities/SidebarIcon";
import { Loader } from "@/components/utilities/Loader";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentPath = usePathname();

  const userRole = session?.user?.role as "admin" | "moderator" | "user";
  const userName = session?.user?.name;
  const userImage = session?.user?.image;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const rolePaths: Record<string, string> = {
      admin: "/dashboard/admin",
      moderator: "/dashboard/moderator",
      user: "/dashboard/user",
    };

    if (userRole && !currentPath.includes(rolePaths[userRole])) {
      router.push(rolePaths[userRole]);
    }
  }, [status, userRole, currentPath, router]);

  if (status === "loading" || !userRole) {
    return <Loader />;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={true}>
        <DashboardSidebar role={userRole} userName={userName || ""} userImage={userImage || ""} />
        <main className="w-full">
          <SidebarIcon />
          <div className="px-4">{children}</div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
