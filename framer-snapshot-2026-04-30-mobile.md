# Snapshot 2026-04-30 — mobile breakpoint pass

**What this commit captures:** the mobile pass shipped 2026-04-30 PM. Five code files modified, three production publishes (Publish 1 / 2a / 2b / 3 — bundled into this single commit). Reference handoff: `~/Desktop/philmora-mobile-breakpoint-handoff.md`.

## Summary

The site was live with desktop polish but unreviewed on mobile. Initial audit at iPhone 14 (390×844) showed `/` rendering at **11,594px = 13.7 viewports of scroll** — Phil's pain point ("way too much scrolling") was real. Reference target: butchsonic.com post-compaction at 7.7 viewports.

Three problems found:
1. **No mobile nav at all on production** — SiteNav.tsx had the hamburger code shipped to GitHub on commit `5f56af1`, but Framer hadn't been Published, so live mobile had `display: none` on the inline links and no hamburger button.
2. **HomeContent had reasonable ≤720 mobile rules but kept hero `min-height: 100vh`** and generous section padding — page was just genuinely long.
3. **SiteFooter had zero media queries** — 3-col grid forced into 320px viewport.
4. **WorkBrainBody table on `/work-brain/repo-velocity` overflowed at 320px** — page horizontally scrolled (docW 350 vs vw 320).

## Files modified

| File | codeFileId | What changed |
|---|---|---|
| `SiteNav.tsx` | `PbxImyK` | Mobile hamburger overlay — Option H typography (Fraunces 500 medium-display labels with mono kickers `LIVE NOW / THE ARC / OPERATING / ON RECORD / ESSAYS / THE WIKI` above each, italic-Fraunces-900 signal-orange active accent, mono `§ NN` prefix) |
| `HomeContent.tsx` | `trXphK7` | C-spec compaction: hero `min-height: 100vh` removed, portrait 540→220 on mobile, section padding 64/32→48/24, NOW log hidden on mobile, stats compacted, BELIEVE position padding 32→20, BIG PICTURE essay padding 28→16 with 2-line dek clamp, BUILDER/CONTACT card-defs 2-up grid at 480-720 |
| `SiteFooter.tsx` | `D2OYQjQ` | Added `@media (max-width: 720px)` — 3-col grid → single stack, left-aligned, 24px→20px padding |
| `NotFoundContent.tsx` | `jS9JE_Q` | Added `@media (max-width: 720px)` — `min-height: 100vh` removed, 180/120 padding → 96/64, smaller title clamp |
| `WorkBrainBody.tsx` | `nyzFx69` | Added `@media (max-width: 480px)` — table font-size 11→10, cell padding 8/10→6/8, `word-break: break-word`. Fixes horizontal page scroll on `/work-brain/repo-velocity` at 320px |

## Measured results (production)

| Viewport | Before | After | Reduction |
|---|---|---|---|
| **320px** (iPhone SE) | 12,947 px = 22.8 screens | 10,631 px = **18.7 screens** | −18% |
| **390px** (iPhone 14) | 11,594 px = 13.7 screens | 9,693 px = **11.5 screens** | −16% |
| **600px** (small tablet) | ~10,200 px = ~10 screens | 7,926 px = **7.7 screens** ⭐ | −22% |

At 600px we hit the Butchsonic 7.7-viewport benchmark exactly — 2-up grids fire correctly (essays, builder, card-defs all 2-col).

WorkBrainBody table at 320 verified clean: `docW = 320`, `table.scrollWidth = 280`, no overflow.

## Hamburger Option H

Phil rejected the originally-shipped Fraunces 300 huge labels (`clamp(40-64px)`) as a category mistake — Fraunces is the philmora display register, not chrome. After 8 mockup variants on Phil's Desktop (`philmora-hamburger-option-{A..H}.png`), Phil picked **H** — the two-tier kicker pattern.

Each nav item renders as:
```
§ 01    LIVE NOW           ← mono kicker (9px, paper-mute)
        NOW                ← Fraunces 500 (clamp 22-30px), uppercase
```

Active state (current page) flips the label to Fraunces 900 italic in `/signal` orange, and the kicker also tints to signal-orange.

## Mobile pattern reference — Butchsonic precedent

Approach borrowed from butchsonic.com's mobile compaction (2026-04-27 ship): section padding `--sp-10` (128px) → `--sp-9` (40px), grid 1col→2col on mobile for biggest single visual win, hide-vs-compact for secondary content. Adapted to philmora's Fraunces/Mono register and content shape (8 essays, 7 positions, 4 builder cards — fundamentally more text density than Butchsonic's gallery-style home).

## What's NOT in this pass

- Desktop layout untouched — mobile breakpoints only
- CMS content untouched
- Design tokens untouched
- EssayBodyCMS spot-check at 390 found no overflow / breakpoints already correct (1200 / 1000 / 600) — no fix needed
- ThoughtsContent and WorkBrainIndex audited, found clean — no fix needed

## Commit lineage

- `5f56af1` (2026-04-30) — pre-mobile-pass baseline (mobile hamburger nav code committed but not yet Published in Framer)
- This commit (2026-04-30 evening) — mobile breakpoint pass shipped via 4 sequential Framer Publishes
