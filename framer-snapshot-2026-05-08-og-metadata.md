# Framer project snapshot — 2026-05-08 (OpenGraph metadata across all 7 surfaces)

Mixed CMS-data + Framer-UI milestone. No code components changed since `739773d` (2026-05-08 OG card images commit). All 7 page types now emit rich preview metadata in static HTML.

## What changed since `739773d`

### Static page Social Previews uploaded (5 surfaces)
Phil uploaded site OG cards manually-via-MCP-driven-Chrome to Framer Page Settings → Page Images → Social Preview:

| Page | nodeId | Image asset (Framer CDN) |
|---|---|---|
| `/` (home) | `augiA20Il` | `framerusercontent.com/assets/uQhnoS1FkPRsFvZGsqVAR1askDw.png` |
| `/thoughts` | `tcBiWyb8j` | `framerusercontent.com/assets/oG8l3jbWHiizgzxdqDfuCTm7kM.png` |
| `/work-brain` | `Hio60XiOO` | `framerusercontent.com/assets/jVjsiaFchGBTYjwMOwNQBYln06I.png` |
| `/factory` | (factory page id) | `framerusercontent.com/assets/Oy72VdqwLt3beIIMGwEN0rvW65g.png` |
| `/404` | `Z8gAEFcdz` | `framerusercontent.com/assets/snILq9yjHBjSzHuM80LdUP3oLU.png` |

Source PNGs (1200×630) live in this repo at `og/site-{home,thoughts,work-brain,factory,404}.png` from commit `739773d`. Framer auto-uploaded externally-referenced images to its own CDN; the live HTML now references the framerusercontent.com URLs (works either way for scrapers).

### Dynamic CMS-bound templates configured (2 surfaces)

Both detail-page templates now bind their SEO surfaces to CMS Variables:

**`/essays/:slug`** (nodeId `tEBllyikl`):
- Title: `{{Title}} - Phil Mora — Building platforms for the agent era`
- Description: `{{Dek}}`
- Social Preview: `Choose Image` → `CMS Variables` → `OG Image`

**`/work-brain/:slug`** (nodeId `sxV9vzjDf`):
- Title: `{{Title}} - Phil Mora — Building platforms for the agent era`
- Description: `{{Dek}}`
- Social Preview: `Choose Image` → `CMS Variables` → `OG Image`

The `OG Image` field was added by Phil to both `Essays` (id `iztk2YMg4`) and `Work Brain Concepts` (id `M2QB9xWra`) collections. New field IDs: `KFZ3nEl1R` (Essays) and `vHsVeAwgL` (Work Brain Concepts).

### CMS items auto-filled (17 items)

Auto-filled via Framer MCP `upsertCMSItem` with `raw.githubusercontent.com/philmora/philmora-site/main/og/...` URLs (Framer reuploads to its own CDN on first render):

- **Essays (8/8)**: the-pm-is-dead, the-pirate-stack, the-half-life-of-product-management, the-context-engineering-discipline, second-brain-philosophy, riding-the-curve, agentic-readiness, change-agency-for-ai-adoption
- **Work Brain Concepts (9/9 with matching mirror entries)**: repo-velocity, agentic-readiness, context-engineering, pm-as-builder, change-agency-for-ai-adoption, vibe-driven-product-development, two-claude-protocol, work-brain-mirror-public, 2026-04-30-philmora-detail-page-shipped

## Production verification (2026-05-08, post-publish)

All 7 surfaces emit complete `og:*` and `twitter:*` meta tags in static HTML. Bot scrapers (LinkedIn, Slack, iMessage, X, Discord) get rich previews on every philmora.com URL.

Spot-checked:
- `https://philmora.com/` → site card, generic site title/dek
- `https://philmora.com/essays/the-pm-is-dead` → "The PM Is Dead. Long Live the Builder." + per-essay dek + per-essay OG card
- `https://philmora.com/work-brain/repo-velocity` → "Repo Velocity" + per-concept dek + per-concept OG card

All return `twitter:card = summary_large_image` and absolute `og:image` URLs.

## Pages (unchanged structure; settings updated)
| nodeId | path | what changed |
|---|---|---|
| `augiA20Il` | `/` | Social Preview uploaded |
| `tcBiWyb8j` | `/thoughts` | Social Preview uploaded |
| `Z8gAEFcdz` | `/404` | Social Preview uploaded |
| `sinWaex7q` | `/essays` | (collection page; no template change) |
| `tEBllyikl` | `/essays/:slug` | Title/Description/Social Preview templated to CMS |
| `Hio60XiOO` | `/work-brain` | Social Preview uploaded |
| `sxV9vzjDf` | `/work-brain/:slug` | Title/Description/Social Preview templated to CMS |
| (factory id) | `/factory` | Social Preview uploaded |

## Code components (unchanged)
All `.tsx` files unchanged from `739773d`. Today was Framer SEO settings + CMS data only.

## CMS collections
| id | name | managedBy | items | new field |
|---|---|---|---|---|
| `iztk2YMg4` | Essays | user | 8 | `OG Image` (`KFZ3nEl1R`) |
| `M2QB9xWra` | Work Brain Concepts | user | 9 | `OG Image` (`vHsVeAwgL`) |
| `ape_mxXpF` | Product Factory Recipes | user | 1 | (not extended; only 1 recipe) |

## Architecture decision

Full ADR at `~/BaseCamp/home/decisions/2026-05-08_philmora-og-metadata.md`. Summary:

- **Option chosen**: brand-correct text-cards generated per surface from frontmatter (title + dek + slug eyebrow + brand strip)
- **Render pipeline**: HTML template + Python generator + puppeteer-core with `document.fonts.ready` wait. Critical detail: Chrome `--screenshot` CLI takes the screenshot before web fonts swap in — even with `&display=block` in the Google Fonts URL. The fix is `puppeteer.page.evaluate(() => document.fonts.ready)` before `page.screenshot()`.
- **Hosting**: PNGs in this repo at `og/`, served via raw.githubusercontent.com initially; Framer auto-rehosts on first render to its own CDN.
- **Scaling**: new essay/concept/recipe → regenerate via `/tmp/og-html/generate.py` → push to `og/` → upsert CMS item with new URL → publish in Framer. Should migrate generator to `~/BaseCamp/factory/scripts/sync-og-cards.sh` and promote to a Product Factory recipe.

## Next-session optional work
- **Promote OG generator to Product Factory recipe** — currently at `/tmp/og-html/`. Migrate to `~/BaseCamp/factory/scripts/sync-og-cards.sh` parallel to `sync-to-mirror.sh` and write `recipes/og-card-generation.md`.
- **Visual smoke test** — paste each of the 7 URLs into LinkedIn Post Inspector + iMessage + Slack DM to confirm rendering.
- **Twitter Card global** — confirmed `summary_large_image` works for all surfaces. No per-surface override needed.
- **404 page OG image** — currently uses `site-404.png` ("You drifted off the map"). Could swap to `site-home.png` if 404 is shared often (unlikely). Defer until usage data.
