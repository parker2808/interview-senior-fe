# Frontend Project Structure

Adapted from [product-details STRUCTURE.md](https://github.com/parker2808/product-details/blob/main/STRUCTURE.md) for this Nuxt app.

## Overview

```text
/
  app.vue · nuxt.config.ts · tailwind.config.ts · tsconfig.json
  pages/                          # Thin route wrappers only
  layouts/
  server/api/                     # Nitro API (progress, auth)
  locales/                        # @nuxtjs/i18n message files
  public/
  documents/                      # Shared interview KB (vi|en markdown)
  modules/                        # Content tracks (markdown only)
    study-plan-30-days/content/
  src/
    assets/css/
    modules/                      # Feature UI modules
      core/                       # Shared UI / helpers
      hub/
      knowledge-base/
      study-plan/
```

## Module-Based Architecture (`src/modules/`)

Each feature lives in its own self-contained module:

```text
src/modules/[module-name]/
├── components/               # Vue components (PascalCase folders/files)
├── composables/              # *.composable.ts
├── stores/                   # *.store.ts (Pinia when needed)
├── queries/                  # *.query.ts
├── mutations/                # *.mutation.ts
├── services/                 # *.service.ts
├── enums/                    # *.enum.ts
├── constants/                # *.constant.ts
├── types/
│   ├── entities/             # *.type.ts
│   ├── forms/
│   └── requests/
├── styles/                   # module styles when needed
├── utils/                    # *.util.ts
├── helpers/                  # *.helper.ts
├── mockups/                  # *.mockup.ts
└── views/                    # Page-level Vue (PascalCase)
```

## Naming Conventions

- **Vue components / views**: PascalCase (`DocSidebar/DocSidebar.vue`, `HubHome.vue`)
- **Everything else**: kebab-case + suffix (`doc-catalog.constant.ts`, `use-progress.composable.ts`)
- **Module dirs**: kebab-case (`knowledge-base/`, `study-plan/`)
- **Alias**: `@/*` → `src/*` (e.g. `@/modules/hub/views/HubHome.vue`)

## Pages ↔ Views

`pages/` only wires routes; UI lives in module `views/`:

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
import HubHome from '@/modules/hub/views/HubHome.vue'
</script>

<template>
  <HubHome />
</template>
```

## Content vs UI modules

| Path | Owns |
|---|---|
| `documents/` | Shared bilingual interview KB |
| `modules/<track>/content/` | Track markdown (plan, worksheets) — not Nuxt UI |
| `src/modules/<feature>/` | Feature UI per this structure |

## Creating a New UI Module

```bash
MODULE_NAME="your-module-name" && mkdir -p "src/modules/$MODULE_NAME"/{components,composables,stores,queries,mutations,services,enums,constants,styles,utils,helpers,mockups,views,types/{entities,forms,requests}}
```
