# Graph Report - interview-senior-fe  (2026-11-15)

## Corpus Check
- 311 files · ~69,745 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 4, .example 1, .css 1)

## Summary
- 1701 nodes · 3359 edges · 137 communities (85 shown, 52 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 54 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2a795e89`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- md-to-blocks.mjs
- plan-lab.test.ts
- DocReaderPage.vue
- search-text.util.ts
- sessionCookie.ts
- index.ts
- InterviewHome.vue
- contentStore.ts
- practice-readers.test.ts
- PracticeStep.vue
- usePracticeProgress
- pickLocale
- practice.type.ts
- spec-ref.util.ts
- PracticeDesign.vue
- steps
- qa-search.util.ts
- BlockRenderer.vue
- PlanDay.vue
- validate-content.mjs
- JdStudy.vue
- react/package.json
- toAuthApiError
- steps
- FdeStudy.vue
- AppTopBar.vue
- content-links.util.ts
- interview-auth.test.ts
- kb-search-core.util.ts
- PlanHome.vue
- dependencies
- steps
- DayList.vue
- use-interview-unlock.composable.ts
- DesignLightbox.vue
- steps
- MilestoneList.vue
- practice-readers.test.ts
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
- [lang]/[slug].vue
- pull-data.mjs
- ref_node_fs
- useHideOnScrollBar
- JdSearch.vue
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
- jdModules.ts
- DocSearch.vue
- practice-content-tree.mjs
- practice-search.util.ts
- practice-design-tree.mjs
- LocaleToggle.vue
- use-doc-reader.composable.ts
- content-links.util.ts
- restoreLangScroll
- readPlanIndex
- fde-markdown.util.ts
- Backend learning guide integration revision
- JD dashboard implementation plan
- 2026-11-15-fde-interview-module.md
- 2026-11-15-fde-plan.md

## God Nodes (most connected - your core abstractions)
1. `pickLocale()` - 35 edges
2. `usePracticeProgress()` - 29 edges
3. `useProgress()` - 28 edges
4. `foldSearchText()` - 23 edges
5. `splitSearchKeywords()` - 22 edges
6. `useInterviewUnlock()` - 20 edges
7. `toAuthApiError()` - 19 edges
8. `matchesAllKeywords()` - 15 edges
9. `isPracticeStepId()` - 15 edges
10. `useEditMode()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `normalizePayload()` --calls--> `isPracticeStepId()`  [EXTRACTED]
  server/api/practice/progress.ts → src/modules/practice/utils/practice-id.util.ts
- `readPlanIndex()` --calls--> `stripPlanIndexDates()`  [EXTRACTED]
  server/utils/contentStore.ts → src/modules/content/utils/plan-dates.util.ts
- `readPlanDay()` --calls--> `stripPlanDayDates()`  [EXTRACTED]
  server/utils/contentStore.ts → src/modules/content/utils/plan-dates.util.ts
- `readPracticeStep()` --calls--> `isPracticeStepId()`  [EXTRACTED]
  server/utils/contentStore.ts → src/modules/practice/utils/practice-id.util.ts
- `readPracticeDesign()` --calls--> `specHeadingsFromMarkdown()`  [EXTRACTED]
  server/utils/contentStore.ts → src/modules/practice/utils/spec-ref.util.ts

## Import Cycles
- None detected.

## Communities (137 total, 52 thin omitted)

### Community 0 - "md-to-blocks.mjs"
Cohesion: 0.08
Nodes (52): copyStaticSeedFiles(), DOC_GROUPS, DOC_TITLES, exportDays(), exportKnowledgeBase(), exportQna(), exportResources(), firstHeading() (+44 more)

### Community 1 - "plan-lab.test.ts"
Cohesion: 0.21
Nodes (13): doc, fixtureDay(), L(), labStub(), NO_LAB_DAY, pad(), resources, systemDesignDoc (+5 more)

### Community 2 - "DocReaderPage.vue"
Cohesion: 0.09
Nodes (26): activeHeading, backLabel, backTo, {
  catalog,
  catalogPending,
  safeLang,
  pending,
  error,
  doc,
  toc,
  adjacent,
  title,
  refresh,
}, fromPlan, goDoc(), headerOffset, jumpTo() (+18 more)

### Community 3 - "search-text.util.ts"
Cohesion: 0.18
Nodes (24): queryGroups(), filterInterviewQuestions(), interviewQuestionBlob(), joinLocalized(), scoreInterviewQuestion(), searchCatalogTitles(), collectKeywordRanges(), escapeHtml() (+16 more)

### Community 4 - "sessionCookie.ts"
Cohesion: 0.09
Nodes (42): assertWriteAuth(), normalizePayload(), assertWriteAuth(), readInterviewBank(), b64url(), EDIT_TOKEN_TTL_MS, fromB64url(), isSixDigitPasscode() (+34 more)

### Community 5 - "index.ts"
Cohesion: 0.11
Nodes (34): CalloutBlock, CalloutKind, CodeBlock, ContentBlock, ExampleBlock, FollowUpsBlock, HeadingBlock, HeadingLevel (+26 more)

### Community 6 - "InterviewHome.vue"
Cohesion: 0.08
Nodes (33): interviewPathForQuestion(), questionExists(), questionIdFromHash(), questionIdFromQuery(), requestedQuestionId(), withQuestionQuery(), QA_SESSION_BOOT_TIMEOUT_MS, qaIsContentLoading() (+25 more)

### Community 7 - "contentStore.ts"
Cohesion: 0.11
Nodes (20): ROOT, adjacentDocs(), DISK_ROOT, fromDisk(), fromDiskText(), hasPracticeDesign(), listResourceIds(), practiceNotFound() (+12 more)

### Community 8 - "practice-readers.test.ts"
Cohesion: 0.27
Nodes (12): readPracticeIndex(), isPracticeStepId(), PRACTICE_STEP_COUNT, PRACTICE_STEP_ID_RE, practiceStepOrder(), indexFromMetaAndSteps(), listStepFiles(), loadPracticeIndexFromDir() (+4 more)

### Community 9 - "PracticeStep.vue"
Cohesion: 0.07
Nodes (31): PracticeDesignPayload, PracticeIndex, practiceStepHref(), usePracticeDesign(), usePracticeDesignAvailable(), usePracticeStep(), usePracticeSteps(), specHeadingsFromMarkdown() (+23 more)

### Community 10 - "usePracticeProgress"
Cohesion: 0.06
Nodes (66): usePracticeIndex(), localDoneMap, parseShareFromLocation(), publicMeta, source, statusMessage, usePracticeProgress(), applyShareFromUrl() (+58 more)

### Community 11 - "pickLocale"
Cohesion: 0.33
Nodes (10): ContentSection, LocaleCode, tocFromSections(), filterBlocks(), isTocHeadingText(), localizedIds(), prepareReadableSections(), stripTocFromMarkdown() (+2 more)

### Community 12 - "practice.type.ts"
Cohesion: 0.08
Nodes (24): TocItem, PracticeConcept, PracticeDesignFigma, PracticeDesignGroup, PracticeDesignScreen, PracticeDesignTheme, PracticeDesignViewport, PracticeKbLink (+16 more)

### Community 13 - "spec-ref.util.ts"
Cohesion: 0.05
Nodes (57): applyIds(), collapseAll(), emit, expandAll(), expanded, props, revealActive(), tree (+49 more)

### Community 14 - "PracticeDesign.vue"
Cohesion: 0.09
Nodes (19): practiceDesignFigma(), pickSpecMarkdown(), figma, lang, lightboxIndex, lightboxOpen, { locale, t }, navOpen (+11 more)

### Community 15 - "steps"
Cohesion: 0.07
Nodes (33): runs-on, steps, timeout-minutes, concurrency, cancel-in-progress, group, CONTENT_REPO_TOKEN, GITHUB_TOKEN (+25 more)

### Community 16 - "qa-search.util.ts"
Cohesion: 0.18
Nodes (14): grouped, listRef, props, answerHtml, emit, exampleHtml, md(), props (+6 more)

### Community 17 - "BlockRenderer.vue"
Cohesion: 0.12
Nodes (28): emit, html(), md(), prepared, props, text(), itemHtml(), itemsOf() (+20 more)

### Community 18 - "PlanDay.vue"
Cohesion: 0.12
Nodes (22): planResourceHref(), docsHref(), interviewHref(), openInNewTab(), dayNumber, navOpen, openDoc(), openDocs() (+14 more)

### Community 19 - "validate-content.mjs"
Cohesion: 0.16
Nodes (22): categories, dayDir, dayFiles, errors, expectedSpecAnchor(), fail(), kbDir, kbFiles (+14 more)

### Community 20 - "JdStudy.vue"
Cohesion: 0.08
Nodes (26): JdModule, JdRow, filterModules(), groupModules(), JdTab, liveKbHref(), tabEntries(), date (+18 more)

### Community 21 - "react/package.json"
Cohesion: 0.10
Nodes (25): dependencies, react@^19.0.0, react-dom@^19.0.0, devDependencies, @types/react@^19.0.0, @types/react-dom@^19.0.0, typescript@^5.8.0, vite@^6.0.0 (+17 more)

### Community 22 - "toAuthApiError"
Cohesion: 0.36
Nodes (8): AUTH_I18N_KEY, AuthApiError, AuthErrorCode, KNOWN_CODES, parseApiErrorCode(), parseApiErrorMessage(), stringFromUnknown(), toAuthApiError()

### Community 23 - "steps"
Cohesion: 0.11
Nodes (18): if, runs-on, steps, BASE, HEAD, jobs, context, name (+10 more)

### Community 24 - "FdeStudy.vue"
Cohesion: 0.09
Nodes (25): FdeContent, FdeEntry, FdeLocalized, buildFdeIndex(), FdeSearchHit, nearMatch(), searchFde(), SearchRecord (+17 more)

### Community 25 - "AppTopBar.vue"
Cohesion: 0.25
Nodes (7): emit, { isVisible, onFocusIn, onFocusOut }, measuredHeight, props, rootRef, spacerHeight, updateHeight()

### Community 26 - "content-links.util.ts"
Cohesion: 0.29
Nodes (7): classifyMarkdownHref(), GITHUB_BLOB_MAIN, MarkdownHrefResult, normalizeDocPath(), resolveRelative(), LAB_HEADING_KEYS, stripPlanLocalePrefix()

### Community 27 - "interview-auth.test.ts"
Cohesion: 0.22
Nodes (13): clearInterviewToken(), INTERVIEW_TOKEN_STORAGE_KEY, interviewAuthHeaders(), isInterviewTokenStorageKey(), memoryTokenStorage(), readInterviewToken(), TokenStorage, writeInterviewToken() (+5 more)

### Community 28 - "kb-search-core.util.ts"
Cohesion: 0.16
Nodes (19): buildSearchIndex(), getKbSearchIndex(), searchKnowledgeBase(), SearchRecord, DocLang, blockPlain(), indexKnowledgeDoc(), IndexRecord (+11 more)

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
Nodes (11): PlanWeek, daysByWeek, lang, { locale }, openDays, props, visibleWeeks, daysByWeek (+3 more)

### Community 33 - "use-interview-unlock.composable.ts"
Cohesion: 0.17
Nodes (19): useAuthSession(), refresh(), AuthSession, AuthSessionScope, authSessionUrl(), clearAuthSession(), EMPTY_AUTH_SESSION, fetchAuthSession() (+11 more)

### Community 34 - "DesignLightbox.vue"
Cohesion: 0.19
Nodes (14): bumpZoom(), clampIndex(), closeBtn, emit, go(), lang, { locale, t }, onKey() (+6 more)

### Community 35 - "steps"
Cohesion: 0.14
Nodes (13): description, name, runs, steps, using, name, run, shell (+5 more)

### Community 36 - "MilestoneList.vue"
Cohesion: 0.15
Nodes (11): PracticeMilestone, PracticeStepSummary, lang, { locale }, props, stepsByMilestone, visibleMilestones, lang (+3 more)

### Community 37 - "practice-readers.test.ts"
Cohesion: 0.10
Nodes (11): day, r, dataDir, fde, index, root, sample, server (+3 more)

### Community 38 - "algo/package.json"
Cohesion: 0.20
Nodes (11): devDependencies, typescript@^5.8.0, vitest@^3.0.0, typescript, vitest, name, private, scripts (+3 more)

### Community 39 - "LocaleToggle.vue"
Cohesion: 0.24
Nodes (6): HUB_MODULES, HubModuleCard, HubRoute, Home, modules, usePracticeAvailable()

### Community 40 - "steps"
Cohesion: 0.15
Nodes (12): VERCEL_DEPLOY_HOOK_URL, jobs, vercel, name, on, push, branches, env (+4 more)

### Community 41 - "ResourceDoc.vue"
Cohesion: 0.17
Nodes (10): aliases, { data: plan }, emit, lang, { locale, t }, onDocClick(), props, resourceId (+2 more)

### Community 42 - "useInterviewUnlock"
Cohesion: 0.26
Nodes (13): withTimeout(), emptyBank(), InterviewBankPayload, useInterviewUnlock(), bootSession(), loadQuestions(), lock(), onStorage() (+5 more)

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
Cohesion: 0.19
Nodes (11): PracticeDesignIndex, DEFAULT_SPEC_PATH, DESIGN_INDEX_REL, DESIGN_SCREENS_REL, designIndexExists(), listDesignScreenFiles(), loadPracticeDesignFromDir(), loadPracticeDesignIndexFromDir() (+3 more)

### Community 49 - "DayDetail.vue"
Cohesion: 0.15
Nodes (14): PlanDay, PlanResourceSummary, isLabResourceId(), visiblePlanResources(), aliases, { data: plan }, DayTab, emit (+6 more)

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
Cohesion: 0.36
Nodes (8): PlanDaySummary, PlanIndex, PlanResource, stripPlanDate(), stripPlanDayDates(), stripPlanIndexDates(), usePlanDay(), usePlanIndex()

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
Cohesion: 0.33
Nodes (6): lang, { locale }, openAlgo(), openPlanDoc(), props, router

### Community 67 - "validate.mjs"
Cohesion: 0.22
Nodes (9): days, errors, fail(), kb, listJsonFiles(), practiceDir, readJson(), root (+1 more)

### Community 97 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 105 - "[lang]/[slug].vue"
Cohesion: 0.15
Nodes (15): lang, { locale }, query, route, known, lang, route, slug (+7 more)

### Community 106 - "pull-data.mjs"
Cohesion: 0.28
Nodes (14): copyLocal(), copyOptionalDesign(), copySpecIfPresent(), dest, downloadRepo(), fail(), findContentTree(), looksLikeContentTree() (+6 more)

### Community 107 - "ref_node_fs"
Cohesion: 0.29
Nodes (5): contentDir, copyContentIntoNitroOutput(), 'nitro:init'(), rootDir, srcRoot

### Community 108 - "useHideOnScrollBar"
Cohesion: 0.46
Nodes (7): useHideOnScrollBar(), getScrollTop(), hideBar(), onFocusIn(), onScroll(), setVisible(), showBar()

### Community 109 - "JdSearch.vue"
Cohesion: 0.16
Nodes (11): EscapeContext, shouldClearFdeSearch(), onKeydown(), debounced, lang, onKeydown(), query, SearchHit (+3 more)

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

### Community 121 - "jdModules.ts"
Cohesion: 0.23
Nodes (7): readContentJsonOptional(), activeModule(), activeModules(), fallback, ModuleIndex, StartTokenProvider, telegramHandoff()

### Community 122 - "DocSearch.vue"
Cohesion: 0.18
Nodes (12): activeIndex, choose(), emit, inputRef, onKey(), pending, props, query (+4 more)

### Community 123 - "practice-content-tree.mjs"
Cohesion: 0.32
Nodes (13): allPracticeSteps(), fixturePracticeIndex(), fixturePracticeMeta(), fixturePracticeStep(), fixturePracticeStepP06(), genericConcepts(), genericTasks(), L() (+5 more)

### Community 124 - "practice-search.util.ts"
Cohesion: 0.33
Nodes (10): PracticeStep, filterPracticeSteps(), joinLocalized(), PracticeSearchHit, practiceSearchHits(), PracticeSearchKind, practiceStepBlob(), scorePracticeStep() (+2 more)

### Community 125 - "practice-design-tree.mjs"
Cohesion: 0.27
Nodes (11): FIXTURE_FIGMA, FIXTURE_SPEC_PATH, FIXTURE_SPEC_PATH_VI, fixtureDesignIndex(), fixtureDesignScreens(), fixtureDesignSpecMarkdown(), fixtureDesignSpecMarkdownVi(), L() (+3 more)

### Community 126 - "LocaleToggle.vue"
Cohesion: 0.22
Nodes (4): { locale, setLocale }, groups, mode, { t, locale }

### Community 127 - "use-doc-reader.composable.ts"
Cohesion: 0.42
Nodes (5): useDocReader(), useKbCatalog(), pushRecentDoc(), readRecentDocs(), RecentDoc

### Community 128 - "content-links.util.ts"
Cohesion: 0.36
Nodes (6): classifyContentHref(), ContentHref, classifyKbHref(), GITHUB_BLOB_MAIN, KbHrefResult, normalizeDocPath()

### Community 129 - "restoreLangScroll"
Cohesion: 0.43
Nodes (8): captureLangScroll(), getScrollHeight(), getScrollTop(), headingEls(), restoreLangScroll(), scrollEl(), setScrollTop(), switchLang()

### Community 130 - "readPlanIndex"
Cohesion: 0.33
Nodes (5): planHasLab(), readPlanDay(), readPlanIndex(), hasLabContent(), showLab

## Knowledge Gaps
- **14 isolated node(s):** `Hub`, `Docs`, `Plan`, `Practice`, `Home` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 647 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `marked` connect `dependencies` to `md-to-blocks.mjs`, `BlockRenderer.vue`, `fde-markdown.util.ts`, `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `usePracticeProgress()` (e.g. with `copyShareLink()` and `exportJson()`) actually correct?**
  _`usePracticeProgress()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Hub`, `Docs`, `Plan` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `md-to-blocks.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.08007013442431327 - nodes in this community are weakly interconnected._
- **Why does `pickLocale()` connect `pickLocale` to `DayList.vue`, `DocReaderPage.vue`, `search-text.util.ts`, `DesignLightbox.vue`, `MilestoneList.vue`, `PlanDayContent.vue`, `PracticeStep.vue`, `ResourceDoc.vue`, `practice.type.ts`, `PracticeDesign.vue`, `BlockRenderer.vue`, `DayDetail.vue`, `PlanDay.vue`, `kb-search-core.util.ts`, `PlanHome.vue`, `use-doc-reader.composable.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `useProgress()` (e.g. with `copyShareLink()` and `exportJson()`) actually correct?**
  _`useProgress()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Should `DocReaderPage.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.08620689655172414 - nodes in this community are weakly interconnected._