# Companion lab repo — nơi lưu code mỗi ngày

Hub plan (repo này) giữ **lý thuyết + worksheet + đề bài**.  
Code chạy được (React/Next/Vue spike + algo tests) nên nằm ở **repo lab riêng** để bạn commit/push hàng ngày.

## Khuyến nghị cấu trúc (ý tưởng tốt hơn “nhét hết vào Nuxt hub”)

| Cách | Ưu | Nhược | Kết luận |
|---|---|---|---|
| Code trong Nuxt hub | 1 repo | Lẫn với product hub, khó Vite/Next song song | Không nên |
| Nhiều repo rời (mỗi ngày 1) | Tách biệt | Rối, không tái sử dụng | Không nên |
| **1 companion monorepo `senior-fe-lab`** | Đúng “push mỗi ngày”, tách apps, có test algo | Phải clone thêm 1 repo | **Chọn cái này** |

## Tạo repo lab (một lần — Day 1 hoặc Day 6)

```bash
# 1) Tạo repo trống trên GitHub, ví dụ: parker2808/senior-fe-lab
git clone git@github.com:YOUR_USER/senior-fe-lab.git
cd senior-fe-lab

# 2) Bootstrap (copy từ template trong plan hub)
# Từ máy bạn, trong repo interview-senior-fe:
cp -R modules/study-plan-30-days/lab-template/. ../senior-fe-lab/
cd ../senior-fe-lab
npm install
```

Hoặc tự tạo theo cây thư mục:

```text
senior-fe-lab/
├── README.md
├── package.json              # workspaces
├── apps/
│   ├── react/                # Vite React+TS (Day 1–19 labs)
│   ├── next/                 # Next App Router (Day 20+)
│   └── vue-spike/            # Day 27 Capstone Vue
├── algo/
│   ├── day-01/
│   │   ├── solution.ts
│   │   └── solution.test.ts
│   ├── day-02/
│   │   └── ...
│   └── ...
└── notes/                    # optional: mirror worksheet answers
```

## Flow làm việc mỗi ngày (quan trọng)

```text
1. Mở Plan hub → Day N
2. Tab "Hướng dẫn"  → đọc Lý thuyết + Thực hành (checklist)
3. Tab "Worksheet"  → điền Capstone / artifact (docs)
4. Tab "Lab setup"  → làm đúng lệnh setup + biết folder hôm nay
5. Làm bài trong senior-fe-lab:
     - apps/react hoặc apps/next  → practice FE
     - algo/day-NN                → đề nằm ở plan hub, code + test ở lab
6. Commit & push:
     git add -A && git commit -m "day-NN: <theme>" && git push
7. Quay lại Plan hub → tick Checkpoint → đánh dấu Day done
```

**Đề thuật toán ở đâu?**  
Trong plan hub: `artifacts/algo/problems/day-NN.md` (và tab Lab / Algo track).  
**Bạn không copy đề vào lab** — chỉ viết `solution.ts` + test.

## Convention commit

```text
day-01: two-sum + hello react
day-15: api contract + react-query customers
day-28: capstone react spike parity
```

## Link repo của bạn

Điền URL lab vào đây (và vào README lab):

```text
LAB_REPO=https://github.com/YOUR_USER/senior-fe-lab
```

Mỗi file `lab/day-NN-lab.md` sẽ nhắc path trong lab; thay `YOUR_USER` cho khớp.
