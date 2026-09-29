# Day 18 — Hướng dẫn (20/10/2026)

**Chủ đề:** Race conditions + AbortController  
**Timebox:** 90–120 phút  
**Mục tiêu:** Biết stale response; cleanup useEffect đúng.

## Lý thuyết — học gì hôm nay

- documents/vi/javascript.md — abort/race
- documents/vi/react.md — useEffect cleanup

> Đọc có chọn lọc (20–25′). Không cần đọc cả file KB — chỉ đúng mục liên quan.

## Thực hành — làm gì hôm nay

### 1) Capstone / FE craft
Viết investigation log “search race”: reproduce, root cause, fix (ignore stale / abort / seq id).

→ Làm trên tab **Worksheet**: [`artifacts/day-18-debug-stale-ui.md`](./artifacts/day-18-debug-stale-ui.md)

### 2) React / Next lab
Lab: search-as-you-type với AbortController; verify request cũ bị abort khi gõ tiếp.

→ Setup & path: tab **Lab setup** [`lab/day-18-lab.md`](./lab/day-18-lab.md)

### 3) Thuật toán
**Number of Islands** (Medium) · pattern **Grid BFS/DFS**

→ Đề đầy đủ: [`artifacts/algo/problems/day-18.md`](./artifacts/algo/problems/day-18.md)  
→ Code + test trong lab repo: `algo/day-18/`

## Checkpoint (tick trước khi mark Day done)

- [ ] Có fix pattern ghi trong Capstone notes; lab abort hoạt động; Islands OK.

## Links nhanh

- [Lab repo guide](./lab-repo.md) · [Algorithms track](./algorithms-track.md) · [React/Next track](./react-next-track.md)
