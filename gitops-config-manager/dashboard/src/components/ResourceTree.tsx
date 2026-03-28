import type { ResourceNode } from "@/api/types";
import { ChevronRight, Box, Server, Layers, Globe, FileText, Settings } from "lucide-react";
import { useState } from "react";

const kindIcons: Record<string, typeof Box> = {
  Application: Layers,
  Deployment: Server,
  ReplicaSet: Layers,
  Pod: Box,
  Service: Globe,
  Ingress: Globe,
  ConfigMap: FileText,
  Secret: Settings,
};

function healthColor(health: string) {
  if (health === "Healthy") return "text-status-healthy";
  if (health === "Progressing") return "text-status-progressing";
  if (health === "Degraded") return "text-status-degraded";
  return "text-status-unknown";
}

function TreeNode({ node, depth = 0 }: { node: ResourceNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  const Icon = kindIcons[node.kind] || Box;

  return (
    <div>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`flex items-center gap-2 w-full text-left py-1.5 px-2 rounded-md hover:bg-muted/60 transition-colors text-sm ${
          hasChildren ? "cursor-pointer" : "cursor-default"
        }`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {hasChildren ? (
          <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
        ) : (
          <span className="w-3.5" />
        )}
        <Icon className={`w-4 h-4 ${healthColor(node.health)}`} />
        <span className="font-medium text-foreground">{node.kind}</span>
        <span className="text-muted-foreground font-mono text-xs truncate">{node.name}</span>
        <span className={`ml-auto text-xs font-medium ${healthColor(node.health)}`}>{node.health}</span>
      </button>
      {expanded && hasChildren && (
        <div>
          {node.children.map((child, i) => (
            <TreeNode key={`${child.kind}-${child.name}-${i}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ResourceTree({ tree }: { tree: ResourceNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-2">
      <TreeNode node={tree} />
    </div>
  );
}
