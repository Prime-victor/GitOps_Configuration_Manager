import type { AlertEvent } from "@/api/types";
import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const typeConfig = {
  error: { icon: XCircle, border: "border-l-status-degraded", bg: "bg-status-degraded-bg/50" },
  warning: { icon: AlertTriangle, border: "border-l-status-outofsync", bg: "bg-status-outofsync-bg/50" },
  info: { icon: Info, border: "border-l-primary", bg: "" },
  success: { icon: CheckCircle2, border: "border-l-status-healthy", bg: "bg-status-healthy-bg/50" },
};

export function AlertFeed({ alerts, limit }: { alerts: AlertEvent[]; limit?: number }) {
  const items = limit ? alerts.slice(0, limit) : alerts;

  if (!items.length) {
    return <p className="text-sm text-muted-foreground py-4">No alerts.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((alert, i) => {
        const c = typeConfig[alert.type];
        const Icon = c.icon;
        return (
          <div
            key={alert.id}
            className={`border-l-4 ${c.border} ${c.bg} rounded-r-md p-3 animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
          >
            <div className="flex items-start gap-2">
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium truncate">{alert.title}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
