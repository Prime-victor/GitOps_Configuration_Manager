<div align="center">

# ⚙️ GitOps Configuration Manager

**Production-Style Kubernetes Automation Platform**

[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![ArgoCD](https://img.shields.io/badge/ArgoCD-EF7B4D?style=for-the-badge&logo=argo&logoColor=white)](https://argoproj.github.io/cd/)
[![Helm](https://img.shields.io/badge/Helm-0F1689?style=for-the-badge&logo=helm&logoColor=white)](https://helm.sh/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)
![CI](https://github.com/Prime-victor/gitops-config-manager/actions/workflows/infra-ci.yml/badge.svg)

*A fully automated GitOps pipeline where every Git commit is the single source of truth for cluster state.*

[Overview](#-overview) · [Architecture](#-architecture) · [Quick Start](#-quick-start) · [Features](#-features) · [Runbooks](#-runbooks) · [Dashboard](#-dashboard)

</div>

---

## 📌 Overview

The **GitOps Configuration Manager** is a production-grade DevOps platform that implements end-to-end GitOps principles on Kubernetes. ArgoCD continuously watches a GitHub repository and automatically reconciles the live cluster state with the desired state declared in Git — enabling zero-touch deployments, real-time drift detection, and self-healing infrastructure.

> **The core loop:** `git push` → ArgoCD detects change → cluster syncs automatically → notifications fire → dashboard updates.

###  What This Project Demonstrates

| Capability | Status |
|---|---|
| Git commit → automatic Kubernetes deployment |  Complete |
| Drift detection & self-healing |  Complete |
| Helm-based multi-environment deployments |  Complete |
| RBAC with dev / staging / prod isolation |  Complete |
| Slack / Discord notifications on OutOfSync |  Complete |
| React dashboard with live health & sync status |  Complete |
| Secrets management via Sealed Secrets |  Complete |
| Cluster recovery from scratch in < 30 minutes |  Complete |

---

##  Architecture

```
[ Developer ]  →  git push  →  [ GitHub Repo ]
                                      ↓  (poll every 3 min / webhook)
                            [ ArgoCD Controller ]
                   ↙  sync            ↘  notify
[ Kubernetes Cluster ]          [ Slack / Discord ]
  ↳ Deployments, Services, Ingress, ConfigMaps
                   ↘  REST API
            [ React Dashboard UI ]
```

### GitOps Data Flow

1. Developer updates Kubernetes manifests or Helm values and opens a PR
2. PR merges to `main` — Git becomes the source of truth for the new state
3. ArgoCD polls the repository (every 3 min, or instantly via webhook)
4. ArgoCD diffs live cluster state against desired state in Git
5. On drift, ArgoCD applies the delta — pods, services, ingresses reconcile
6. Notifications fire if the app is `OutOfSync` or `Degraded`
7. Dashboard reflects current health and sync history in real time

---

## Technology Stack

| Category | Technology | Purpose |
|---|---|---|
| Container Runtime | Docker | Image packaging and container management |
| Orchestration | Kubernetes (kind) | Container orchestration platform |
| GitOps Controller | ArgoCD | Declarative CD — watches Git, syncs cluster |
| Package Manager | Helm | Kubernetes manifest templating |
| Source of Truth | GitHub | All cluster state flows through pull requests |
| Dashboard UI | React + Vite | Live health, sync status, deployment history |
| Notifications | Slack / Discord Webhooks | Alerts on OutOfSync and sync failures |
| Secrets | Sealed Secrets (Bitnami) | Encrypted secrets safe to commit to Git |
| CLI Tools | kubectl, argocd CLI | Cluster and ArgoCD management |

---

## Repository Structure

```
gitops-config-manager/
├── apps/                          # ArgoCD Application manifests
│   ├── hello-world.yaml
│   └── guestbook.yaml
│
├── charts/                        # Helm chart definitions
│   └── hello-world/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── deployment.yaml
│           ├── service.yaml
│           └── ingress.yaml
│
├── environments/                  # Environment-specific value overrides
│   ├── dev/values.yaml
│   ├── staging/values.yaml
│   └── prod/values.yaml
│
├── argocd/                        # ArgoCD configuration
│   ├── projects/                  # AppProjects (RBAC boundaries)
│   ├── notifications/             # Alert templates (Slack / Discord)
│   └── rbac/                      # Role bindings and policy
│
├── dashboard/                     # React monitoring UI
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── api/
│   └── vite.config.js
│
└── docs/                          # Architecture diagrams & setup guides
    ├── architecture.md
    ├── setup-guide.md
    └── diagrams/
```

**Design principle:** Each directory has a single clear responsibility. Application logic lives in `charts/`, environment differences in `environments/`, and ArgoCD wiring in `apps/` and `argocd/`. Any engineer can immediately know where to look when making a change.

---

##  Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running
- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/) for local Kubernetes clusters
- [kubectl](https://kubernetes.io/docs/tasks/tools/) CLI
- [Helm](https://helm.sh/docs/intro/install/) v3+
- [argocd CLI](https://argo-cd.readthedocs.io/en/stable/cli_installation/) (optional but recommended)

### Step 1 — Create Local Kubernetes Cluster

```bash
# Install kind (macOS)
brew install kind

# Create cluster
kind create cluster --name gitops-demo --config kind-config.yaml

# Verify
kubectl cluster-info --context kind-gitops-demo
kubectl get nodes
```

<details>
<summary><code>kind-config.yaml</code> — click to expand</summary>

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    kubeadmConfigPatches:
      - |
        kind: InitConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            node-labels: ingress-ready=true
    extraPortMappings:
      - containerPort: 80
        hostPort: 80
        protocol: TCP
```

</details>

### Step 2 — Install ArgoCD

```bash
kubectl create namespace argocd

kubectl apply -n argocd -f \
  https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for pods to be ready
kubectl wait --for=condition=Ready pod \
  -l app.kubernetes.io/name=argocd-server \
  -n argocd --timeout=120s

# Retrieve initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

### Step 3 — Access ArgoCD

```bash
# Port-forward the UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Open https://localhost:8080
# Username: admin  |  Password: <from step above>

# Or log in via CLI
argocd login localhost:8080 --insecure
```

### Step 4 — Deploy via GitOps

```bash
# Apply the ArgoCD Application manifest pointing to this repo
kubectl apply -f apps/hello-world.yaml -n argocd

# Watch ArgoCD sync the application automatically
argocd app get hello-world
```

From this point, **any `git push` to the configured path auto-deploys to the cluster.**

---

##  Features

###  Self-Healing & Drift Detection

With `selfHeal: true`, ArgoCD restores the cluster to the desired Git state automatically if anyone manually modifies resources.

**Demo:**

```bash
# Delete a deployment to simulate drift
kubectl delete deployment hello-world -n default

# Watch ArgoCD detect and self-heal (within seconds)
watch kubectl get pods -n default
# → ArgoCD recreates the deployment automatically
# → UI shows: OutOfSync → Syncing → Synced 
```

### 📦 Helm Chart Deployments

All applications are packaged as Helm charts with environment-specific value overrides:

| Environment | Replicas | CPU Limit | Image Tag |
|---|---|---|---|
| `dev` | 1 | 100m | `latest` |
| `staging` | 2 | 250m | `rc-1.2.0` |
| `prod` | 3 | 500m | `1.2.0` (pinned) |

###  Notifications

ArgoCD sends Slack / Discord alerts when applications go `OutOfSync` or `Degraded`:

```yaml
# argocd/notifications/configmap.yaml
trigger.on-sync-failed: |
  - when: app.status.operationState.phase in ['Error', 'Failed']
    send: [app-sync-failed]
```

###  Secrets Management

Secrets are **never committed to Git in plaintext.** The project uses Sealed Secrets (Bitnami):

```bash
# Encrypt a secret — safe to push to GitHub
kubectl create secret generic db-credentials \
  --from-literal=password=s3cr3t \
  --dry-run=client -o yaml | \
  kubeseal --format yaml > sealed-db-credentials.yaml

git add sealed-db-credentials.yaml && git push
```

Only the in-cluster Sealed Secrets controller can decrypt it.

###  RBAC Configuration

ArgoCD projects provide RBAC boundaries preventing dev teams from deploying directly to production:

```
# argocd/rbac/policy.csv
p, role:dev-team,       applications, sync, dev/*,     allow
p, role:dev-team,       applications, get,  staging/*, allow
p, role:platform-eng,   applications, *,    */*, allow
```

---

##  Dashboard

The React dashboard queries the ArgoCD REST API to display real-time deployment status.

**Key components:**

| Component | Description |
|---|---|
| `AppHealthCard` | Health status: Healthy / Progressing / Degraded |
| `SyncStatusBadge` | Synced / OutOfSync / Unknown with color coding |
| `DeploymentTimeline` | Scrollable history of recent sync operations |
| `ResourceTree` | Visual tree of Kubernetes resources per app |
| `AlertFeed` | Live notification feed from ArgoCD events |

**Run locally:**

```bash
cd dashboard
cp .env.example .env   # Set VITE_ARGOCD_URL and VITE_ARGOCD_TOKEN
npm install
npm run dev
```

---

##  Runbooks

### Manual Sync

```bash
argocd app sync hello-world
# Force sync (bypass diff checks)
argocd app sync hello-world --force
```

### Rollback a Bad Deployment

```bash
# View history
argocd app history hello-world

# Roll back to a specific revision
argocd app rollback hello-world <REVISION_ID>

# Or revert in Git — ArgoCD auto-syncs the revert
git revert HEAD && git push origin main
```

### Full Cluster Recovery

```bash
# 1. Recreate cluster
kind create cluster --name gitops-demo --config kind-config.yaml

# 2. Reinstall ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f \
  https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 3. Re-apply all ArgoCD Applications from Git
kubectl apply -f apps/ -n argocd

# ArgoCD restores the entire cluster state from Git automatically 
```

> **GitOps recovery story:** Because Git is the single source of truth, a complete cluster failure is recoverable in minutes — no state is lost.

---

##  FAQ 

**Why ArgoCD over Flux?**
ArgoCD provides a richer UI, Application-level abstractions, and stronger RBAC. Flux has simpler YAML but less visibility. Both are CNCF graduated — choice depends on team workflow.

**What happens during a network partition?**
ArgoCD stops syncing but the cluster continues running the last-known-good state. Once connectivity restores, ArgoCD reconciles. Applications are never left in an intermediate state.

**How does this scale to hundreds of apps?**
ArgoCD `ApplicationSets` generate `Application` objects from a template, reducing repetition. Combined with the App-of-Apps pattern, a single root application manages the entire fleet.

**What's the promotion workflow?**
PRs merge to `main` for dev → a git tag triggers staging sync → a manual approval gate (`argocd sync windows`) controls production promotion.

---

##  Recommended Screenshots

- ArgoCD UI with all applications `Synced` and `Healthy`
- Application mid-sync showing the `Syncing` state
- Drift detection: `OutOfSync` after a manual `kubectl delete`
- Self-healing: application restored to `Synced` seconds later
- Dashboard UI with live health status and deployment timeline
- Slack / Discord notification card for an `OutOfSync` alert
- GitHub repo structure demonstrating clean GitOps layout

---

##  License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**GitOps Configuration Manager** · Platform Engineering Portfolio Project · v1.0 · 2026

*Built to demonstrate production-grade GitOps practices transferable to enterprise environments.*

</div>
