# Leadership & Soft Skills

Leadership kỹ thuật, mentorship và kỹ năng cộng tác nhóm cho Senior developers.

---

## 17. Leadership & Soft Skills

## Table of Contents

1. [Mentorship Kỹ thuật](#171-mentorship-kỹ-thuật)

2. [Ghi chép Quyết định Kiến trúc (ADR)](#172-ghi-chép-quyết-định-kiến-trúc-adr)

3. [Ước lượng Độ phức tạp](#173-ước-lượng-độ-phức-tạp)

4. [Giải quyết Xung đột](#174-giải-quyết-xung-đột)

---

### 17.1. Mentorship Kỹ thuật

**Câu hỏi:** Bạn mentor junior developers như thế nào?

**Câu trả lời chuẩn Senior:**

#### **Nguyên tắc Mentorship:**

| Nguyên tắc                 | Giải thích                             |
| -------------------------- | -------------------------------------- |
| **Teach, don't tell**      | Hướng dẫn tư duy, không chỉ đưa answer |
| **Pair programming**       | Code cùng nhau, giải thích real-time   |
| **Code review chi tiết**   | Explain why, not just what             |
| **Set clear expectations** | Rõ ràng về goals, timelines            |
| **Celebrate wins**         | Recognize progress, build confidence   |

#### **Cách tiếp cận:**

**1. Onboarding (tuần đầu):**

- ✅ Setup môi trường dev
- ✅ Giới thiệu codebase architecture
- ✅ Assign task nhỏ để familiar
- ✅ Introduce team members

**2. First Tasks:**

- ✅ Chọn tasks "good first issue"
- ✅ Pair programming 50% thời gian
- ✅ Review code kỹ, explain alternatives
- ✅ Share best practices documents

**3. Growth:**

- ✅ Gradually tăng complexity
- ✅ Encourage questions
- ✅ Share resources (articles, courses)
- ✅ 1-on-1 meetings định kỳ

#### **Code Review Tips:**

```markdown
❌ Bad: "This is wrong, do it this way"

✅ Good: "I see you're using X. Have you considered Y?
Because [explain reason]. Let me know if you have questions!"
```

#### **Ví dụ thực tế:**

**Junior code:**

```js
// Lặp nhiều lần
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

### 17.2. Ghi chép Quyết định Kiến trúc (ADR)

**Câu trả lời chuẩn Senior:**

ADR (Architecture Decision Record) document lại **tại sao** team chọn solution A thay vì B.

#### **Template ADR:**

```markdown
# ADR-001: Chọn Pinia thay vì Vuex

## Status

Accepted

## Context

Team cần state management cho Vue 3 app.
Có 2 options chính: Vuex hoặc Pinia.

## Decision

Chọn Pinia làm state management solution.

## Rationale

- Pinia là official recommendation cho Vue 3
- TypeScript support tốt hơn (auto type inference)
- API đơn giản hơn (không cần mutations)
- Bundle size nhỏ hơn
- DevTools integration tốt

## Consequences

### Positive

- Faster development (less boilerplate)
- Better developer experience
- Easier to onboard new devs

### Negative

- Team cần học API mới
- Một số patterns từ Vuex không áp dụng được

## Alternatives Considered

- Vuex: Mature nhưng verbose, TS support kém
- Plain reactive(): Đủ cho app nhỏ nhưng thiếu structure

## References

- [Pinia docs](https://pinia.vuejs.org/)
- Team discussion: [link to meeting notes]
```

#### **Khi nào viết ADR:**

✅ Chọn framework/library chính
✅ Quyết định architecture pattern
✅ Chọn deployment strategy
✅ Database schema changes
✅ Breaking changes

❌ Implementation details nhỏ
❌ Bug fixes
❌ Refactoring không đổi behavior

---

### 17.3. Ước lượng Độ phức tạp

**Câu hỏi:** Làm sao estimate task complexity?

**Câu trả lời chuẩn Senior:**

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

#### **Factors cần xem xét:**

**Technical Complexity:**

- Code changes cần thiết
- Dependencies với modules khác
- Testing effort
- Code review rounds

**Uncertainty:**

- Requirement rõ ràng chưa?
- Có technical unknowns?
- Cần research/POC không?

**Dependencies:**

- Chờ API từ backend?
- Cần design từ designer?
- Third-party integrations?

#### **Estimation Process:**

**1. Planning Poker:**

```
Team members independently estimate
→ Show cards cùng lúc
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

### 17.4. Giải quyết Xung đột

**Câu hỏi:** Xử lý conflict trong team như thế nào?

**Câu trả lời chuẩn Senior:**

#### **Types of Conflicts:**

| Type                       | Ví dụ                            | Approach              |
| -------------------------- | -------------------------------- | --------------------- |
| **Technical disagreement** | Tabs vs Spaces, Framework choice | Data-driven decision  |
| **Priority conflict**      | Bug fix vs New feature           | Stakeholder alignment |
| **Personality clash**      | Communication style khác nhau    | 1-on-1, empathy       |
| **Workload imbalance**     | Một người quá tải                | Redistribute tasks    |

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

#### **Ví dụ thực tế:**

**Conflict:** Dev A muốn dùng TypeScript strict mode, Dev B nói quá strict làm chậm.

**Resolution:**

```markdown
1. Listen: Understand cả 2 perspectives

   - A: Type safety catches bugs early
   - B: Too many errors, hard to refactor legacy code

2. Propose compromise:

   - Enable strict mode cho new files
   - Gradually migrate old files
   - Set deadline: 3 months to full strict

3. Measure:

   - Track bugs found by TypeScript
   - Track refactor time
   - Re-evaluate after 1 month

4. Document decision in ADR
```

#### **Communication Tips:**

✅ **Use "I" statements**: "I feel..." thay vì "You always..."
✅ **Assume good intent**: Everyone wants what's best
✅ **Private discussions**: Don't argue publicly
✅ **Focus on problem, not person**
✅ **Find common ground first**

---

[← Quay lại Tổng quan](../README.md)
