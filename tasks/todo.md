# Simplify day detail tabs and rebuild the 30-day lab track

## Plan
- [x] Audit the old Worksheet content and decide what should be kept inside the Plan experience versus removed as redundant
- [x] Remove the Worksheet tab and keep the day page readable on mobile with a cleaner Plan | Lab split
- [x] Rebuild all 30 daily Lab docs around one shared practice repo with explicit reuse, folders, tasks, done-when, stretch goals, hints, and algorithm work
- [x] Verify the updated day page and refreshed Lab content still build and read well on mobile and desktop

## Notes
- The removed Worksheet tab mostly contained prompts, templates, and checklists rather than unique runnable content, so the useful part is now an optional inline artifact link inside the Plan tab.
- The new Lab track assumes one companion monorepo set up once, then reused across all 30 days.
- Mobile readability was the deciding factor for keeping exactly two tabs: Plan for what to review / think through, Lab for the concrete 45-60 minute build.

## Review
- The day detail page now uses **Plan | Lab** only; Worksheet is gone, and its supporting prompt doc is demoted to a lightweight in-Plan artifact link instead of a full tab.
- `lab-repo.md` is now a real Day 0 setup guide for one shared pnpm-workspace monorepo, and all 30 `lab/day-NN-lab.md` files now chain together through that repo instead of repeating setup.
- Verified with `NUXT_IGNORE_LOCK=1 npm run build` plus browser-based checks on `/plan` and `/plan/day/1`, including dark mode and the new two-tab mobile layout.
