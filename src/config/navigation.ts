import {
  Home,
  CheckSquare,
  Target,
  BookOpen,
  BarChart3,
  Calendar,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import type { NavConfig } from "@/types/navigation.types";

export const navigationConfig: NavConfig = {
  primary: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      label: "Tasks",
      href: "/dashboard/tasks",
      icon: CheckSquare,
    },
    {
      label: "Goals",
      href: "/dashboard/goals",
      icon: Target,
    },
    {
      label: "Reflections",
      href: "/dashboard/reflections",
      icon: BookOpen,
    },
    {
      label: "Insights",
      href: "/dashboard/insights",
      icon: BarChart3,
    },
    {
      label: "Calendar",
      href: "/dashboard/settings/calendar",
      icon: Calendar,
      divider: true,
    },
  ],
  secondary: [
    {
      label: "Notifications",
      href: "/dashboard/settings/notifications",
      icon: Bell,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      label: "Help",
      href: "/help",
      icon: HelpCircle,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: LogOut,
      divider: true,
    },
  ],
};
