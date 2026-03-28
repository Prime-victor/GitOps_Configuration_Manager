import type { HealthStatus } from "@/api/types";
import { Heart, Loader2, AlertTriangle, HelpCircle, XCircle } from "lucide-react";

const config: Record<HealthStatus, { bg: string; text: string; icon: typeof Heart }> = {
  Healthy: { bg: "bg-status-healthy-bg", text: "text-status-healthy", icon: Heart },
  Progressing: { bg: "bg-status-progressing-bg", text: "text-status-progressing", icon: Loader2 },
  Degraded: { bg: "bg-status-degraded-bg", text: "text-status-degraded", icon: XCircle },
  Missing: { bg: "bg-status-missing-bg", text: "text-status-missing", icon: HelpCircle },
  Unknown: { bg: "bg-status-unknown-bg", text: "text-status-unknown", icon: AlertTriangle },
};

export function HealthBadge({ status }: { status: HealthStatus }) {
  const c = config[status] || config.Unknown;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <Icon className={`w-3 h-3 ${status === "Progressing" ? "animate-spin" : ""}`} />
      {status}
    </span>
  );
}
