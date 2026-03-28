import { useQuery } from "@tanstack/react-query";
import { getApplications } from "@/api/argocd";
import { HealthBadge } from "@/components/HealthBadge";
import { SyncBadge } from "@/components/SyncBadge";
import { LoadingState, ErrorState } from "@/components/LoadingState";
import { Link } from "react-router-dom";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { HealthStatus, SyncStatus } from "@/api/types";
import { Search, Filter } from "lucide-react";

export default function Applications() {
  const { data: apps, isLoading, error, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  const [search, setSearch] = useState("");
  const [healthFilter, setHealthFilter] = useState<HealthStatus | "All">("All");
  const [syncFilter, setSyncFilter] = useState<SyncStatus | "All">("All");

  if (isLoading) return <LoadingState message="Loading applications..." />;
  if (error) return <ErrorState message="Failed to load applications." onRetry={() => refetch()} />;
  if (!apps) return null;

  const filtered = apps.filter((app) => {
    if (search && !app.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (healthFilter !== "All" && app.healthStatus !== healthFilter) return false;
    if (syncFilter !== "All" && app.syncStatus !== syncFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-sm text-muted-foreground mt-1">{apps.length} applications managed</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value as HealthStatus | "All")}
              className="pl-8 pr-3 py-2 text-sm rounded-lg border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring/30 appearance-none cursor-pointer"
            >
              <option value="All">All Health</option>
              <option value="Healthy">Healthy</option>
              <option value="Progressing">Progressing</option>
              <option value="Degraded">Degraded</option>
            </select>
          </div>
          <select
            value={syncFilter}
            onChange={(e) => setSyncFilter(e.target.value as SyncStatus | "All")}
            className="px-3 py-2 text-sm rounded-lg border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring/30 appearance-none cursor-pointer"
          >
            <option value="All">All Sync</option>
            <option value="Synced">Synced</option>
            <option value="OutOfSync">Out of Sync</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">No applications match your filters.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-semibold text-muted-foreground">Name</th>
                <th className="pb-3 font-semibold text-muted-foreground hidden md:table-cell">Namespace</th>
                <th className="pb-3 font-semibold text-muted-foreground">Health</th>
                <th className="pb-3 font-semibold text-muted-foreground">Sync</th>
                <th className="pb-3 font-semibold text-muted-foreground hidden lg:table-cell">Last Sync</th>
                <th className="pb-3 font-semibold text-muted-foreground hidden xl:table-cell">Revision</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => (
                <tr
                  key={app.name}
                  className={`border-b border-border/50 hover:bg-muted/40 transition-colors animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
                >
                  <td className="py-3 pr-4">
                    <Link to={`/applications/${app.name}`} className="font-medium text-primary hover:underline">
                      {app.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono md:hidden">{app.namespace}</p>
                  </td>
                  <td className="py-3 pr-4 hidden md:table-cell">
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{app.namespace}</code>
                  </td>
                  <td className="py-3 pr-4"><HealthBadge status={app.healthStatus} /></td>
                  <td className="py-3 pr-4"><SyncBadge status={app.syncStatus} /></td>
                  <td className="py-3 pr-4 text-muted-foreground hidden lg:table-cell">
                    {app.lastSyncTime ? formatDistanceToNow(new Date(app.lastSyncTime), { addSuffix: true }) : "—"}
                  </td>
                  <td className="py-3 hidden xl:table-cell">
                    <code className="text-xs font-mono text-muted-foreground">{app.targetRevision}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
