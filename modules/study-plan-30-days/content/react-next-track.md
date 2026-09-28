# React / Next.js track — dành cho Vue specialist

**Mục tiêu sau 30 ngày:** Đọc và viết được React + Next App Router ở mức senior-interview: giải thích được lifecycle/hooks, state ownership, data fetching, RSC vs client, và code được 1 slice Capstone bằng React/Next.

## Bản đồ tư duy Vue → React

| Vue | React / Next |
|---|---|
| `ref` / `reactive` | `useState` / `useReducer` |
| `computed` | `useMemo` (cẩn thận: không phải computed tự động) |
| `watch` / `watchEffect` | `useEffect` (+ cleanup) |
| `v-model` | controlled input (`value` + `onChange`) |
| props / emit | props / callbacks |
| slots | `children` / render props / composition |
| `provide` / `inject` | Context |
| Pinia | Zustand / Redux Toolkit / Context+hooks |
| Vue Router | Next App Router / React Router |
| Nuxt server routes / `useFetch` | Route Handlers / `fetch` + cache / React Query |
| VTU | React Testing Library |

## Nhịp mỗi ngày (25–35′)

1. Đọc KB mục tương ứng (`documents/vi/react.md` · `nextjs.md` · `state-management-react.md`)
2. **Lab nhỏ chạy được** (Vite React+TS hoặc Next app riêng — không nhét vào Nuxt hub)
3. Viết 3–5 dòng so sánh “mình hay làm thế nào ở Vue”
4. Checkpoint: giải thích được 1 câu “tại sao React làm vậy”

## Setup đề xuất (Day 6)

```bash
# Lab React thuần
npm create vite@latest fe-react-lab -- --template react-ts

# Lab Next (từ tuần 3)
npx create-next-app@latest fe-next-lab
```

Giữ 1 repo lab xuyên tháng; mỗi ngày 1 folder `day-NN/` hoặc 1 route.

## Tuần focus

| Tuần | Focus React/Next |
|---|---|
| 1 | Mental model, hooks cơ bản, lists, forms controlled |
| 2 | Composition, Context, custom hooks, a11y portal |
| 3 | Data fetching, error boundary, memo, **Next App Router + caching** |
| 4 | RTL tests, Server Actions, Capstone spike React/Next |
