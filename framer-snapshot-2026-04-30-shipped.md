# Framer project snapshot — 2026-04-30 (shipped to production)

Production cut: philmora.com/work-brain is live as of 2026-04-30. Builds on `framer-snapshot-2026-04-30.md` (the detail-page-only milestone earlier the same day). This snapshot captures the full work-brain section shipped end-to-end.

## What changed since `framer-snapshot-2026-04-30.md`

**New code component**
- `WorkBrainIndex.tsx` (codeFileId `OcV9MSx`). Fetches `wiki.json` from `philmora/work-brain-mirror`, renders the catalog grouped by category, ordered by `_categories[slug].order`, with empty-state copy for unused categories. Concept rows: `§ NN` index + title + dek + date · linked to `/work-brain/{slug}`. Same Fraunces / signal-orange / paper-on-ink design system as the rest of the site.

**SiteNav updated**
- `SiteNav.tsx` (codeFileId `PbxImyK`) gained slot 06 `WORK BRAIN` linking to `/work-brain`. Slots 01–05 unchanged (still anchor links to `/#section` on home).
- New `NavLink` type with optional `href` field — the 5 home-section slots derive `/#${id}` as before; slot 06 uses an explicit path.
- Active-state detection upgraded: scroll-position tracking on home page is unchanged, but for cross-page consistency the nav now path-detects:
  - `/work-brain` and `/work-brain/:slug` → slot 06 lit
  - `/thoughts` and `/essays/:slug` → slot 05 lit
  - All other paths fall through to scroll tracking (or no active state if `trackSections=false`).
- Mid-width breakpoint (≤900px) added: tighter gap and smaller font on the 6 nav links so the row doesn't crowd. Below 720px the link text still hides as before.

**`/work-brain` page wired**
- Page id `Hio60XiOO`, Desktop variant `spiRt6Gno`. Auto-CMS layout deleted; page now stacks PageEffects + SiteNav + WorkBrainIndex + SiteFooter on `/ink` background.

**Production deployment**
- Production deploymentTime: `1777578805371` (2026-04-30 ~17:13 UTC).
- philmora.com/work-brain returns 200.
- philmora.com/work-brain/repo-velocity returns 200.
- philmora.com/work-brain/agentic-readiness returns 200.

## Pages — full table
| nodeId | path | notes |
|---|---|---|
| `augiA20Il` | `/` | unchanged |
| `tcBiWyb8j` | `/thoughts` | unchanged |
| `Z8gAEFcdz` | `/404` | unchanged |
| `sinWaex7q` | `/essays` | unchanged |
| `tEBllyikl` | `/essays/:slug` | unchanged |
| `Hio60XiOO` | `/work-brain` | wired with WorkBrainIndex (this snapshot) |
| `sxV9vzjDf` | `/work-brain/:slug` | wired with WorkBrainBody (prior snapshot) |

## Code components — full table
| codeFileId | path | active | notes |
|---|---|---|---|
| `m9qXlAP` | `PageEffects.tsx` | yes | unchanged |
| `eCIT2HW` | `LiveClock.tsx` | yes | unchanged |
| `CzAqFCQ` | `RuntimeCounter.tsx` | yes | unchanged |
| `iNe3AdH` | `StatCounter.tsx` | yes | unchanged |
| `PbxImyK` | `SiteNav.tsx` | yes | UPDATED — slot 06 + path-based active |
| `trXphK7` | `HomeContent.tsx` | yes | unchanged |
| `D2OYQjQ` | `SiteFooter.tsx` | yes | unchanged |
| `jS9JE_Q` | `NotFoundContent.tsx` | yes | unchanged |
| `pMTmSZu` | `ThoughtsContent.tsx` | yes | unchanged |
| `vWC35E2` | `EssayBodyCMS.tsx` | yes | unchanged |
| `nyzFx69` | `WorkBrainBody.tsx` | yes | unchanged from 2026-04-30 milestone |
| `OcV9MSx` | `WorkBrainIndex.tsx` | yes | NEW |

## CMS collections
| id | name | managedBy | items |
|---|---|---|---|
| `iztk2YMg4` | Essays | user | 8 |
| `M2QB9xWra` | Work Brain Concepts | user | 6 |

## Source repos at runtime
- `philmora/essays` (PUBLIC) — backs `/thoughts` and `/essays/:slug`.
- `philmora/work-brain-mirror` (PUBLIC) — backs `/work-brain` and `/work-brain/:slug`. Mirror visibility flipped from PRIVATE to PUBLIC on 2026-04-30 to enable browser-side runtime fetches.

## What this build closes out
The original Phil×home-laptop-Claude work-brain integration spec (per `~/Desktop/work-brain-framer-context.md` from 2026-04-27). All 5 deliverables shipped:

- ✅ `WorkBrainBody.tsx` (detail page with markdown renderer + wikilinks + GFM tables)
- ✅ `WorkBrainIndex.tsx` (catalog page reading from wiki.json)
- ✅ Dynamic route `/work-brain/:slug` (CMS-bound) + index route `/work-brain` (CMS-bound)
- ✅ `wiki.json` schema agreed and produced (work-laptop side, locked in handoff rev 2)
- ✅ Wikilink format honored as a regex-friendly constraint (only inside `## Related` lists)
- ✅ Mirror integration end-to-end: airlock script + 193-pattern glossary on work laptop → public mirror → philmora.com runtime fetch

## What's optional from here
- New concepts: work-laptop pushes to mirror + Phil upserts the matching CMS item via plugin (or bumps it by hand). No Framer rebuild needed; component fetches at runtime.
- New categories (decisions, sources, retros): same pattern. Add `_categories[X]` in `wiki.json`, populate items, upsert CMS items per item. Empty-state copy auto-generates from category display name.
- Component refactor: `WorkBrainBody`'s prose CSS could be extracted into a shared `ProsePrimitive` shared with `EssayBodyCMS` to reduce duplication. Not urgent.
