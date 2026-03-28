import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getApplication, getApplicationHistory, getApplicationResourceTree, getAlerts } from "@/api/argocd";
import { HealthBadge } from "@/components/HealthBadge";
import { SyncBadge } from "@/components/SyncBadge";
import { DeploymentTimeline } from "@/components/DeploymentTimeline";
import { ResourceTree } from "@/components/ResourceTree";
import { AlertFeed } from "@/components/AlertFeed";
import { LoadingState, ErrorState } from "@/components/LoadingState";
import { ArrowLeft, ExternalLink, GitBranch, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AppDetail() {
  const { name } = useParams<{ name: string }>();

  const { data: app, isLoading, error } = useQuery({
    queryKey: ["application", name],
    queryFn: () => getApplication(name!),
    enabled: !!name,
  });

  const { data: history } = useQuery({
    queryKey: ["applicationHistory", name],
    queryFn: () => getApplicationHistory(name!),
    enabled: !!name,
  });

  const { data: tree } = useQuery({
    queryKey: ["applicationResourceTree", name],
    queryFn: () => getApplicationResourceTree(name!),
    enabled: !!name,
  });

  const { data: alerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
  });

  if (isLoading) return <LoadingState message={`Loading ${name}...`} />;
  if (error || !app) return <ErrorState message={`Application "${name}" not found.`} />;

  const appAlerts = alerts?.filter((a) => a.appName === name) || [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <Link to="/applications" className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{app.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            <code className="font-mono">{app.namespace}</code> · {app.project}
          </p>
        </div>
      </div>

      {/* Health & Sync Card */}
      <div className="glass-card rounded-lg p-5 animate-fade-in-up stagger-1">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1.5">Health Status</p>
            <HealthBadge status={app.healthStatus} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1.5">Sync Status</p>
            <SyncBadge status={app.syncStatus} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Last Sync
            </p>
            <p className="text-sm font-medium">
              {app.lastSyncTime ? formatDistanceToNow(new Date(app.lastSyncTime), { addSuffix: true }) : "Never"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
              <GitBranch className="w-3 h-3" /> Target
            </p>
            <code className="text-sm font-mono font-medium">{app.targetRevision}</code>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/60 flex items-center gap-2 text-xs text-muted-foreground">
          <ExternalLink className="w-3 h-3" />
          <a href={app.repoURL} target="_blank" rel="noopener noreferrer" className="hover:text-primary truncate font-mono">
            {app.repoURL}
          </a>
          <span className="text-muted-foreground/50">· {app.path}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Resource Tree */}
        <div className="glass-card rounded-lg p-5 animate-fade-in-up stagger-2">
          <h2 className="text-base font-semibold mb-3">Resource Tree</h2>
          {tree ? <ResourceTree tree={tree} /> : <LoadingState message="Loading resources..." />}
        </div>

        {/* Deployment History */}
        <div className="glass-card rounded-lg p-5 animate-fade-in-up stagger-3">
          <h2 className="text-base font-semibold mb-3">Deployment History</h2>
          {history ? <DeploymentTimeline history={history} /> : <LoadingState message="Loading history..." />}
        </div>
      </div>

      {/* Alerts */}
      {appAlerts.length > 0 && (
        <div className="glass-card rounded-lg p-5 animate-fade-in-up stagger-4">
          <h2 className="text-base font-semibold mb-3">Recent Events</h2>
          <AlertFeed alerts={appAlerts} />
        </div>
      )}
    </div>
  );
}
