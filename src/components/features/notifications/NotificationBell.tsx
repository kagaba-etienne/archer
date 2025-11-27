"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationCenter } from "./NotificationCenter";
import { useUnreadCountQuery } from "@/services/queries/useNotifications";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount } = useUnreadCountQuery();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-bg-gray transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-text-primary" />

        {/* Unread Badge */}
        {unreadCount !== undefined && unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-accent-error rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 md:w-md md:-translate-x-[77%] -left-4 md:top-24 mt-2 max-h-[calc(100vh-5rem)] sm:max-h-[600px] bg-bg-white border border-border-light md:rounded-lg shadow-lg overflow-hidden z-50 overflow-y-auto styled-scrollbar"
          >
            <NotificationCenter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
