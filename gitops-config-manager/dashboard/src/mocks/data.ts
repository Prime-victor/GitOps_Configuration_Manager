import type { Application, SyncHistory, ResourceNode, AlertEvent } from "@/api/types";

export const mockApplications: Application[] = [
  {
    name: "frontend-web",
    namespace: "production",
    project: "default",
    repoURL: "https://github.com/acme/frontend-web.git",
    targetRevision: "main",
    path: "k8s/overlays/prod",
    healthStatus: "Healthy",
    syncStatus: "Synced",
    lastSyncTime: "2026-03-28T08:45:00Z",
    createdAt: "2025-11-01T10:00:00Z",
  },
  {
    name: "api-gateway",
    namespace: "production",
    project: "default",
    repoURL: "https://github.com/acme/api-gateway.git",
    targetRevision: "release/v2.4",
    path: "deploy/prod",
    healthStatus: "Progressing",
    syncStatus: "Synced",
    lastSyncTime: "2026-03-28T09:12:00Z",
    createdAt: "2025-09-15T14:30:00Z",
  },
  {
    name: "payments-service",
    namespace: "production",
    project: "payments",
    repoURL: "https://github.com/acme/payments-svc.git",
    targetRevision: "main",
    path: "manifests/prod",
    healthStatus: "Degraded",
    syncStatus: "OutOfSync",
    lastSyncTime: "2026-03-27T22:30:00Z",
    createdAt: "2025-08-20T09:00:00Z",
  },
  {
    name: "auth-service",
    namespace: "auth",
    project: "default",
    repoURL: "https://github.com/acme/auth-service.git",
    targetRevision: "main",
    path: "k8s/prod",
    healthStatus: "Healthy",
    syncStatus: "Synced",
    lastSyncTime: "2026-03-28T07:00:00Z",
    createdAt: "2025-07-10T12:00:00Z",
  },
  {
    name: "notification-worker",
    namespace: "messaging",
    project: "messaging",
    repoURL: "https://github.com/acme/notif-worker.git",
    targetRevision: "v1.8.2",
    path: "charts/prod",
    healthStatus: "Healthy",
    syncStatus: "OutOfSync",
    lastSyncTime: "2026-03-28T06:15:00Z",
    createdAt: "2025-12-01T08:00:00Z",
  },
  {
    name: "data-pipeline",
    namespace: "data",
    project: "analytics",
    repoURL: "https://github.com/acme/data-pipeline.git",
    targetRevision: "main",
    path: "k8s/prod",
    healthStatus: "Healthy",
    syncStatus: "Synced",
    lastSyncTime: "2026-03-28T05:30:00Z",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    name: "ml-inference",
    namespace: "ml",
    project: "analytics",
    repoURL: "https://github.com/acme/ml-inference.git",
    targetRevision: "main",
    path: "deploy/",
    healthStatus: "Healthy",
    syncStatus: "Synced",
    lastSyncTime: "2026-03-28T04:00:00Z",
    createdAt: "2026-02-01T16:00:00Z",
  },
  {
    name: "monitoring-stack",
    namespace: "observability",
    project: "infra",
    repoURL: "https://github.com/acme/monitoring.git",
    targetRevision: "main",
    path: "helm/prod",
    healthStatus: "Healthy",
    syncStatus: "Synced",
    lastSyncTime: "2026-03-28T03:00:00Z",
    createdAt: "2025-06-01T09:00:00Z",
  },
];

export const mockSyncHistory: Record<string, SyncHistory[]> = {
  "frontend-web": [
    { id: "s1", revision: "abc1234", status: "Succeeded", startedAt: "2026-03-28T08:44:00Z", finishedAt: "2026-03-28T08:45:00Z", message: "Successfully synced" },
    { id: "s2", revision: "def5678", status: "Succeeded", startedAt: "2026-03-27T14:00:00Z", finishedAt: "2026-03-27T14:01:30Z", message: "Successfully synced" },
    { id: "s3", revision: "ghi9012", status: "Failed", startedAt: "2026-03-26T10:00:00Z", finishedAt: "2026-03-26T10:02:00Z", message: "ImagePullBackOff: registry timeout" },
    { id: "s4", revision: "jkl3456", status: "Succeeded", startedAt: "2026-03-25T16:30:00Z", finishedAt: "2026-03-25T16:31:00Z", message: "Successfully synced" },
    { id: "s5", revision: "mno7890", status: "Succeeded", startedAt: "2026-03-24T09:00:00Z", finishedAt: "2026-03-24T09:01:00Z", message: "Successfully synced" },
  ],
  "payments-service": [
    { id: "s6", revision: "pqr1111", status: "Failed", startedAt: "2026-03-27T22:28:00Z", finishedAt: "2026-03-27T22:30:00Z", message: "CrashLoopBackOff in payments-worker" },
    { id: "s7", revision: "stu2222", status: "Succeeded", startedAt: "2026-03-26T18:00:00Z", finishedAt: "2026-03-26T18:02:00Z", message: "Successfully synced" },
  ],
  "api-gateway": [
    { id: "s8", revision: "vwx3333", status: "Running", startedAt: "2026-03-28T09:10:00Z", finishedAt: "", message: "Sync in progress..." },
    { id: "s9", revision: "yza4444", status: "Succeeded", startedAt: "2026-03-27T20:00:00Z", finishedAt: "2026-03-27T20:01:00Z", message: "Successfully synced" },
  ],
};

export function getMockHistory(name: string): SyncHistory[] {
  return mockSyncHistory[name] || [
    { id: "default1", revision: "aaa1111", status: "Succeeded", startedAt: "2026-03-28T06:00:00Z", finishedAt: "2026-03-28T06:01:00Z", message: "Successfully synced" },
    { id: "default2", revision: "bbb2222", status: "Succeeded", startedAt: "2026-03-27T12:00:00Z", finishedAt: "2026-03-27T12:01:00Z", message: "Successfully synced" },
  ];
}

export function getMockResourceTree(name: string): ResourceNode {
  return {
    kind: "Application",
    name,
    namespace: "argocd",
    health: "Healthy",
    children: [
      {
        kind: "Deployment",
        name: `${name}-deploy`,
        namespace: mockApplications.find(a => a.name === name)?.namespace || "default",
        health: "Healthy",
        children: [
          {
            kind: "ReplicaSet",
            name: `${name}-deploy-7f8b9c`,
            namespace: mockApplications.find(a => a.name === name)?.namespace || "default",
            health: "Healthy",
            children: [
              { kind: "Pod", name: `${name}-deploy-7f8b9c-x1k2`, namespace: "default", health: "Healthy", children: [] },
              { kind: "Pod", name: `${name}-deploy-7f8b9c-m3n4`, namespace: "default", health: "Healthy", children: [] },
            ],
          },
        ],
      },
      {
        kind: "Service",
        name: `${name}-svc`,
        namespace: mockApplications.find(a => a.name === name)?.namespace || "default",
        health: "Healthy",
        children: [],
      },
      {
        kind: "ConfigMap",
        name: `${name}-config`,
        namespace: mockApplications.find(a => a.name === name)?.namespace || "default",
        health: "Healthy",
        children: [],
      },
      {
        kind: "Ingress",
        name: `${name}-ingress`,
        namespace: mockApplications.find(a => a.name === name)?.namespace || "default",
        health: "Healthy",
        children: [],
      },
    ],
  };
}

export const mockAlerts: AlertEvent[] = [
  { id: "a1", type: "error", title: "payments-service degraded", message: "CrashLoopBackOff detected in payments-worker pod", timestamp: "2026-03-27T22:30:00Z", appName: "payments-service" },
  { id: "a2", type: "warning", title: "notification-worker out of sync", message: "Target revision v1.8.2 differs from live state", timestamp: "2026-03-28T06:15:00Z", appName: "notification-worker" },
  { id: "a3", type: "info", title: "api-gateway sync started", message: "Sync operation initiated for release/v2.4", timestamp: "2026-03-28T09:10:00Z", appName: "api-gateway" },
  { id: "a4", type: "success", title: "frontend-web synced", message: "Successfully synced to abc1234", timestamp: "2026-03-28T08:45:00Z", appName: "frontend-web" },
  { id: "a5", type: "info", title: "data-pipeline synced", message: "Automated sync completed successfully", timestamp: "2026-03-28T05:30:00Z", appName: "data-pipeline" },
  { id: "a6", type: "warning", title: "payments-service OutOfSync", message: "Live state has drifted from desired state in Git", timestamp: "2026-03-27T22:35:00Z", appName: "payments-service" },
];
