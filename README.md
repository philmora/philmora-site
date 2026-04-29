# philmora.com — Framer Site Backup

Backup of all code components, design tokens, and project structure for the philmora.com Framer project.

## Latest snapshot
**2026-04-29** — Terminal Aurora rebuild (post-March 23 redesign). 10 active code components, no code overrides, 5 web pages. See `framer-snapshot-2026-04-29.md` for full project structure.

## Layout

| Path | Status | What |
|---|---|---|
| `code-components/EssayBodyCMS.tsx` | active | Markdown-from-GitHub essay detail page (`/essays/:slug`). Fetches `philmora/essays/main/content/{slug}.md` at runtime. |
| `code-components/HomeContent.tsx` | active | Single-page home hub (hero through footer). |
| `code-components/ThoughtsContent.tsx` | active | Essay index (`/thoughts`). Reads `essays.json`, fallback to inline list. |
| `code-components/SiteNav.tsx` | active | Fixed top nav with section tracking. |
| `code-components/SiteFooter.tsx` | active | Standalone footer. |
| `code-components/NotFoundContent.tsx` | active | 404 page body. |
| `code-components/PageEffects.tsx` | active | Aurora gradient + grain + custom cursor (boot layer). |
| `code-components/LiveClock.tsx` | active | Ticking clock, IANA TZ. |
| `code-components/RuntimeCounter.tsx` | active | HH:MM:SS since mount. |
| `code-components/StatCounter.tsx` | active | Count-up on viewport entry. |
| `code-components/ParallaxHero.tsx` | legacy | Pre-rebuild (March 2026). Not in current Framer project. |
| `code-components/ParallaxBackground.tsx` | legacy | Same. |
| `code-components/GlassCard.tsx` | legacy | Same. |
| `code-overrides/*.tsx` | legacy | Pre-rebuild overrides. Current Framer project has zero code overrides. |
| `docs/*` | reference | Pre-rebuild design guide, copy reference, MJ prompts, mockups. |

Legacy files are kept in-place for historical reference. Git history preserves the pre-rebuild state at commit `a4b6f1b` regardless.

## Design system (current — Terminal Aurora)

```
Headings:  Fraunces 300 (opsz 144, SOFT 50)
Italic:    Fraunces 900 italic (signal-orange)
Body:      Fraunces 300
Mono:      JetBrains Mono (chrome, eyebrows, code, dates)

Background:  /ink         #0A0B0F
Inset:       /ink-2      #12141B
Surface:     /ink-3      #1A1D26

Foreground:  /paper      #EDE6D7   (headings, strong text)
Mid:         /paper-dim  #BDB6A8   (body text)
Mute:        /paper-mute #7A7568   (eyebrows, meta, dates)

Accent:      /signal     #E26B38   (italics, links, accent)
Accent-dim:  /signal-dim #9A4A28
OK:          /ok         #4FBA87   (status indicator)

Edges:       /edge          rgba(237,230,215,0.08)
             /edge-strong   rgba(237,230,215,0.18)
```

Italic emphasis renders in `/signal` at weight 900 (heavy italic, distinctive). Bold renders in `/paper` at weight 700. Block code in JetBrains Mono on `/ink-2` background.

## Pages
- `/` — single-page hub with anchor sections (`#now`, `#pattern`, `#believe`, `#voices`, `#thoughts`)
- `/thoughts` — essay index (renders `ThoughtsContent`)
- `/essays/:slug` — essay detail (renders `EssayBodyCMS`)
- `/essays` — Framer CMS-bound index page
- `/404` — not-found page (renders `NotFoundContent`)

## Markdown-from-GitHub pattern

`/thoughts` and `/essays/:slug` read content from `https://github.com/philmora/essays` at runtime:
- `essays.json` is the index (slug, title, dek, date, reading_time, order, published)
- `content/{slug}.md` is the body (frontmatter stripped at fetch, custom inline markdown→HTML renderer in component)

This is the pattern that `/work-brain` will extend (per the Phil×home-laptop-Claude work-brain integration, in progress as of 2026-04-29).

## Production
- Live: https://philmora.com (deployed 2026-04-19)
- Staging: https://refreshed-acknowledge-343777.framer.app

## How to take a fresh backup
1. Pull latest 10 components from Framer via the Framer MCP `readCodeFile` tool (one per `codeFileId`).
2. Write each to `code-components/{Name}.tsx`.
3. Update `framer-snapshot-{date}.md` if pages, color styles, or text styles changed.
4. Commit with a descriptive message (`Backup snapshot: {date} — {what changed}`).
