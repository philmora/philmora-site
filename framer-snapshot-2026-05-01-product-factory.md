# Snapshot 2026-05-01 — Product Factory shipped

The Product Factory is live as the 7th surface on philmora.com.

- **Route:** `https://philmora.com/factory`
- **Public mirror:** [`philmora/product-factory-mirror`](https://github.com/philmora/product-factory-mirror)
- **Private wiki:** `~/BaseCamp/factory/` (encrypted sparsebundle, mounted at login via `com.philmora.basecamp-factory-mount.plist`)

Sister to "The Product Factory" claude.ai project (chat side ↔ wiki side, same pattern as Butchsonic ↔ Operation Butch).

## What this commit captures

| Surface | Status | What |
|---|---|---|
| `~/BaseCamp/factory/` | New, encrypted sparsebundle | Karpathy-style cross-project craft wiki — README, index, rules, recipes, decisions, sessions, raw |
| `philmora/product-factory-mirror` (this is a SISTER repo, not part of philmora-site) | New, public on GitHub | Sanitized airlock subset — first recipe + recipes.json catalog |
| `philmora.com/factory` | New page | FactoryIndex renders the recipe catalog; recipes link OUT to GitHub-rendered markdown in a new tab |
| Slot 07 PRODUCT FACTORY in nav | Live | Desktop nav 6→7 slots (gap 32→24px, status bar hidden ≤1100); mobile hamburger overlay shows `§ 07 / RECIPES / PRODUCT FACTORY` with Fraunces 900 italic signal-orange active state |
| Rule #10 in `~/.claude/CLAUDE.md` | New | Auto-load triggers + `#pf-save` capture protocol parallel to `#butch-save` and `#basecamp-save` |

## Architecture (the airlock pattern, applied for the second time)

```
~/BaseCamp/factory/                        ← private (encrypted sparsebundle)
        │
        │  airlock (manual sanitization, per-recipe)
        ▼
philmora/product-factory-mirror            ← public GitHub repo (sanitized subset)
        │
        ▼ at runtime
philmora.com/factory                       ← Framer page (FactoryIndex.tsx)
        │
        ▼ recipe click
github.com/philmora/product-factory-mirror/blob/main/recipes/<slug>.md   ← GitHub-rendered markdown (new tab)
```

This is the same pattern already running for `/work-brain` (private wiki → `philmora/work-brain-mirror` → `philmora.com/work-brain`). The Product Factory side is leaner: no in-site detail route, recipes are read on GitHub. See "Why the dynamic route was deleted" below.

## Files in this commit

| File | Type | What |
|---|---|---|
| `code-components/SiteNav.tsx` | Modified | Slot 07 PRODUCT FACTORY (kicker RECIPES) added. Active-state path tracking for `/factory`. Desktop link gap 32→24px. Status bar hidden at ≤1100px to give 7 inline slots room. |
| `code-components/FactoryIndex.tsx` | New | Catalog page at `/factory`. Fetches `recipes.json` from public mirror at runtime, renders by category, recipe rows link to GitHub blob URLs in a new tab with a `READ ON GITHUB ↗` affordance. |
| `code-components/FactoryBody.tsx` | New (dormant) | Built for an in-site `/factory/:slug` detail route, kept in case the dynamic route is revived. Currently NOT inserted into any page. Header note documents the path back. |
| `framer-snapshot-2026-05-01-product-factory.md` | New | This file. |

## First recipe migrated

`framer-mobile-compaction.md` — extracted from Butchsonic's `framer-build.md`, generalized as a portable cross-project recipe. Validated on butchsonic.com (42% reduction) and philmora.com (16-22%, hits Butchsonic baseline at 600px tablet width). Lives in:

- Private: `~/BaseCamp/factory/recipes/framer-mobile-compaction.md`
- Public: `philmora/product-factory-mirror/recipes/framer-mobile-compaction.md`
- Surfaced: as the first row at `philmora.com/factory`

## First ADR

`~/BaseCamp/factory/decisions/2026-04-30_chrome-vs-display-typography.md` — captures the typography role-separation decision from yesterday's hamburger menu Option H work. Fraunces (display) and JetBrains Mono (chrome) are role-separated; chrome elements never use display typography except as accent.

## Why the dynamic route (`/factory/:slug`) was deleted

Initial plan included `/factory/:slug` for in-site recipe detail pages (parallel to `/work-brain/:slug`). Hit Framer's CMS coupling — dynamic routes require a CMS collection bound at build time, and the MCP plugin's `createCMSCollection` fails on this project (mode constraint).

Two paths:
- (Option 1) Phil creates the CMS collection manually in Framer UI, binds the route, ships dynamic detail pages
- (Option 2) Delete the dynamic route, link recipes to GitHub-rendered markdown in a new tab

Phil chose Option 2 for speed. GitHub renders markdown cleanly with diff history and copy-link affordances; visitors get the recipe content without the in-site Framer chrome. Trade-off: no consistent typography on detail pages, but the recipe-as-markdown register fits GitHub's rendering well.

`FactoryBody.tsx` is preserved in the project (dormant, not inserted on any page) so the dynamic route can be revived in <30 minutes if ever needed.

## Cleanup left in Framer (optional)

A `Product Factory Recipes` CMS collection was created during the brief Option-1 attempt before pivoting. It now sits empty and unbound. Harmless; safe to delete from Framer's CMS panel anytime.

## Hamburger overlay (mobile, ≤720px)

7 slots now:

```
§ 01    LIVE NOW          NOW
§ 02    THE ARC           PATTERN
§ 03    OPERATING         BELIEVE
§ 04    ON RECORD         VOICES
§ 05    ESSAYS            THE BIG PICTURE
§ 06    THE WIKI          WORK BRAIN
§ 07    RECIPES           PRODUCT FACTORY    ← active state when on /factory
```

Active state: signal-orange Fraunces 900 italic on label, signal-orange on kicker.

## Commit lineage

- `cb66717` (2026-04-30 evening) — Mobile breakpoint pass shipped
- This commit (2026-05-01) — Product Factory ships as the 7th surface
