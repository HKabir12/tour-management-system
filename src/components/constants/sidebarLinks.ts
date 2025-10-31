import {
  LayoutDashboard,
  Users,
  BarChart3,
  
  Megaphone,
  ClipboardCheck,
  Settings,
  User,
  Train,
  Heart,
  SaveAll,
  LifeBuoy,
  Wallet,
  Bell,
  FileText,
  Star,
  CreditCard,
  Zap,
  Box,
  CheckCircle2,
} from "lucide-react";

export interface SidebarLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
}

// 🧩 Admin Links
export const adminLinks: SidebarLink[] = [
 { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "All Tours", href: "/dashboard/admin/all", icon: SaveAll },
  { label: "Add Tour", href: "/dashboard/admin/add/tours", icon: Megaphone },
  { label: "Users Management", href: "/dashboard/admin/users", icon: Users },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },

  // 🔹 Future links
  { label: "Payments / Transactions", href: "/dashboard/admin/payments", icon: CreditCard },
  { label: "Reports", href: "/dashboard/admin/reports", icon: FileText },
  { label: "Promotions / Coupons", href: "/dashboard/admin/promotions", icon: Zap },
  { label: "Site Settings", href: "/dashboard/admin/settings", icon: Settings },
  { label: "Content Management", href: "/dashboard/admin/content", icon: Box },
  { label: "Audit Logs", href: "/dashboard/admin/audit-logs", icon: ClipboardCheck },
];

// 🧩 Moderator Links
export const moderatorLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard/moderator", icon: LayoutDashboard },
  { label: "Manage Bookings", href: "/dashboard/moderator/bookings", icon: ClipboardCheck },
   { label: "Support Management", href: "/dashboard/moderator/support", icon: LifeBuoy },
    { label: "Tour Approvals", href: "/dashboard/moderator/tour-approvals", icon: CheckCircle2 },
  { label: "Feedback / Reviews", href: "/dashboard/moderator/reviews", icon: FileText },
  { label: "Notifications / Announcements", href: "/dashboard/moderator/notifications", icon: Bell },
  { label: "User Monitoring", href: "/dashboard/moderator/users", icon: Users },
  { label: "Reports Summary", href: "/dashboard/moderator/reports", icon: FileText },
    
];

// 🧩 User Links
export const userLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
  { label: "My Bookings", href: "/dashboard/user/my-bookings", icon: ClipboardCheck },
  { label: "Travel Buddy", href: "/dashboard/user/travel-buddy", icon: Train },
  { label: "Chat", href: "/dashboard/user/chat", icon: Megaphone },
  { label: "Live Support", href: "/dashboard/user/live-support", icon: LifeBuoy },
  { label: "Wishlist", href: "/dashboard/user/wishlist", icon: Heart },
  { label: "Profile", href: "/dashboard/user/profile", icon: User },
  { label: "Settings", href: "/dashboard/user/settings", icon: Settings },

  // 🔹 Future links
  { label: "Payment History", href: "/dashboard/user/payments", icon: Wallet },
  { label: "Notifications", href: "/dashboard/user/notifications", icon: Bell },
  { label: "Travel History", href: "/dashboard/user/travel-history", icon: FileText },
  { label: "Rewards / Loyalty", href: "/dashboard/user/rewards", icon: Star },
  { label: "Reviews / Feedback", href: "/dashboard/user/reviews", icon: ClipboardCheck },
];
