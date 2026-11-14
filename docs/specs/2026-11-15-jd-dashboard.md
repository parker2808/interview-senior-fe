# JD dashboard implementation plan

The existing FDE study pack should remain readable while a new dashboard makes multiple job-description (JD) modules easy to find. For example, a fictional frontend module can appear beside FDE without changing `/fde`.

1. Serve an optional modules index with an FDE fallback.
2. Build `/jd` cards, filters, grouping, and safe Telegram state.
3. Commit A1 before building module routes.
4. Add bilingual tabs and short-answer-first details.
5. Commit A2 before building global search.
6. Reuse FDE search and keyboard utilities across `/search`.
7. Check FDE regression, local fixture build, and 430×932 layout.

## Boundaries

Only listed active modules are returned by the read APIs. A module document path comes from the trusted index, never directly from a user-provided slug; FDE retains its existing endpoint and path. Module pages mark themselves `noindex`. A future edit-mode component may add archive/restore actions; this change adds no mutations. Telegram links require a server-provided opaque start token and configured bot name, so the button is unavailable until a provider exists. Search uses the existing folded bilingual FDE index and must not include archived or unlisted documents. No JD text or CV data enters metadata or URLs.

The upstream UX also sketches comparison and focused cheat routes. This task's explicit A1–A3 scope covers the dashboard, module tabs, and global search; the existing `/fde/cheat-sheet` remains available. Comparisons and module-specific focused cheat routes are future work.
