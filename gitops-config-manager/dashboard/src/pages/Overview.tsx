import { useQuery } from "@tanstack/react-query";
import { getApplications, getAlerts } from "@/api/argocd";
import { KPICard } from "@/components/KPICard";
import { DeploymentTimeline } from "@/components/DeploymentTimeline";
import { AlertFeed } from "@/components/AlertFeed";
import { LoadingState, ErrorState } from "@/components/LoadingState";
import { Layers, Heart, AlertTriangle, RefreshCw } from "lucide-react";
import { getMockHistory } from "@/mocks/data";

export default function Overview() {
  const { data: apps, isLoading, error, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  const { data: alerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
  });

  if (isLoading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState message="Failed to load applications." onRetry={() => refetch()} />;
  if (!apps) return null;

  const total = apps.length;
  const healthy = apps.filter((a) => a.healthStatus === "Healthy").length;
  const degraded = apps.filter((a) => a.healthStatus === "Degraded").length;
  const outOfSync = apps.filter((a) => a.syncStatus === "OutOfSync").length;

  // Aggregate recent syncs from all apps
  const recentSyncs = apps
    .flatMap((app) => getMockHistory(app.name).map((h) => ({ ...h, appName: app.name })))
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">GitOps cluster health at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Apps" value={total} icon={<Layers className="w-5 h-5" />} index={0} />
        <KPICard title="Healthy" value={healthy} icon={<Heart className="w-5 h-5" />} accentClass="text-status-healthy" index={1} />
        <KPICard title="Degraded" value={degraded} icon={<AlertTriangle className="w-5 h-5" />} accentClass="text-status-degraded" index={2} />
        <KPICard title="Out of Sync" value={outOfSync} icon={<RefreshCw className="w-5 h-5" />} accentClass="text-status-outofsync" index={3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-lg p-5 animate-fade-in-up stagger-5">
          <h2 className="text-base font-semibold mb-4">Recent Deployments</h2>
          <DeploymentTimeline history={recentSyncs} />
        </div>

        <div className="glass-card rounded-lg p-5 animate-fade-in-up stagger-6">
          <h2 className="text-base font-semibold mb-4">Alerts</h2>
          <AlertFeed alerts={alerts || []} limit={5} />
        </div>
      </div>
    </div>
  );
}
