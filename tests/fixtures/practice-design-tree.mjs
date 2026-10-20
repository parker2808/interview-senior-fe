#!/usr/bin/env node
/**
 * Optional design-spec tree: `plans/portfolio-design-system.md` + `practice/design/`.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const L = (en, vi = en) => ({ en, vi })

/** 1×1 white WebP so tests do not depend on ffmpeg. */
export const TINY_WEBP = Buffer.from(
  'RIFF$\x00\x00\x00WEBPVP8 \x18\x00\x00\x00\x30\x01\x00\x9d\x01\x2a\x01\x00\x01\x00\x02\x00\x34\x25\xa4\x00\x03\x70\x00\xfe\xfb\x94\x00\x00',
  'binary',
)

export const FIXTURE_SPEC_PATH = 'plans/portfolio-design-system.md'
export const FIXTURE_SPEC_PATH_VI = 'plans/portfolio-design-system.vi.md'

export function fixtureDesignSpecMarkdownVi() {
  return `# Hệ thống thiết kế portfolio

Nguồn sự thật cho UI sản phẩm practice. Heading HTML \`<h2 id="s-N">\` / \`<h3 id="s-N-M">\` để \`§X.Y\` resolve.

<h2 id="s-1">1. Tổng quan sản phẩm</h2>

> **Trong chương này:** các mục đánh số bên dưới.

| § | Mục |
| --- | --- |
| 1.5 | Navigation |

Site public là một content graph song ngữ. Admin là bề mặt riêng, cùng token.

| Surface | Audience | Auth |
| --- | --- | --- |
| Public | Readers | None |
| Admin | Editors | Session cookie |

<h3 id="s-1-5">1.5 Navigation</h3>

Nav chính: Hub, Docs, Plan, Practice, Q&A. Practice cũng link sang trang Design này.

<h2 id="s-2">2. Foundations</h2>

> **Trong chương này:** các mục đánh số bên dưới.

| § | Mục |
| --- | --- |
| 2.1 | Color |
| 2.3 | Hiệu năng |

Color, type, và space. Token phải sống được ở light và dark.

<h3 id="s-2-1">2.1 Color</h3>

Accent là teal. Không hard-code white trên elevated surface.

<h3 id="s-2-3">2.3 Hiệu năng</h3>

Giữ LCP của thumbnail gallery trung thực: width/height trên mọi \`<img>\`, \`loading="lazy"\` dưới fold.

<h2 id="s-3">3. Design tokens</h2>

> **Trong chương này:** các mục đánh số bên dưới.

| § | Mục |
| --- | --- |
| 3.1b | Atmosphere |

<h3 id="s-3-1b">3.1b Atmosphere</h3>

Hue phụ cho admin. Cùng token light/dark.

<h2 id="s-5">5. Screens</h2>

> **Trong chương này:** các mục đánh số bên dưới.

| § | Mục |
| --- | --- |
| 5.1 | Home - light |
| 5.2 | Admin dashboard |

Ảnh full page. View admin dài phải cuộn trong lightbox.

<h3 id="s-5-1">5.1 Home - light</h3>

Trang chủ public, theme sáng, desktop.

<h3 id="s-5-2">5.2 Admin dashboard</h3>

Editor thấy draft, publish, và media.

<h2 id="s-6">6. Motion</h2>

Ưu tiên opacity và translate nhỏ. Tôn trọng \`prefers-reduced-motion\`.
`
}

export function fixtureDesignSpecMarkdown() {
  return `# Portfolio design system

Source of truth for the practice product UI. Numbered headings are HTML \`<h2 id="s-N">\` / \`<h3 id="s-N-M">\` so \`§X.Y\` refs resolve.

<h2 id="s-1">1. Product overview</h2>

> **In this chapter:** numbered sections below.

| § | Section |
| --- | --- |
| 1.5 | Navigation |

The public site is a bilingual content graph. Admin is a separate surface with the same tokens.

| Surface | Audience | Auth |
| --- | --- | --- |
| Public | Readers | None |
| Admin | Editors | Session cookie |

<h3 id="s-1-5">1.5 Navigation</h3>

Primary nav: Hub, Docs, Plan, Practice, Q&A. Practice also links to this Design page.

\`\`\`
+--------------------------------------+
| Hub  Docs  Plan  Practice  Q&A  [☀] |
+--------------------------------------+
| Practice   [Steps] [Design]          |
+--------------------------------------+
\`\`\`

<h2 id="s-2">2. Foundations</h2>

> **In this chapter:** numbered sections below.

| § | Section |
| --- | --- |
| 2.1 | Color |
| 2.3 | Hiệu năng |

Color, type, and space. Tokens must survive light and dark.

<h3 id="s-2-1">2.1 Color</h3>

Accent is teal. Never hard-code white on elevated surfaces.

| Token | Light | Dark |
| --- | --- | --- |
| \`--accent\` | \`#0f766e\` | \`#2dd4bf\` |
| \`--ink\` | \`#14201c\` | \`#e7f0ec\` |

\`\`\`css
:root { --accent: #0f766e; }
html[data-theme='dark'] { --accent: #2dd4bf; }
\`\`\`

<h3 id="s-2-3">2.3 Hiệu năng</h3>

Keep LCP on gallery thumbnails honest: width/height on every \`<img>\`, \`loading="lazy"\` below the fold.

<h2 id="s-3">3. Design tokens</h2>

> **In this chapter:** numbered sections below.

| § | Section |
| --- | --- |
| 3.1b | Atmosphere |

<h3 id="s-3-1b">3.1b Atmosphere</h3>

Secondary hue for admin. Same tokens in light and dark.

<h2 id="s-5">5. Screens</h2>

> **In this chapter:** numbered sections below.

| § | Section |
| --- | --- |
| 5.1 | Home - light |
| 5.2 | Admin dashboard |

Full-page captures. Tall admin views must scroll inside the lightbox.

<h3 id="s-5-1">5.1 Home - light</h3>

Public home, light theme, desktop. Search sits in the header; milestone cards below.

\`\`\`
+---------------------------+
| Logo     Search     Lang  |
+---------------------------+
| Hero                      |
|  [Continue]               |
+---------------------------+
| Milestone cards           |
+---------------------------+
\`\`\`

<h3 id="s-5-2">5.2 Admin dashboard</h3>

Editors see drafts, publish, and media. Dark admin is the same layout with inverted tokens.

<h2 id="s-6">6. Motion</h2>

Prefer opacity and small translates. Respect \`prefers-reduced-motion\`.
`
}

export function fixtureDesignScreens() {
  return [
    {
      id: 'home-light',
      file: 'practice/design/screens/01-home-light.webp',
      title: L('Home — light', 'Trang chủ — sáng'),
      caption: L(
        'Public home in light theme, desktop width.',
        'Trang chủ public, theme sáng, desktop.',
      ),
      group: 'public',
      theme: 'light',
      viewport: 'desktop',
      specRefs: ['§5.1'],
      width: 1440,
      height: 900,
      color: '0xe7f0ec',
    },
    {
      id: 'home-dark',
      file: 'practice/design/screens/02-home-dark.webp',
      title: L('Home — dark', 'Trang chủ — tối'),
      caption: L(
        'Public home in dark theme.',
        'Trang chủ public, theme tối.',
      ),
      group: 'public',
      theme: 'dark',
      viewport: 'desktop',
      specRefs: ['§5.1'],
      width: 1440,
      height: 900,
      color: '0x0f1614',
    },
    {
      id: 'home-mobile',
      file: 'practice/design/screens/03-home-mobile.webp',
      title: L('Home — mobile', 'Trang chủ — mobile'),
      caption: L(
        'Public home at a phone viewport.',
        'Trang chủ public trên mobile.',
      ),
      group: 'public',
      theme: 'light',
      viewport: 'mobile',
      specRefs: ['§5.1'],
      width: 390,
      height: 844,
      color: '0xd9efe9',
    },
    {
      id: 'admin-light',
      file: 'practice/design/screens/04-admin-light.webp',
      title: L('Admin — light', 'Admin — sáng'),
      caption: L(
        'Tall admin dashboard (full-page, scrolls in the lightbox).',
        'Dashboard admin dài (cuộn trong lightbox).',
      ),
      group: 'admin',
      theme: 'light',
      viewport: 'desktop',
      specRefs: ['§5.2'],
      width: 1440,
      height: 2200,
      color: '0xccfbf1',
    },
    {
      id: 'admin-dark',
      file: 'practice/design/screens/05-admin-dark.webp',
      title: L('Admin — dark', 'Admin — tối'),
      caption: L(
        'Admin dashboard in dark theme.',
        'Dashboard admin theme tối.',
      ),
      group: 'admin',
      theme: 'dark',
      viewport: 'desktop',
      specRefs: ['§5.2'],
      width: 1440,
      height: 900,
      color: '0x134e4a',
    },
  ]
}

export const FIXTURE_FIGMA = {
  url: 'https://www.figma.com/design/fixture/portfolio-design-system',
  label: L('Open in Figma', 'Mở trong Figma'),
  note: L(
    'Figma is the source of truth for these screens.',
    'Figma là nguồn sự thật cho các màn hình này.',
  ),
}

export function fixtureDesignIndex(screens = fixtureDesignScreens(), options = {}) {
  const index = {
    version: 1,
    specPath: FIXTURE_SPEC_PATH,
    title: L('Portfolio design system', 'Hệ thống thiết kế portfolio'),
    intro: L(
      'Screens and the numbered spec the practice steps point at with § refs.',
      'Màn hình và spec đánh số mà các bước practice trỏ tới bằng §.',
    ),
    screens: screens.map(
      ({ color: _color, ...screen }) => screen,
    ),
  }
  if (options.figma !== false) index.figma = options.figma || FIXTURE_FIGMA
  return index
}

function writeWebp(file, { width, height, color, useFfmpeg }) {
  mkdirSync(path.dirname(file), { recursive: true })
  if (useFfmpeg) {
    const result = spawnSync(
      'ffmpeg',
      [
        '-y',
        '-f',
        'lavfi',
        '-i',
        `color=c=${color}:s=${width}x${height}:d=0.04`,
        '-frames:v',
        '1',
        file,
      ],
      { encoding: 'utf8' },
    )
    if (result.status === 0) return
  }
  writeFileSync(file, TINY_WEBP)
}

export function writePracticeDesignFixture(dir, options = {}) {
  const useFfmpeg = options.ffmpeg !== false
  const screens = fixtureDesignScreens()
  const write = (rel, value) => {
    const file = path.join(dir, rel)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`)
  }
  write(FIXTURE_SPEC_PATH, fixtureDesignSpecMarkdown())
  write(FIXTURE_SPEC_PATH_VI, fixtureDesignSpecMarkdownVi())
  write('practice/design/index.json', fixtureDesignIndex(screens, options))
  for (const screen of screens) {
    writeWebp(path.join(dir, screen.file), {
      width: screen.width,
      height: screen.height,
      color: screen.color,
      useFfmpeg,
    })
  }
  return dir
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = path.resolve(process.argv[2] || '.data/fixture-content')
  writePracticeDesignFixture(dir)
  console.log(`Wrote practice design fixture → ${dir}`)
}
