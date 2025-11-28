"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, ChevronDown, BowArrow } from "lucide-react";
import { useRouter } from "next/navigation";
import { NotificationBell } from "@/components/features/notifications/NotificationBell";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";

export interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // handle on outside click to close user menu
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-light bg-bg-white">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo & Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg hover:text-primary cursor-pointer md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary flex items-center justify-center rounded-sm">
              <BowArrow className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-primary hidden sm:inline">
              Archer
            </span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <NotificationBell />

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-bg-gray transition-colors"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-sm bg-primary/10">
                <span className="text-2xl font-bold text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-text-secondary" />
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-bg-white border border-border-light rounded-lg shadow-lg overflow-hidden">
                <div className="p-3 border-b border-border-light">
                  <p className="text-sm font-medium text-text-primary">
                    {user?.name}
                  </p>
                  <p className="text-xs text-text-secondary">{user?.email}</p>
                </div>

                <div className="py-2">
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm hover:bg-bg-gray transition-colors"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/dashboard/settings/calendar"
                    className="block px-4 py-2 text-sm hover:bg-bg-gray transition-colors"
                  >
                    Calendar
                  </Link>
                  <Link
                    href="/dashboard/settings/notifications"
                    className="block px-4 py-2 text-sm hover:bg-bg-gray transition-colors"
                  >
                    Notifications
                  </Link>

                  <div className="border-t border-border-light my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-accent-error hover:bg-accent-error/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
