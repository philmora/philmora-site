// @ts-ignore
import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// Essay metadata fetched from the CC BY 4.0 source repo.
// Detail pages live in Framer CMS at /essays/:slug (auto-routed).
const ESSAYS_JSON_URL =
    "https://raw.githubusercontent.com/philmora/essays/main/essays.json"
const ESSAY_PATH_PREFIX = "/essays" // matches Framer CMS collection route

interface EssayMeta {
    slug: string
    title: string
    title_plain?: string
    dek: string
    date: string
    reading_time: number
    published?: boolean
    order?: number
}

const FALLBACK: EssayMeta[] = [
    { slug: "after-the-prd", title: "After the <em>PRD.</em>", dek: "The document that ran software for thirty years just stopped being the unit of work.", date: "2026-04-15", reading_time: 14, published: true, order: 8 },
    { slug: "agents-as-teammates", title: "Agents as <em>teammates</em>, not tools.", dek: "On assigning work to something that doesn't have a Slack avatar, doesn't go home, and still surprises you.", date: "2026-03-12", reading_time: 11, published: true, order: 7 },
    { slug: "code-wizards-to-cosmic-architects", title: "From code wizards to <em>cosmic architects.</em>", dek: "The leverage moved up the stack. What you build now is the system that builds.", date: "2026-03-04", reading_time: 10, published: true, order: 6 },
    { slug: "the-invisible-platform", title: "The invisible <em>platform.</em>", dek: "Five companies, 160 million lives, and one architecture that has to disappear into the floorboards.", date: "2026-02-18", reading_time: 9, published: true, order: 5 },
    { slug: "the-expertise-inversion", title: "The expertise <em>inversion.</em>", dek: "Juniors ship senior output; seniors become editors of machines. The ladder bent.", date: "2026-02-08", reading_time: 9, published: true, order: 4 },
    { slug: "the-combination-premium", title: "The combination <em>premium.</em>", dek: "When generation is free, the value is in the taste that combines the pieces.", date: "2026-02-01", reading_time: 10, published: true, order: 3 },
    { slug: "the-five-breaks", title: "The five <em>breaks.</em>", dek: "Five things that quietly broke in the last six months — and what they broke into.", date: "2026-01-22", reading_time: 9, published: true, order: 2 },
    { slug: "prototypes-vs-specs", title: "Prototypes > <em>specs.</em>", dek: "The working thing ends the meeting. A short argument for showing before telling.", date: "2026-01-12", reading_time: 7, published: true, order: 1 },
]

function formatDate(date: string): string {
    try {
        const d = new Date(date + "T12:00:00Z")
        return d
            .toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
                timeZone: "UTC",
            })
            .toUpperCase()
    } catch {
        return date
    }
}

const pad3 = (n: number | undefined) =>
    n != null ? String(n).padStart(3, "0") : "—"

/**
 * ThoughtsContent — /thoughts → the D5 "Field Notes" index.
 * One reverse-chron .fn-table matching the home Field Notes section.
 * Links to /essays/:slug (Framer CMS-rendered detail route).
 * Hard-navigation onClick bypasses Framer's SPA router (avoids Safari
 * bfcache freeze on back-button).
 */
export default function ThoughtsContent() {
    const [essays, setEssays] = useState<EssayMeta[]>(FALLBACK)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const r = await fetch(ESSAYS_JSON_URL, { cache: "no-store" })
                if (!r.ok) throw new Error(`HTTP ${r.status}`)
                const data = await r.json()
                if (cancelled) return
                const items: EssayMeta[] = Array.isArray(data?.essays)
                    ? data.essays
                    : []
                const published = items
                    .filter((e) => e.published !== false)
                    .sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
                if (published.length > 0) setEssays(published)
            } catch (e) {
                console.warn("essays fetch failed, using fallback", e)
            }
        })()
        return () => {
            cancelled = true
        }
    }, [])

    const hardNav = (href: string) => (
        ev: React.MouseEvent<HTMLAnchorElement>
    ) => {
        if (
            ev.button !== 0 ||
            ev.ctrlKey ||
            ev.metaKey ||
            ev.shiftKey ||
            ev.altKey
        )
            return
        ev.preventDefault()
        if (typeof window !== "undefined") window.location.assign(href)
    }

    return (
        <div className="pm-d5-writing">
            <style>{CSS}</style>
            <main className="page">
                <header className="sec-head">
                    <div className="sec-key">FIELD NOTES</div>
                    <h1 className="sec-name">
                        Notes from the <b>collision.</b>
                    </h1>
                    <div className="sec-meta">
                        {essays.length} dispatches · 2026
                    </div>
                </header>

                <div className="fn-table">
                    <div className="fn-row head">
                        <span>№</span>
                        <span>Date</span>
                        <span>Title</span>
                        <span>Read</span>
                        <span />
                    </div>
                    {essays.map((e) => {
                        const href = `${ESSAY_PATH_PREFIX}/${e.slug}`
                        return (
                            <a
                                key={e.slug}
                                className="fn-row"
                                href={href}
                                data-cursor="link"
                                rel="external"
                                onClick={hardNav(href)}
                            >
                                <span className="fn-no">{pad3(e.order)}</span>
                                <span className="fn-date">
                                    {formatDate(e.date)}
                                </span>
                                <span className="fn-title-cell">
                                    <span
                                        className="fn-title"
                                        dangerouslySetInnerHTML={{
                                            __html: e.title,
                                        }}
                                    />
                                    {e.dek && (
                                        <span className="fn-dek">{e.dek}</span>
                                    )}
                                </span>
                                <span className="fn-time">
                                    {e.reading_time} min
                                </span>
                                <span className="fn-action">Read →</span>
                            </a>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}

addPropertyControls(ThoughtsContent, {})

const CSS = `
.pm-d5-writing {
  --ink: #0A0B0E;
  --ink-2: #131419;
  --paper: #E8E6DC;
  --paper-dim: #989384;
  --paper-mute: #5A5750;
  --line: rgba(232, 230, 220, 0.14);
  --line-strong: rgba(232, 230, 220, 0.30);
  --signal: #C8FF3D;
  --signal-dim: #87a821;
  --gutter: clamp(20px, 3cqw, 56px);
  position: relative;
  background: var(--ink);
  color: var(--paper);
  font-family: "JetBrains Mono", ui-monospace, monospace;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  container-type: inline-size;
}
.pm-d5-writing * { box-sizing: border-box; margin: 0; padding: 0; }
.pm-d5-writing::before {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background-image:
    linear-gradient(rgba(232, 230, 220, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232, 230, 220, 0.025) 1px, transparent 1px);
  background-size: 80px 80px;
}
.pm-d5-writing .page {
  position: relative; z-index: 3;
  max-width: 1320px; margin: 0 auto;
  padding: 0 var(--gutter);
}

.pm-d5-writing .sec-head {
  padding: 132px 0 28px;
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 24px;
  align-items: baseline;
  border-bottom: 1px solid var(--line);
}
.pm-d5-writing .sec-key {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--signal);
}
.pm-d5-writing .sec-key::before { content: "§"; color: var(--paper-mute); margin-right: 4px; }
.pm-d5-writing .sec-name {
  font-weight: 100;
  font-size: clamp(34px, 6cqw, 82px);
  letter-spacing: -0.05em;
  line-height: 1;
  color: var(--paper);
}
.pm-d5-writing .sec-name b { font-weight: 800; color: var(--signal); }
.pm-d5-writing .sec-meta {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--paper-mute);
}
.pm-d5-writing .sec-meta::before { content: "// "; color: var(--signal-dim); }

.pm-d5-writing .fn-table {
  margin: 0 0 16px;
  border-bottom: 1px solid var(--line-strong);
}
.pm-d5-writing .fn-row {
  display: grid;
  grid-template-columns: 56px 100px 1fr 80px 80px;
  gap: 20px;
  align-items: baseline;
  padding: 20px 18px;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  font-size: 13px;
  transition: background 200ms, padding-left 200ms;
}
.pm-d5-writing .fn-row.head {
  background: var(--ink-2);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--paper-mute);
  font-weight: 700;
  cursor: default;
  align-items: center;
  padding: 12px 18px;
}
.pm-d5-writing .fn-row.head:hover { background: var(--ink-2); padding-left: 18px; }
.pm-d5-writing .fn-row:last-child { border-bottom: 0; }
.pm-d5-writing .fn-row:hover { background: var(--ink-2); padding-left: 28px; }
.pm-d5-writing .fn-no {
  color: var(--signal);
  font-weight: 700;
  letter-spacing: 0.04em;
}
.pm-d5-writing .fn-date { color: var(--paper-mute); letter-spacing: 0.05em; }
.pm-d5-writing .fn-title-cell { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.pm-d5-writing .fn-title {
  font-weight: 700;
  font-size: 16px;
  color: var(--paper);
  letter-spacing: -0.01em;
  line-height: 1.2;
}
.pm-d5-writing .fn-title em { font-style: italic; font-weight: 800; color: var(--signal); }
.pm-d5-writing .fn-dek {
  font-size: 12px;
  line-height: 1.5;
  color: var(--paper-dim);
  font-weight: 400;
  letter-spacing: 0.005em;
  max-width: 62ch;
}
.pm-d5-writing .fn-time { color: var(--paper-mute); letter-spacing: 0.06em; }
.pm-d5-writing .fn-action {
  text-align: right;
  color: var(--paper-mute);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 700;
}
.pm-d5-writing .fn-row:hover .fn-action { color: var(--signal); }
.pm-d5-writing .fn-row:hover .fn-title { color: var(--signal); }

@container (max-width: 980px) {
  .pm-d5-writing .sec-head { grid-template-columns: 1fr; padding-top: 120px; }
  .pm-d5-writing .fn-row { grid-template-columns: 48px 1fr; gap: 6px 14px; padding: 16px 12px; }
  .pm-d5-writing .fn-row.head { display: none; }
  .pm-d5-writing .fn-date { grid-column: 2; font-size: 10px; }
  .pm-d5-writing .fn-title-cell { grid-column: 2; }
  .pm-d5-writing .fn-time, .pm-d5-writing .fn-action { display: none; }
}
`
