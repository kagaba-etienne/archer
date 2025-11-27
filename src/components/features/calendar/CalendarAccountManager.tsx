"use client";

import { Trash2, RefreshCw, Calendar } from "lucide-react";
import { Button, Card, LoadingSkeleton } from "@/components/ui";
import { CalendarConnectButton } from "./CalendarConnectButton";
import { useCalendarAccountsQuery } from "@/services/queries/useCalendar";
import {
  useDisconnectCalendar,
  useSyncCalendar,
} from "@/services/mutations/useCalendar";

export function CalendarAccountManager() {
  const { data: accounts, isLoading } = useCalendarAccountsQuery();
  const disconnectCalendar = useDisconnectCalendar();
  const syncCalendar = useSyncCalendar();

  const handleDisconnect = (accountId: string) => {
    if (confirm("Disconnect this calendar?")) {
      disconnectCalendar.mutate(accountId);
    }
  };

  const handleSync = (accountId: string) => {
    syncCalendar.mutate(accountId);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <LoadingSkeleton key={i} variant="rectangular" height={80} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {accounts && accounts.length > 0 ? (
        <>
          <div className="space-y-3">
            {accounts.map((account) => (
              <Card key={account.id}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">
                        {account.email}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {account.calendars?.length || 0} calendars synced
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(account.id)}
                      isLoading={syncCalendar.isPending}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDisconnect(account.id)}
                      isLoading={disconnectCalendar.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <CalendarConnectButton />
        </>
      ) : (
        <Card>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary mb-4">
              Connect your calendar to sync events with tasks
            </p>
            <CalendarConnectButton />
          </div>
        </Card>
      )}
    </div>
  );
}
