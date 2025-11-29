# Practical Interview Questions

Các tình huống thực tế và workflows cho Senior Frontend Developer interviews.

---

## 18. Practical Interview Questions

## Table of Contents

1. [Xử lý 401 Error → Redirect to Login](#181-xử-lý-401-error--redirect-to-login)

2. [Công cụ Quản lý Dự án & Quy trình](#182-công-cụ-quản-lý-dự-án--quy-trình)

3. [Đánh giá Issue: Bug hay Yêu cầu Tính năng?](#183-đánh-giá-issue-bug-hay-yêu-cầu-tính-năng)

4. [Quy trình Git](#184-quy-trình-git)

5. [Giải quyết Xung đột Git](#185-giải-quyết-xung-đột-git)

6. [Gộp Commits](#186-gộp-commits)

---

### 18.1. Xử lý 401 Error → Redirect to Login

**Câu hỏi:** Khi API trả về 401 Unauthorized, làm sao redirect user về trang login?

**Câu trả lời chuẩn Senior:**

#### **Giải pháp: Axios Interceptor**

```js
// api/index.js
import axios from "axios";
import router from "@/router";

const api = axios.create({
  baseURL: "/api",
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state
      localStorage.removeItem("token");

      // Redirect to login
      router.push({
        path: "/login",
        query: { redirect: router.currentRoute.value.fullPath },
      });
    }

    return Promise.reject(error);
  }
);

export default api;
```

#### **Best Practices:**

✅ Lưu URL hiện tại để redirect lại sau khi login
✅ Clear token/auth state
✅ Show toast notification
✅ Handle refresh token trước khi redirect
✅ Avoid multiple redirects (dùng flag)

---

### 18.2. Công cụ Quản lý Dự án & Quy trình

**Câu hỏi:** Bạn dùng công cụ gì để quản lý dự án?

**Câu trả lời chuẩn Senior:**

#### **Stack phổ biến:**

| Công cụ             | Mục đích                       |
| ------------------- | ------------------------------ |
| **Jira**            | Task tracking, Sprint planning |
| **Linear**          | Modern alternative cho Jira    |
| **GitHub Projects** | Tích hợp với GitHub            |
| **Notion**          | Documentation, Wiki            |
| **Confluence**      | Team documentation             |
| **Slack/Discord**   | Communication                  |
| **Figma**           | Design collaboration           |

#### **Quy trình Agile/Scrum:**

1. **Sprint Planning** (đầu sprint)

   - Review backlog
   - Ước lượng story points
   - Commit sprint goals

2. **Daily Standup** (hàng ngày)

   - Yesterday: Làm gì
   - Today: Sẽ làm gì
   - Blockers: Vấn đề cần help

3. **Sprint Review** (cuối sprint)

   - Demo features
   - Stakeholder feedback

4. **Retrospective**
   - What went well
   - What didn't
   - Action items

---

### 18.3. Đánh giá Issue: Bug hay Yêu cầu Tính năng?

**Câu hỏi:** Làm sao phân biệt Bug vs Feature Request?

**Câu trả lời chuẩn Senior:**

#### **Phân biệt:**

| Tiêu chí       | Bug                            | Feature Request            |
| -------------- | ------------------------------ | -------------------------- |
| **Định nghĩa** | Code không hoạt động đúng spec | Yêu cầu thêm chức năng mới |
| **Tác động**   | Break existing functionality   | Thêm new functionality     |
| **Priority**   | Cao (nếu critical)             | Tùy business value         |
| **Timeline**   | Fix ngay (hotfix nếu critical) | Plan trong sprint tới      |

#### **Checklist đánh giá:**

**Bug?**

- ✅ Có worked trước đây không?
- ✅ Có document/spec mô tả behavior không?
- ✅ User có thể reproduce không?
- ✅ Có ảnh hưởng critical function không?

**Feature?**

- ✅ Có trong spec/design ban đầu không?
- ✅ Có cần design/approval không?
- ✅ Business value là gì?
- ✅ Có alternative workaround không?

#### **Severity Levels:**

```
Critical: Production down, data loss
High: Core function broken, nhiều users ảnh hưởng
Medium: Minor function broken, có workaround
Low: UI glitch, edge case
```

---

### 18.4. Quy trình Git

**Câu hỏi:** Quy trình Git workflow của bạn như thế nào?

**Câu trả lời chuẩn Senior:**

#### **Git Flow (phổ biến nhất):**

```
main (production)
  └── develop (staging)
       ├── feature/user-auth
       ├── feature/payment
       └── hotfix/critical-bug
```

#### **Workflow:**

1. **Tạo feature branch**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/user-profile
   ```

2. **Commit thường xuyên**

   ```bash
   git add .
   git commit -m "feat: add user profile component"
   ```

3. **Push & tạo PR**

   ```bash
   git push origin feature/user-profile
   # Tạo Pull Request trên GitHub
   ```

4. **Code Review → Merge**

   - Review code
   - CI/CD chạy tests
   - Approve → Merge vào develop

5. **Release**
   ```bash
   # Merge develop → main
   git checkout main
   git merge develop
   git tag v1.2.0
   ```

#### **Commit Message Convention:**

```
feat: thêm tính năng mới
fix: sửa bug
docs: cập nhật documentation
style: format code (không thay đổi logic)
refactor: refactor code
test: thêm tests
chore: update dependencies, config
```

---

### 18.5. Giải quyết Xung đột Git

**Câu hỏi:** Làm sao giải quyết Git conflicts?

**Câu trả lời chuẩn Senior:**

#### **Bước 1: Update branch**

```bash
git checkout feature/my-branch
git fetch origin
git rebase origin/develop
# Hoặc: git merge origin/develop
```

#### **Bước 2: Resolve conflicts**

```js
// File có conflict
<<<<<<< HEAD
const name = 'Alice';  // Your changes
=======
const name = 'Bob';    // Incoming changes
>>>>>>> origin/develop

// Sau khi resolve
const name = 'Alice'; // Giữ phiên bản đúng
```

#### **Bước 3: Continue**

```bash
git add .
git rebase --continue
# Hoặc: git commit (nếu dùng merge)
```

#### **Best Practices:**

✅ **Communicate**: Nói chuyện với teammate nếu conflict phức tạp
✅ **Test**: Chạy tests sau khi resolve
✅ **Small PRs**: PR nhỏ → ít conflict hơn
✅ **Pull thường xuyên**: Update branch thường xuyên

#### **Tools hữu ích:**

- VS Code built-in merge editor
- GitKraken, SourceTree
- `git mergetool`

---

### 18.6. Gộp Commits

**Câu hỏi:** Làm sao gộp nhiều commits thành 1?

**Câu trả lời chuẩn Senior:**

#### **Interactive Rebase:**

```bash
# Gộp 3 commits gần nhất
git rebase -i HEAD~3
```

**Editor hiện ra:**

```
pick abc123 feat: add component
pick def456 fix: typo
pick ghi789 fix: another typo

# Đổi thành:
pick abc123 feat: add component
squash def456 fix: typo
squash ghi789 fix: another typo
```

**Kết quả:** 3 commits → 1 commit duy nhất

#### **Soft Reset (cách khác):**

```bash
git reset --soft HEAD~3
git commit -m "feat: add user profile with fixes"
```

#### **Khi nào nên squash:**

✅ Trước khi merge PR
✅ Loại bỏ "WIP", "fix typo" commits
✅ Tạo history sạch đẹp

❌ **Không squash:**

- Commits đã push lên shared branch
- Commits có review comments
- Feature lớn cần giữ history

---

[← Quay lại Tổng quan](../README.md)
