# React / Next.js track — dành cho Vue specialist

**Mục tiêu sau 30 ngày:** Đọc và viết được React + Next App Router ở mức senior-interview: hooks, state ownership, data fetching, RSC vs client, và giải thích được bằng một slice nhỏ đã chạy — không phải bằng một Capstone từ tuần 1.

Đây là **interview prep**, không phải giáo trình phải học hết. Docs và Q&A trong app mở **tab mới**; ở lại trang ngày trên Plan tab.

Code practice (khi có) nằm trong companion lab repo — xem [lab-repo.md](./lab-repo.md). Mỗi ngày mở **Lab** để biết note / snippet / spike của ngày đó.

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

## Nhịp mỗi ngày (25–35′ khi tới tuần React)

1. Đọc KB mục tương ứng (`documents/vi/react.md` · `nextjs.md` · `state-management-react.md`) — mở tab mới
2. **Drill nhỏ:** note so sánh, snippet, hoặc spike Day 21 — không phải product
3. Viết 3–5 dòng “mình hay làm thế nào ở Vue”
4. Checkpoint: giải thích được 1 câu “tại sao React làm vậy” theo decision → constraint → failure → measure

## Tuần focus (khớp PLAN_WEEKS)

| Tuần | Focus |
|---|---|
| 1 · Design system + UI | Tokens, states, a11y, responsive, component APIs. **Chưa** dựng React/Next product. |
| 2 · JS/TS + Vue/Nuxt | Event loop, Promise/AbortController, type models, composable review, Nuxt rendering, state map, perf story. **Không** tiếp tục chuỗi build module Vue. |
| 3 · React + Next | Mental model Vue→React, hooks, effects, App Router, cache/rendering, Server Actions, rồi **một** spike `/customers` nhỏ. |
| 4 · System design + behavioral | Dashboard design, data-heavy trade-offs, security/release, behavioral stories, mock #1. **Không** phải ngày spike Capstone Vue/React. |
| 5 · Review + mock | Company fit + full mock + retrospective. |

Giữ 1 repo lab xuyên tháng nếu đã có; mỗi ngày một note `notes/day-NN.md` hoặc một snippet — đừng `npm create` lại từ đầu mỗi sáng.
