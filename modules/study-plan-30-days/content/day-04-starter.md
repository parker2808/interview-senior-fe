# Day 4 — Hướng dẫn (06/10/2026)

**Chủ đề:** TS + Data-heavy table  
**Timebox:** 90–120 phút  
**Mục tiêu:** Type được row model; chiến lược table 500+ rows; list React có key đúng.

## Lý thuyết — học gì hôm nay

- documents/vi/typescript.md — interfaces, unions, generics cơ bản
- documents/vi/performance.md — list virtualization skim
- documents/vi/react.md — lists & keys

> Đọc có chọn lọc (20–25′). Không cần đọc cả file KB — chỉ đúng mục liên quan.

## Thực hành — làm gì hôm nay

### 1) Capstone / FE craft
Spec table Capstone: columns, filter, sort, pagination vs virtualize — chọn 1 approach + lý do.

→ Làm trên tab **Worksheet**: [`artifacts/day-04-data-heavy.md`](./artifacts/day-04-data-heavy.md)

### 2) React / Next lab
Lab: render table 50 rows từ mock data typed bằng TS interface; filter client-side; giải thích key ổn định.

→ Setup & path: tab **Lab setup** [`lab/day-04-lab.md`](./lab/day-04-lab.md)

### 3) Thuật toán
**Group Anagrams** (Medium) · pattern **HashMap + sorted key**

→ Đề đầy đủ: [`artifacts/algo/problems/day-04.md`](./artifacts/algo/problems/day-04.md)  
→ Code + test trong lab repo: `algo/day-04/`

## Checkpoint (tick trước khi mark Day done)

- [ ] Có TS type cho CustomerRow; table React filter được; Group Anagrams đúng.

## Links nhanh

- [Lab repo guide](./lab-repo.md) · [Algorithms track](./algorithms-track.md) · [React/Next track](./react-next-track.md)
