# Framer project snapshot — 2026-05-04 (decisions + retros sections shipped)

CMS-only milestone. No code components changed since `eb1fc64` (2026-05-03). Three new entries pushed live via plugin upsert; architectural Mode-3 question for extending `/work-brain` to multiple categories was answered.

## What changed since `eb1fc64`

**Three CMS items added** to `Work Brain Concepts` collection (id `M2QB9xWra`):

| CMS item ID | Slug | Title | Category | Order |
|---|---|---|---|---|
| `kxpZwg5hl` | `two-claude-protocol` | Two-Claude Protocol | concepts | 7 |
| `V1VAg06Sg` | `work-brain-mirror-public` | Why the public mirror is public | decisions | 1 |
| `ZqhmDE091` | `2026-04-30-philmora-detail-page-shipped` | Shipping the public-side wiki | retros | 1 |

The collection now contains **9 items** spanning 3 categories: 7 concepts, 1 decision, 1 retro.

## Architectural lock-in — Option A (aggregated collection)

The Mode-3 question from the 2026-05-04 base-camp briefing — "how does a new category extend the renderer?" — was answered. Decision: **one collection contains all entries, regardless of category. The `Category` field on each item is what distinguishes them.**

Why:
- Framer route → ONE collection. Multiple-collection-on-same-route is impossible.
- Nested `/work-brain/{cat}/:slug` is Footgun 5 (broken).
- Per-category flat paths (`/wb-decisions/:slug`) are URL-ugly and would require renderer rewrites.
- The aggregated approach matches `wiki.json`'s shape (top-level `_categories` block + per-category arrays); CMS now mirrors that.

Implementation:
- The `Work Brain Concepts` collection name is internal. Internal labeling is "Concepts" because that's where it started; functionally it's "Work Brain Entries" now. Phil left the name alone (UI rename was clunky); not exposed in URLs or rendered output.
- The `Category` field (added when the collection was created on 2026-04-30) is the discriminator. Values: `concepts | decisions | sources | retros`.
- `WorkBrainBody.tsx` and `WorkBrainIndex.tsx` already source category from `wiki.json._categories` — they didn't need changes.

## Mode-3 → Mode-2 conversion

This decision converts what was a Mode-3 architectural problem (new category needs new collection + page binding) into a Mode-2 routine operation (new entry → upsert with new Category value). Future categories (sources, future tags) cost zero Framer work — push to mirror, upsert one item, done.

## Pages (unchanged)
| nodeId | path | notes |
|---|---|---|
| `augiA20Il` | `/` | unchanged |
| `tcBiWyb8j` | `/thoughts` | unchanged |
| `Z8gAEFcdz` | `/404` | unchanged |
| `sinWaex7q` | `/essays` | unchanged |
| `tEBllyikl` | `/essays/:slug` | unchanged |
| `Hio60XiOO` | `/work-brain` | unchanged — index renders 3 sections (Concepts, Decisions, Retros) instead of 1+empties |
| `sxV9vzjDf` | `/work-brain/:slug` | unchanged — resolves all 9 slugs across 3 categories |
| (Product Factory) | `/factory` and `/factory/:slug` | added 2026-05-03 (separate session); not touched today |

## Code components (unchanged)
All `.tsx` files unchanged from `eb1fc64`. Today was CMS-data-only.

## CMS collections
| id | name | managedBy | items |
|---|---|---|---|
| `iztk2YMg4` | Essays | user | 8 |
| `M2QB9xWra` | Work Brain Concepts | user | **9** (was 6) |
| `ape_mxXpF` | Product Factory Recipes | user | (not audited today) |

## Production verification (2026-05-04)

All 9 work-brain URLs return 200:
```
philmora.com/work-brain                                              200
philmora.com/work-brain/repo-velocity                                200
philmora.com/work-brain/agentic-readiness                            200
philmora.com/work-brain/context-engineering                          200
philmora.com/work-brain/pm-as-builder                                200
philmora.com/work-brain/change-agency-for-ai-adoption                200
philmora.com/work-brain/vibe-driven-product-development              200
philmora.com/work-brain/two-claude-protocol                          200
philmora.com/work-brain/work-brain-mirror-public                     200
philmora.com/work-brain/2026-04-30-philmora-detail-page-shipped      200
```

Mirror reachable, `wiki.json` returns 200. Both end-to-end paths verified.

## Next-session optional work
- **Phase 1 polling automation** per §7 of `~/Desktop/base-camp-context.md`. Detect mirror SHA changes, run upserts unattended. Defer until cadence is high enough to justify.
- **Mobile breakpoint pass on remaining components** — handoff doc at `~/Desktop/philmora-mobile-breakpoint-handoff.md`. Partial work already done by another session (NotFoundContent, SiteFooter); HomeContent is the biggest remaining piece.
- **Product Factory render audit** — `/factory` returns 200; haven't inspected the rendered output. Worth a quick visual check.
