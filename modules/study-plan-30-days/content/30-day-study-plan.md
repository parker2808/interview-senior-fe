# Kế hoạch ôn 30 ngày — bản rõ ràng, dễ đi từng ngày

**Lịch:** Day 1 = **03/10/2026** → Day 30 = **01/11/2026**  
**Nhịp mỗi ngày:** khoảng **90–120 phút**  
**Source of truth:** xem **Plan homepage** để mở từng ngày theo tuần, link sang docs và Q&A trực tiếp.

---

## Dùng plan này như thế nào?

Mỗi ngày trong app giờ có cùng một cấu trúc:

1. **Mục tiêu ngắn** — biết hôm nay đang ôn để làm gì
2. **Read / review** — link sang tài liệu FE có sẵn trong `documents/`
3. **Practice Q&A** — link thẳng tới câu hỏi phỏng vấn liên quan
4. **Hands-on nhỏ** — đủ thực tế để nói lại trong phỏng vấn
5. **1 bài thuật toán** — liều lượng nhẹ nhưng đều
6. **Checklist hoàn thành** — giúp biết lúc nào đủ để dừng

> Nếu bị thiếu thời gian: ưu tiên **docs + Q&A + 1 hands-on + 1 algo**. Không cần làm quá nhiều trong một ngày.

---

## Tổng quan 4 tuần + những ngày cuối

### Tuần 1 · Design system + UI rõ ràng

**Mục tiêu:** ôn lại cách nhìn giao diện ở mức senior: primitive, state, responsive, accessibility.  
**Kết quả mong muốn:** không còn cảm giác “UI nhìn được là xong”, mà biết giải thích vì sao một màn hình dễ hiểu, dễ dùng và maintain hơn.

**Các ngày chính:**

- Day 01 — Kiểm kê hệ thống UI
- Day 02 — Làm cho UI state dễ đọc
- Day 03 — Form dễ dùng và accessible
- Day 04 — Responsive cho UI nhiều dữ liệu
- Day 05 — Review tương tác theo hướng keyboard-first
- Day 06 — Thiết kế API component với TypeScript
- Day 07 — Mini redesign để chốt tuần 1

### Tuần 2 · Ôn JS/TS + Vue/Nuxt

**Mục tiêu:** siết lại phần nền tảng Parker đã có kinh nghiệm production để trả lời phỏng vấn gọn và sắc hơn.  
**Kết quả mong muốn:** JavaScript, TypeScript, Vue và Nuxt đều quay về mức “giải thích được rõ ràng dưới áp lực”.

**Các ngày chính:**

- Day 08 — Execution model của JavaScript
- Day 09 — Promise, fetch và event trong browser
- Day 10 — TypeScript cho model frontend thực tế
- Day 11 — Vue reactivity và composable
- Day 12 — Rendering và data fetching trong Nuxt
- Day 13 — State ownership, Pinia và cache boundary
- Day 14 — Review performance và debugging

### Tuần 3 · React + Next.js theo góc nhìn Vue

**Mục tiêu:** học React/Next theo mental model chuyển từ Vue/Nuxt, không bluff production depth nhưng vẫn nói chuyện framework rất chắc tay.  
**Kết quả mong muốn:** giải thích được hooks, state, effects, App Router, Server vs Client Components, cache/revalidation, SSR/SSG/ISR/streaming, Server Actions, middleware, SEO và deployment basics.

**Các ngày chính:**

- Day 15 — Mental model React cho người đi từ Vue
- Day 16 — State, ref và controlled input trong React
- Day 17 — Effect, cleanup async và error boundary
- Day 18 — App Router, layout, loading và error
- Day 19 — Data fetching, cache và rendering mode của Next
- Day 20 — Server Actions, middleware, SEO và tối ưu asset
- Day 21 — Hands-on nhỏ với Next.js

### Tuần 4 · Gắn system design với behavioral

**Mục tiêu:** nối technical depth với system design, delivery và storytelling.  
**Kết quả mong muốn:** không chỉ trả lời “đúng”, mà trả lời như một senior hiểu trade-off, product impact và team impact.

**Các ngày chính:**

- Day 22 — Thiết kế một admin dashboard
- Day 23 — Bề mặt nhiều dữ liệu và trade-off performance
- Day 24 — Security, release và resilience
- Day 25 — Behavioral: giới thiệu, impact, seniority
- Day 26 — Behavioral: project, trade-off và khoảng trống React
- Day 27 — Review chéo giữa stack và lỗ hổng còn lại
- Day 28 — Mock round #1

### Những ngày cuối · Review + mock interview

**Mục tiêu:** chốt company fit, growth story, điểm mạnh/điểm yếu và chạy mock hoàn chỉnh.  
**Các ngày:**

- Day 29 — Review cuối và company fit
- Day 30 — Full mock interview + retrospective

---

## Tài nguyên nên dùng kèm

- [Daily index](./daily-index.md)
- [React / Next track](./react-next-track.md)
- [Algorithms track](./algorithms-track.md)
- [Project context](./project-context.md)
- [Feature template](./feature-template.md)
- [Definition of Done](./definition-of-done.md)
- [Self-check questions](./self-check-questions.md)
- [Companion lab repo](./lab-repo.md)

---

## Ghi chú về khoảng trống nội dung

- Trong `documents/` chưa có một tài liệu design system riêng biệt, nên phần design system của plan sẽ cố ý ghép **architecture + CSS layout + accessibility + Q&A**.
- Phần thuật toán nằm ở **study-plan resources** chứ không nằm trong bộ docs chung.
- Tài liệu Next.js tổng quát đã đủ tốt để đọc nền, còn phần **App Router / cache / Server Actions / middleware / deployment basics** sẽ được nhấn mạnh thêm bằng Q&A và task hands-on trong tuần 3.

---

## Done sau Day 30 nếu plan đi đúng hướng

- [ ] Giải thích được tuần nào ôn gì và vì sao
- [ ] Có 1-2 story behavioral nghe chắc tay và trung thực
- [ ] Có 1 task Next.js nhỏ chạy được để nói về App Router bằng trải nghiệm thật
- [ ] Duy trì được nhịp 1 bài thuật toán mỗi ngày hoặc gần như mỗi ngày
- [ ] Biết rõ phần nào của React/Next mình hiểu, phần nào chưa có production depth để không bluff
