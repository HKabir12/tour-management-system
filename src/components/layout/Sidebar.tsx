"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut } from "lucide-react";

import { adminLinks, moderatorLinks, userLinks, SidebarLink } from "@/components/constants/sidebarLinks";

interface DashboardSidebarProps {
  role: "admin" | "moderator" | "user";
  userName?: string;
  userImage?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  role,
  userName,
  userImage,
}) => {
  const pathname = usePathname();

  // ✅ Role-based links
  let links: SidebarLink[] = [];
  if (role === "admin") links = adminLinks;
  else if (role === "moderator") links = moderatorLinks;
  else links = userLinks;

  // ✅ Check exact match for active link
  const isActive = (href: string) => pathname === href;

  // ✅ Logout
  const handleLogout = () => signOut({ callbackUrl: "/" });

  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <Image src="/icon.png" alt="logo" width={36} height={36} />
                <span className="font-semibold text-lg">TMS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* MAIN CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <SidebarMenuItem
                    key={link.href}
                    className={
                      isActive(link.href)
                        ? "bg-blue-100 dark:bg-blue-900 rounded-lg"
                        : ""
                    }
                  >
                    <SidebarMenuButton asChild>
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 py-2"
                      >
                        <Icon size={18} />
                        <span>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Logout */}
              <SidebarMenuItem
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-100 rounded-lg mt-2"
              >
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <LogOut size={18} />
                    Logout
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar>
                    <AvatarImage src={userImage || "/default-avatar.png"} />
                    <AvatarFallback>{userName?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/user/profile">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/user/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
