# Leadership & Soft Skills

Technical leadership, mentorship and team collaboration skills for Senior developers.

---

## 17. Leadership & Soft Skills

## Table of Contents

1. [Technical Mentorship](#171-technical-mentorship)

2. [Architecture Decision Records (ADR)](#172-architecture-decision-records-adr)

3. [Complexity Estimation](#173-complexity-estimation)

4. [Conflict Resolution](#174-conflict-resolution)

---

### 17.1. Technical Mentorship

**Question:** How do you mentor junior developers?

**Senior-level Answer:**

#### **Mentorship Principles:**

| Principle                  | Explanation                          |
| -------------------------- | ------------------------------------ |
| **Teach, don't tell**      | Guide thinking, not just give answer |
| **Pair programming**       | Code together, explain real-time     |
| **Detailed code review**   | Explain why, not just what           |
| **Set clear expectations** | Clear goals, timelines               |
| **Celebrate wins**         | Recognize progress, build confidence |

#### **Approach:**

**1. Onboarding (first week):**

- ✅ Setup dev environment
- ✅ Introduce codebase architecture
- ✅ Assign small tasks to get familiar
- ✅ Introduce team members

**2. First Tasks:**

- ✅ Choose "good first issue" tasks
- ✅ Pair programming 50% of time
- ✅ Review code carefully, explain alternatives
- ✅ Share best practices documents

**3. Growth:**

- ✅ Gradually increase complexity
- ✅ Encourage questions
- ✅ Share resources (articles, courses)
- ✅ Regular 1-on-1 meetings

#### **Code Review Tips:**

```markdown
❌ Bad: "This is wrong, do it this way"

✅ Good: "I see you're using X. Have you considered Y?
Because [explain reason]. Let me know if you have questions!"
```

#### **Real Example:**

**Junior code:**

```js
// Iterating multiple times
users
  .filter((u) => u.active)
  .map((u) => u.name)
  .filter((n) => n.length > 5);
```

**Mentor feedback:**

```markdown
Good start! One optimization: we're iterating the array
3 times. We can do it in 1 pass with reduce:

[show better solution]

This matters when dealing with large datasets.
What do you think?
```

---

### 17.2. Architecture Decision Records (ADR)

**Senior-level Answer:**

ADR (Architecture Decision Record) documents **why** team chose solution A instead of B.

#### **ADR Template:**

```markdown
# ADR-001: Choose Pinia over Vuex

## Status

Accepted

## Context

Team needs state management for Vue 3 app.
Two main options: Vuex or Pinia.

## Decision

Choose Pinia as state management solution.

## Rationale

- Pinia is official recommendation for Vue 3
- Better TypeScript support (auto type inference)
- Simpler API (no mutations)
- Smaller bundle size
- Good DevTools integration

## Consequences

### Positive

- Faster development (less boilerplate)
- Better developer experience
- Easier to onboard new devs

### Negative

- Team needs to learn new API
- Some Vuex patterns don't apply

## Alternatives Considered

- Vuex: Mature but verbose, poor TS support
- Plain reactive(): Good for small apps but lacks structure

## References

- [Pinia docs](https://pinia.vuejs.org/)
- Team discussion: [link to meeting notes]
```

#### **When to write ADR:**

✅ Choosing main framework/library
✅ Architectural pattern decision
✅ Deployment strategy choice
✅ Database schema changes
✅ Breaking changes

❌ Small implementation details
❌ Bug fixes
❌ Refactoring without behavior change

---

### 17.3. Complexity Estimation

**Question:** How do you estimate task complexity?

**Senior-level Answer:**

#### **Story Points vs Hours:**

| Story Points | Complexity   | Hours (rough)            |
| ------------ | ------------ | ------------------------ |
| 1            | Trivial      | 1-2h                     |
| 2            | Easy         | 2-4h                     |
| 3            | Simple       | 4-8h                     |
| 5            | Medium       | 1-2 days                 |
| 8            | Complex      | 3-5 days                 |
| 13           | Very complex | 1-2 weeks                |
| 21+          | Epic         | Split into smaller tasks |

#### **Factors to consider:**

**Technical Complexity:**

- Code changes needed
- Dependencies with other modules
- Testing effort
- Code review rounds

**Uncertainty:**

- Are requirements clear?
- Any technical unknowns?
- Need research/POC?

**Dependencies:**

- Waiting for backend API?
- Need design from designer?
- Third-party integrations?

#### **Estimation Process:**

**1. Planning Poker:**

```
Team members independently estimate
→ Show cards simultaneously
→ Discuss outliers
→ Re-estimate until consensus
```

**2. T-Shirt Sizing:**

```
XS, S, M, L, XL
→ Later convert to story points
```

**3. Three-Point Estimation:**

```
Best case: 2 days
Most likely: 4 days
Worst case: 7 days

Estimate = (Best + 4×Likely + Worst) / 6
         = (2 + 16 + 7) / 6
         = ~4 days
```

#### **Buffer Rule:**

```
Estimate × 1.5 = Realistic timeline
(Account for meetings, code review, testing, unexpected issues)
```

---

### 17.4. Conflict Resolution

**Question:** How do you handle team conflicts?

**Senior-level Answer:**

#### **Types of Conflicts:**

| Type                       | Example                    | Approach              |
| -------------------------- | -------------------------- | --------------------- |
| **Technical disagreement** | Tabs vs Spaces, Framework  | Data-driven decision  |
| **Priority conflict**      | Bug fix vs New feature     | Stakeholder alignment |
| **Personality clash**      | Different communication    | 1-on-1, empathy       |
| **Workload imbalance**     | One person overloaded      | Redistribute tasks    |

#### **Resolution Framework:**

**1. Listen First:**

```
"I understand you prefer approach X because [reasons].
Can you help me understand why [specific concern]?"
```

**2. Focus on Goals:**

```
"Our goal is to ship quality product on time.
Both approaches can work, let's evaluate based on:
- Performance
- Maintainability
- Timeline
- Team expertise"
```

**3. Data > Opinions:**

```
"Let's prototype both and measure:
- Bundle size
- Load time
- Developer experience
Then decide based on results."
```

**4. Escalate if Needed:**

```
If no consensus → involve tech lead/architect
Document options & trade-offs
Let decision-maker choose with full context
```

#### **Real Example:**

**Conflict:** Dev A wants TypeScript strict mode, Dev B says too strict slows down.

**Resolution:**

```markdown
1. Listen: Understand both perspectives

   - A: Type safety catches bugs early
   - B: Too many errors, hard to refactor legacy code

2. Propose compromise:

   - Enable strict mode for new files
   - Gradually migrate old files
   - Set deadline: 3 months to full strict

3. Measure:

   - Track bugs found by TypeScript
   - Track refactor time
   - Re-evaluate after 1 month

4. Document decision in ADR
```

#### **Communication Tips:**

✅ **Use "I" statements**: "I feel..." instead of "You always..."
✅ **Assume good intent**: Everyone wants what's best
✅ **Private discussions**: Don't argue publicly
✅ **Focus on problem, not person**
✅ **Find common ground first**

---

[← Back to Overview](../../README-en.md)

