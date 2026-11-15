# Edit-mode JD archive and restore handoff

An owner needs to hide an outdated job-description (JD) study module without accidentally deleting it. The web offers Delete and Restore in edit mode, but the bot alone confirms and executes either action. For example, the owner can archive a fictional application and restore it before its seven-day deadline. This change never writes to the content repository.

The lifecycle contract is `jdcv/docs/specs/module-delete-and-archive.md`; the private content shape and reviewed removal are `interview-fe-data/docs/specs/module-archive.md`; the bot commands are `tg-bots/docs/specs/jd-delete-restore.md`. The source plan's delete, user experience and writing sections describe the intended flow. The bot currently supports typed `/jd_delete <slug>` and `/jd_restore <slug>` but **not** an action-specific start payload. Its existing `jd_` token opens a job review, not deletion. The web must not substitute that token for a module action.

## Behavior and boundary

Only a verified edit session receives archived rows or action handoffs. The existing `useEditMode()` gate hides controls in view mode; the server independently checks the edit cookie before returning an action handoff or archived data. Active non-FDE cards and their module pages offer Delete. The edit-only Archived filter lists archived modules with their persisted `purgeAfter` deadline and Restore. FDE cannot be archived or acted on even if a malformed index marks it archived. The active list, global search and direct view-mode module route omit archived content; without `modules/index.json`, FDE remains visible. An archived module is not presented as an ordinary module page even in edit mode; restore happens from the archived list.

The existing `StartTokenProvider` and `telegramHandoff` accept an action. A future secure provider may issue a validated opaque action token, yielding only `https://t.me/<bot>?start=<token>`. Until then, the default provider returns null: show the exact command `/jd_delete <slug>` or `/jd_restore <slug>` and a Copy button, plus a plain bot chat link if the bot username is valid. Without a configured bot username, keep the existing unavailable message but still offer the copyable command. A failed/invalid provider token must fail closed rather than issue a misleading job-review link. No JD or curriculum vitae (CV) text, names, contact details, owner or job identifiers appear in URLs, metadata, link text or logs. The slug is restricted to the existing module route and the copyable command; bot URLs never include it. The web has no mutation endpoint and does not invoke the lifecycle command-line interface (CLI).

## Proposed bot contract (follow-up, not implemented)

The bot could accept `jdd_` and `jdr_` followed by 48 lowercase hexadecimal characters, issued by a private authorized provider and resolved via a private token map. It would re-check owner identity and module state on open, then ask for confirmation. This needs a separate tg-bots change and secure token issuer. Until both exist, web buttons use the copyable command and plain bot chat; the existing `jd_` job-review token must not be reused.

## Acceptance map

| Criterion | Named check |
| --- | --- |
| AC1: View mode has no action controls; edit mode shows Delete for active non-FDE cards and pages only. | `tests/jd-actions.test.ts` and `scripts/check-jd-viewport.mjs` |
| AC2: A valid action token produces exactly the bot start URL; invalid names and tokens never leak module information. | `tests/jd-telegram.test.ts` |
| AC3: Without an issuer, show an exact copyable command and a plain bot link, or the unavailable state. | `tests/jd-actions.test.ts` and `tests/jd-telegram.test.ts` |
| AC4: No web mutation, content write or CLI call exists. | `git diff --name-only origin/main...HEAD` and `rg 'jdcv-module|writeContent|defineEventHandler' server/api/jd` (diff review) |
| AC5: Default dashboard and search exclude archived rows while retaining active rows and FDE. | `tests/jd-api.test.ts` and `tests/jd-list.test.ts` |
| AC6: Only a verified edit session receives archived rows and deadline; direct view-mode access is missing. | `tests/jd-api.test.ts` |
| AC7: Archived cards offer Restore with the action-specific handoff or command fallback. | `tests/jd-actions.test.ts` and `scripts/check-jd-viewport.mjs` |
| AC8: Existing FDE and other features keep working, including fallback without modules. | `npx vitest run` and `JD_VIEWPORT_NO_MODULES=1 PLAYWRIGHT_PACKAGE=<path> node scripts/check-jd-viewport.mjs` |
| AC9: All routes fit a 430×932 iPhone viewport in both modes with reachable controls. | `PLAYWRIGHT_PACKAGE=<path> node scripts/check-jd-viewport.mjs` under the shared lock |
| AC10: No personal information or secrets enter code, URLs, fixtures or logs. | `gitleaks git --no-banner` and diff grep for contact details and `start=` |
| AC11: Spec, both READMEs, bilingual help, context and structure agree on the fallback. | `git diff --check` and documentation diff review |
| AC12: Local gates and every pull-request check pass. | `npx vitest run`, `npm run build`, viewport script, and GitHub Actions `CI` / `context-check` |

Run heavy local checks only after the one-minute load admission and under `lockf ~/.t3/locks/lilp-e2e.lock`. Mobile verification covers `/jd`, `/jd/<slug>`, the archived filter and `/search` at 430×932 in view and edit mode. The build may require the private content pull; record a skipped build honestly if the content source is unavailable.
