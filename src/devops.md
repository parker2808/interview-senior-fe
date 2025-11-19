# DevOps

DevOps practices for frontend development.

---

## Table of Contents

1. [GitOps + ArgoCD Pipeline](#1-gitops--argocd-pipeline)

---
## 9. DevOps

### 9.1. GitOps + ArgoCD Pipeline

#### **1. GitOps là gì?**

GitOps = triển khai hạ tầng & ứng dụng bằng **Git làm single source of truth**.

- Mọi cấu hình Kubernetes (YAML/Helm/Kustomize) được lưu trong Git.
- Commit → trigger pipeline → ArgoCD tự đồng bộ trạng thái.

#### **2. ArgoCD hoạt động như thế nào?**

ArgoCD là **CD tool** chạy trong Kubernetes:

- Theo dõi repo Git theo thời gian thực.
- So sánh **Live State** (trong cluster) với **Desired State** (trong Git).
- Khi có thay đổi → tự **sync** để đảm bảo cluster == Git.
- Hỗ trợ auto-sync hoặc manual.

**Dễ nhớ:** Push vào Git → ArgoCD deploy.

#### **3. GitOps Pipeline Chuẩn**

1. **Dev commit code** → mở PR.
2. CI chạy: test, build, tạo image → push lên registry.
3. CI update file manifest (tag mới) trong GitOps repo.
4. Merge vào main.
5. ArgoCD phát hiện thay đổi → sync vào cluster.
6. Monitoring + rollback khi cần (ArgoCD có thời gian thực + diff).

#### **4. Ưu điểm của GitOps**

- Tự động hóa 100% quá trình deploy.
- Audit/rollback dễ dàng (vì mọi thứ là commit).
- Trạng thái hệ thống luôn nhất quán và minh bạch.
- Declarative infrastructure → dễ review, dễ reproduce.

---


---

[← Back to Overview](../README.md)
