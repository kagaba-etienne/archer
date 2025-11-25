"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/tasks", label: "Tasks" },
  { href: "/dashboard/goals", label: "Goals" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.push("/login");
    },
  });

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-bg-white border-b border-border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-primary">
              Archer
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-text-primary hover:bg-bg-light hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop User & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-text-secondary">{user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              isLoading={logoutMutation.isPending}
            >
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex px-1 h-full items-center justify-center rounded-md text-text-primary hover:bg-bg-light hover:text-text-primary transition-colors hover:outline-none hover:ring-2 hover:ring-inset hover:ring-primary"
            onClick={handleMobileMenuToggle}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger Icon */}
            {!isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border-light">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-text-primary hover:bg-bg-light hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-border-light">
            <div className="px-4 flex items-center justify-between">
              <span className="text-sm text-text-secondary">{user?.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  closeMobileMenu();
                  logoutMutation.mutate();
                }}
                isLoading={logoutMutation.isPending}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
