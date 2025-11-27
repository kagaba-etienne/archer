"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Settings index page - redirects to notifications settings
 */
export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/settings/notifications");
  }, [router]);

  return null;
}
