# Day 27 — Lab

> Timebox 45-60 minutes. Interview drill, not a product build.  
> Timebox 45-60 phút. Drill phỏng vấn, không phải dựng sản phẩm.

## What they will ask / Họ sẽ hỏi gì

- **EN:** How do you review code? What is your quality bar? How do you handle ambiguity? Which of those answers are still weak — concept, story, or articulation?
- **VI:** Bạn review code thế nào? Quality bar của bạn là gì? Xử lý requirement mơ hồ ra sao? Câu nào vẫn yếu — khái niệm, story, hay diễn đạt?

## What you will produce / Bạn sẽ produce gì

- **EN:** List the 5 questions you still answer weakly and group them by root cause: concept gap, story gap, or articulation gap.
  - **VI:** Liệt kê 5 câu bạn vẫn trả lời yếu và gom nhóm theo root cause: thiếu khái niệm, thiếu story hay diễn đạt chưa rõ.
- **EN:** Pick the top 2 weak spots and do one repair pass each today.
  - **VI:** Chọn 2 điểm yếu lớn nhất và sửa một lượt tập trung cho từng điểm trong hôm nay.

## How a senior works this / Senior làm thế nào

- **Decision / Quyết định:**
  - EN: Triage before more study. Concept gap → reread + one example. Story gap → STAR from a shipped system. Articulation gap → record and cut.
  - VI: Phân loại trước khi học thêm. Thiếu khái niệm → đọc lại + một ví dụ. Thiếu story → STAR từ hệ thống đã ship. Diễn đạt yếu → ghi âm và cắt.
- **Constraint / Ràng buộc:**
  - EN: A weak-spot list plus two repair passes. Not a Vue spike and not a new Next feature.
  - VI: Danh sách điểm yếu cộng hai lượt sửa. Không phải spike Vue và không phải feature Next mới.
- **Failure mode:**
  - EN: A list of 20 topics. Repairing the topic you like instead of the one that would fail the loop. No spoken pass.
  - VI: List 20 chủ đề. Sửa topic bạn thích thay vì topic sẽ trượt vòng. Không có lượt nói.
- **Measure / Cách đo:**
  - EN: A real weak-spot list with priorities, and two spots that got a concrete repair pass.
  - VI: Danh sách điểm yếu thật kèm ưu tiên, và hai điểm đã được sửa một lượt cụ thể.
- **Tradeoff / Trade-off:**
  - EN: Breadth review feels safe and changes nothing. Two deep repairs raise the floor of the mock tomorrow.
  - VI: Ôn rộng thì thấy an toàn và không đổi gì. Hai lượt sửa sâu nâng sàn buổi mock ngày mai.
- **Production gotcha / Gotcha production:**
  - EN: Ambiguity answers that skip the clarifying question. Code-review answers that only mention style. Quality bars with no example of something you rejected.
  - VI: Câu ambiguity bỏ qua câu hỏi làm rõ. Câu code-review chỉ nói style. Quality bar không có ví dụ thứ bạn đã từ chối.

## Done when / Tiêu chí xong

- Đã có danh sách điểm yếu thật kèm thứ tự ưu tiên.
  - EN: A real weak-spot list exists with priorities.
- Hai điểm yếu đã được sửa bằng một lượt ôn tập cụ thể.
  - EN: Two weak spots got a concrete repair pass.
- Đã xong phần flashcard Big-O.
  - EN: Big-O flashcards are complete.
- Giải thích được một trade-off của hôm nay dưới 2 phút (quyết định → constraint → failure → cách đo).
  - EN: You can explain one trade-off from today in under 2 minutes (decision → constraint → failure → measure).

## Stretch / Stretch

- **EN:** Write the clarifying questions you ask in the first 2 minutes of a vague design prompt.
- **VI:** Viết các câu hỏi làm rõ bạn hỏi trong 2 phút đầu của đề design mơ hồ.

## Algorithm / Thuật toán

- **Problem / Bài:** Big-O flashcards / Flashcard Big-O
- **Constraints / Ràng buộc:**
  - EN:
- 10 minutes
  - VI:
- 10′
- **Hint:** Write a 6-row table.
  - VI: Viết bảng 6 dòng.

```text
algorithms/day-27/solution.ts
algorithms/day-27/solution.test.ts
```

Run: `pnpm test:algo -- day-27`

Open the full prompt: [day-27.md](../artifacts/algo/problems/day-27.md)

## Suggested commit

```text
day-27: weak-spot triage and two repair passes
```
