# Graph Report - interview-senior-fe  (2026-10-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1448 nodes · 2999 edges · 105 communities (65 shown, 40 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fe0631ec`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99

## God Nodes (most connected - your core abstractions)
1. `pickLocale()` - 35 edges
2. `usePracticeProgress()` - 29 edges
3. `useProgress()` - 28 edges
4. `splitSearchKeywords()` - 20 edges
5. `useInterviewUnlock()` - 20 edges
6. `toAuthApiError()` - 19 edges
7. `foldSearchText()` - 18 edges
8. `isPracticeStepId()` - 15 edges
9. `useEditMode()` - 14 edges
10. `Localized` - 13 edges

## Surprising Connections (you probably didn't know these)
- `buildSearchIndex()` --calls--> `indexKnowledgeDoc()`  [EXTRACTED]
  server/utils/kbSearch.ts → src/modules/knowledge-base/utils/kb-search-core.util.ts
- `searchKnowledgeBase()` --calls--> `searchIndexRecords()`  [EXTRACTED]
  server/utils/kbSearch.ts → src/modules/knowledge-base/utils/kb-search-core.util.ts
- `distinctiveQuery()` --calls--> `foldSearchText()`  [EXTRACTED]
  tests/real-content.optional.test.ts → src/modules/knowledge-base/utils/search-text.util.ts
- `readPracticeDesign()` --calls--> `localeSpecPath()`  [EXTRACTED]
  server/utils/contentStore.ts → src/modules/practice/utils/spec-locale.util.ts
- `readPracticeDesign()` --calls--> `specHeadingsFromMarkdown()`  [EXTRACTED]
  server/utils/contentStore.ts → src/modules/practice/utils/spec-ref.util.ts

## Import Cycles
- None detected.

## Communities (105 total, 40 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (66): contentDir, copyContentIntoNitroOutput(), 'nitro:init'(), rootDir, srcRoot, days, errors, fail() (+58 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (57): day, r, copyLocal(), copyOptionalDesign(), copySpecIfPresent(), dest, downloadRepo(), fail() (+49 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (55): lang, { locale }, query, route, known, lang, route, slug (+47 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (55): PracticeStep, scoreInterviewQuestion(), activeIndex, choose(), emit, inputRef, onKey(), pending (+47 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (41): assertWriteAuth(), assertWriteAuth(), readInterviewBank(), b64url(), EDIT_TOKEN_TTL_MS, fromB64url(), isSixDigitPasscode(), issueEditToken() (+33 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (36): CalloutBlock, CalloutKind, CodeBlock, ContentBlock, ExampleBlock, FollowUpsBlock, HeadingBlock, HeadingLevel (+28 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (34): interviewPathForQuestion(), questionExists(), questionIdFromHash(), questionIdFromQuery(), requestedQuestionId(), withQuestionQuery(), filterInterviewQuestions(), QA_SESSION_BOOT_TIMEOUT_MS (+26 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (19): DISK_ROOT, fromDisk(), fromDiskText(), hasPracticeDesign(), listResourceIds(), planHasLab(), practiceNotFound(), publicCacheHeaders() (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (23): route, stepId, normalizePayload(), parseShareFromLocation(), isPracticeStepId(), PRACTICE_STEP_COUNT, PRACTICE_STEP_ID_RE, practiceStepIdFromOrder() (+15 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (23): lang, { locale }, practiceStepHref(), usePracticeDesign(), usePracticeDesignAvailable(), usePracticeIndex(), usePracticeStep(), localDoneMap (+15 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (25): localDoneMap, parseShareFromLocation(), publicMeta, source, statusMessage, useProgress(), applyShareFromUrl(), buildShareUrl() (+17 more)

### Community 11 - "Community 11"
Cohesion: 0.18
Nodes (19): emit, md(), prepared, props, text(), ContentSection, LocaleCode, tocFromSections() (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.09
Nodes (23): PracticeConcept, PracticeDesignFigma, PracticeDesignGroup, PracticeDesignPayload, PracticeDesignScreen, PracticeDesignTheme, PracticeDesignViewport, PracticeIndex (+15 more)

### Community 13 - "Community 13"
Cohesion: 0.12
Nodes (21): applyIds(), collapseAll(), emit, expandAll(), expanded, props, revealActive(), tree (+13 more)

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (20): practiceDesignFigma(), pickSpecMarkdown(), figma, lang, lightboxIndex, lightboxOpen, { locale, t }, navOpen (+12 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (24): runs-on, steps, timeout-minutes, concurrency, cancel-in-progress, group, CONTENT_REPO_TOKEN, jobs (+16 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (20): answerHtml, exampleHtml, md(), props, grouped, listRef, props, answerHtml (+12 more)

### Community 17 - "Community 17"
Cohesion: 0.17
Nodes (19): html(), itemHtml(), itemsOf(), props, ListBlock, renderInline(), renderMarkdown(), expandListItemSource() (+11 more)

### Community 18 - "Community 18"
Cohesion: 0.14
Nodes (21): lang, { locale }, openAlgo(), openPlanDoc(), props, router, planResourceHref(), docsHref() (+13 more)

### Community 19 - "Community 19"
Cohesion: 0.16
Nodes (22): categories, dayDir, dayFiles, errors, expectedSpecAnchor(), fail(), kbDir, kbFiles (+14 more)

### Community 20 - "Community 20"
Cohesion: 0.17
Nodes (19): hitIds, rendered, hrefFor(), props, decodeBasicEntities(), headingMatchesSection(), headingSpecAnchorId(), headingTextFromLine() (+11 more)

### Community 21 - "Community 21"
Cohesion: 0.14
Nodes (19): dependencies, react@^19.0.0, react-dom@^19.0.0, devDependencies, @types/react@^19.0.0, @types/react-dom@^19.0.0, vite@^6.0.0, @vitejs/plugin-react@^4.3.0 (+11 more)

### Community 22 - "Community 22"
Cohesion: 0.18
Nodes (17): AUTH_I18N_KEY, AuthApiError, AuthErrorCode, KNOWN_CODES, localizeAuthError(), parseApiErrorCode(), parseApiErrorMessage(), stringFromUnknown() (+9 more)

### Community 23 - "Community 23"
Cohesion: 0.11
Nodes (18): if, runs-on, steps, BASE, HEAD, jobs, context, name (+10 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (15): label, props, usePracticeSteps(), nextUnfinishedId(), continueStep(), filteredSteps, lang, { locale } (+7 more)

### Community 25 - "Community 25"
Cohesion: 0.15
Nodes (15): emit, { isVisible, onFocusIn, onFocusOut }, measuredHeight, props, rootRef, spacerHeight, updateHeight(), useHideOnScrollBar() (+7 more)

### Community 26 - "Community 26"
Cohesion: 0.17
Nodes (13): classifyContentHref(), ContentHref, classifyKbHref(), GITHUB_BLOB_MAIN, KbHrefResult, normalizeDocPath(), classifyMarkdownHref(), GITHUB_BLOB_MAIN (+5 more)

### Community 27 - "Community 27"
Cohesion: 0.22
Nodes (13): clearInterviewToken(), INTERVIEW_TOKEN_STORAGE_KEY, interviewAuthHeaders(), isInterviewTokenStorageKey(), memoryTokenStorage(), readInterviewToken(), TokenStorage, writeInterviewToken() (+5 more)

### Community 28 - "Community 28"
Cohesion: 0.19
Nodes (17): usePracticeProgress(), applyShareFromUrl(), buildShareUrl(), copyShareLink(), enterViewOnly(), exportJson(), importJsonFile(), isDone() (+9 more)

### Community 29 - "Community 29"
Cohesion: 0.15
Nodes (12): PlanResourceSummary, isLabResourceId(), visiblePlanResources(), filteredDays, lang, { locale }, navOpen, quickResources (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.17
Nodes (14): dependencies, marked@^15.0.12, nuxt@^3.21.11, @vercel/blob@^2.8.0, vue@^3.5.43, description, name, private (+6 more)

### Community 31 - "Community 31"
Cohesion: 0.13
Nodes (14): jobs, validate, name, on, pull_request, push, branches, name (+6 more)

### Community 32 - "Community 32"
Cohesion: 0.14
Nodes (12): PlanDaySummary, PlanWeek, daysByWeek, lang, { locale }, openDays, props, visibleWeeks (+4 more)

### Community 33 - "Community 33"
Cohesion: 0.27
Nodes (11): useAuthSession(), refresh(), AuthSession, AuthSessionScope, authSessionUrl(), clearAuthSession(), EMPTY_AUTH_SESSION, fetchAuthSession() (+3 more)

### Community 34 - "Community 34"
Cohesion: 0.19
Nodes (14): bumpZoom(), clampIndex(), closeBtn, emit, go(), lang, { locale, t }, onKey() (+6 more)

### Community 35 - "Community 35"
Cohesion: 0.14
Nodes (13): description, name, runs, steps, using, name, run, shell (+5 more)

### Community 36 - "Community 36"
Cohesion: 0.15
Nodes (11): PracticeMilestone, PracticeStepSummary, lang, { locale }, props, stepsByMilestone, visibleMilestones, lang (+3 more)

### Community 37 - "Community 37"
Cohesion: 0.19
Nodes (13): activeHeading, applyHash(), headingEls(), jumpTo(), props, proseRef, query, scrollContainer() (+5 more)

### Community 38 - "Community 38"
Cohesion: 0.18
Nodes (12): devDependencies, typescript@^5.8.0, vitest@^3.0.0, vitest, name, private, scripts, test (+4 more)

### Community 39 - "Community 39"
Cohesion: 0.18
Nodes (7): { locale, setLocale }, HUB_MODULES, HubModuleCard, HubRoute, Home, modules, usePracticeAvailable()

### Community 40 - "Community 40"
Cohesion: 0.15
Nodes (12): VERCEL_DEPLOY_HOOK_URL, jobs, vercel, name, on, push, branches, env (+4 more)

### Community 41 - "Community 41"
Cohesion: 0.17
Nodes (10): aliases, { data: plan }, emit, lang, { locale, t }, onDocClick(), props, resourceId (+2 more)

### Community 42 - "Community 42"
Cohesion: 0.26
Nodes (12): withTimeout(), emptyBank(), useInterviewUnlock(), bootSession(), loadQuestions(), lock(), onStorage(), reload() (+4 more)

### Community 43 - "Community 43"
Cohesion: 0.28
Nodes (11): publishToCloud(), fetchCloudPracticeProgress(), practiceProgressApiUrl(), publishCloudPracticeProgress(), publishToCloud(), authEditApiUrl(), fetchCloudProgress(), getWriteToken() (+3 more)

### Community 44 - "Community 44"
Cohesion: 0.17
Nodes (12): scripts, build, data:export, data:migrate, data:pull, data:validate, dev, postinstall (+4 more)

### Community 45 - "Community 45"
Cohesion: 0.21
Nodes (8): dayNumber, route, path, route, PlanRoute, Day, Home, Resource

### Community 46 - "Community 46"
Cohesion: 0.27
Nodes (9): label, { t }, { theme, toggle }, readStored(), ThemeMode, useTheme(), apply(), init() (+1 more)

### Community 47 - "Community 47"
Cohesion: 0.27
Nodes (9): adjacentDocs(), readContentJson(), readKnowledgeCatalog(), readKnowledgeDoc(), buildSearchIndex(), getKbSearchIndex(), searchKnowledgeBase(), SearchRecord (+1 more)

### Community 48 - "Community 48"
Cohesion: 0.27
Nodes (9): PracticeDesignIndex, DEFAULT_SPEC_PATH, DESIGN_INDEX_REL, DESIGN_SCREENS_REL, loadPracticeDesignFromDir(), loadPracticeDesignIndexFromDir(), loadPracticeSpecMarkdownFromDir(), localeSpecPath() (+1 more)

### Community 49 - "Community 49"
Cohesion: 0.20
Nodes (11): hasLabContent(), aliases, { data: plan }, DayTab, emit, lang, { locale }, onDocClick() (+3 more)

### Community 50 - "Community 50"
Cohesion: 0.33
Nodes (8): bindAll(), cleanups, docsMain(), maxScrollTop(), onScroll(), scrollTargets(), scrollTop(), visible

### Community 51 - "Community 51"
Cohesion: 0.20
Nodes (9): name, private, scripts, algo:test, algo:test:day, dev:next, dev:react, dev:vue (+1 more)

### Community 52 - "Community 52"
Cohesion: 0.20
Nodes (10): devDependencies, @nuxtjs/i18n@^9.5.6, @nuxtjs/tailwindcss@^6.14.0, @types/node@^26.6.3, typescript@^6.0.3, vitest@^3.2.4, vitest, @nuxtjs/i18n (+2 more)

### Community 53 - "Community 53"
Cohesion: 0.20
Nodes (7): dayNumber, navOpen, props, {
  readOnly,
  isDone,
  toggleDone,
  modalOpen,
  unlocking,
  unlockError,
  tryUnlock,
  skipUnlock,
}, retrying, router, { t }

### Community 54 - "Community 54"
Cohesion: 0.44
Nodes (7): PlanDay, PlanIndex, stripPlanDate(), stripPlanDayDates(), stripPlanIndexDates(), usePlanDay(), usePlanIndex()

### Community 55 - "Community 55"
Cohesion: 0.25
Nodes (7): emit, hasPinnedNav, mainRef, navOpenModel, props, slots, topBarHeight

### Community 56 - "Community 56"
Cohesion: 0.32
Nodes (7): emit, fileInput, onFileChange(), onImportClick(), props, sourceLabel, toolsOpen

### Community 57 - "Community 57"
Cohesion: 0.38
Nodes (4): PracticeRoute, Design, Home, Step

### Community 58 - "Community 58"
Cohesion: 0.29
Nodes (6): ./.nuxt/tsconfig.json, compilerOptions, paths, extends, @kb/*, @plan/*

### Community 60 - "Community 60"
Cohesion: 0.33
Nodes (5): AppRoute, Docs, Hub, Plan, Practice

### Community 61 - "Community 61"
Cohesion: 0.40
Nodes (4): digits, emit, onSubmit(), props

### Community 62 - "Community 62"
Cohesion: 0.40
Nodes (4): digits, emit, onSubmit(), props

### Community 63 - "Community 63"
Cohesion: 0.40
Nodes (4): buildCommand, framework, installCommand, $schema

### Community 66 - "Community 66"
Cohesion: 0.50
Nodes (4): scripts, build, dev, test

### Community 97 - "Community 97"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **14 isolated node(s):** `Index`, `Reader`, `Home`, `Day`, `Home` (+9 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 484 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `marked` connect `Community 30` to `Community 0`, `Community 17`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `usePracticeProgress()` (e.g. with `copyShareLink()` and `exportJson()`) actually correct?**
  _`usePracticeProgress()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Index`, `Reader`, `Home` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05427905427905428 - nodes in this community are weakly interconnected._
- **Why does `typescript` connect `Community 38` to `Community 52`, `Community 21`, `Community 30`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `useProgress()` (e.g. with `copyShareLink()` and `exportJson()`) actually correct?**
  _`useProgress()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05517503805175038 - nodes in this community are weakly interconnected._