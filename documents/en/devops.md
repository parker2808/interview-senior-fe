# DevOps

DevOps practices for frontend development.

---

## Table of Contents

1. [GitOps + ArgoCD Pipeline](#141-gitops--argocd-pipeline)

---

## 14. DevOps

### 14.1. GitOps + ArgoCD Pipeline

#### **1. What is GitOps?**

GitOps = deploy infrastructure & apps using **Git as single source of truth**.

- All Kubernetes config (YAML/Helm/Kustomize) stored in Git.
- Commit → trigger pipeline → ArgoCD auto-syncs state.

#### **2. How does ArgoCD work?**

ArgoCD is a **CD tool** running in Kubernetes:

- Watches Git repo in real-time.
- Compares **Live State** (in cluster) with **Desired State** (in Git).
- When changes detected → auto **sync** to ensure cluster == Git.
- Supports auto-sync or manual sync.

**Easy to remember:** Push to Git → ArgoCD deploys.

#### **3. Standard GitOps Pipeline**

1. **Dev commits code** → opens PR.
2. CI runs: test, build, create image → push to registry.
3. CI updates manifest file (new tag) in GitOps repo.
4. Merge to main.
5. ArgoCD detects change → syncs to cluster.
6. Monitoring + rollback when needed (ArgoCD has real-time + diff).

#### **4. Benefits of GitOps**

- 100% automated deployment process.
- Easy audit/rollback (everything is a commit).
- System state is always consistent and clear.
- Declarative infrastructure → easy to review, easy to reproduce.

---


---

[← Back to Overview](../../README-en.md)

