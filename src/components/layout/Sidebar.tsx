"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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

import {
  LayoutDashboard,
  Users,
  BarChart3,
  Home,
  Megaphone,
  ClipboardCheck,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  role: "admin" | "moderator" | "user";
  userName?: string;
  userImage?: string;
}

const adminLinks = [
  { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Add Tour", href: "/dashboard/admin/add/tours", icon: Users },
  { label: "Users Management", href: "/dashboard/admin/users", icon: Users },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
];

const moderatorLinks = [
  { label: "Dashboard", href: "/dashboard/moderator", icon: Home },
  { label: "Bookings", href: "/dashboard/moderator/bookings", icon: Megaphone },
];

const userLinks = [
  { label: "Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
  { label: "My Bookings", href: "/dashboard/user/my-bookings", icon: Home },
  {
    label: "Communication",
    href: "/dashboard/user/chat",
    icon: ClipboardCheck,
  },
  { label: "Wishlist", href: "/dashboard/user/wishlist", icon: BarChart3 },
  { label: "Profile", href: "/dashboard/user/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  role,
  userName,
  userImage,
}) => {
  const pathname = usePathname();
  const links =
    role === "admin"
      ? [...adminLinks, ...moderatorLinks, ...userLinks]
      : role === "moderator"
      ? moderatorLinks
      : userLinks;

  const handleLogout = () => signOut({ callbackUrl: "/" });
  const isActive = (href: string) => pathname.startsWith(href);
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image src="/icon.png" alt="logo" width={40} height={20} />
                <span>TMS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem
                  key={`${link.label}-${link.href}`}
                  className={
                    isActive(link.href)
                      ? "bg-blue-100 dark:bg-blue-900 rounded-lg"
                      : ""
                  }
                >
                  <SidebarMenuButton asChild>
                    <Link href={link.href}>
                      <link.icon />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-100"
              >
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <LogOut />
                    Logout
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

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
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
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
