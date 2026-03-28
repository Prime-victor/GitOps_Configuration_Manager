import type { SyncStatus } from "@/api/types";
import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

const config: Record<SyncStatus, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  Synced: { bg: "bg-status-synced-bg", text: "text-status-synced", icon: CheckCircle2 },
  OutOfSync: { bg: "bg-status-outofsync-bg", text: "text-status-outofsync", icon: AlertCircle },
  Unknown: { bg: "bg-status-unknown-bg", text: "text-status-unknown", icon: HelpCircle },
};

export function SyncBadge({ status }: { status: SyncStatus }) {
  const c = config[status] || config.Unknown;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />
      {status === "OutOfSync" ? "Out of Sync" : status}
    </span>
  );
}
