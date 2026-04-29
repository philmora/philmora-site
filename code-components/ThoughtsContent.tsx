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
    { slug: "the-pm-is-dead", title: "The PM Is Dead. <em>Long Live the Builder.</em>", dek: "Something broke in the last six months. Not broke in a bad way — broke like a dam breaks.", date: "2026-04-15", reading_time: 14, published: true, order: 9 },
    { slug: "agents-as-teammates", title: "Agents as <em>Teammates</em>, Not Tools.", dek: "On assigning work to something that doesn't have a Slack avatar, doesn't go home, and still manages to surprise you.", date: "2026-03-12", reading_time: 11, published: true, order: 8 },
    { slug: "the-invisible-platform", title: "The Invisible <em>Platform</em>.", dek: "Five companies, 160 million lives, and one architecture that has to disappear into the floorboards before anyone trusts it.", date: "2026-02-08", reading_time: 9, published: true, order: 7 },
    { slug: "prototypes-vs-specs", title: "Prototypes > <em>Specs</em>.", dek: "The working thing ends the meeting. A short argument for showing before telling, in a field that is addicted to telling.", date: "2026-01-22", reading_time: 7, published: true, order: 6 },
]

function formatIdx(order: number | undefined, date: string): string {
    const orderStr = order != null ? String(order).padStart(3, "0") : "—"
    try {
        const d = new Date(date + "T12:00:00Z")
        return `${orderStr} · ${d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).toUpperCase()}`
    } catch { return `${orderStr} · ${date}` }
}

/**
 * ThoughtsContent — /thoughts essay index page body.
 * Links to /essays/:slug which is Framer's CMS-rendered detail route.
 * Uses a hard-navigation onClick handler to bypass Framer's SPA router,
 * avoiding Safari bfcache freeze on back-button.
 */
export default function ThoughtsContent() {
    const [essays, setEssays] = useState<EssayMeta[]>(FALLBACK)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const r = await fetch(ESSAYS_JSON_URL, { cache: "no-store" })
                if (!r.ok) throw new Error(`HTTP ${r.status}`)
                const data = await r.json()
                if (cancelled) return
                const items: EssayMeta[] = Array.isArray(data?.essays) ? data.essays : []
                const published = items.filter((e) => e.published !== false).sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
                if (published.length > 0) setEssays(published)
            } catch (e) {
                console.warn("essays fetch failed, using fallback", e)
            } finally {
                if (!cancelled) setLoading(false)
            }
        })()
        return () => { cancelled = true }
    }, [])

    return (
        <>
            <style>{CSS}</style>
            <main className="pm-thoughts">
                <header className="pm-th-head">
                    <div className="pm-th-head-body">
                        <div className="pm-eyebrow">
                            <span className="dot" />
                            THE BIG PICTURE / ESSAY INDEX
                        </div>
                        <h1 className="pm-th-title">
                            <span className="line">Notes from the</span>
                            <span className="line"><em>collision</em></span>
                            <span className="line">in progress.</span>
                        </h1>
                    </div>
                </header>

                <ul className="pm-essays">
                    {essays.map((e) => {
                        const href = `${ESSAY_PATH_PREFIX}/${e.slug}`
                        return (
                            <li key={e.slug}>
                                <a
                                    className="pm-essay"
                                    href={href}
                                    data-cursor="link"
                                    rel="external"
                                    onClick={(ev) => {
                                        if (
                                            ev.button !== 0 ||
                                            ev.ctrlKey ||
                                            ev.metaKey ||
                                            ev.shiftKey ||
                                            ev.altKey
                                        )
                                            return
                                        ev.preventDefault()
                                        if (typeof window !== "undefined")
                                            window.location.assign(href)
                                    }}
                                >
                                    <div className="pm-essay-meta">
                                        <span>{formatIdx(e.order, e.date)}</span>
                                        <span>{e.reading_time} MIN</span>
                                    </div>
                                    <div>
                                        <h3 className="pm-essay-title" dangerouslySetInnerHTML={{ __html: e.title }} />
                                        <p className="pm-essay-dek">{e.dek}</p>
                                    </div>
                                    <div className="pm-essay-go">READ <span className="arrow">→</span></div>
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </main>
        </>
    )
}

addPropertyControls(ThoughtsContent, {})

const CSS = `
@import url(https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,100..900,0..100;1,9..144,100..900,0..100&family=JetBrains+Mono:ital,wght@0,400..800;1,400..800&display=swap);
.pm-thoughts { max-width: 1440px; margin: 0 auto; padding: 160px clamp(24px, 4vw, 72px) 80px; color: #EDE6D7; font-family: 'JetBrains Mono', monospace; position: relative; z-index: 3; }
.pm-thoughts * { box-sizing: border-box; }
.pm-thoughts h1, .pm-thoughts h3, .pm-thoughts p, .pm-thoughts ul, .pm-thoughts li { margin: 0; padding: 0; }
.pm-thoughts ul { list-style: none; }
.pm-th-head { display: grid; grid-template-columns: 88px 1fr; gap: 48px; padding: 0 0 64px; align-items: start; }
.pm-th-head::before { content: "§ ESSAYS"; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.2em; color: #E26B38; padding-right: 24px; border-right: 1px solid rgba(237,230,215,0.08); align-self: stretch; display: flex; align-items: flex-start; padding-top: 14px; grid-column: 1; grid-row: 1; }
.pm-th-head-body { grid-column: 2; grid-row: 1; display: flex; flex-direction: column; }
.pm-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #7A7568; font-weight: 500; display: inline-flex; align-items: center; margin-bottom: 28px; }
.pm-eyebrow .dot { display: inline-block; width: 6px; height: 6px; background: #E26B38; border-radius: 50%; margin-right: 10px; box-shadow: 0 0 12px rgba(226,107,56,0.25); animation: pm_pulse 1.8s ease-in-out infinite; }
@keyframes pm_pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.75); } }
.pm-th-title { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(48px, 7.5vw, 120px); letter-spacing: -0.03em; line-height: 0.92; color: #EDE6D7; font-variation-settings: "opsz" 144, "SOFT" 50; }
.pm-th-title .line { display: block; }
.pm-th-title em { font-style: italic; font-weight: 900; color: #E26B38; }
.pm-essays { margin-left: 136px; max-width: 1100px; padding-bottom: 80px; }
.pm-essays li { border-top: 1px solid rgba(237,230,215,0.08); }
.pm-essays li:last-child { border-bottom: 1px solid rgba(237,230,215,0.08); }
.pm-essay { display: grid; grid-template-columns: 180px 1fr auto; gap: 40px; align-items: baseline; padding: 40px 0; transition: padding 300ms, background 300ms; position: relative; text-decoration: none; color: inherit; cursor: pointer; }
.pm-essay::before { content: ""; position: absolute; left: 0; top: 50%; height: 1px; width: 0; background: #E26B38; transition: width 300ms; transform: translateY(-50%); }
.pm-essay:hover { padding-left: 28px; }
.pm-essay:hover::before { width: 20px; }
.pm-essay-meta { display: flex; flex-direction: column; gap: 4px; color: #7A7568; font-size: 11px; letter-spacing: 0.14em; font-family: 'JetBrains Mono', monospace; }
.pm-essay-meta span:first-child { color: #E26B38; }
.pm-essay-title { font-family: 'Fraunces', serif; font-weight: 200; font-size: clamp(28px, 3.4vw, 46px); line-height: 1.05; letter-spacing: -0.025em; color: #EDE6D7; margin-bottom: 10px; text-wrap: balance; transition: color 200ms; }
.pm-essay-title em { font-style: italic; font-weight: 900; color: #E26B38; }
.pm-essay:hover .pm-essay-title { color: #E26B38; }
.pm-essay-dek { font-family: 'Fraunces', serif; font-weight: 300; font-size: 18px; line-height: 1.4; color: #BDB6A8; max-width: 640px; text-wrap: pretty; }
.pm-essay-go { color: #7A7568; letter-spacing: 0.18em; display: flex; align-items: center; gap: 8px; transition: color 200ms; font-family: 'JetBrains Mono', monospace; font-size: 12px; text-transform: uppercase; }
.pm-essay:hover .pm-essay-go { color: #E26B38; }
.pm-essay-go .arrow { transition: transform 200ms; }
.pm-essay:hover .pm-essay-go .arrow { transform: translateX(6px); }
@media (max-width: 1100px) {
    .pm-th-head { grid-template-columns: 56px 1fr; gap: 24px; }
    .pm-essays { margin-left: 80px; }
    .pm-essay { grid-template-columns: 140px 1fr; }
    .pm-essay-go { grid-column: 2; }
}
@media (max-width: 720px) {
    .pm-th-head { grid-template-columns: 1fr; }
    .pm-th-head::before { display: none; }
    .pm-th-head-body { grid-column: 1; }
    .pm-essays { margin-left: 0; }
    .pm-essay { grid-template-columns: 1fr; gap: 12px; padding: 28px 0; }
    .pm-essay-go { grid-column: auto; }
}
`
