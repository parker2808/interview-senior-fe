# Graph Report - interview-senior-fe  (2026-11-01)

## Corpus Check
- 275 files · ~61,910 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 4, .example 1, .css 1)

## Summary
- 1562 nodes · 3103 edges · 121 communities (75 shown, 46 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 53 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7cb44681`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- md-to-blocks.mjs
- plan-lab.test.ts
- DocReaderPage.vue
- kb-search-core.util.ts
- sessionCookie.ts
- index.ts
- InterviewHome.vue
- contentStore.ts
- practice-readers.test.ts
- PracticeStep.vue
- useProgress
- pickLocale
- DesignGallery.vue
- DocToc.vue
- PracticeDesign.vue
- steps
- qa-search.util.ts
- BlockRenderer.vue
- PlanDay.vue
- validate-content.mjs
- spec-ref.util.ts
- react/package.json
- toAuthApiError
- steps
- PracticeHome.vue
- AppTopBar.vue
- content-links.util.ts
- interview-auth.test.ts
- usePracticeProgress
- PlanHome.vue
- dependencies
- steps
- DayList.vue
- use-interview-unlock.composable.ts
- DesignLightbox.vue
- steps
- MilestoneList.vue
- DesignSpec.vue
- algo/package.json
- LocaleToggle.vue
- steps
- ResourceDoc.vue
- useInterviewUnlock
- Senior FE Interview Prep
- scripts
- PlanRoute
- ThemeToggle.vue
- PROJECT_CONTEXT — interview-senior-fe (Nuxt 3 app)
- practice-design.test.ts
- DayDetail.vue
- ScrollToTop.vue
- scripts
- package.json
- 🎯 **HIGH PRIORITY** (Must Know)
- use-plan-index.composable.ts
- AppDetailShell.vue
- ProgressTools.vue
- [id].vue
- tsconfig.json
- ref_vitest
- AppRoute
- InterviewPinGate.vue
- EditGateModal.vue
- vercel.json
- router.options.ts
- day-01/solution.ts
- PlanDayContent.vue
- validate.mjs
- day-02/solution.test.ts
- day-03/solution.test.ts
- day-04/solution.test.ts
- day-05/solution.test.ts
- day-06/solution.test.ts
- day-07/solution.test.ts
- day-08/solution.test.ts
- day-09/solution.test.ts
- day-10/solution.test.ts
- day-11/solution.test.ts
- day-12/solution.test.ts
- day-13/solution.test.ts
- day-14/solution.test.ts
- day-15/solution.test.ts
- day-16/solution.test.ts
- day-17/solution.test.ts
- day-18/solution.test.ts
- day-19/solution.test.ts
- day-20/solution.test.ts
- day-21/solution.test.ts
- day-22/solution.test.ts
- day-23/solution.test.ts
- day-24/solution.test.ts
- day-25/solution.test.ts
- day-26/solution.test.ts
- day-27/solution.test.ts
- day-28/solution.test.ts
- day-29/solution.test.ts
- day-30/solution.test.ts
- repository
- autolink-md.util.ts
- context-check.sh
- pick-locale.util.ts
- use-practice-progress.composable.ts
- ref_node_fs
- useHideOnScrollBar
- useEditMode
- interview-fe-data
- senior-fe-lab
- use-hide-on-scroll-bar.composable.ts
- Split-pane layout: one scrollbar per pane, sticky nav
- CHANGELOG_ARCHIVE.md
- next/README.md
- react/README.md
- vue-spike/README.md
- study-plan-30-days/README.md
- lessons.md

## God Nodes (most connected - your core abstractions)
1. `pickLocale()` - 35 edges
2. `usePracticeProgress()` - 29 edges
3. `useProgress()` - 28 edges
4. `useInterviewUnlock()` - 20 edges
5. `splitSearchKeywords()` - 20 edges
6. `toAuthApiError()` - 19 edges
7. `foldSearchText()` - 18 edges
8. `isPracticeStepId()` - 15 edges
9. `useEditMode()` - 14 edges
10. `scripts` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Editing` --references--> `text()`  [INFERRED]
  scripts/data-repo-seed/README.md → src/modules/content/components/BlockRenderer/BlockRenderer.vue
- `normalizePayload()` --calls--> `isPracticeStepId()`  [EXTRACTED]
  server/api/practice/progress.ts → src/modules/practice/utils/practice-id.util.ts
- `readPlanIndex()` --calls--> `stripPlanIndexDates()`  [EXTRACTED]
  server/utils/contentStore.ts → src/modules/content/utils/plan-dates.util.ts
- `readPlanDay()` --calls--> `stripPlanDayDates()`  [EXTRACTED]
  server/utils/contentStore.ts → src/modules/content/utils/plan-dates.util.ts
- `readPracticeIndex()` --calls--> `isPracticeStepId()`  [EXTRACTED]
  server/utils/contentStore.ts → src/modules/practice/utils/practice-id.util.ts

## Import Cycles
- None detected.

## Communities (121 total, 46 thin omitted)

### Community 0 - "md-to-blocks.mjs"
Cohesion: 0.08
Nodes (52): copyStaticSeedFiles(), DOC_GROUPS, DOC_TITLES, exportDays(), exportKnowledgeBase(), exportQna(), exportResources(), firstHeading() (+44 more)

### Community 1 - "plan-lab.test.ts"
Cohesion: 0.06
Nodes (56): day, r, copyLocal(), copyOptionalDesign(), copySpecIfPresent(), dest, downloadRepo(), fail() (+48 more)

### Community 2 - "DocReaderPage.vue"
Cohesion: 0.05
Nodes (50): lang, { locale }, query, route, known, lang, route, slug (+42 more)

### Community 3 - "kb-search-core.util.ts"
Cohesion: 0.06
Nodes (65): readContentJson(), readKnowledgeCatalog(), readKnowledgeDoc(), buildSearchIndex(), getKbSearchIndex(), searchKnowledgeBase(), SearchRecord, KnowledgeDoc (+57 more)

### Community 4 - "sessionCookie.ts"
Cohesion: 0.09
Nodes (42): assertWriteAuth(), normalizePayload(), assertWriteAuth(), readInterviewBank(), b64url(), EDIT_TOKEN_TTL_MS, fromB64url(), isSixDigitPasscode() (+34 more)

### Community 5 - "index.ts"
Cohesion: 0.09
Nodes (40): CalloutBlock, CalloutKind, CodeBlock, ContentBlock, ContentSection, ExampleBlock, FollowUpsBlock, HeadingBlock (+32 more)

### Community 6 - "InterviewHome.vue"
Cohesion: 0.08
Nodes (34): interviewPathForQuestion(), questionExists(), questionIdFromHash(), questionIdFromQuery(), requestedQuestionId(), withQuestionQuery(), filterInterviewQuestions(), QA_SESSION_BOOT_TIMEOUT_MS (+26 more)

### Community 7 - "contentStore.ts"
Cohesion: 0.10
Nodes (23): ROOT, adjacentDocs(), DISK_ROOT, fromDisk(), fromDiskText(), hasPracticeDesign(), listResourceIds(), planHasLab() (+15 more)

### Community 8 - "practice-readers.test.ts"
Cohesion: 0.18
Nodes (19): isPracticeStepId(), PRACTICE_STEP_COUNT, PRACTICE_STEP_ID_RE, practiceStepIdFromOrder(), practiceStepOrder(), indexFromMetaAndSteps(), listStepFiles(), loadPracticeIndexFromDir() (+11 more)

### Community 9 - "PracticeStep.vue"
Cohesion: 0.12
Nodes (19): PracticeDesignPayload, PracticeIndex, practiceStepHref(), usePracticeDesign(), usePracticeDesignAvailable(), usePracticeIndex(), usePracticeStep(), usePracticeSteps() (+11 more)

### Community 10 - "useProgress"
Cohesion: 0.13
Nodes (26): localDoneMap, parseShareFromLocation(), publicMeta, source, statusMessage, useProgress(), applyShareFromUrl(), buildShareUrl() (+18 more)

### Community 11 - "pickLocale"
Cohesion: 0.18
Nodes (18): prepared, tocFromSections(), filterBlocks(), isTocHeadingText(), localizedIds(), prepareReadableSections(), stripTocFromMarkdown(), pickLocale() (+10 more)

### Community 12 - "DesignGallery.vue"
Cohesion: 0.18
Nodes (10): PracticeDesignGroup, PracticeDesignTheme, emit, filtered, group, lang, { locale }, open() (+2 more)

### Community 13 - "DocToc.vue"
Cohesion: 0.12
Nodes (21): applyIds(), collapseAll(), emit, expandAll(), expanded, props, revealActive(), tree (+13 more)

### Community 14 - "PracticeDesign.vue"
Cohesion: 0.09
Nodes (20): practiceDesignFigma(), pickSpecMarkdown(), figma, lang, lightboxIndex, lightboxOpen, { locale, t }, navOpen (+12 more)

### Community 15 - "steps"
Cohesion: 0.07
Nodes (29): runs-on, steps, timeout-minutes, concurrency, cancel-in-progress, group, CONTENT_REPO_TOKEN, GITHUB_TOKEN (+21 more)

### Community 16 - "qa-search.util.ts"
Cohesion: 0.14
Nodes (20): answerHtml, exampleHtml, md(), props, grouped, listRef, props, answerHtml (+12 more)

### Community 17 - "BlockRenderer.vue"
Cohesion: 0.14
Nodes (23): emit, html(), md(), props, text(), itemHtml(), itemsOf(), props (+15 more)

### Community 18 - "PlanDay.vue"
Cohesion: 0.12
Nodes (21): planResourceHref(), docsHref(), openInNewTab(), dayNumber, navOpen, openDoc(), openDocs(), props (+13 more)

### Community 19 - "validate-content.mjs"
Cohesion: 0.16
Nodes (22): categories, dayDir, dayFiles, errors, expectedSpecAnchor(), fail(), kbDir, kbFiles (+14 more)

### Community 20 - "spec-ref.util.ts"
Cohesion: 0.18
Nodes (19): hitIds, rendered, hrefFor(), props, decodeBasicEntities(), headingMatchesSection(), headingSpecAnchorId(), headingTextFromLine() (+11 more)

### Community 21 - "react/package.json"
Cohesion: 0.10
Nodes (25): dependencies, react@^19.0.0, react-dom@^19.0.0, devDependencies, @types/react@^19.0.0, @types/react-dom@^19.0.0, typescript@^5.8.0, vite@^6.0.0 (+17 more)

### Community 22 - "toAuthApiError"
Cohesion: 0.25
Nodes (12): AUTH_I18N_KEY, AuthApiError, AuthErrorCode, KNOWN_CODES, parseApiErrorCode(), parseApiErrorMessage(), stringFromUnknown(), toAuthApiError() (+4 more)

### Community 23 - "steps"
Cohesion: 0.11
Nodes (18): if, runs-on, steps, BASE, HEAD, jobs, context, name (+10 more)

### Community 24 - "PracticeHome.vue"
Cohesion: 0.15
Nodes (11): continueStep(), filteredSteps, lang, { locale }, notFound, openStep(), query, retrying (+3 more)

### Community 25 - "AppTopBar.vue"
Cohesion: 0.25
Nodes (7): emit, { isVisible, onFocusIn, onFocusOut }, measuredHeight, props, rootRef, spacerHeight, updateHeight()

### Community 26 - "content-links.util.ts"
Cohesion: 0.17
Nodes (13): classifyContentHref(), ContentHref, classifyKbHref(), GITHUB_BLOB_MAIN, KbHrefResult, normalizeDocPath(), classifyMarkdownHref(), GITHUB_BLOB_MAIN (+5 more)

### Community 27 - "interview-auth.test.ts"
Cohesion: 0.20
Nodes (13): clearInterviewToken(), INTERVIEW_TOKEN_STORAGE_KEY, interviewAuthHeaders(), isInterviewTokenStorageKey(), memoryTokenStorage(), TokenStorage, writeInterviewToken(), onStorage() (+5 more)

### Community 28 - "usePracticeProgress"
Cohesion: 0.15
Nodes (23): usePracticeProgress(), buildShareUrl(), copyShareLink(), enterViewOnly(), exportJson(), importJsonFile(), isDone(), loadCloudProgress() (+15 more)

### Community 29 - "PlanHome.vue"
Cohesion: 0.14
Nodes (10): label, props, filteredDays, lang, { locale }, navOpen, retrying, router (+2 more)

### Community 30 - "dependencies"
Cohesion: 0.29
Nodes (7): dependencies, marked@^15.0.12, nuxt@^3.21.11, @vercel/blob@^2.8.0, marked, nuxt, @vercel/blob

### Community 31 - "steps"
Cohesion: 0.13
Nodes (14): jobs, validate, name, on, pull_request, push, branches, name (+6 more)

### Community 32 - "DayList.vue"
Cohesion: 0.14
Nodes (12): PlanDaySummary, PlanWeek, daysByWeek, lang, { locale }, openDays, props, visibleWeeks (+4 more)

### Community 33 - "use-interview-unlock.composable.ts"
Cohesion: 0.26
Nodes (12): useAuthSession(), refresh(), AuthSession, AuthSessionScope, authSessionUrl(), clearAuthSession(), EMPTY_AUTH_SESSION, fetchAuthSession() (+4 more)

### Community 34 - "DesignLightbox.vue"
Cohesion: 0.17
Nodes (15): PracticeDesignScreen, bumpZoom(), clampIndex(), closeBtn, emit, go(), lang, { locale, t } (+7 more)

### Community 35 - "steps"
Cohesion: 0.14
Nodes (13): description, name, runs, steps, using, name, run, shell (+5 more)

### Community 36 - "MilestoneList.vue"
Cohesion: 0.15
Nodes (11): PracticeMilestone, PracticeStepSummary, lang, { locale }, props, stepsByMilestone, visibleMilestones, lang (+3 more)

### Community 37 - "DesignSpec.vue"
Cohesion: 0.19
Nodes (13): activeHeading, applyHash(), headingEls(), jumpTo(), props, proseRef, query, scrollContainer() (+5 more)

### Community 38 - "algo/package.json"
Cohesion: 0.20
Nodes (11): devDependencies, typescript@^5.8.0, vitest@^3.0.0, typescript, vitest, name, private, scripts (+3 more)

### Community 39 - "LocaleToggle.vue"
Cohesion: 0.18
Nodes (7): { locale, setLocale }, HUB_MODULES, HubModuleCard, HubRoute, Home, modules, usePracticeAvailable()

### Community 40 - "steps"
Cohesion: 0.15
Nodes (12): VERCEL_DEPLOY_HOOK_URL, jobs, vercel, name, on, push, branches, env (+4 more)

### Community 41 - "ResourceDoc.vue"
Cohesion: 0.17
Nodes (10): aliases, { data: plan }, emit, lang, { locale, t }, onDocClick(), props, resourceId (+2 more)

### Community 42 - "useInterviewUnlock"
Cohesion: 0.28
Nodes (12): localizeAuthError(), withTimeout(), emptyBank(), useInterviewUnlock(), bootSession(), loadQuestions(), lock(), reload() (+4 more)

### Community 43 - "Senior FE Interview Prep"
Cohesion: 0.05
Nodes (39): Modules, Two layers, UI modules (`src/modules/`), APIs, Architecture, Auth, Content model, Data flow (+31 more)

### Community 44 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, data:export, data:migrate, data:pull, data:validate, dev, postinstall (+5 more)

### Community 45 - "PlanRoute"
Cohesion: 0.21
Nodes (8): dayNumber, route, path, route, PlanRoute, Day, Home, Resource

### Community 46 - "ThemeToggle.vue"
Cohesion: 0.27
Nodes (9): label, { t }, { theme, toggle }, readStored(), ThemeMode, useTheme(), apply(), init() (+1 more)

### Community 47 - "PROJECT_CONTEXT — interview-senior-fe (Nuxt 3 app)"
Cohesion: 0.10
Nodes (17): Agent rules moved, AGENTS.md — interview-senior-fe, Navigation and checks, Project, Safety, Workflow, Lessons, 1. Project overview (+9 more)

### Community 48 - "practice-design.test.ts"
Cohesion: 0.17
Nodes (14): PracticeDesignIndex, DEFAULT_SPEC_PATH, DESIGN_INDEX_REL, DESIGN_SCREENS_REL, designIndexExists(), listDesignScreenFiles(), loadPracticeDesignFromDir(), loadPracticeDesignIndexFromDir() (+6 more)

### Community 49 - "DayDetail.vue"
Cohesion: 0.22
Nodes (9): aliases, { data: plan }, DayTab, emit, lang, { locale }, onDocClick(), props (+1 more)

### Community 50 - "ScrollToTop.vue"
Cohesion: 0.33
Nodes (8): bindAll(), cleanups, docsMain(), maxScrollTop(), onScroll(), scrollTargets(), scrollTop(), visible

### Community 51 - "scripts"
Cohesion: 0.20
Nodes (9): name, private, scripts, algo:test, algo:test:day, dev:next, dev:react, dev:vue (+1 more)

### Community 52 - "package.json"
Cohesion: 0.15
Nodes (16): description, devDependencies, @nuxtjs/i18n@^9.5.6, @nuxtjs/tailwindcss@^6.14.0, @types/node@^26.6.3, typescript@^6.0.3, vitest@^3.2.4, typescript (+8 more)

### Community 53 - "🎯 **HIGH PRIORITY** (Must Know)"
Cohesion: 0.15
Nodes (12): 1. **[Vue 3](./documents/en/vue3.md)** ⭐⭐⭐, 2. **[State Management](./documents/en/state-management.md)** ⭐⭐⭐, 3. **[JavaScript](./documents/en/javascript.md)** ⭐⭐⭐, 4. **[TypeScript](./documents/en/typescript.md)** ⭐⭐⭐, 5. **[Networking](./documents/en/networking.md)**, 6. **[Nuxt.js](./documents/en/nuxt.md)**, 7. **[CSS Layout](./documents/en/css-layout.md)**, 8. **[Architecture & Design Patterns](./documents/en/architecture.md)** (+4 more)

### Community 54 - "use-plan-index.composable.ts"
Cohesion: 0.44
Nodes (7): PlanDay, PlanIndex, stripPlanDate(), stripPlanDayDates(), stripPlanIndexDates(), usePlanDay(), usePlanIndex()

### Community 55 - "AppDetailShell.vue"
Cohesion: 0.25
Nodes (7): emit, hasPinnedNav, mainRef, navOpenModel, props, slots, topBarHeight

### Community 56 - "ProgressTools.vue"
Cohesion: 0.32
Nodes (7): emit, fileInput, onFileChange(), onImportClick(), props, sourceLabel, toolsOpen

### Community 57 - "[id].vue"
Cohesion: 0.27
Nodes (6): route, stepId, PracticeRoute, Design, Home, Step

### Community 58 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): ./.nuxt/tsconfig.json, compilerOptions, paths, extends, @kb/*, @plan/*

### Community 60 - "AppRoute"
Cohesion: 0.33
Nodes (5): AppRoute, Docs, Hub, Plan, Practice

### Community 61 - "InterviewPinGate.vue"
Cohesion: 0.40
Nodes (4): digits, emit, onSubmit(), props

### Community 62 - "EditGateModal.vue"
Cohesion: 0.40
Nodes (4): digits, emit, onSubmit(), props

### Community 63 - "vercel.json"
Cohesion: 0.40
Nodes (4): buildCommand, framework, installCommand, $schema

### Community 66 - "PlanDayContent.vue"
Cohesion: 0.21
Nodes (9): lang, { locale }, lang, { locale }, openAlgo(), openPlanDoc(), props, router (+1 more)

### Community 67 - "validate.mjs"
Cohesion: 0.24
Nodes (9): days, errors, fail(), kb, listJsonFiles(), practiceDir, readJson(), root (+1 more)

### Community 97 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 105 - "pick-locale.util.ts"
Cohesion: 0.24
Nodes (6): LocaleCode, Localized, InterviewBank, InterviewCategory, InterviewCategoryId, InterviewQuestion

### Community 106 - "use-practice-progress.composable.ts"
Cohesion: 0.22
Nodes (8): localDoneMap, parseShareFromLocation(), publicMeta, source, statusMessage, applyShareFromUrl(), viewDoneMap, decodeShareToken()

### Community 107 - "ref_node_fs"
Cohesion: 0.25
Nodes (5): contentDir, copyContentIntoNitroOutput(), 'nitro:init'(), rootDir, srcRoot

### Community 108 - "useHideOnScrollBar"
Cohesion: 0.46
Nodes (7): useHideOnScrollBar(), getScrollTop(), hideBar(), onFocusIn(), onScroll(), setVisible(), showBar()

### Community 109 - "useEditMode"
Cohesion: 0.38
Nodes (7): skipUnlock(), useEditMode(), applySession(), enterViewMode(), lockEditMode(), submitPasscode(), skipUnlock()

### Community 110 - "interview-fe-data"
Cohesion: 0.33
Nodes (5): Editing, interview-fe-data, Layout, Redeploy, Validation

### Community 111 - "senior-fe-lab"
Cohesion: 0.40
Nodes (4): Algo, Daily, Quick start, senior-fe-lab

### Community 112 - "use-hide-on-scroll-bar.composable.ts"
Cohesion: 0.50
Nodes (3): vue@^3.5.43, vue, UseHideOnScrollBarOptions

### Community 113 - "Split-pane layout: one scrollbar per pane, sticky nav"
Cohesion: 0.50
Nodes (3): Plan, Review, Split-pane layout: one scrollbar per pane, sticky nav

## Knowledge Gaps
- **14 isolated node(s):** `Hub`, `Docs`, `Plan`, `Practice`, `Home` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 568 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `marked` connect `dependencies` to `md-to-blocks.mjs`, `BlockRenderer.vue`, `package.json`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `usePracticeProgress()` (e.g. with `copyShareLink()` and `exportJson()`) actually correct?**
  _`usePracticeProgress()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Hub`, `Docs`, `Plan` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `md-to-blocks.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.08007013442431327 - nodes in this community are weakly interconnected._
- **Why does `pickLocale()` connect `pickLocale` to `DayList.vue`, `DocReaderPage.vue`, `kb-search-core.util.ts`, `DesignLightbox.vue`, `MilestoneList.vue`, `PlanDayContent.vue`, `pick-locale.util.ts`, `PracticeStep.vue`, `ResourceDoc.vue`, `DesignGallery.vue`, `PracticeDesign.vue`, `BlockRenderer.vue`, `DayDetail.vue`, `PlanDay.vue`, `PracticeHome.vue`, `PlanHome.vue`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `useProgress()` (e.g. with `copyShareLink()` and `exportJson()`) actually correct?**
  _`useProgress()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Should `plan-lab.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.056314699792960665 - nodes in this community are weakly interconnected._