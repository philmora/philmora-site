# Framer project snapshot — 2026-04-30

Incremental snapshot capturing the work-brain detail-page milestone shipped 2026-04-30. Builds on `framer-snapshot-2026-04-29.md`.

## What changed since 2026-04-29

**New pages**
- `/work-brain` — wg9A5BGQb-superseded; current id `Hio60XiOO`. CMS-bound parent (Work Brain Concepts collection). Index page content not yet built (next session).
- `/work-brain/:slug` — current id `sxV9vzjDf`. CMS-bound dynamic detail page. Wires PageEffects + SiteNav + WorkBrainBody + SiteFooter.

**New CMS collection**
- `Work Brain Concepts` (id `M2QB9xWra`, user-managed). Fields: Title, Dek, Date, Updated, Category, Order. Plus Framer's built-in `slug`. 6 items populated (one per published concept in `philmora/work-brain-mirror`).

**New code component**
- `WorkBrainBody.tsx` (codeFileId `nyzFx69`). Detail-page renderer: parses `/work-brain/{slug}` from `window.location`, looks up the slug's category in `wiki.json`, fetches the matching `.md` from `philmora/work-brain-mirror`, renders prose via a forked-from-EssayBodyCMS pipeline. Adds wikilink resolution (`[[category/slug]]`), GFM table parsing, and a `stripTitleAndDek` preprocessor (removes the body's leading `# Title` + italic dek paragraph since both are already rendered from CMS metadata).

**Mirror visibility flipped**
- `philmora/work-brain-mirror`: PRIVATE → PUBLIC on 2026-04-30.
- Browser-side runtime fetch from `raw.githubusercontent.com/philmora/work-brain-mirror/main/...` requires public visibility. Airlock script + 193-pattern glossary (work-laptop side) remains the privacy boundary; repo visibility is downstream of that, not part of it. Same trust model as `philmora/essays`.

## Pages — full table
| nodeId | path | notes |
|---|---|---|
| `augiA20Il` | `/` | unchanged |
| `tcBiWyb8j` | `/thoughts` | unchanged |
| `Z8gAEFcdz` | `/404` | unchanged |
| `sinWaex7q` | `/essays` | unchanged |
| `tEBllyikl` | `/essays/:slug` | unchanged |
| `Hio60XiOO` | `/work-brain` | NEW — CMS-bound, Work Brain Concepts collection. Index content TBD. |
| `sxV9vzjDf` | `/work-brain/:slug` | NEW — CMS-bound dynamic detail. Wires WorkBrainBody. |

## Code components — full table
| codeFileId | path | active | notes |
|---|---|---|---|
| `m9qXlAP` | `PageEffects.tsx` | yes | unchanged |
| `eCIT2HW` | `LiveClock.tsx` | yes | unchanged |
| `CzAqFCQ` | `RuntimeCounter.tsx` | yes | unchanged |
| `iNe3AdH` | `StatCounter.tsx` | yes | unchanged |
| `PbxImyK` | `SiteNav.tsx` | yes | unchanged. Slot 06 (`WORK BRAIN`) NOT yet added. |
| `trXphK7` | `HomeContent.tsx` | yes | unchanged |
| `D2OYQjQ` | `SiteFooter.tsx` | yes | unchanged |
| `jS9JE_Q` | `NotFoundContent.tsx` | yes | unchanged |
| `pMTmSZu` | `ThoughtsContent.tsx` | yes | unchanged |
| `vWC35E2` | `EssayBodyCMS.tsx` | yes | unchanged |
| `nyzFx69` | `WorkBrainBody.tsx` | yes | NEW. See above. |

## CMS collections
| id | name | managedBy | items |
|---|---|---|---|
| `iztk2YMg4` | Essays | user | 8 |
| `M2QB9xWra` | Work Brain Concepts | user | 6 |

## Color/text styles
Unchanged from `framer-snapshot-2026-04-29.md`.

## Source repos at runtime
- `philmora/essays` (PUBLIC) — `essays.json` + `content/{slug}.md` for `/thoughts` index and `/essays/:slug` detail.
- `philmora/work-brain-mirror` (PUBLIC as of 2026-04-30) — `wiki.json` + `concepts/{slug}.md` for `/work-brain/:slug` detail. Index page (`/work-brain`) will read from same `wiki.json` once built.

## Production deployment
- Production: not yet pushed with work-brain content (philmora.com still serves pre-work-brain build).
- Staging: `refreshed-acknowledge-343777.framer.app` — work-brain detail page live as of 2026-04-30.

## Next session — work remaining
1. Build `WorkBrainIndex.tsx` and wire to `/work-brain` parent page (currently empty).
2. Add `WORK BRAIN` slot 06 to `SiteNav.tsx`.
3. Promote staging → production.
4. Backup commit (this milestone) + future backup once index ships.
