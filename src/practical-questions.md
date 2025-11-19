# Practical Interview Questions

Real-world scenarios và workflows cho Senior Frontend Developer interviews.

---

## Table of Contents

1. [Xử lý 401 Error → Redirect to Login](#1-xử-lý-401-error--redirect-to-login)
2. [Project Management Tool & Workflow](#2-project-management-tool--workflow)
3. [Đánh giá Issue: Bug hay Feature Request?](#3-đánh-giá-issue-bug-hay-feature-request)
4. [Git Workflow](#4-git-workflow)
5. [Resolve Git Conflicts](#5-resolve-git-conflicts)
6. [Squash Commits](#6-squash-commits)

---
## 11. Practical Interview Questions

### 11.1. Xử lý 401 Error → Redirect to Login

**Câu hỏi:** Khi muốn xử lí trường hợp 1 trong các API của ứng dụng trả về lỗi 401 cần chuyển hướng về trang đăng nhập thì cần xử lí như thế nào?

**Câu trả lời chuẩn Senior:**

#### **Approach 1: Axios Interceptor (Recommended)**

Setup global interceptor để handle tất cả 401 responses:

```ts
// plugins/axios.ts
import axios from "axios";
import router from "@/router";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      router.push({
        name: "login",
        query: { redirect: router.currentRoute.value.fullPath },
      });

      // Optional: show notification
      ElMessage.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### **Approach 2: Nuxt 3 với ofetch**

```ts
// plugins/api.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const token = useCookie("token");
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        };
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        // Clear auth
        const token = useCookie("token");
        token.value = null;

        // Redirect
        navigateTo("/login");
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
```

#### **Approach 3: Với Refresh Token**

```ts
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post("/auth/refresh", { refreshToken });

        localStorage.setItem("token", data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        processQueue(null, data.token);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // Refresh failed → logout
        localStorage.clear();
        router.push("/login");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

#### **Best Practices:**

- ✅ Handle ở **global level** (interceptor) thay vì mỗi API call.
- ✅ Preserve **redirect URL** để quay lại sau khi login.
- ✅ Clear **all auth data** (token, user info, cookies).
- ✅ Show **user-friendly message**.
- ✅ Implement **refresh token** nếu có.
- ✅ Prevent **multiple refresh requests** (queue mechanism).

---

### 11.2. Project Management Tool & Workflow

**Câu hỏi:** Ở công ty cũ của bạn dùng tool gì để quản lí dự án? Hãy kể thử quy trình làm việc cơ bản từ khi nhận task đến khi bàn giao task?

**Câu trả lời chuẩn Senior:**

#### **Tools thường dùng:**

- **Project Management**: Jira, ClickUp, Asana, Monday, Linear
- **Communication**: Slack, Microsoft Teams, Discord
- **Documentation**: Confluence, Notion, GitBook
- **Code Review**: GitHub PR, GitLab MR, Bitbucket

#### **Workflow chuẩn (Agile/Scrum):**

**1. Sprint Planning (đầu sprint)**

- Team họp, chọn tasks từ backlog.
- Product Owner clarify requirements.
- Dev team estimate effort (story points).
- Tasks được assign vào sprint.

**2. Nhận Task**

```
Jira ticket includes:
- Title & Description
- Acceptance Criteria
- Figma/Design link
- Priority & Due date
- Related tickets
```

**3. Analysis & Planning (1-2h)**

- Đọc kỹ requirements, AC (Acceptance Criteria).
- Check design trên Figma.
- Hỏi BA/PM nếu unclear.
- Break down task thành subtasks:
  - Setup UI structure
  - Integrate API
  - Handle edge cases
  - Write tests
  - Update docs

**4. Development**

- Update ticket status: **To Do → In Progress**.
- Create branch: `feature/TICKET-123-user-profile`.
- Code + self-test.
- Update ticket với screenshots/GIFs nếu có UI changes.

**5. Code Review**

- Create Pull Request:
  - Title: `[TICKET-123] Implement user profile page`
  - Description: link ticket, screenshots, test scenarios
  - Assign reviewers
- Address review comments.
- Update status: **In Progress → Code Review**.

**6. QA Testing**

- Deploy to staging/dev environment.
- Move ticket: **Code Review → QA Testing**.
- QA test theo test cases.
- Nếu có bug → quay lại Dev, fix and re-test.

**7. Done & Demo**

- QA approve → **Done**.
- Demo trong Sprint Review (nếu có).
- Merge vào main/develop branch.
- Deploy production (theo release schedule).

#### **Daily Updates:**

- **Daily Standup** (15 phút):
  - Yesterday: đã làm gì?
  - Today: sẽ làm gì?
  - Blockers: có vấn đề gì cần support?

#### **Tracking Progress:**

```
Jira Board columns:
Backlog → To Do → In Progress → Code Review → QA Testing → Done

Time logging:
- Log giờ làm việc vào ticket
- Update estimated vs actual time
```

**Pro tips:**

- ✅ Update ticket status **real-time**.
- ✅ Comment vào ticket khi có questions/blockers.
- ✅ Attach **screenshots/videos** cho UI changes.
- ✅ Link related tickets/PRs.
- ✅ Keep communication **transparent** trong ticket comments.

---

### 11.3. Đánh giá Issue: Bug hay Feature Request?

**Câu hỏi:** Khi bạn nhận issue từ khách hàng, làm sao để bạn đánh giá issue đúng là bug hay không?

**Câu trả lời chuẩn Senior:**

#### **Definition:**

**Bug**: Hệ thống không hoạt động đúng như **spec đã define**.

**Feature Request**: Khách hàng muốn thêm chức năng **mới** chưa có trong spec.

#### **Quy trình đánh giá:**

**Bước 1: Gather Information**

```markdown
Checklist:
□ Steps to reproduce?
□ Expected behavior?
□ Actual behavior?
□ Screenshots/videos?
□ Environment (browser, device, OS)?
□ User role/permissions?
□ Frequency (always/sometimes)?
```

**Bước 2: Reproduce**

- Tự tái tạo issue trên môi trường tương tự.
- Không reproduce được → hỏi thêm thông tin.
- Reproduce được → confirm là bug.

**Bước 3: Check Spec/Requirements**

```
Questions:
1. Có trong spec/PRD không?
   - Có → so sánh expected vs actual
   - Không → có thể là feature request

2. Có trong Acceptance Criteria không?
   - Có → bug
   - Không → clarify với PM/PO

3. Có được mention trong các meeting/email không?
```

**Bước 4: Classify**

**✅ Đây là BUG nếu:**

- Hệ thống crash/error.
- Không match với spec đã approved.
- UI không đúng design đã approve.
- Performance issue (spec yêu cầu < 2s nhưng mất 10s).
- Security vulnerability.
- Data inconsistency.

**❌ KHÔNG phải bug (có thể là Feature Request):**

- "Thêm button Export Excel" (chức năng mới).
- "Cho phép user edit sau khi submit" (business rule mới).
- "UI đẹp hơn" (subjective, không phải spec).

**Bước 5: Prioritize (nếu là bug)**

```
P0 - Critical: Production down, data loss, security breach
  → Fix immediately, hotfix

P1 - High: Core feature không work, blocking users
  → Fix trong 1-2 ngày

P2 - Medium: Feature work nhưng có issue, có workaround
  → Fix trong sprint hiện tại

P3 - Low: Minor UI issue, edge case hiếm gặp
  → Backlog, fix khi có time
```

#### **Response Template:**

**Nếu là Bug:**

```markdown
✅ Confirmed as bug

**Root cause:** [explain technical reason]
**Impact:** [số users affected, severity]
**Priority:** P1 - High
**ETA:** Will fix in 2 days

**Workaround:** [nếu có temporary solution]
```

**Nếu là Feature Request:**

```markdown
❌ Not a bug - Feature request

**Reason:** This behavior matches current spec [link to spec]
Current design allows X but not Y as per requirement [ticket #123]

**Suggestion:** Please create a feature request ticket, we can discuss in next sprint planning.
```

**Nếu cần clarify:**

```markdown
🤔 Need more info

Could you please provide:

1. Steps to reproduce
2. Screenshots/video
3. Expected behavior vs actual behavior
4. Reference to requirement document (if any)

This will help us classify and prioritize correctly.
```

**Pro tips:**

- ✅ Always be **respectful** và **professional**.
- ✅ Base on **facts & specs**, not opinions.
- ✅ Involve **PM/PO** nếu unclear về requirements.
- ✅ Document everything trong ticket.

---

### 11.4. Git Workflow

**Câu hỏi:** Công ty cũ của bạn quản lí source code bằng tool gì? Hãy kể về luồng làm việc với git khi bạn xử lí 1 task?

**Câu trả lời chuẩn Senior:**

#### **Tools:**

- GitHub, GitLab, Bitbucket, Azure DevOps

#### **Git Workflow (Feature Branch + Pull Request)**

**Step 1: Pull latest code**

```bash
git checkout develop
git pull origin develop
```

**Step 2: Create feature branch**

```bash
# Naming convention
git checkout -b feature/TICKET-123-user-authentication
# or
git checkout -b fix/TICKET-456-login-bug
git checkout -b hotfix/critical-security-patch
```

**Step 3: Development**

```bash
# Code...

# Commit với conventional commits
git add .
git commit -m "feat(auth): implement user login with JWT"

git commit -m "fix(profile): resolve avatar upload issue"
git commit -m "refactor(api): extract auth interceptor to separate file"
git commit -m "docs(readme): update setup instructions"
```

**Commit message format:**

```
<type>(<scope>): <subject>

type: feat, fix, docs, style, refactor, test, chore
scope: module/feature affected
subject: short description (imperative mood)

Examples:
✅ feat(auth): add password reset functionality
✅ fix(cart): prevent duplicate items
✅ refactor(utils): simplify date formatting
✅ docs(api): add endpoint documentation
```

**Step 4: Push to remote**

```bash
git push origin feature/TICKET-123-user-authentication
```

**Step 5: Create Pull Request**

```markdown
Title: [TICKET-123] Implement user authentication

Description:

## Changes

- Implement login/logout flow
- Add JWT token management
- Integrate with auth API

## Screenshots

[attach images]

## Testing

- ✅ Unit tests passed
- ✅ Manual test on Chrome/Safari
- ✅ Test on mobile devices

## Checklist

- [x] Code follows style guide
- [x] Self-reviewed
- [x] No console.log left
- [x] Updated documentation

Closes #123
```

**Step 6: Code Review Process**

```bash
# Reviewer comments → fix

# Pull latest changes (if any)
git checkout develop
git pull origin develop
git checkout feature/TICKET-123-user-authentication
git rebase develop  # or merge develop

# Fix issues
git add .
git commit -m "fix: address review comments"
git push origin feature/TICKET-123-user-authentication
```

**Step 7: Merge**

```bash
# After approval
# Option 1: Merge via PR interface (recommended)

# Option 2: Manual merge
git checkout develop
git merge feature/TICKET-123-user-authentication
git push origin develop

# Delete branch
git branch -d feature/TICKET-123-user-authentication
git push origin --delete feature/TICKET-123-user-authentication
```

#### **Branch Strategy:**

```
main/master
  └─ Production code (protected)

develop
  └─ Integration branch (protected)

feature/*
  └─ New features

fix/*
  └─ Bug fixes

hotfix/*
  └─ Critical production fixes
  └─ Branch from main, merge to main + develop
```

#### **Best Practices:**

- ✅ **Commit often**, với meaningful messages.
- ✅ **Pull/rebase** frequently để tránh conflict lớn.
- ✅ **Never commit** vào main/develop trực tiếp.
- ✅ **Review own PR** trước khi assign reviewer.
- ✅ **Delete branch** sau khi merge.
- ✅ Keep commits **atomic** (1 commit = 1 logical change).

---

### 11.5. Resolve Git Conflicts

**Câu hỏi:** Khi bạn chuẩn bị merge 1 pull request mà bị tool báo có conflict thì bạn sẽ xử lí như thế nào?

**Câu trả lời chuẩn Senior:**

#### **Approach 1: Rebase (Recommended cho clean history)**

```bash
# Step 1: Update local develop
git checkout develop
git pull origin develop

# Step 2: Rebase feature branch
git checkout feature/my-feature
git rebase develop

# Step 3: Git sẽ báo conflicts
# CONFLICT (content): Merge conflict in src/components/User.vue
# error: could not apply abc1234...

# Step 4: Fix conflicts manually
# Open files, tìm các markers:
```

**Conflict markers:**

```js
<<<<<<< HEAD (current change - your feature branch)
const greeting = "Hello World";
=======
const greeting = "Hi there";
>>>>>>> develop (incoming change - develop branch)
```

**Resolve:**

```js
// Choose one or combine both
const greeting = "Hello World"; // Keep your change
// or
const greeting = "Hi there"; // Accept incoming
// or
const greeting = "Hello World, Hi there"; // Combine
```

```bash
# Step 5: Mark resolved
git add src/components/User.vue

# Step 6: Continue rebase
git rebase --continue

# Nếu có conflicts khác → lặp lại Step 4-5
# Nếu muốn abort → git rebase --abort

# Step 7: Force push (vì history changed)
git push origin feature/my-feature --force-with-lease
```

#### **Approach 2: Merge (Simpler, preserves history)**

```bash
# Step 1: From feature branch
git checkout feature/my-feature

# Step 2: Merge develop into feature
git merge develop

# Step 3: Resolve conflicts (same as rebase Step 4)

# Step 4: Complete merge
git add .
git commit -m "merge: resolve conflicts with develop"

# Step 5: Push
git push origin feature/my-feature
```

#### **Using IDE (VS Code, WebStorm)**

VS Code với GitLens extension:

```
Click on conflict file
→ See inline options:
  [ Accept Current Change ]
  [ Accept Incoming Change ]
  [ Accept Both Changes ]
  [ Compare Changes ]

→ Choose và save
→ git add .
→ git rebase --continue (or git commit)
```

#### **Complex Conflicts Strategy:**

**1. Understand the conflict:**

```bash
# See what changed
git diff

# See commit history
git log --oneline --graph feature/my-feature develop
```

**2. Communicate:**

- Nếu conflict liên quan đến code của teammate → **chat trực tiếp**.
- Pair programming để resolve cùng nhau.

**3. Test after resolving:**

```bash
# After resolve
npm run lint
npm run test
npm run dev  # manual test
```

**4. Prevention:**

```bash
# Pull develop frequently (daily)
git checkout feature/my-feature
git rebase develop  # hoặc git merge develop

# Push often → conflicts nhỏ hơn
```

#### **Common Conflict Scenarios:**

**Scenario 1: Same line edited**

```js
// Your change
const API_URL = "https://api-v2.example.com";

// Their change
const API_URL = "https://api.example.com/v2";

// Resolution: discuss với team, chọn cái đúng
```

**Scenario 2: File renamed/moved**

```bash
# You renamed: User.vue → UserProfile.vue
# They modified: User.vue

# Resolution:
git rm User.vue
git add UserProfile.vue
# Manually apply their changes to UserProfile.vue
```

**Scenario 3: Conflicts in package-lock.json**

```bash
# Usually safe to regenerate
git checkout develop -- package-lock.json
npm install
git add package-lock.json
```

#### **Best Practices:**

- ✅ **Rebase frequently** để tránh conflicts lớn.
- ✅ **Test thoroughly** sau khi resolve.
- ✅ **Communicate** với người có code conflict.
- ✅ Dùng **`--force-with-lease`** thay vì `--force` (safer).
- ✅ Keep PR **small** → ít conflict hơn.

---

### 11.6. Squash Commits

**Câu hỏi:** Giả sử bạn tạo 1 pull request có 3 commit mà quy trình là 1 pull request chỉ bao gồm 1 commit thì bạn sẽ xử lí như thế nào?

**Câu trả lời chuẩn Senior:**

#### **Method 1: Interactive Rebase (Recommended)**

```bash
# Step 1: Check commit history
git log --oneline
# abc123 fix: typo in button text
# def456 feat: add user profile page
# ghi789 feat: initial setup

# Step 2: Interactive rebase last 3 commits
git rebase -i HEAD~3

# Editor opens:
```

```bash
pick ghi789 feat: initial setup
pick def456 feat: add user profile page
pick abc123 fix: typo in button text

# Change to:
pick ghi789 feat: initial setup
squash def456 feat: add user profile page
squash abc123 fix: typo in button text

# Or use 's' shorthand:
pick ghi789 feat: initial setup
s def456 feat: add user profile page
s abc123 fix: typo in button text
```

**Save & close editor → New editor opens cho commit message:**

```bash
# Combine messages or write new one:
feat(profile): implement user profile page

- Add profile page UI
- Integrate with user API
- Add avatar upload functionality

Closes #123
```

```bash
# Step 3: Force push
git push origin feature/my-feature --force-with-lease
```

#### **Method 2: Soft Reset**

```bash
# Step 1: Reset to before your commits (keep changes)
git reset --soft HEAD~3

# Step 2: Create new single commit
git add .
git commit -m "feat(profile): implement user profile page"

# Step 3: Force push
git push origin feature/my-feature --force-with-lease
```

#### **Method 3: Merge Commit (GitHub/GitLab UI)**

**GitHub:**

```
In PR page:
→ Click "Squash and merge" button
→ Edit commit message
→ Confirm merge

This automatically squashes all commits into one on merge.
```

**GitLab:**

```
Merge Request page:
→ Check "Squash commits"
→ Merge
```

#### **Method 4: Manual Squash**

```bash
# Create new branch from develop
git checkout develop
git checkout -b feature/my-feature-squashed

# Cherry-pick và squash
git merge --squash feature/my-feature
git commit -m "feat(profile): implement user profile page"

# Push new branch
git push origin feature/my-feature-squashed

# Update PR to point to new branch (or create new PR)
```

#### **Interactive Rebase Options:**

```bash
pick   = use commit
reword = use commit, but edit message
edit   = use commit, but stop for amending
squash = use commit, combine with previous
fixup  = like squash, but discard message
drop   = remove commit
```

**Example workflow:**

```bash
pick abc123 feat: add login
reword def456 feat: add logout  # Will prompt to change message
fixup ghi789 fix: typo          # Squash but ignore commit message
drop jkl012 wip: testing        # Remove this commit
```

#### **Best Practices:**

```bash
# ✅ Check history before squash
git log --oneline --graph

# ✅ Use --force-with-lease instead of --force
git push --force-with-lease origin feature/my-feature

# ✅ Never squash commits already merged to main/develop

# ✅ Keep commit message clear
feat(scope): brief description

- Detailed point 1
- Detailed point 2

Closes #123
```

#### **When to Squash:**

✅ **Should squash:**

- Multiple "WIP" commits
- "Fix typo", "Fix linting" commits
- Commits fixing previous commits trong cùng PR
- Company policy requires 1 commit per PR

❌ **Don't squash:**

- Commits đã merged vào main/develop
- Commits khác logical changes (nên tách PR)
- Trong public/open-source repos (preserve contributor history)

#### **Troubleshooting:**

**Conflict during rebase:**

```bash
# Resolve conflicts
git add .
git rebase --continue

# Or abort
git rebase --abort
```

**Accidentally squashed wrong commits:**

```bash
# Undo với reflog
git reflog
git reset --hard HEAD@{2}  # Go back to before squash
```

---


---

[← Back to Overview](../README.md)
