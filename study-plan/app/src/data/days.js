/** @typedef {{ day: number, date: string, theme: string, week: number, starter: string, worksheet: string }} DayMeta */

/** @type {DayMeta[]} */
export const DAYS = [
  { day: 1, date: '03/10/2026', theme: 'User flow Product', week: 1, starter: 'day-01-starter.md', worksheet: 'artifacts/day-01-user-flow.md' },
  { day: 2, date: '04/10/2026', theme: 'UI hierarchy critique', week: 1, starter: 'day-02-starter.md', worksheet: 'artifacts/day-02-ui-critique.md' },
  { day: 3, date: '05/10/2026', theme: 'Forms validation', week: 1, starter: 'day-03-starter.md', worksheet: 'artifacts/day-03-form-states.md' },
  { day: 4, date: '06/10/2026', theme: 'Data-heavy table', week: 1, starter: 'day-04-starter.md', worksheet: 'artifacts/day-04-data-heavy.md' },
  { day: 5, date: '07/10/2026', theme: 'Product review + AC', week: 1, starter: 'day-05-starter.md', worksheet: 'artifacts/day-05-product-review.md' },
  { day: 6, date: '08/10/2026', theme: 'Work management', week: 1, starter: 'day-06-starter.md', worksheet: 'artifacts/day-06-work-plan.md' },
  { day: 7, date: '09/10/2026', theme: 'Capstone kickoff + Feature Template', week: 1, starter: 'day-07-starter.md', worksheet: 'artifacts/capstone/00-feature-template.md' },
  { day: 8, date: '10/10/2026', theme: 'Component architecture', week: 2, starter: 'day-08-starter.md', worksheet: 'artifacts/day-08-component-tree.md' },
  { day: 9, date: '11/10/2026', theme: 'State ownership', week: 2, starter: 'day-09-starter.md', worksheet: 'artifacts/day-09-state-map.md' },
  { day: 10, date: '12/10/2026', theme: 'Data flow + TypeScript', week: 2, starter: 'day-10-starter.md', worksheet: 'artifacts/day-10-types-and-flow.md' },
  { day: 11, date: '13/10/2026', theme: 'Empty/error + design system', week: 2, starter: 'day-11-starter.md', worksheet: 'artifacts/day-11-design-primitives.md' },
  { day: 12, date: '14/10/2026', theme: 'Responsive table trade-offs', week: 2, starter: 'day-12-starter.md', worksheet: 'artifacts/day-12-responsive-tradeoffs.md' },
  { day: 13, date: '15/10/2026', theme: 'A11y modal', week: 2, starter: 'day-13-starter.md', worksheet: 'artifacts/day-13-modal-a11y.md' },
  { day: 14, date: '16/10/2026', theme: 'Keyboard review', week: 2, starter: 'day-14-starter.md', worksheet: 'artifacts/day-14-keyboard-result.md' },
  { day: 15, date: '17/10/2026', theme: 'API contract', week: 3, starter: 'day-15-starter.md', worksheet: 'artifacts/day-15-api-contract.md' },
  { day: 16, date: '18/10/2026', theme: 'Error matrix + 401', week: 3, starter: 'day-16-starter.md', worksheet: 'artifacts/day-16-error-matrix.md' },
  { day: 17, date: '19/10/2026', theme: 'FE security', week: 3, starter: 'day-17-starter.md', worksheet: 'artifacts/day-17-security.md' },
  { day: 18, date: '20/10/2026', theme: 'Debug stale UI + race', week: 3, starter: 'day-18-starter.md', worksheet: 'artifacts/day-18-debug-stale-ui.md' },
  { day: 19, date: '21/10/2026', theme: 'Performance', week: 3, starter: 'day-19-starter.md', worksheet: 'artifacts/day-19-performance.md' },
  { day: 20, date: '22/10/2026', theme: 'Bundle + observability', week: 3, starter: 'day-20-starter.md', worksheet: 'artifacts/day-20-observability.md' },
  { day: 21, date: '23/10/2026', theme: 'CI / T-shaped wrap', week: 3, starter: 'day-21-starter.md', worksheet: 'artifacts/day-21-ci-and-adr.md' },
  { day: 22, date: '24/10/2026', theme: 'Test pyramid', week: 4, starter: 'day-22-starter.md', worksheet: 'artifacts/day-22-test-plan.md' },
  { day: 23, date: '25/10/2026', theme: 'Form/API tests (Vue+React)', week: 4, starter: 'day-23-starter.md', worksheet: 'artifacts/day-23-test-snippets-vue-react.md' },
  { day: 24, date: '26/10/2026', theme: 'E2E + CI gates', week: 4, starter: 'day-24-starter.md', worksheet: 'artifacts/day-24-e2e-and-ci.md' },
  { day: 25, date: '27/10/2026', theme: 'AI prompt + review', week: 4, starter: 'day-25-starter.md', worksheet: 'artifacts/day-25-ai-review.md' },
  { day: 26, date: '28/10/2026', theme: 'Code review + AI before/after', week: 4, starter: 'day-26-starter.md', worksheet: 'artifacts/day-26-code-review.md' },
  { day: 27, date: '29/10/2026', theme: 'Capstone Vue spike', week: 4, starter: 'day-27-starter.md', worksheet: 'artifacts/day-27-vue-spike.md' },
  { day: 28, date: '30/10/2026', theme: 'Capstone React spike', week: 4, starter: 'day-28-starter.md', worksheet: 'artifacts/day-28-react-spike.md' },
  { day: 29, date: '31/10/2026', theme: 'DoD + delivery notes', week: 5, starter: 'day-29-starter.md', worksheet: 'artifacts/capstone/15-delivery-notes.md' },
  { day: 30, date: '01/11/2026', theme: 'Mock interview', week: 5, starter: 'day-30-starter.md', worksheet: 'artifacts/day-30-mock-outline.md' },
]

export const RESOURCES = [
  { id: 'plan', label: 'Kế hoạch 30 ngày', path: '30-day-study-plan.md' },
  { id: 'index', label: 'Daily index', path: 'daily-index.md' },
  { id: 'context', label: 'Bối cảnh dự án', path: 'project-context.md' },
  { id: 'capstone', label: 'Capstone brief', path: 'capstone-brief.md' },
  { id: 'feature', label: 'Feature template', path: 'feature-template.md' },
  { id: 'dod', label: 'Definition of Done', path: 'definition-of-done.md' },
  { id: 'selfcheck', label: 'Self-check questions', path: 'self-check-questions.md' },
]

export const WEEK_LABELS = {
  0: 'Tất cả',
  1: 'Tuần 1 · Product',
  2: 'Tuần 2 · Architecture',
  3: 'Tuần 3 · Quality',
  4: 'Tuần 4 · Ship',
  5: 'Tuần 5 · Close',
}

export function getDay(n) {
  return DAYS.find((d) => d.day === n) ?? null
}
