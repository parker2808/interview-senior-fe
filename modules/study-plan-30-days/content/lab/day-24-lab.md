# Day 24 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** CSRF vs XSS — what changes in the UI? How do you evaluate a third-party script? How do you roll out a frontend feature with flags and a rollback?
- **VI:** CSRF vs XSS — UI đổi gì? Đánh giá third-party script thế nào? Rollout feature frontend với flag và rollback ra sao?

## What you will produce / Bạn sẽ produce gì

- **EN:** Write a short release checklist for one frontend feature: flags, monitoring, rollback, third-party risk, and post-release watch points.
  - **VI:** Viết một release checklist ngắn cho một feature frontend: flag, monitoring, rollback, risk từ third-party và điểm cần quan sát sau release.
- **EN:** Add one paragraph on how cookie auth, XSS, and CSRF change your UI decisions.
  - **VI:** Thêm một đoạn ngắn về cách cookie auth, XSS và CSRF ảnh hưởng tới quyết định ở UI.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Treat release as part of the design. Flags + one metric + a rollback path before the merge. Security notes must change a concrete UI choice (no `v-html`, cookie flags, CSRF token on mutations).
  - VI: Coi release là một phần của design. Flag + một metric + đường rollback trước khi merge. Ghi chú security phải đổi một lựa chọn UI cụ thể (không `v-html`, cookie flag, CSRF token trên mutation).
- **Constraint / Ràng buộc:**
  - EN: Checklist + one paragraph. Not an E2E suite, not a CI rewrite.
  - VI: Checklist + một đoạn. Không phải bộ E2E, không viết lại CI.
- **Failure mode:**
  - EN: A generic OWASP list. Feature flags that cannot be turned off without a deploy. ‘XSS is a backend problem.’
  - VI: List OWASP chung chung. Feature flag không tắt được nếu không deploy. ‘XSS là chuyện backend.’
- **Measure / Cách đo:**
  - EN: The checklist is practical enough to use next week. Security notes are tied to concrete frontend choices.
  - VI: Checklist đủ thực tế để dùng tuần sau. Ghi chú security gắn với lựa chọn frontend cụ thể.
- **Tradeoff / Trade-off:**
  - EN: Third-party tags buy product analytics and cost XSS surface, perf, and a vendor outage in your critical path. Say no, or isolate.
  - VI: Tag third-party mua analytics và trả bề mặt XSS, perf, và outage vendor trên critical path. Nói không, hoặc cô lập.
- **Production gotcha / Gotcha production:**
  - EN: HttpOnly cookies still leave you CSRF-exposed on cookie-auth mutations. `innerHTML` in a Vue `v-html` from a ‘trusted CMS’. Flags that default on in production.
  - VI: Cookie HttpOnly vẫn để bạn hở CSRF trên mutation cookie-auth. `innerHTML` qua `v-html` từ ‘CMS tin cậy’. Flag mặc định bật trên production.

## Done when / Tiêu chí xong

- Release checklist đủ thực tế để dùng ngay tuần sau.
  - EN: The release checklist is practical enough to use next week.
- Ghi chú security đã gắn với lựa chọn frontend cụ thể.
  - EN: Security notes are tied to concrete frontend choices.
- Đã xong buổi mô phỏng live-coding algo.
  - EN: Live-coding algo session is complete.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Add the rollback sentence: what you revert (flag, CDN, or commit) and how long until users are safe.
- **VI:** Thêm câu rollback: bạn revert cái gì (flag, CDN, hay commit) và bao lâu thì user an toàn.

## Algorithm / Thuật toán

- **Problem / Bài:** Live coding simulation / Mô phỏng live coding
- **Constraints / Ràng buộc:**
  - EN:
- Narrate the pattern before typing
  - VI:
- Nói pattern trước khi gõ
- **Hint:** Say the pattern out loud before you type.
  - VI: Nói pattern trước khi gõ.

```text
algorithms/day-24/solution.ts
algorithms/day-24/solution.test.ts
```

Run: `pnpm test:algo -- day-24`

Open the full prompt: [day-24.md](../artifacts/algo/problems/day-24.md)

## Suggested commit

```text
day-24: frontend release checklist and XSS CSRF UI notes
```
