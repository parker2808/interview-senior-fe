# Leadership & Soft Skills

Technical leadership, mentorship, và team collaboration skills for Senior developers.

---

## Table of Contents

1. [Technical Mentorship](#1-technical-mentorship)
2. [Architectural Decision Records (ADR)](#2-architectural-decision-records-adr)
3. [Estimating Complexity](#3-estimating-complexity)
4. [Conflict Resolution](#4-conflict-resolution)

---
## 12. Leadership & Soft Skills

### 12.1. Technical Mentorship

**Câu trả lời chuẩn Senior:**

#### **Effective Code Reviews**

```markdown
✅ Good code review comment:

"Good start! For better performance, consider using computed here instead of watch.
Computed is cached and only recalculates when dependencies change.

Example:
const filteredUsers = computed(() => {
return users.value.filter(u => u.active)
})

This avoids unnecessary re-filtering on every render."

❌ Bad code review comment:

"This is wrong. Use computed."
```

#### **Knowledge Sharing**

- Weekly tech talks (15-30 min)
- Pair programming sessions
- Documentation (ADR, RFC)
- Internal blog/wiki
- Code review as teaching opportunity

---

### 12.2. Architectural Decision Records (ADR)

```markdown
# ADR-001: Choose Nuxt 3 over Next.js

## Status

Accepted

## Context

We need to choose a meta-framework for our new e-commerce platform.
Team has more Vue experience than React.
SEO is critical for product pages.

## Decision

We will use Nuxt 3 for the following reasons:

1. Team expertise in Vue 3
2. Excellent SSR/SSG support
3. File-based routing
4. Built-in performance optimizations
5. Strong TypeScript support

## Consequences

### Positive

- Faster development (team familiarity)
- Better SEO out of the box
- Reduced bundle size vs CSR

### Negative

- Smaller ecosystem than Next.js
- Fewer third-party Nuxt-specific libraries
- Team needs to learn Nuxt conventions

## Alternatives Considered

- Next.js: Rejected due to React learning curve
- Vue 3 SPA: Rejected due to SEO requirements
```

---

### 12.3. Estimating Complexity

**Câu trả lời chuẩn Senior:**

#### **Story Point Estimation**

```
1 point: Simple bug fix, text change (< 1 hour)
2 points: Small feature, simple component (2-4 hours)
3 points: Medium feature, API integration (1 day)
5 points: Complex feature, multiple components (2-3 days)
8 points: Large feature, architecture changes (1 week)
13 points: Epic, needs breakdown
```

#### **Planning Poker**

- Team estimates together
- Discuss outliers
- Re-estimate until consensus

#### **Breaking Down Large Tasks**

```
Epic: Implement user dashboard
├─ Setup routing (2 points)
├─ Create layout component (3 points)
├─ Integrate user API (3 points)
├─ Build stats widgets (5 points)
├─ Add charts library (5 points)
├─ Implement real-time updates (8 points)
└─ Write tests (5 points)

Total: 31 points → ~2-3 sprints
```

---

### 12.4. Conflict Resolution

**Câu trả lời chuẩn Senior:**

#### **Technical Disagreements**

```
Scenario: Team disagrees on REST vs GraphQL

Steps:
1. Listen to all perspectives
2. Document pros/cons of each approach
3. Run small POC with both
4. Measure: performance, DX, maintainability
5. Make data-driven decision
6. Document decision (ADR)
7. Commit as team
```

#### **Code Review Conflicts**

```
Scenario: Junior dev defensive about feedback

Approach:
1. Frame feedback as questions: "What do you think about...?"
2. Explain WHY, not just WHAT to change
3. Offer to pair program to show alternative
4. Acknowledge good parts first
5. Focus on code, not person
6. Be willing to accept their approach if valid
```

---


---

[← Back to Overview](../README.md)
