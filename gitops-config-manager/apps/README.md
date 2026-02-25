# apps/

Contains ArgoCD Application manifests.
Each file declares one application — its source repo, target cluster, and sync policy.
Adding a file here = registering an app with ArgoCD.
Removing a file here = ArgoCD will prune the app from the cluster.
