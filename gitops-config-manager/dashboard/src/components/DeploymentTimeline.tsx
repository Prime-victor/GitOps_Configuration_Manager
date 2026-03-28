import type { SyncHistory } from "@/api/types";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function StatusIcon({ status }: { status: string }) {
  if (status === "Succeeded") return <CheckCircle2 className="w-4 h-4 text-status-healthy" />;
  if (status === "Failed") return <XCircle className="w-4 h-4 text-status-degraded" />;
  return <Loader2 className="w-4 h-4 text-status-progressing animate-spin" />;
}

export function DeploymentTimeline({ history }: { history: SyncHistory[] }) {
  if (!history.length) {
    return <p className="text-sm text-muted-foreground py-4">No deployment history available.</p>;
  }

  return (
    <div className="space-y-0">
      {history.map((entry, i) => (
        <div key={entry.id} className={`flex gap-3 animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
          <div className="flex flex-col items-center">
            <StatusIcon status={entry.status} />
            {i < history.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
          </div>
          <div className="pb-5 flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{entry.revision}</code>
              <span className={`text-xs font-medium ${
                entry.status === "Succeeded" ? "text-status-healthy" :
                entry.status === "Failed" ? "text-status-degraded" : "text-status-progressing"
              }`}>{entry.status}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{entry.message}</p>
            <p className="text-xs text-muted-foreground/70 mt-0.5">
              {formatDistanceToNow(new Date(entry.startedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
