# Fix plan dark mode after PR #20 review

## Plan
- [x] Audit the new study-plan surfaces for hard-coded light-theme colors and identify the dark-mode contrast failures
- [x] Merge the latest `origin/main` after PR #21 and keep the shared AppTopBar behavior intact
- [x] Verify the merged branch in both light and dark mode on desktop and mobile, including runtime theme switching
- [x] Capture before/after dark-mode screenshots, update PR #20, and push the final fix

## Notes
- Parker reported the regression from the Vercel preview on mobile dark mode with Day 01 expanded.
- The main issue was new plan surfaces using `bg-white`, `bg-white/70`, and `bg-white/90`, which bypassed the existing dark-theme variables.
- PR #21 was already merged into `main`; the branch now needs to preserve the new shared AppTopBar behavior while keeping the plan-specific content changes.

## Review
- Replaced the plan-specific hard-coded light surfaces with theme-token surfaces (`bg-surface`, `bg-surface-elevated`) and switched active tabs/buttons to token-based foregrounds.
- Added a custom theme-aware checkbox style so checkboxes render consistently in Safari/iPhone dark mode instead of falling back to an unreadable native square.
- Merged `origin/main`; only `tasks/todo.md` conflicted, while `PlanHome.vue`, `PlanDay.vue`, and `InterviewHome.vue` picked up the new shared top-bar implementation automatically.
- Verified the merged result with `NUXT_IGNORE_LOCK=1 npm run build`, plus browser-based light/dark checks on `/plan` and `/plan/day/18`, including runtime theme switching and mobile dark-mode screenshots against both the pre-fix and post-fix versions.
