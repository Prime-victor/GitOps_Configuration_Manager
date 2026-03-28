export type HealthStatus = "Healthy" | "Progressing" | "Degraded" | "Missing" | "Unknown";
export type SyncStatus = "Synced" | "OutOfSync" | "Unknown";
export type SyncResultStatus = "Succeeded" | "Failed" | "Running";
export type AlertType = "error" | "warning" | "info" | "success";

export interface Application {
  name: string;
  namespace: string;
  project: string;
  repoURL: string;
  targetRevision: string;
  path: string;
  healthStatus: HealthStatus;
  syncStatus: SyncStatus;
  lastSyncTime: string;
  createdAt: string;
}

export interface SyncHistory {
  id: string;
  revision: string;
  status: SyncResultStatus;
  startedAt: string;
  finishedAt: string;
  message: string;
}

export interface ResourceNode {
  kind: string;
  name: string;
  namespace: string;
  health: string;
  children: ResourceNode[];
}

export interface AlertEvent {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
  appName: string;
}
