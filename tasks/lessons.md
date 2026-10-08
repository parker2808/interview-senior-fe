# Lessons

- When the user adds scope for a learning plan, immediately fold the new topics into the plan checklist and verify whether supporting Q&A content or links also need updates.
- When a plan should reference existing repo docs, inventory the docs early and treat them as reusable reading material instead of rewriting them by default.
- When another branch is known to be editing shared view files, keep changes outside the overlapping UI region when possible and call out exactly which shared files were touched.
- When a user reports theme-specific regressions from preview screenshots, audit every new surface for hard-coded colors and re-test both themes plus runtime theme switching before closing the PR.
- When rewriting multi-day labs, default to one repo set up once and make each day explicitly build on prior folders, artifacts, and commits instead of repeating setup per day.
- When retiring old plan material, remove it from the plan data, quick-resource UI, and routes together, then check for now-unused markdown files before deleting them.
- When generated plan content starts showing both languages inline, split it into locale-specific files or locale-keyed data and route it through the same locale selection mechanism the app already uses.
