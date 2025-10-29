"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import { IconDashboard } from "@tabler/icons-react";
import { signOut } from "next-auth/react";

interface UserProfileDropdownProps {
  session: Session;
}

export default function UserProfileDropdown({ session }: UserProfileDropdownProps) {
  const router = useRouter();
  const user = session?.user;

  const handleLogout = () => signOut({ callbackUrl: "/" });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || "/default-avatar.png"} />
          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={10}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="h-4 w-4 mr-2" /> Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/dashboard/admin")}>
          <IconDashboard className="h-4 w-4 mr-2" /> Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="h-4 w-4 mr-2" /> Settings
        </DropdownMenuItem>

        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
