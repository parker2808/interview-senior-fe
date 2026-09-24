# Capstone — Customer Verification Admin Console

**Cách làm:** docs-first trước (flow, AC, contract, checklist). Sau đó spike code nhỏ **Vue + React/TS** (song song từng slice, không làm hai app đầy đủ).

## Phạm vi chức năng

### Customer List
- search, filter status, sort, pagination

### Customer Detail
- view information, verification status, audit information

### Field Config
- list, enable/disable, required/optional, display order, edit label

### Permissions
```text
Viewer | Editor | Admin
```

## UX states bắt buộc
```text
loading | empty | error | success | disabled | permission denied | unsaved changes
```

## Responsive
Định nghĩa rõ desktop / tablet / mobile strategy — không ép mọi màn giống nhau.

## Accessibility (phải test)
```text
keyboard | focus | label | semantic | error announcement
```

## API (tự thiết kế contract)
```text
pagination | filter | sort | validation | error schema | conflict
```

## Automation (tối thiểu)
```text
unit | component | integration | 1 critical E2E
```

## 15 deliverables (nộp trong `docs/artifacts/capstone/`)

| # | Deliverable | File gợi ý |
|---|---|---|
| 01 | User flow | `01-user-flow.md` |
| 02 | Screen design / wireframe | `02-wireframes.md` |
| 03 | Acceptance criteria | `03-acceptance-criteria.md` |
| 04 | Component architecture | `04-component-architecture.md` |
| 05 | State ownership | `05-state-ownership.md` |
| 06 | API contract | `06-api-contract.md` |
| 07 | Error handling matrix | `07-error-matrix.md` |
| 08 | Responsive strategy | `08-responsive-strategy.md` |
| 09 | Accessibility checklist | `09-a11y-checklist.md` |
| 10 | Security checklist | `10-security-checklist.md` |
| 11 | Performance review | `11-performance-review.md` |
| 12 | Automated test plan | `12-test-plan.md` |
| 13 | AI prompt / evidence | `13-ai-evidence.md` |
| 14 | Code review checklist | `14-code-review-checklist.md` |
| 15 | Delivery notes | `15-delivery-notes.md` |

Code spikes (không tính là app production):
- `docs/artifacts/capstone/spikes/vue/` — 1–2 slices
- `docs/artifacts/capstone/spikes/react/` — cùng slice tương đương

Quay lại [Plan 30 ngày](./30-day-study-plan.md).
