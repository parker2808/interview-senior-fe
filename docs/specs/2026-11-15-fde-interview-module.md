# FDE interview module: app contract

AC1. The `/fde` route serves bilingual private-repo content via Nitro, with a hub link and noindex. Verify with local build and rendered route.
AC2. Client-side search ranks title over body, folds Vietnamese accents, supports synonyms, and highlights safe snippets. Verify with unit tests.
AC3. Section and JD filters, language modes, short-first collapsed details, deep links and keyboard search work. Verify on mobile viewport.
AC4. `/fde/cheat-sheet` shows pitch, rescue phrases and interviewer questions at a glance. Verify on mobile viewport.
AC5. The existing data validation and Nuxt tests/build pass. No merge or deployment is authorized.

Data PR merges first, app PR second; no change to PR #27.
