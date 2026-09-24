# Practical Interview Questions

Real-world scenarios and workflows for Senior Frontend Developer interviews.

---

## 18. Practical Interview Questions

## Table of Contents

1. [Handling 401 Error → Redirect to Login](#181-handling-401-error--redirect-to-login)

2. [Project Management Tools & Workflows](#182-project-management-tools--workflows)

3. [Evaluating Issues: Bug vs Feature Request?](#183-evaluating-issues-bug-vs-feature-request)

4. [Git Workflow](#184-git-workflow)

5. [Resolving Git Conflicts](#185-resolving-git-conflicts)

6. [Squashing Commits](#186-squashing-commits)

---

### 18.1. Handling 401 Error → Redirect to Login

**Question:** When API returns 401 Unauthorized, how do you redirect user to login page?

**Senior-level Answer:**

#### **Solution: Axios Interceptor**

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

✅ Save current URL to redirect back after login
✅ Clear token/auth state
✅ Show toast notification
✅ Handle refresh token before redirect
✅ Avoid multiple redirects (use flag)

---

### 18.2. Project Management Tools & Workflows

**Question:** What tools do you use for project management?

**Senior-level Answer:**

#### **Common Stack:**

| Tool                | Purpose                    |
| ------------------- | -------------------------- |
| **Jira**            | Task tracking, Sprint plan |
| **Linear**          | Modern Jira alternative    |
| **GitHub Projects** | Integrated with GitHub     |
| **Notion**          | Documentation, Wiki        |
| **Confluence**      | Team documentation         |
| **Slack/Discord**   | Communication              |
| **Figma**           | Design collaboration       |

#### **Agile/Scrum Process:**

1. **Sprint Planning** (start of sprint)

   - Review backlog
   - Estimate story points
   - Commit sprint goals

2. **Daily Standup** (daily)

   - Yesterday: What was done
   - Today: What will be done
   - Blockers: Issues need help

3. **Sprint Review** (end of sprint)

   - Demo features
   - Stakeholder feedback

4. **Retrospective**
   - What went well
   - What didn't
   - Action items

---

### 18.3. Evaluating Issues: Bug vs Feature Request?

**Question:** How do you distinguish Bug vs Feature Request?

**Senior-level Answer:**

#### **Differences:**

| Criteria       | Bug                       | Feature Request         |
| -------------- | ------------------------- | ----------------------- |
| **Definition** | Code doesn't work as spec | Request new function    |
| **Impact**     | Breaks existing function  | Adds new function       |
| **Priority**   | High (if critical)        | Depends on value        |
| **Timeline**   | Fix now (hotfix critical) | Plan in next sprint     |

#### **Evaluation Checklist:**

**Bug?**

- ✅ Did it work before?
- ✅ Is there doc/spec describing behavior?
- ✅ Can user reproduce it?
- ✅ Does it affect critical function?

**Feature?**

- ✅ Was it in original spec/design?
- ✅ Does it need design/approval?
- ✅ What's the business value?
- ✅ Is there alternative workaround?

#### **Severity Levels:**

```
Critical: Production down, data loss
High: Core function broken, many users affected
Medium: Minor function broken, has workaround
Low: UI glitch, edge case
```

---

### 18.4. Git Workflow

**Question:** What's your Git workflow like?

**Senior-level Answer:**

#### **Git Flow (most common):**

```
main (production)
  └── develop (staging)
       ├── feature/user-auth
       ├── feature/payment
       └── hotfix/critical-bug
```

#### **Workflow:**

1. **Create feature branch**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/user-profile
   ```

2. **Commit frequently**

   ```bash
   git add .
   git commit -m "feat: add user profile component"
   ```

3. **Push & create PR**

   ```bash
   git push origin feature/user-profile
   # Create Pull Request on GitHub
   ```

4. **Code Review → Merge**

   - Review code
   - CI/CD runs tests
   - Approve → Merge to develop

5. **Release**
   ```bash
   # Merge develop → main
   git checkout main
   git merge develop
   git tag v1.2.0
   ```

#### **Commit Message Convention:**

```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code (no logic change)
refactor: refactor code
test: add tests
chore: update dependencies, config
```

---

### 18.5. Resolving Git Conflicts

**Question:** How do you resolve Git conflicts?

**Senior-level Answer:**

#### **Step 1: Update branch**

```bash
git checkout feature/my-branch
git fetch origin
git rebase origin/develop
# Or: git merge origin/develop
```

#### **Step 2: Resolve conflicts**

```js
// File with conflict
<<<<<<< HEAD
const name = 'Alice';  // Your changes
=======
const name = 'Bob';    // Incoming changes
>>>>>>> origin/develop

// After resolving
const name = 'Alice'; // Keep correct version
```

#### **Step 3: Continue**

```bash
git add .
git rebase --continue
# Or: git commit (if using merge)
```

#### **Best Practices:**

✅ **Communicate**: Talk to teammate if complex conflict
✅ **Test**: Run tests after resolving
✅ **Small PRs**: Small PR → fewer conflicts
✅ **Pull frequently**: Update branch often

#### **Useful Tools:**

- VS Code built-in merge editor
- GitKraken, SourceTree
- `git mergetool`

---

### 18.6. Squashing Commits

**Question:** How do you squash multiple commits into one?

**Senior-level Answer:**

#### **Interactive Rebase:**

```bash
# Squash last 3 commits
git rebase -i HEAD~3
```

**Editor shows:**

```
pick abc123 feat: add component
pick def456 fix: typo
pick ghi789 fix: another typo

# Change to:
pick abc123 feat: add component
squash def456 fix: typo
squash ghi789 fix: another typo
```

**Result:** 3 commits → 1 single commit

#### **Soft Reset (alternative):**

```bash
git reset --soft HEAD~3
git commit -m "feat: add user profile with fixes"
```

#### **When to squash:**

✅ Before merging PR
✅ Remove "WIP", "fix typo" commits
✅ Create clean history

❌ **Don't squash:**

- Commits already pushed to shared branch
- Commits with review comments
- Large feature needing history

---

[← Back to Overview](../../README-en.md)

