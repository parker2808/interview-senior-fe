# Graph Report - interview-senior-fe  (2026-11-22)

## Corpus Check
- 317 files · ~72,810 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 4, .example 1, .css 1)

## Summary
- 1736 nodes · 3438 edges · 145 communities (93 shown, 52 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 57 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `85a2d67d`
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
- useProgress
- pickLocale
- DesignGallery.vue
- DocToc.vue
- PracticeDesign.vue
- steps
- spec-ref.util.ts
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
- JdDashboard.vue
- ThemeToggle.vue
- PROJECT_CONTEXT — interview-senior-fe (Nuxt 3 app)
- practice-design.test.ts
- DayDetail.vue
- ScrollToTop.vue
- scripts
- package.json
- 🎯 **HIGH PRIORITY** (Must Know)
- use-plan-index.composable.ts
- use-practice-progress.composable.ts
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
- PracticeHome.vue
- usePracticeProgress
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
- DesignSpec.vue
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
- progress.service.ts
- kbSearch.ts
- practice-content-tree.mjs
- Senior FE Interview Prep
- practice-design-tree.mjs
- LocaleToggle.vue
- use-doc-reader.composable.ts
- content-links.util.ts
- restoreLangScroll
- useEditMode
- jd-module.type.ts
- Backend learning guide integration revision
- JD dashboard implementation plan
- 2026-11-15-fde-interview-module.md
- 2026-11-15-fde-plan.md
- AGENTS.md
- JdModuleAction.vue
- AGENTS.md — interview-senior-fe
- UI module conventions
- Architecture
- Kiến trúc
- toc.util.ts
- Modules

## God Nodes (most connected - your core abstractions)
1. `pickLocale()` - 35 edges
2. `usePracticeProgress()` - 29 edges
3. `useProgress()` - 28 edges
4. `foldSearchText()` - 23 edges
5. `splitSearchKeywords()` - 22 edges
6. `useInterviewUnlock()` - 20 edges
7. `toAuthApiError()` - 19 edges
8. `useEditMode()` - 17 edges
9. `matchesAllKeywords()` - 15 edges
10. `isPracticeStepId()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Behavior and boundary` --references--> `useEditMode()`  [INFERRED]
  docs/specs/2026-11-15-jd-delete-restore-web.md → src/modules/study-plan/composables/use-edit-mode.composable.ts
- `Behavior and boundary` --references--> `StartTokenProvider`  [INFERRED]
  docs/specs/2026-11-15-jd-delete-restore-web.md → server/utils/jdTelegram.ts
- `Behavior and boundary` --references--> `telegramHandoff()`  [INFERRED]
  docs/specs/2026-11-15-jd-delete-restore-web.md → server/utils/jdTelegram.ts
- `normalizePayload()` --calls--> `isPracticeStepId()`  [EXTRACTED]
  server/api/practice/progress.ts → src/modules/practice/utils/practice-id.util.ts
- `planHasLab()` --calls--> `hasLabContent()`  [EXTRACTED]
  server/utils/contentStore.ts → src/modules/content/utils/plan-lab.util.ts

## Import Cycles
- None detected.

## Communities (145 total, 52 thin omitted)

### Community 0 - "md-to-blocks.mjs"
Cohesion: 0.05
Nodes (67): contentDir, copyContentIntoNitroOutput(), 'nitro:init'(), rootDir, srcRoot, days, errors, fail() (+59 more)

### Community 1 - "plan-lab.test.ts"
Cohesion: 0.20
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
Cohesion: 0.05
Nodes (73): PracticeStep, DocLang, FdeSearchHit, nearMatch(), queryGroups(), searchFde(), SearchRecord, SYNONYMS (+65 more)

### Community 4 - "sessionCookie.ts"
Cohesion: 0.05
Nodes (61): Acceptance map, Behavior and boundary, Edit-mode JD archive and restore handoff, Proposed bot contract (follow-up, not implemented), assertWriteAuth(), assertWriteAuth(), readContentJsonOptional(), readInterviewBank() (+53 more)

### Community 5 - "index.ts"
Cohesion: 0.08
Nodes (44): CalloutBlock, CalloutKind, CodeBlock, ContentBlock, ExampleBlock, FollowUpsBlock, HeadingBlock, HeadingLevel (+36 more)

### Community 6 - "InterviewHome.vue"
Cohesion: 0.09
Nodes (33): interviewPathForQuestion(), questionExists(), questionIdFromHash(), questionIdFromQuery(), requestedQuestionId(), withQuestionQuery(), QA_SESSION_BOOT_TIMEOUT_MS, qaIsContentLoading() (+25 more)

### Community 7 - "contentStore.ts"
Cohesion: 0.12
Nodes (21): DISK_ROOT, fromDisk(), fromDiskText(), hasPracticeDesign(), listResourceIds(), planHasLab(), practiceNotFound(), publicCacheHeaders() (+13 more)

### Community 8 - "practice-readers.test.ts"
Cohesion: 0.19
Nodes (15): normalizePayload(), isPracticeStepId(), PRACTICE_STEP_COUNT, PRACTICE_STEP_ID_RE, practiceStepOrder(), indexFromMetaAndSteps(), listStepFiles(), loadPracticeIndexFromDir() (+7 more)

### Community 9 - "PracticeStep.vue"
Cohesion: 0.12
Nodes (18): PracticeDesignPayload, PracticeIndex, practiceStepHref(), usePracticeDesign(), usePracticeDesignAvailable(), usePracticeStep(), usePracticeSteps(), adjacent (+10 more)

### Community 10 - "useProgress"
Cohesion: 0.13
Nodes (24): usePlanIndex(), localDoneMap, parseShareFromLocation(), publicMeta, source, statusMessage, useProgress(), applyShareFromUrl() (+16 more)

### Community 11 - "pickLocale"
Cohesion: 0.36
Nodes (10): ContentSection, LocaleCode, tocFromSections(), filterBlocks(), isTocHeadingText(), localizedIds(), prepareReadableSections(), stripTocFromMarkdown() (+2 more)

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
Nodes (33): runs-on, steps, timeout-minutes, concurrency, cancel-in-progress, group, CONTENT_REPO_TOKEN, GITHUB_TOKEN (+25 more)

### Community 16 - "spec-ref.util.ts"
Cohesion: 0.18
Nodes (19): hitIds, rendered, hrefFor(), props, decodeBasicEntities(), headingMatchesSection(), headingSpecAnchorId(), headingTextFromLine() (+11 more)

### Community 17 - "BlockRenderer.vue"
Cohesion: 0.14
Nodes (24): emit, html(), md(), prepared, props, text(), itemHtml(), itemsOf() (+16 more)

### Community 18 - "PlanDay.vue"
Cohesion: 0.05
Nodes (45): dayNumber, route, path, route, emit, hasPinnedNav, mainRef, navOpenModel (+37 more)

### Community 19 - "validate-content.mjs"
Cohesion: 0.16
Nodes (22): categories, dayDir, dayFiles, errors, expectedSpecAnchor(), fail(), kbDir, kbFiles (+14 more)

### Community 20 - "JdStudy.vue"
Cohesion: 0.13
Nodes (15): JdModule, JdTab, liveKbHref(), tabEntries(), entries, expanded, { isEditMode }, lang (+7 more)

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
Cohesion: 0.10
Nodes (17): markdown, renderFdeDetail(), buildFdeIndex(), expanded, indexed, languageMode, query, requirement() (+9 more)

### Community 25 - "AppTopBar.vue"
Cohesion: 0.25
Nodes (7): emit, { isVisible, onFocusIn, onFocusOut }, measuredHeight, props, rootRef, spacerHeight, updateHeight()

### Community 26 - "content-links.util.ts"
Cohesion: 0.29
Nodes (7): classifyMarkdownHref(), GITHUB_BLOB_MAIN, MarkdownHrefResult, normalizeDocPath(), resolveRelative(), LAB_HEADING_KEYS, stripPlanLocalePrefix()

### Community 27 - "interview-auth.test.ts"
Cohesion: 0.20
Nodes (13): clearInterviewToken(), INTERVIEW_TOKEN_STORAGE_KEY, interviewAuthHeaders(), memoryTokenStorage(), readInterviewToken(), TokenStorage, writeInterviewToken(), fetchInterviewQuestions() (+5 more)

### Community 28 - "kb-search-core.util.ts"
Cohesion: 0.23
Nodes (12): KnowledgeDoc, blockPlain(), indexKnowledgeDoc(), IndexRecord, isLocalized(), KbSearchKind, KIND_BASE, pushRecord() (+4 more)

### Community 29 - "PlanHome.vue"
Cohesion: 0.15
Nodes (12): PlanResourceSummary, isLabResourceId(), visiblePlanResources(), filteredDays, lang, { locale }, navOpen, quickResources (+4 more)

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
Cohesion: 0.24
Nodes (11): useAuthSession(), refresh(), AuthSession, AuthSessionScope, authSessionUrl(), clearAuthSession(), EMPTY_AUTH_SESSION, fetchAuthSession() (+3 more)

### Community 34 - "DesignLightbox.vue"
Cohesion: 0.17
Nodes (15): PracticeDesignScreen, bumpZoom(), clampIndex(), closeBtn, emit, go(), lang, { locale, t } (+7 more)

### Community 35 - "steps"
Cohesion: 0.14
Nodes (13): description, name, runs, steps, using, name, run, shell (+5 more)

### Community 36 - "MilestoneList.vue"
Cohesion: 0.15
Nodes (11): PracticeMilestone, PracticeStepSummary, lang, { locale }, props, stepsByMilestone, visibleMilestones, lang (+3 more)

### Community 37 - "practice-readers.test.ts"
Cohesion: 0.12
Nodes (8): day, r, dataDir, fde, index, root, sample, server

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
Cohesion: 0.13
Nodes (12): label, props, aliases, { data: plan }, emit, lang, { locale, t }, onDocClick() (+4 more)

### Community 42 - "useInterviewUnlock"
Cohesion: 0.31
Nodes (11): isInterviewTokenStorageKey(), withTimeout(), emptyBank(), useInterviewUnlock(), bootSession(), loadQuestions(), lock(), onStorage() (+3 more)

### Community 43 - "Senior FE Interview Prep"
Cohesion: 0.18
Nodes (11): Agent rules, Data flow, Deploy and content updates, Environment, Features, License, Local development, Page request flow (+3 more)

### Community 44 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, data:export, data:migrate, data:pull, data:validate, dev, postinstall (+5 more)

### Community 45 - "JdDashboard.vue"
Cohesion: 0.13
Nodes (16): JdRow, filterModules(), groupModules(), date, filtered, group, groups, { isEditMode } (+8 more)

### Community 46 - "ThemeToggle.vue"
Cohesion: 0.27
Nodes (9): label, { t }, { theme, toggle }, readStored(), ThemeMode, useTheme(), apply(), init() (+1 more)

### Community 47 - "PROJECT_CONTEXT — interview-senior-fe (Nuxt 3 app)"
Cohesion: 0.18
Nodes (11): 1. Project overview, 2. Confirmed facts, 3. Forbidden / hard rules, 4. UI rules, 5. Workflow, 6. Multi-agent coordination, 7. Future work, 8. Open items / status (+3 more)

### Community 48 - "practice-design.test.ts"
Cohesion: 0.24
Nodes (10): DESIGN_SCREENS_REL, designIndexExists(), listDesignScreenFiles(), loadPracticeDesignFromDir(), loadPracticeDesignIndexFromDir(), loadPracticeSpecMarkdownFromDir(), localeSpecPath(), specHeadingsFromMarkdown() (+2 more)

### Community 49 - "DayDetail.vue"
Cohesion: 0.20
Nodes (11): hasLabContent(), aliases, { data: plan }, DayTab, emit, lang, { locale }, onDocClick() (+3 more)

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
Nodes (8): PlanDay, PlanDaySummary, PlanIndex, PlanResource, stripPlanDate(), stripPlanDayDates(), stripPlanIndexDates(), usePlanDay()

### Community 55 - "use-practice-progress.composable.ts"
Cohesion: 0.16
Nodes (15): usePracticeIndex(), localDoneMap, parseShareFromLocation(), publicMeta, source, statusMessage, applyShareFromUrl(), exportJson() (+7 more)

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

### Community 66 - "PracticeHome.vue"
Cohesion: 0.14
Nodes (12): nextUnfinishedId(), continueStep(), filteredSteps, lang, { locale }, notFound, openStep(), query (+4 more)

### Community 67 - "usePracticeProgress"
Cohesion: 0.23
Nodes (14): usePracticeProgress(), buildShareUrl(), copyShareLink(), enterViewOnly(), importJsonFile(), isDone(), loadCloudProgress(), loadPublicProgress() (+6 more)

### Community 97 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 105 - "[lang]/[slug].vue"
Cohesion: 0.14
Nodes (15): lang, { locale }, query, route, known, lang, route, slug (+7 more)

### Community 106 - "pull-data.mjs"
Cohesion: 0.28
Nodes (14): copyLocal(), copyOptionalDesign(), copySpecIfPresent(), dest, downloadRepo(), fail(), findContentTree(), looksLikeContentTree() (+6 more)

### Community 107 - "DesignSpec.vue"
Cohesion: 0.19
Nodes (13): activeHeading, applyHash(), headingEls(), jumpTo(), props, proseRef, query, scrollContainer() (+5 more)

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

### Community 121 - "progress.service.ts"
Cohesion: 0.25
Nodes (12): publishToCloud(), fetchCloudPracticeProgress(), practiceProgressApiUrl(), publishCloudPracticeProgress(), exportJson(), publishToCloud(), fetchCloudProgress(), getWriteToken() (+4 more)

### Community 122 - "kbSearch.ts"
Cohesion: 0.26
Nodes (10): adjacentDocs(), readContentJson(), readKnowledgeCatalog(), readKnowledgeDoc(), buildSearchIndex(), getKbSearchIndex(), searchKnowledgeBase(), SearchRecord (+2 more)

### Community 123 - "practice-content-tree.mjs"
Cohesion: 0.32
Nodes (13): allPracticeSteps(), fixturePracticeIndex(), fixturePracticeMeta(), fixturePracticeStep(), fixturePracticeStepP06(), genericConcepts(), genericTasks(), L() (+5 more)

### Community 124 - "Senior FE Interview Prep"
Cohesion: 0.18
Nodes (11): Biến môi trường, Chạy local, Deploy và cập nhật nội dung, License, Luồng dữ liệu, Luồng request của một trang, Mở khoá PIN, Quy tắc cho trợ lý (+3 more)

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

### Community 130 - "useEditMode"
Cohesion: 0.29
Nodes (10): localizeAuthError(), skipUnlock(), useEditMode(), applySession(), enterViewMode(), lockEditMode(), submitPasscode(), skipUnlock() (+2 more)

### Community 131 - "jd-module.type.ts"
Cohesion: 0.33
Nodes (4): FdeContent, FdeEntry, FdeLocalized, snippetHtml()

### Community 138 - "JdModuleAction.vue"
Cohesion: 0.25
Nodes (5): copied, props, { t }, JdActionHandoff, canShowJdAction()

### Community 139 - "AGENTS.md — interview-senior-fe"
Cohesion: 0.33
Nodes (6): AGENTS.md — interview-senior-fe, Full decision authority, Navigation and checks, Project, Safety, Workflow

### Community 140 - "UI module conventions"
Cohesion: 0.33
Nodes (6): Module layout, Naming, New UI module, Overview, Pages ↔ views, UI module conventions

### Community 141 - "Architecture"
Cohesion: 0.40
Nodes (5): APIs, Architecture, Auth, Content model, i18n

### Community 142 - "Kiến trúc"
Cohesion: 0.40
Nodes (5): API, Auth, i18n, Kiến trúc, Mô hình nội dung

### Community 143 - "toc.util.ts"
Cohesion: 0.70
Nodes (4): nextHeadingId(), slugifyHeading(), decodeBasicEntities(), enhanceMarkdownHtml()

### Community 144 - "Modules"
Cohesion: 0.50
Nodes (3): Modules, Two layers, UI modules (`src/modules/`)

## Knowledge Gaps
- **14 isolated node(s):** `Hub`, `Docs`, `Plan`, `Practice`, `Home` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 668 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `marked` connect `dependencies` to `md-to-blocks.mjs`, `BlockRenderer.vue`, `package.json`, `FdeStudy.vue`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `usePracticeProgress()` (e.g. with `copyShareLink()` and `exportJson()`) actually correct?**
  _`usePracticeProgress()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Hub`, `Docs`, `Plan` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `md-to-blocks.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.05058717253839205 - nodes in this community are weakly interconnected._
- **Why does `pickLocale()` connect `pickLocale` to `DayList.vue`, `DocReaderPage.vue`, `search-text.util.ts`, `DesignLightbox.vue`, `MilestoneList.vue`, `PracticeHome.vue`, `PracticeStep.vue`, `ResourceDoc.vue`, `DesignGallery.vue`, `PracticeDesign.vue`, `BlockRenderer.vue`, `PlanDay.vue`, `DayDetail.vue`, `kb-search-core.util.ts`, `PlanHome.vue`, `use-doc-reader.composable.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `useProgress()` (e.g. with `copyShareLink()` and `exportJson()`) actually correct?**
  _`useProgress()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Should `DocReaderPage.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.08620689655172414 - nodes in this community are weakly interconnected._