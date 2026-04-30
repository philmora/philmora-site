// @ts-ignore
import { useEffect, useState, useMemo } from "react"
import { addPropertyControls, ControlType } from "framer"

const MIRROR_BASE =
    "https://raw.githubusercontent.com/philmora/work-brain-mirror/main"
const WIKI_INDEX_URL = `${MIRROR_BASE}/wiki.json`

interface WikiItem {
    slug: string
    title: string
    dek: string
    date: string
    updated: string
    category: string
    order: number
}

interface CategoryMeta {
    display: string
    order: number
}

interface WikiIndex {
    _categories: Record<string, CategoryMeta>
    [key: string]: any
}

function formatDate(iso: string | undefined): string {
    if (!iso) return ""
    try {
        const d = new Date(iso + "T12:00:00Z")
        if (isNaN(d.getTime())) return iso
        return d
            .toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                timeZone: "UTC",
            })
            .replace(/\//g, "-")
    } catch {
        return iso
    }
}

const hardNav = (href: string) => (ev: React.MouseEvent<HTMLAnchorElement>) => {
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

interface SortedCategory {
    slug: string
    display: string
    order: number
    items: WikiItem[]
}

function sortCategories(wiki: WikiIndex | null): SortedCategory[] {
    if (!wiki || !wiki._categories) return []
    const cats = Object.entries(wiki._categories).map(([slug, meta]) => {
        const raw = wiki[slug]
        const items = Array.isArray(raw) ? (raw as WikiItem[]) : []
        const sorted = [...items].sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0)
        )
        return {
            slug,
            display: meta.display ?? slug,
            order: meta.order ?? 0,
            items: sorted,
        }
    })
    cats.sort((a, b) => a.order - b.order)
    return cats
}

function emptyStateCopy(displayName: string): string {
    const lower = displayName.toLowerCase()
    return `No public ${lower} yet. Forthcoming.`
}

/**
 * WorkBrainIndex — Terminal Aurora work-brain index/catalog page.
 * URL: /work-brain
 * Fetches wiki.json from philmora/work-brain-mirror, renders the catalog
 * grouped by category (ordered by _categories[slug].order), with empty
 * states for unused categories (decisions, sources, retros).
 */
export default function WorkBrainIndex() {
    const [wiki, setWiki] = useState<WikiIndex | null>(null)
    const [fetchState, setFetchState] = useState<
        "loading" | "ready" | "error"
    >("loading")

    useEffect(() => {
        if (typeof window === "undefined") return
        let cancelled = false
        ;(async () => {
            try {
                const r = await fetch(WIKI_INDEX_URL, { cache: "no-store" })
                if (!r.ok) throw new Error(`wiki ${r.status}`)
                const w: WikiIndex = await r.json()
                if (cancelled) return
                setWiki(w)
                setFetchState("ready")
            } catch (e) {
                if (!cancelled) {
                    console.warn("work-brain index fetch failed", e)
                    setFetchState("error")
                }
            }
        })()
        return () => {
            cancelled = true
        }
    }, [])

    const categories = useMemo(() => sortCategories(wiki), [wiki])

    return (
        <>
            <style>{CSS}</style>
            <main className="wbi-detail">
                <div className="wbi-page">
                    <div className="wbi-eyebrow">
                        <span className="dot" />
                        § WORK BRAIN / PUBLIC OPERATING CONCEPTS
                    </div>

                    <h1 className="wbi-page-title">
                        Work <em>Brain.</em>
                    </h1>

                    <p className="wbi-dek">
                        A Karpathy-style LLM wiki for professional knowledge —
                        concepts, decisions, sources, the substrate that{" "}
                        <em>compounds</em>. Public companions of a private
                        wiki, kept honest by an airlock.
                    </p>

                    <div className="wbi-intro">
                        <p>
                            The thinking that compounds — written down where
                            future me, and any agent reading on my behalf, can
                            find it. New concepts land here as they earn their
                            place. Older ones get extended; rarely overwritten.
                        </p>
                        <p>
                            If you want the full theory,{" "}
                            <a
                                href="https://gist.github.com/butchsonik/a9e643f69217c1584f407f491e3f22b0"
                                target="_blank"
                                rel="noopener"
                            >
                                read the gist
                            </a>
                            . If you want to fork the scaffold,{" "}
                            <a
                                href="https://github.com/butchsonik/work-brain-template"
                                target="_blank"
                                rel="noopener"
                            >
                                grab the template repo
                            </a>
                            .
                        </p>
                    </div>

                    {fetchState === "loading" && (
                        <p className="wbi-status">Loading wiki…</p>
                    )}
                    {fetchState === "error" && (
                        <p className="wbi-status">
                            Wiki index unreachable. Check{" "}
                            <a
                                href="https://github.com/philmora/work-brain-mirror"
                                target="_blank"
                                rel="noopener"
                            >
                                philmora/work-brain-mirror
                            </a>
                            .
                        </p>
                    )}
                    {fetchState === "ready" &&
                        categories.map((cat) => (
                            <section key={cat.slug} className="wbi-category">
                                <h2>// {cat.display}</h2>
                                {cat.items.length === 0 ? (
                                    <p className="wbi-empty-state">
                                        {emptyStateCopy(cat.display)}
                                    </p>
                                ) : (
                                    <ul className="wbi-concept-list">
                                        {cat.items.map((item, idx) => {
                                            const numStr = String(
                                                item.order ?? idx + 1
                                            ).padStart(2, "0")
                                            const href = `/work-brain/${item.slug}`
                                            return (
                                                <li key={item.slug}>
                                                    <a
                                                        href={href}
                                                        onClick={hardNav(href)}
                                                    >
                                                        <div className="num">
                                                            § {numStr}
                                                        </div>
                                                        <div className="body">
                                                            <h3
                                                                className="title"
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        item.title,
                                                                }}
                                                            />
                                                            <p
                                                                className="item-dek"
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        item.dek,
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="meta">
                                                            {formatDate(
                                                                item.date
                                                            )}
                                                        </div>
                                                    </a>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </section>
                        ))}
                </div>
            </main>
        </>
    )
}

addPropertyControls(WorkBrainIndex, {})

const CSS = `
@import url(https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,100..900,0..100;1,9..144,100..900,0..100&family=JetBrains+Mono:ital,wght@0,400..800;1,400..800&display=swap);

.wbi-detail { color: #EDE6D7; font-family: 'JetBrains Mono', ui-monospace, monospace; position: relative; z-index: 3; }
.wbi-detail * { box-sizing: border-box; }
.wbi-detail h1, .wbi-detail h2, .wbi-detail h3, .wbi-detail p, .wbi-detail ol, .wbi-detail ul, .wbi-detail li { margin: 0; padding: 0; }
.wbi-detail ol, .wbi-detail ul { list-style: none; }
.wbi-detail a { color: inherit; text-decoration: none; }

.wbi-page { max-width: 1100px; margin: 0 auto; padding: 160px clamp(24px, 4vw, 72px) 80px; }

@keyframes wbi_pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.75); } }

.wbi-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #7A7568; font-weight: 500; display: inline-flex; align-items: center; margin-bottom: 28px; }
.wbi-eyebrow .dot { display: inline-block; width: 6px; height: 6px; background: #E26B38; border-radius: 50%; margin-right: 10px; box-shadow: 0 0 12px rgba(226,107,56,0.25); animation: wbi_pulse 1.8s ease-in-out infinite; }

.wbi-page-title { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(56px, 10vw, 144px); letter-spacing: -0.03em; line-height: 0.92; color: #EDE6D7; font-variation-settings: "opsz" 144, "SOFT" 50; margin: 0 0 32px; text-wrap: balance; }
.wbi-page-title em { font-style: italic; font-weight: 900; color: #E26B38; }

.wbi-dek { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(22px, 2.4vw, 32px); line-height: 1.35; letter-spacing: -0.01em; color: #BDB6A8; max-width: 780px; margin: 0 0 64px; text-wrap: pretty; }
.wbi-dek em { color: #E26B38; font-style: italic; font-weight: 400; }

.wbi-intro { margin-bottom: 96px; padding-bottom: 48px; border-bottom: 1px solid rgba(237,230,215,0.08); max-width: 720px; }
.wbi-intro p { font-family: 'Fraunces', serif; font-weight: 300; font-size: 19px; line-height: 1.6; color: #BDB6A8; margin: 0 0 16px; }
.wbi-intro p:last-child { margin-bottom: 0; }
.wbi-intro a { color: #E26B38; text-decoration: none; border-bottom: 1px solid rgba(226,107,56,0.4); transition: border-color 200ms; }
.wbi-intro a:hover { border-bottom-color: #E26B38; }

.wbi-status { font-family: 'Fraunces', serif; font-weight: 300; font-style: italic; font-size: 19px; color: #7A7568; margin: 32px 0; }
.wbi-status a { color: #E26B38; text-decoration: none; border-bottom: 1px solid rgba(226,107,56,0.4); }

.wbi-category { margin-bottom: 80px; }
.wbi-category h2 { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #E26B38; margin: 0 0 32px; padding-bottom: 12px; border-bottom: 1px solid rgba(237,230,215,0.08); font-weight: 500; }

.wbi-concept-list { list-style: none; padding: 0; margin: 0; }
.wbi-concept-list li { border-top: 1px solid rgba(237,230,215,0.08); }
.wbi-concept-list li:last-child { border-bottom: 1px solid rgba(237,230,215,0.08); }

.wbi-concept-list a { display: grid; grid-template-columns: 88px 1fr auto; gap: 32px; align-items: baseline; padding: 32px 0; text-decoration: none; color: inherit; transition: padding 300ms; position: relative; }
.wbi-concept-list a::before { content: ""; position: absolute; left: 0; top: 50%; height: 1px; width: 0; background: #E26B38; transition: width 300ms; transform: translateY(-50%); }
.wbi-concept-list a:hover { padding-left: 28px; }
.wbi-concept-list a:hover::before { width: 20px; }

.wbi-concept-list .num { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; color: #E26B38; text-transform: uppercase; padding-top: 10px; }

.wbi-concept-list .body { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.wbi-concept-list .title { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(28px, 3.4vw, 42px); line-height: 1.05; letter-spacing: -0.025em; color: #EDE6D7; margin: 0; font-variation-settings: "opsz" 144, "SOFT" 50; transition: color 200ms; text-wrap: balance; }
.wbi-concept-list a:hover .title { color: #E26B38; }
.wbi-concept-list .title em { font-style: italic; font-weight: 900; color: #E26B38; }

.wbi-concept-list .item-dek { font-family: 'Fraunces', serif; font-weight: 300; font-size: 18px; line-height: 1.4; color: #BDB6A8; margin: 0; max-width: 580px; text-wrap: pretty; }

.wbi-concept-list .meta { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #7A7568; white-space: nowrap; padding-top: 14px; }

.wbi-empty-state { font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 18px; color: #7A7568; margin: 0; padding: 8px 0 16px; }

@media (max-width: 800px) {
    .wbi-page { padding: 120px 20px 60px; }
    .wbi-concept-list a { grid-template-columns: 1fr; gap: 8px; padding: 24px 0; }
    .wbi-concept-list .meta { padding-top: 0; order: 3; }
}
`
