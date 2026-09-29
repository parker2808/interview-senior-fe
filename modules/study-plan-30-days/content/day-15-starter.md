# Day 15 — Hướng dẫn (17/10/2026)

**Chủ đề:** API contract + React Query  
**Timebox:** 90–120 phút  
**Mục tiêu:** Contract GET/PATCH Capstone; fetch với cache/stale policy.

## Lý thuyết — học gì hôm nay

- documents/vi/networking.md
- documents/vi/react.md — data fetching
- documents/vi/nextjs.md — skim fetch

> Đọc có chọn lọc (20–25′). Không cần đọc cả file KB — chỉ đúng mục liên quan.

## Thực hành — làm gì hôm nay

### 1) Capstone / FE craft
Viết contract endpoints List/Detail/Patch + error shape → capstone/06.

→ Làm trên tab **Worksheet**: [`artifacts/day-15-api-contract.md`](./artifacts/day-15-api-contract.md)

### 2) React / Next lab
Lab: dùng @tanstack/react-query (hoặc SWR) load customers mock; loading/error/success states.

→ Setup & path: tab **Lab setup** [`lab/day-15-lab.md`](./lab/day-15-lab.md)

### 3) Thuật toán
**Binary Tree Level Order Traversal** (Medium) · pattern **BFS queue**

→ Đề đầy đủ: [`artifacts/algo/problems/day-15.md`](./artifacts/algo/problems/day-15.md)  
→ Code + test trong lab repo: `algo/day-15/`

## Checkpoint (tick trước khi mark Day done)

- [ ] Contract review được; query lab không race khi remount nhanh; BFS đúng.

## Links nhanh

- [Lab repo guide](./lab-repo.md) · [Algorithms track](./algorithms-track.md) · [React/Next track](./react-next-track.md)
