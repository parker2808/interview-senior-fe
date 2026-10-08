# Lessons

- When the user adds scope for a learning plan, immediately fold the new topics into the plan checklist and verify whether supporting Q&A content or links also need updates.
- When a plan should reference existing repo docs, inventory the docs early and treat them as reusable reading material instead of rewriting them by default.
- When another branch is known to be editing shared view files, keep changes outside the overlapping UI region when possible and call out exactly which shared files were touched.
- When a user reports theme-specific regressions from preview screenshots, audit every new surface for hard-coded colors and re-test both themes plus runtime theme switching before closing the PR.
- When rewriting multi-day labs, default to one repo set up once and make each day explicitly build on prior folders, artifacts, and commits instead of repeating setup per day.
