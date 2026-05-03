# Snapshot 2026-05-03 — date polish + Product Factory airlock automation

Two shipments today:

1. **philmora.com home** — fixed two stale-date bugs in the hero metadata
2. **Product Factory airlock** — automated the manual sync from private wiki to public mirror (no philmora-site code change; the script lives in `~/BaseCamp/factory/scripts/`)

---

## A. Home metadata dates — auto-update

### Bug

The hero runtime row had four cells. Three were dynamic; one wasn't:

| Cell | Before | After |
|---|---|---|
| RUNTIME | ✓ ticked every second | unchanged |
| **WK** | ❌ hardcoded `APR 14–20 · 2026` | ✓ computes current Mon-Sun every tick |
| BUILD | hardcoded (intentional — describes the work) | unchanged |
| SCROLL | hardcoded (decorative) | unchanged |

Plus a second hardcoded value in the eyebrow:

| Element | Before | After |
|---|---|---|
| Hero eyebrow | `THE BIG PICTURE, EDITION 08` | `EDITION ${ESSAYS.length.padStart(2, "0")}` — auto-bumps when a 9th essay is added |

### Implementation

`HomeContent.tsx`:

- New `wkRef` ref + `fmtWk()` helper that computes the current Mon-Sun week and handles cross-month formatting (`APR 27 – MAY 3 · 2026` vs same-month `APR 14–20 · 2026`)
- Wired into the existing `tick()` callback so `wkRef.current.textContent = fmtWk()` runs once per second (cheap; handles Sun-night → Mon-morning rollover for tabs left open)
- Eyebrow `EDITION 08` → `EDITION {String(ESSAYS.length).padStart(2, "0")}`

### Verified on production

- WK shows `APR 27 – MAY 3 · 2026` for May 3, 2026 (Sunday)
- EDITION shows `EDITION 08` matching the 8 entries in the `ESSAYS` array

---

## B. Product Factory airlock automation (no philmora-site code change)

The manual sanitization workflow documented in `~/BaseCamp/factory/public-mirror-rules.md` is now encoded in a shell script. **No code in `philmora-site` itself changed for this** — the new files live entirely inside the encrypted sparsebundle at `~/BaseCamp/factory/scripts/`.

### Why this work belongs in a philmora-site snapshot doc anyway

The architecture spans repos. Docs in this repo should describe the system end-to-end. The airlock is half of how `/factory` gets updated.

### What got built

```
~/BaseCamp/factory/scripts/
├── sync-to-mirror.sh        # the airlock + publisher (executable)
├── banned-terms.txt          # literal terms to refuse-to-push (machinify, hughes128)
├── banned-secrets.txt        # regex patterns to refuse-to-push (token shapes)
├── README.md                 # full docs
└── .mirror-clone/            # local checkout of philmora/product-factory-mirror (auto-managed)
```

### Workflow

```
edit ~/BaseCamp/factory/recipes/<slug>.md
    ↓
mark public: true in frontmatter when ready
    ↓
~/BaseCamp/factory/scripts/sync-to-mirror.sh
    │
    ├─ pull latest from origin/main (hard reset — discards aborted prior runs)
    ├─ walk recipes/ → filter to public:true
    ├─ sanitize each one:
    │     · grep -i banned-terms.txt → fail on any hit
    │     · grep -E banned-secrets.txt → fail on any hit
    │     · ANY hit aborts the entire sync (no partial pushes)
    ├─ stage clean copies into .mirror-clone/recipes/
    ├─ regenerate recipes.json from frontmatter (Python parser)
    ├─ show git diff
    ├─ prompt [y/N]
    └─ on y: commit + push
        ↓
philmora.com/factory updates within seconds (runtime fetch — no Framer republish)
```

### The architectural property worth noting

`/factory` fetches `recipes.json` at runtime via `cache: "no-store"`. So **after the script pushes to GitHub, philmora.com is live with the new content immediately** — no Framer publish click needed.

This is different from `/work-brain`, where adding a new concept requires both a GitHub push AND a Framer CMS-item add (because `/work-brain/:slug` is a dynamic Framer route bound to the "Work Brain Concepts" CMS collection). Future work: extend the same airlock pattern to work-brain with an MCP-driven CMS auto-sync.

### Banned-terms list (as of 2026-05-03)

```
machinify       # current employer — confidentiality is absolute
hughes128       # separate brand boundary, lives in ~/H128/
```

### Banned-secrets list (regex; as of 2026-05-03)

```
sk-[A-Za-z0-9_-]{30,}              # OpenAI keys
sk-ant-[A-Za-z0-9_-]{30,}          # Anthropic keys
ghp_[A-Za-z0-9]{36}                # GitHub PAT (classic)
github_pat_[A-Za-z0-9_]{82,}       # GitHub PAT (fine-grained)
xoxb-[0-9]{10,}-[0-9]{10,}-[A-Za-z0-9]{24,}   # Slack bot tokens
AKIA[0-9A-Z]{16}                   # AWS access key ID
```

### Tested today

End-to-end run with the existing `framer-mobile-compaction` recipe:

- ✓ Mount check passed
- ✓ Cloned mirror to `.mirror-clone/`
- ✓ Found 1 public recipe
- ✓ Sanitization clean
- ✓ recipes.json regenerated correctly (`dek` field now derived from frontmatter, not hardcoded inline)
- ✓ Pushed to `philmora/product-factory-mirror` main
- ✓ philmora.com/factory rendered the new content (verified via Playwright DOM inspection)

### What this commit captures

| File | Change |
|---|---|
| `code-components/HomeContent.tsx` | `wkRef` + `fmtWk()` added; eyebrow EDITION derived from `ESSAYS.length` |
| `framer-snapshot-2026-05-03-date-fix-and-airlock.md` | This file |

The `~/BaseCamp/factory/scripts/` files are NOT in this repo — they live in the encrypted sparsebundle (no off-site backup). If the sparsebundle is lost, the script is reproducible from this snapshot doc + the README inside it.

### Companion changes outside this repo

- `~/BaseCamp/factory/scripts/*` — new tooling (encrypted sparsebundle only)
- `~/BaseCamp/factory/recipes/_template.md` — added `dek:`, `order:`, `category:` fields so future recipes are sync-ready
- `~/BaseCamp/factory/recipes/framer-mobile-compaction.md` — same fields backfilled
- `~/BaseCamp/factory/index.md` + `log.md` + `sessions/current-week.md` — wiki maintenance
- `philmora/product-factory-mirror` — first sync-script-driven push: dek field + tags now match private frontmatter

## Commit lineage

- `6bfefe3` (2026-05-01) — Product Factory shipped
- This commit (2026-05-03) — date fix + airlock automation
