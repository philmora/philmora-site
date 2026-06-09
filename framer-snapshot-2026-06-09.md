# Framer snapshot — 2026-06-09

philmora.com, built in Framer. Production: https://philmora.com · Staging: refreshed-acknowledge-343777.framer.app

This snapshot refreshes the backup after the **Kinetic·Cinematic redesign**, the 15-essay **Dispatches** blog, the **Shinka 進化** manifesto, and the on-brand 404. The prior snapshot (2026-05-26) predated all of it.

## Pages (web)
- `/` — home (KineticHome)
- `/404` — not found (NotFoundContent)
- `/essays` — blog index (EssaysIndex)
- `/essays/:slug` — blog post, CMS-coupled route (EssayBodyCMS)
- `/the-build` — Shinka 進化 manifesto (TheBuild)

`/thoughts → /essays` 301 (retired). Deleted pages: `/work-brain`, `/work-brain/:slug`, `/factory` (CMS data retained, code files kept for rollback).

## Code components (17) with codeFileIds
**Canonical / live (refreshed in this commit):**
- `qVaEPSA` KineticHome.tsx — home, 5 panels (Hero · All In · Dispatches · Studio · Connect), liquid-glass pill, parallax. **NEW to backup.**
- `pSIyhNz` EssaysIndex.tsx — Dispatches index, self-fetches essays.json, HERO map (15 slugs). **NEW to backup.**
- `YSXV6IT` TheBuild.tsx — Shinka manifesto, 11 panels. **NEW to backup.**
- `vWC35E2` EssayBodyCMS.tsx — post template, markdown parser, self-fetches from philmora/essays. **Updated (was pre-redesign).**
- `jS9JE_Q` NotFoundContent.tsx — cinematic 404 with real menubar. **Updated (was pre-redesign).**

**Older / helper / rollback (unchanged since 2026-05-26, already in repo):**
- `m9qXlAP` PageEffects · `eCIT2HW` LiveClock · `CzAqFCQ` RuntimeCounter · `iNe3AdH` StatCounter · `PbxImyK` SiteNav · `trXphK7` HomeContent · `D2OYQjQ` SiteFooter · `pMTmSZu` ThoughtsContent · `nyzFx69` WorkBrainBody · `OcV9MSx` WorkBrainIndex · `De9eOIO` FactoryIndex · `MMWE72x` FactoryBody

(Note: the repo also retains GlassCard / ParallaxHero / ParallaxBackground from older snapshots; those are no longer present in the live project.)

## CMS
- `Essays` collection `iztk2YMg4` generates the `/essays/:slug` routes. Fields incl. Title `t27lFFAzv`, Dek `iKxPexkmX`, Date `f63l7o1xo`, Reading Time `S2CiizhbO`, Body `XuWuqBm34`, Order `uZbIUrszg`, Hero `KeIhuQpfS`, **OG Image `KFZ3nEl1R`** (per-essay social image; currently null on most, falls back to the site default OG).

## Design tokens (current ColorStyles + TextStyles)
Colors: /ink `rgb(10,11,15)` · /paper `rgb(237,230,215)` · /signal `rgb(226,107,56)` · /ok `rgb(79,186,135)` · plus ink-2/3, paper-dim/mute, slate, edge variants.
Text: /display Fraunces-300 158px · /section-title 108px · /eyebrow JetBrains Mono 11px · /body-lg 28px · /body-md 22px · /numeric-lg 72px · /nav-label, /meta-label, /btn, /mono-sm/md.

(Live components inject their own Unbounded + Space Grotesk + JetBrains Mono via @import; the project TextStyles above are the design-side styles.)
