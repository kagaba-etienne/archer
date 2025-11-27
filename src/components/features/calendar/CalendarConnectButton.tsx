"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui";
import { useConnectCalendar } from "@/services/mutations/useCalendar";

export function CalendarConnectButton() {
  const connectCalendar = useConnectCalendar();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!isListening) return;

    // Listen for OAuth callback
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "calendar-auth-callback" && event.data?.code) {
        connectCalendar.mutate(event.data.code);
        setIsListening(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isListening, connectCalendar]);

  const handleConnect = async () => {
    try {
      const response = await fetch("/api/calendar/auth-url");
      const { authUrl } = await response.json();

      setIsListening(true);

      // Open OAuth window
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      window.open(
        authUrl,
        "calendar-oauth",
        `width=${width},height=${height},left=${left},top=${top}`,
      );
    } catch (error) {
      console.error("Failed to get auth URL:", error);
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handleConnect}
      isLoading={connectCalendar.isPending}
    >
      <Calendar className="mr-2 h-4 w-4" />
      Connect Calendar
    </Button>
  );
}
