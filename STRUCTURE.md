# UI module conventions

Project overview, APIs, auth, and data flow: **[README.md](./README.md)** ([Tiếng Việt](./README-vi.md)).

This file is only how `src/modules/` is laid out.

## Overview

```text
pages/                    # thin route wrappers
src/modules/              # feature UI
server/api/               # Nitro
scripts/                  # pull / export / validate
.data/content/            # gitignored — pulled at build
```

Content JSON lives in private `parker2808/interview-fe-data`, not in this repo.

## Module layout

```text
src/modules/[module-name]/
├── components/               # PascalCase folders/files
├── composables/              # *.composable.ts
├── services/                 # *.service.ts
├── enums/                    # *.enum.ts
├── constants/                # *.constant.ts
├── types/entities/           # *.type.ts
├── utils/                    # *.util.ts
└── views/                    # page-level Vue (PascalCase)
```

## Naming

- **Vue components / views**: PascalCase (`DocSidebar/DocSidebar.vue`)
- **Everything else**: kebab-case + suffix (`use-progress.composable.ts`)
- **Module dirs**: kebab-case (`knowledge-base/`)
- **Alias**: `@/*` → `src/*`

## Pages ↔ views

`pages/` only wires the route; UI lives in the module view:

```vue
<script setup lang="ts">
import HubHome from '@/modules/hub/views/HubHome.vue'
</script>
<template>
  <HubHome />
</template>
```

## New UI module

```bash
MODULE_NAME="your-module-name" && mkdir -p "src/modules/$MODULE_NAME"/{components,composables,services,enums,constants,utils,views,types/entities}
```
