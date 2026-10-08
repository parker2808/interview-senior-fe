export type DayMeta = {
  day: number
  date: string
  theme: string
  week: number
  starter: string
  worksheet: string
  lab: string
}

export type PlanResource = {
  id: string
  label: string
  path: string
}

export const DAYS: DayMeta[] = [
  { day: 1, date: '03/10/2026', theme: 'JS core + User flow', week: 1, starter: 'day-01-starter.md', worksheet: 'artifacts/day-01-user-flow.md', lab: 'lab/day-01-lab.md' },
  { day: 2, date: '04/10/2026', theme: 'this/event loop + UI critique', week: 1, starter: 'day-02-starter.md', worksheet: 'artifacts/day-02-ui-critique.md', lab: 'lab/day-02-lab.md' },
  { day: 3, date: '05/10/2026', theme: 'Promises + Forms', week: 1, starter: 'day-03-starter.md', worksheet: 'artifacts/day-03-form-states.md', lab: 'lab/day-03-lab.md' },
  { day: 4, date: '06/10/2026', theme: 'TS + Data-heavy table', week: 1, starter: 'day-04-starter.md', worksheet: 'artifacts/day-04-data-heavy.md', lab: 'lab/day-04-lab.md' },
  { day: 5, date: '07/10/2026', theme: 'Product AC + custom hooks', week: 1, starter: 'day-05-starter.md', worksheet: 'artifacts/day-05-product-review.md', lab: 'lab/day-05-lab.md' },
  { day: 6, date: '08/10/2026', theme: 'Work management + React lab setup', week: 1, starter: 'day-06-starter.md', worksheet: 'artifacts/day-06-work-plan.md', lab: 'lab/day-06-lab.md' },
  { day: 7, date: '09/10/2026', theme: 'Capstone kickoff + composition', week: 1, starter: 'day-07-starter.md', worksheet: 'artifacts/capstone/00-feature-template.md', lab: 'lab/day-07-lab.md' },
  { day: 8, date: '10/10/2026', theme: 'Component architecture', week: 2, starter: 'day-08-starter.md', worksheet: 'artifacts/day-08-component-tree.md', lab: 'lab/day-08-lab.md' },
  { day: 9, date: '11/10/2026', theme: 'State ownership', week: 2, starter: 'day-09-starter.md', worksheet: 'artifacts/day-09-state-map.md', lab: 'lab/day-09-lab.md' },
  { day: 10, date: '12/10/2026', theme: 'Data flow + TypeScript', week: 2, starter: 'day-10-starter.md', worksheet: 'artifacts/day-10-types-and-flow.md', lab: 'lab/day-10-lab.md' },
  { day: 11, date: '13/10/2026', theme: 'Design system primitives', week: 2, starter: 'day-11-starter.md', worksheet: 'artifacts/day-11-design-primitives.md', lab: 'lab/day-11-lab.md' },
  { day: 12, date: '14/10/2026', theme: 'Responsive trade-offs', week: 2, starter: 'day-12-starter.md', worksheet: 'artifacts/day-12-responsive-tradeoffs.md', lab: 'lab/day-12-lab.md' },
  { day: 13, date: '15/10/2026', theme: 'A11y modal', week: 2, starter: 'day-13-starter.md', worksheet: 'artifacts/day-13-modal-a11y.md', lab: 'lab/day-13-lab.md' },
  { day: 14, date: '16/10/2026', theme: 'Keyboard review + week pack', week: 2, starter: 'day-14-starter.md', worksheet: 'artifacts/day-14-keyboard-result.md', lab: 'lab/day-14-lab.md' },
  { day: 15, date: '17/10/2026', theme: 'API contract + React Query', week: 3, starter: 'day-15-starter.md', worksheet: 'artifacts/day-15-api-contract.md', lab: 'lab/day-15-lab.md' },
  { day: 16, date: '18/10/2026', theme: 'Error matrix + Error Boundary', week: 3, starter: 'day-16-starter.md', worksheet: 'artifacts/day-16-error-matrix.md', lab: 'lab/day-16-lab.md' },
  { day: 17, date: '19/10/2026', theme: 'FE security', week: 3, starter: 'day-17-starter.md', worksheet: 'artifacts/day-17-security.md', lab: 'lab/day-17-lab.md' },
  { day: 18, date: '20/10/2026', theme: 'Race conditions + AbortController', week: 3, starter: 'day-18-starter.md', worksheet: 'artifacts/day-18-debug-stale-ui.md', lab: 'lab/day-18-lab.md' },
  { day: 19, date: '21/10/2026', theme: 'Performance + React memo', week: 3, starter: 'day-19-starter.md', worksheet: 'artifacts/day-19-performance.md', lab: 'lab/day-19-lab.md' },
  { day: 20, date: '22/10/2026', theme: 'Observability + Next App Router', week: 3, starter: 'day-20-starter.md', worksheet: 'artifacts/day-20-observability.md', lab: 'lab/day-20-lab.md' },
  { day: 21, date: '23/10/2026', theme: 'CI + Next data caching', week: 3, starter: 'day-21-starter.md', worksheet: 'artifacts/day-21-ci-and-adr.md', lab: 'lab/day-21-lab.md' },
  { day: 22, date: '24/10/2026', theme: 'Test pyramid + RTL', week: 4, starter: 'day-22-starter.md', worksheet: 'artifacts/day-22-test-plan.md', lab: 'lab/day-22-lab.md' },
  { day: 23, date: '25/10/2026', theme: 'Form/API tests Vue+React', week: 4, starter: 'day-23-starter.md', worksheet: 'artifacts/day-23-test-snippets-vue-react.md', lab: 'lab/day-23-lab.md' },
  { day: 24, date: '26/10/2026', theme: 'E2E + coding interview sim', week: 4, starter: 'day-24-starter.md', worksheet: 'artifacts/day-24-e2e-and-ci.md', lab: 'lab/day-24-lab.md' },
  { day: 25, date: '27/10/2026', theme: 'AI-assisted + Server Actions', week: 4, starter: 'day-25-starter.md', worksheet: 'artifacts/day-25-ai-review.md', lab: 'lab/day-25-lab.md' },
  { day: 26, date: '28/10/2026', theme: 'Code review + Next Capstone page', week: 4, starter: 'day-26-starter.md', worksheet: 'artifacts/day-26-code-review.md', lab: 'lab/day-26-lab.md' },
  { day: 27, date: '29/10/2026', theme: 'Capstone Vue spike', week: 4, starter: 'day-27-starter.md', worksheet: 'artifacts/day-27-vue-spike.md', lab: 'lab/day-27-lab.md' },
  { day: 28, date: '30/10/2026', theme: 'Capstone React/Next spike', week: 4, starter: 'day-28-starter.md', worksheet: 'artifacts/day-28-react-spike.md', lab: 'lab/day-28-lab.md' },
  { day: 29, date: '31/10/2026', theme: 'DoD + delivery notes', week: 5, starter: 'day-29-starter.md', worksheet: 'artifacts/capstone/15-delivery-notes.md', lab: 'lab/day-29-lab.md' },
  { day: 30, date: '01/11/2026', theme: 'Full mock interview', week: 5, starter: 'day-30-starter.md', worksheet: 'artifacts/day-30-mock-outline.md', lab: 'lab/day-30-lab.md' },
]

export const PLAN_RESOURCES: PlanResource[] = [
  { id: 'plan', label: 'Tổng quan 30 ngày', path: '30-day-study-plan.md' },
  { id: 'index', label: 'Daily index', path: 'daily-index.md' },
  { id: 'lab', label: 'Companion lab repo', path: 'lab-repo.md' },
  { id: 'react', label: 'React/Next track', path: 'react-next-track.md' },
  { id: 'algo', label: 'Algorithms track', path: 'algorithms-track.md' },
  { id: 'context', label: 'Bối cảnh dự án', path: 'project-context.md' },
  { id: 'feature', label: 'Feature template', path: 'feature-template.md' },
  { id: 'dod', label: 'Definition of Done', path: 'definition-of-done.md' },
  { id: 'selfcheck', label: 'Self-check questions', path: 'self-check-questions.md' },
]

export const WEEK_LABELS: Record<number, string> = {
  0: 'Tất cả',
  1: 'Tuần 1 · Foundations',
  2: 'Tuần 2 · Architecture',
  3: 'Tuần 3 · Quality + Next',
  4: 'Tuần 4 · Test + Spikes',
  5: 'Tuần 5 · Close',
}

export function getDay(n: number): DayMeta | null {
  return DAYS.find((d) => d.day === n) ?? null
}
