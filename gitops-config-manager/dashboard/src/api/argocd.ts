import type { Application, SyncHistory, ResourceNode, AlertEvent } from "./types";
import { mockApplications, getMockHistory, getMockResourceTree, mockAlerts } from "@/mocks/data";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true" || !import.meta.env.VITE_ARGOCD_URL;
const BASE_URL = import.meta.env.VITE_ARGOCD_URL || "";
const TOKEN = import.meta.env.VITE_ARGOCD_TOKEN || "";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

function mapArgoApp(item: any): Application {
  const spec = item.spec || {};
  const status = item.status || {};
  const source = spec.source || {};
  return {
    name: item.metadata?.name || "unknown",
    namespace: spec.destination?.namespace || "default",
    project: spec.project || "default",
    repoURL: source.repoURL || "",
    targetRevision: source.targetRevision || "HEAD",
    path: source.path || "",
    healthStatus: status.health?.status || "Unknown",
    syncStatus: status.sync?.status || "Unknown",
    lastSyncTime: status.operationState?.finishedAt || status.reconciledAt || "",
    createdAt: item.metadata?.creationTimestamp || "",
  };
}

export async function getApplications(): Promise<Application[]> {
  if (USE_MOCKS) return mockApplications;
  const data = await apiFetch<any>("/api/v1/applications");
  return (data.items || []).map(mapArgoApp);
}

export async function getApplication(name: string): Promise<Application> {
  if (USE_MOCKS) {
    const app = mockApplications.find((a) => a.name === name);
    if (!app) throw new Error(`Application "${name}" not found`);
    return app;
  }
  const data = await apiFetch<any>(`/api/v1/applications/${name}`);
  return mapArgoApp(data);
}

export async function getApplicationHistory(name: string): Promise<SyncHistory[]> {
  if (USE_MOCKS) return getMockHistory(name);
  const data = await apiFetch<any>(`/api/v1/applications/${name}`);
  return (data.status?.history || []).map((h: any, i: number) => ({
    id: `h-${i}`,
    revision: h.revision?.substring(0, 7) || "",
    status: h.deployedAt ? "Succeeded" : "Unknown",
    startedAt: h.deployStartedAt || "",
    finishedAt: h.deployedAt || "",
    message: h.source?.repoURL || "Sync completed",
  }));
}

export async function getApplicationResourceTree(name: string): Promise<ResourceNode> {
  if (USE_MOCKS) return getMockResourceTree(name);
  const data = await apiFetch<any>(`/api/v1/applications/${name}/resource-tree`);
  function buildTree(nodes: any[]): ResourceNode[] {
    return nodes.map((n: any) => ({
      kind: n.kind || "Unknown",
      name: n.name || "",
      namespace: n.namespace || "",
      health: n.health?.status || "Unknown",
      children: n.children ? buildTree(n.children) : [],
    }));
  }
  const root: ResourceNode = {
    kind: "Application",
    name,
    namespace: "argocd",
    health: "Healthy",
    children: buildTree(data.nodes || []),
  };
  return root;
}

export async function getAlerts(): Promise<AlertEvent[]> {
  if (USE_MOCKS) return mockAlerts;
  return mockAlerts; // Alerts typically from notification controller; fallback to mock
}
