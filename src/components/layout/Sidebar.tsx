"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { navigationConfig } from "@/config/navigation";
import { Badge } from "@/components/ui";
import { useUnreadCountQuery } from "@/services/queries/useNotifications";

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: unreadCount } = useUnreadCountQuery();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={`fixed left-0 top-0 z-30 h-screen w-64 border-r border-border-light bg-bg-white transform transition-transform duration-200 md:relative md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Close button for mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-bg-gray md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <div className="h-16 flex items-center px-6 border-b border-border-light">
        <h1 className="text-lg font-bold text-primary">Archer</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col h-[calc(100vh-64px)] overflow-y-auto p-4">
        {/* Primary Navigation */}
        <div className="space-y-2 flex-1">
          {navigationConfig.primary.map((item) => (
            <div key={item.href}>
              {item.divider && (
                <div className="h-px bg-border-light my-2"></div>
              )}

              <Link href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-text-secondary hover:bg-bg-gray"
                  }`}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge variant="info" size="sm" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-2 border-t border-border-light pt-4">
          {navigationConfig.secondary.map((item) => (
            <div key={item.href}>
              {item.divider && (
                <div className="h-px bg-border-light my-2"></div>
              )}

              <Link href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-text-secondary hover:bg-bg-gray"
                  }`}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span className="font-medium">{item.label}</span>
                  {item.label === "Notifications" && unreadCount && (
                    <Badge variant="info" size="sm" className="ml-auto">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}
