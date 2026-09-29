# Day 12 — Lab setup

**Mục đích tab này:** hướng dẫn môi trường / folder / lệnh để **làm và push code** cho đúng yêu cầu ngày hôm nay.

Companion repo: xem [lab-repo.md](../lab-repo.md) (một lần setup cho cả tháng).

## 0) Một lần duy nhất (nếu chưa có lab repo)

```bash
# clone repo lab trống của bạn, rồi:
cp -R modules/study-plan-30-days/lab-template/. /path/to/senior-fe-lab/
cd /path/to/senior-fe-lab
npm install
```

Ghi URL lab của bạn:

```text
LAB_REPO=https://github.com/YOUR_USER/senior-fe-lab
```

## 1) Folder làm việc hôm nay

| Phần | Path trong lab repo |
|---|---|
| FE practice | `apps/react/src/days/day-12/` |
| App dev | `apps/react` |
| Algo | `algo/day-12/` |

## 2) Lệnh dev / test

```bash
cd /path/to/senior-fe-lab

# FE lab
npm run dev:react

# Algo — đọc đề ở plan hub trước
# đề: interview-senior-fe/.../artifacts/algo/problems/day-12.md
npm run algo:test:day -- 12
```

## 3) Việc cần code hôm nay

### React / Next / Vue
Lab: cùng data, breakpoint chuyển table→cards (CSS hoặc matchMedia hook).

### Algo — Reverse Linked List
1. Mở đề: [day-12.md](../artifacts/algo/problems/day-12.md)
2. Implement `algo/day-12/solution.ts`
3. Bổ sung test nếu cần trong `solution.test.ts`
4. `npm run algo:test:day -- 12` → xanh

## 4) Commit & push

```bash
git add -A
git commit -m "day-12: Responsive trade-offs"
git push
```

## 5) Quay lại Plan hub

- Điền **Worksheet** (Capstone docs)
- Tick **Checkpoint** trên tab Hướng dẫn
- Đánh dấu Day done

## Troubleshooting

| Triệu chứng | Cách xử lý |
|---|---|
| Chưa có Vite/Next app | Day 6 (hoặc hôm nay) scaffold theo [lab-repo.md](../lab-repo.md) |
| `algo:test:day` fail vì thiếu file | Tạo folder `algo/day-12` + copy stub từ `algo/day-01` |
| Không biết đề ở đâu | Luôn ở plan hub `artifacts/algo/problems/` — không phải trong lab |
