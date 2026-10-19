# Hide retired Lab content

## Plan
- [x] Hide Lab tab when `lab` is missing or `lab.sections` is empty; keep Plan as the only tab
- [x] Hide Lab setup CTA and Lab quick-resource links on the plan overview
- [x] Make `lab` optional in types; empty `lab.sections` valid in `scripts/validate-content.mjs`
- [x] Keep progress (day number) and Plan-tab `studyLinks` / `algorithm`
- [x] Fixtures + tests for empty-sections and no-`lab` days
- [x] Lint, typecheck, tests, fixture-backed build
- [ ] Draft PR

## Review
- Day page: Lab tab omitted when `lab` is missing or `lab.sections` is empty. Plan tab stays as the only tab. Plan-tab `studyLinks` and `algorithm` still render. No Lab empty-state.
- Plan overview: Day 0 lab setup card and Lab quick-resource buttons hidden when `hasLab` is false (no day has lab sections).
- Validator/types: `lab` optional; empty `lab.sections` allowed; `algorithm` still required.
- Progress: still keyed by day number (unchanged codec).
- Tests: `tests/plan-lab.test.ts` plus fixture tree (day 1 empty sections, day 2 no `lab`). Optional real-content suite no longer crashes when `.data/content` is missing.
- Verify: no `lint` script. `nuxi typecheck` — our files clean; one pre-existing `scrollTop` error in `use-hide-on-scroll-bar.composable.ts`. `npm test` 23 passed / 3 skipped. Fixture `data:validate` OK. `CONTENT_LOCAL_PATH=.data/fixture-content npm run build` OK. Live SSR: `/plan`, `/plan/day/1`, `/plan/day/2` 200; only Plan tab; Lab nav/setup gone; algorithm + JS study link present.
