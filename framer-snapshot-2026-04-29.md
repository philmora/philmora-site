# Framer project snapshot — 2026-04-29

Live snapshot of the philmora.com Framer project, captured via Framer MCP `getProjectXml`.

## Pages
| nodeId | path |
|---|---|
| `augiA20Il` | `/` |
| `tcBiWyb8j` | `/thoughts` |
| `Z8gAEFcdz` | `/404` |
| `sinWaex7q` | `/essays` |
| `tEBllyikl` | `/essays/:slug` |

No design pages.

## Code components
| codeFileId | path | active |
|---|---|---|
| `m9qXlAP` | `PageEffects.tsx` | yes |
| `eCIT2HW` | `LiveClock.tsx` | yes |
| `CzAqFCQ` | `RuntimeCounter.tsx` | yes |
| `iNe3AdH` | `StatCounter.tsx` | yes |
| `PbxImyK` | `SiteNav.tsx` | yes |
| `trXphK7` | `HomeContent.tsx` | yes |
| `D2OYQjQ` | `SiteFooter.tsx` | yes |
| `jS9JE_Q` | `NotFoundContent.tsx` | yes |
| `pMTmSZu` | `ThoughtsContent.tsx` | yes |
| `vWC35E2` | `EssayBodyCMS.tsx` | yes |

## Code overrides
None.

## Color styles
```
/ink              #0A0B0F  rgb(10, 11, 15)
/ink-2            #12141B  rgb(18, 20, 27)
/ink-3            #1A1D26  rgb(26, 29, 38)
/paper            #EDE6D7  rgb(237, 230, 215)
/paper-dim        #BDB6A8  rgb(189, 182, 168)
/paper-mute       #7A7568  rgb(122, 117, 104)
/slate            #3A3E48  rgb(58, 62, 72)
/slate-dim        #262932  rgb(38, 41, 50)
/signal           #E26B38  rgb(226, 107, 56)
/signal-dim       #9A4A28  rgb(154, 74, 40)
/ok               #4FBA87  rgb(79, 186, 135)
/edge             rgba(237, 230, 215, 0.08)
/edge-strong      rgba(237, 230, 215, 0.18)
```

## Text styles
```
/display          Fraunces 300, 158px, lh 0.92em, ls -0.03em, h1
/section-title    Fraunces 300, 108px, lh 0.92em, ls -0.03em, h2
/body-lg          Fraunces 300, 28px, lh 1.4em, p
/body-md          Fraunces 300, 22px, lh 1.5em, p
/numeric-lg       Fraunces 300, 72px, lh 1em, ls -0.04em
/eyebrow          JetBrains Mono 500, 11px, ls 0.22em, uppercase
/nav-label        JetBrains Mono 500, 12px, ls 0.04em
/nav-mark         JetBrains Mono 600, 12px, ls 0.08em
/meta-label       JetBrains Mono 500, 10px, ls 0.18em, uppercase
/btn              JetBrains Mono 500, 12px, ls 0.12em, uppercase
/mono-sm          JetBrains Mono 400, 12px, lh 1.6em
/mono-md          JetBrains Mono 400, 13px, lh 1.6em
```

## Production deployment
- Status: `optimized`
- Last deploy: 2026-04-19
- URL: https://philmora.com
- Staging: https://refreshed-acknowledge-343777.framer.app

## Source repos that this site reads at runtime
- `philmora/essays` — `essays.json` + `content/{slug}.md` for `/thoughts` index and `/essays/:slug` detail
- (forthcoming) `philmora/work-brain-mirror` — for `/work-brain` index and `/work-brain/:category/:slug` detail (in development, separate work track)
