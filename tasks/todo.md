# Rebuild 30-day study plan

## Plan
- [x] Review the current study-plan storage/rendering flow and identify readability issues without touching top navigation
- [x] Map the interview Q&A bank to the new curriculum, including any missing Next.js/App Router topics that need new entries
- [x] Rewrite the full bilingual 30-day plan with a clear 4-week overview + final days, realistic daily load, direct Q&A practice links, hands-on tasks, and done checklists
- [x] Improve the plan page layout/readability only where it helps comprehension and local progress tracking
- [ ] Build the site, manually verify the plan page on desktop and mobile, capture screenshots/video, and open/update a draft PR

## Notes
- Avoid touching the menu bar/navigation because another PR is changing that area concurrently.
- Parker is a senior Vue/Nuxt/TypeScript engineer with no production React; React content must compare against Vue/Nuxt mental models.
- Next.js coverage must be explicit: App Router, RSC vs Client Components, data fetching/caching/revalidation, SSR/SSG/ISR/streaming, Server Actions, middleware, metadata/SEO, image/font optimization, deployment basics, plus a small hands-on task.
- If the Q&A bank lacks matching Next.js questions, add bilingual entries in the existing schema so the plan can link to them.
- Keep per-day load around 2 hours and make the page easy to skim in Vietnamese first while preserving bilingual support.

## Review
- Pending
