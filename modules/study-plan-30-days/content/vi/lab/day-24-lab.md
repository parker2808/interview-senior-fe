# Day 24 — Lab

> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## Họ sẽ hỏi gì

CSRF vs XSS — UI đổi gì? Đánh giá third-party script thế nào? Rollout feature frontend với flag và rollback ra sao?

## Bạn sẽ produce gì

- Viết một release checklist ngắn cho một feature frontend: flag, monitoring, rollback, risk từ third-party và điểm cần quan sát sau release.
- Thêm một đoạn ngắn về cách cookie auth, XSS và CSRF ảnh hưởng tới quyết định ở UI.

## Senior làm thế nào

- **Quyết định:** Coi release là một phần của design. Flag + một metric + đường rollback trước khi merge. Ghi chú security phải đổi một lựa chọn UI cụ thể (không `v-html`, cookie flag, CSRF token trên mutation).
- **Constraint:** Checklist + một đoạn. Không phải bộ E2E, không viết lại CI.
- **Failure mode:** List OWASP chung chung. Feature flag không tắt được nếu không deploy. ‘XSS là chuyện backend.’
- **Cách đo:** Checklist đủ thực tế để dùng tuần sau. Ghi chú security gắn với lựa chọn frontend cụ thể.
- **Trade-off:** Tag third-party mua analytics và trả bề mặt XSS, perf, và outage vendor trên critical path. Nói không, hoặc cô lập.
- **Gotcha production:** Cookie HttpOnly vẫn để bạn hở CSRF trên mutation cookie-auth. `innerHTML` qua `v-html` từ ‘CMS tin cậy’. Flag mặc định bật trên production.

## Tiêu chí xong

- Release checklist đủ thực tế để dùng ngay tuần sau.
- Ghi chú security đã gắn với lựa chọn frontend cụ thể.
- Đã xong buổi mô phỏng live-coding algo.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).

## Stretch

Thêm câu rollback: bạn revert cái gì (flag, CDN, hay commit) và bao lâu thì user an toàn.

## Thuật toán

- **Bài:** Mô phỏng live coding
- **Ràng buộc:**
- Nói pattern trước khi gõ
- **Hint:** Nói pattern trước khi gõ.

```text
algorithms/day-24/solution.ts
algorithms/day-24/solution.test.ts
```

Chạy: `pnpm test:algo -- day-24`

Mở đề đầy đủ: [day-24.md](../artifacts/algo/problems/day-24.md)

## Commit gợi ý

```text
day-24: frontend release checklist and XSS CSRF UI notes
```
