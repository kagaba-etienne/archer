import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
  children?: NavItem[];
  divider?: boolean;
}

export interface NavConfig {
  primary: NavItem[];
  secondary: NavItem[];
}
