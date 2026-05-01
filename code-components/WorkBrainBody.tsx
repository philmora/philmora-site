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

function findItem(
    wiki: WikiIndex | null,
    slug: string
): { category: string; item: WikiItem } | null {
    if (!wiki || !wiki._categories) return null
    for (const cat of Object.keys(wiki._categories)) {
        const items = wiki[cat]
        if (!Array.isArray(items)) continue
        const match = (items as WikiItem[]).find((x) => x.slug === slug)
        if (match) return { category: cat, item: match }
    }
    return null
}

function formatDate(iso: string | undefined): string {
    if (!iso) return ""
    try {
        const d = new Date(iso + "T12:00:00Z")
        if (isNaN(d.getTime())) return iso
        return d
            .toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
            })
            .toUpperCase()
    } catch {
        return iso
    }
}

const esc = (s: string) =>
    s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")

function stripFrontmatter(md: string): string {
    const m = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/.exec(md)
    return m ? md.slice(m[0].length) : md
}

// Strip the leading `# Title` heading and the immediately-following italic
// dek paragraph. Both are duplicated from the CMS-rendered title/dek and
// don't need to appear in the prose body.
function stripTitleAndDek(md: string): string {
    let s = md.replace(/^\s*\n+/, "")
    s = s.replace(/^#\s+[^\n]+\n+/, "")
    s = s.replace(/^\s*\n+/, "")
    s = s.replace(/^\*[^*\n][^*]*\*\s*\n+/, "")
    return s
}

function makeNormalizeBody(wiki: WikiIndex | null) {
    const resolveWikilink = (cat: string, slug: string): string => {
        const broken = `<a class="wb-wikilink broken" href="/work-brain/${slug}">${slug}</a>`
        if (!wiki) return broken
        const items = wiki[cat]
        if (!Array.isArray(items)) return broken
        const match = (items as WikiItem[]).find((x) => x.slug === slug)
        if (!match) return broken
        return `<a class="wb-wikilink" href="/work-brain/${slug}">${match.title}</a>`
    }

    return function normalizeBody(input: string): string {
        if (!input) return ""
        const looksLikeHTML = /<\/?(p|h[1-6]|ul|ol|li|blockquote|pre|hr|em|strong|a|br|table)\b/i.test(
            input
        )
        if (looksLikeHTML) return input

        const lines = input.split(/\r?\n/)
        const out: string[] = []
        let i = 0
        let inCode = false
        let codeBuf: string[] = []

        const inline = (raw: string): string => {
            let s = esc(raw)
            // Wikilinks first — before generic links so [[a/b]] isn't mistaken.
            s = s.replace(/\[\[(\w+)\/([\w-]+)\]\]/g, (_m, cat, slug) =>
                resolveWikilink(cat, slug)
            )
            s = s.replace(/`([^`]+)`/g, (_m, c) => `<code>${c}</code>`)
            s = s.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
            s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
            s = s.replace(
                /\[([^\]]+)\]\(([^)]+)\)/g,
                (_m, t, u) =>
                    `<a href="${u}" target="_blank" rel="noopener" data-cursor="link">${t}</a>`
            )
            return s
        }

        // Split a GFM table row on `|`, dropping leading/trailing empties.
        const splitTableRow = (s: string): string[] => {
            let trimmed = s.trim()
            if (trimmed.startsWith("|")) trimmed = trimmed.slice(1)
            if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1)
            return trimmed.split("|").map((c) => c.trim())
        }

        // Detect the GFM separator row: pipes/dashes/colons/spaces only,
        // with at least one dash.
        const isTableSeparator = (s: string): boolean =>
            /^\s*\|?[\s|:-]+\|?\s*$/.test(s) && /-/.test(s)

        while (i < lines.length) {
            const line = lines[i]
            if (/^```/.test(line)) {
                if (inCode) {
                    out.push(
                        `<pre><code>${esc(codeBuf.join("\n"))}</code></pre>`
                    )
                    codeBuf = []
                    inCode = false
                } else inCode = true
                i++
                continue
            }
            if (inCode) {
                codeBuf.push(line)
                i++
                continue
            }
            if (/^---\s*$/.test(line)) {
                out.push("<hr />")
                i++
                continue
            }
            if (/^\s*$/.test(line)) {
                i++
                continue
            }

            // GFM table: header row starting with `|`, followed by a
            // separator row of pipes/dashes/colons.
            if (
                /^\s*\|/.test(line) &&
                i + 1 < lines.length &&
                isTableSeparator(lines[i + 1])
            ) {
                const headers = splitTableRow(line)
                i += 2 // skip header + separator
                const rows: string[][] = []
                while (
                    i < lines.length &&
                    /^\s*\|/.test(lines[i]) &&
                    !isTableSeparator(lines[i])
                ) {
                    rows.push(splitTableRow(lines[i]))
                    i++
                }
                let html =
                    `<table><thead><tr>` +
                    headers.map((h) => `<th>${inline(h)}</th>`).join("") +
                    `</tr></thead><tbody>`
                for (const row of rows) {
                    html +=
                        `<tr>` +
                        row.map((c) => `<td>${inline(c)}</td>`).join("") +
                        `</tr>`
                }
                html += `</tbody></table>`
                out.push(html)
                continue
            }

            const h = /^(#{1,4})\s+(.*)$/.exec(line)
            if (h) {
                const level = h[1].length
                const text = h[2]
                out.push(`<h${level + 1}>${inline(text)}</h${level + 1}>`)
                i++
                continue
            }
            if (/^>\s?/.test(line)) {
                const buf: string[] = []
                while (i < lines.length && /^>\s?/.test(lines[i])) {
                    buf.push(lines[i].replace(/^>\s?/, ""))
                    i++
                }
                const text = buf.join(" ").trim()
                out.push(`<blockquote>${inline(text)}</blockquote>`)
                continue
            }
            if (/^[-*]\s+/.test(line)) {
                const buf: string[] = []
                while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
                    buf.push(
                        `<li>${inline(lines[i].replace(/^[-*]\s+/, ""))}</li>`
                    )
                    i++
                }
                out.push(`<ul>${buf.join("")}</ul>`)
                continue
            }
            if (/^\d+\.\s+/.test(line)) {
                const buf: string[] = []
                while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
                    buf.push(
                        `<li>${inline(lines[i].replace(/^\d+\.\s+/, ""))}</li>`
                    )
                    i++
                }
                out.push(`<ol>${buf.join("")}</ol>`)
                continue
            }
            const pBuf: string[] = [line]
            i++
            while (
                i < lines.length &&
                !/^\s*$/.test(lines[i]) &&
                !/^(#{1,4}\s|[-*]\s|\d+\.\s|>\s|---\s*$|```|\s*\|)/.test(lines[i])
            ) {
                pBuf.push(lines[i])
                i++
            }
            out.push(`<p>${inline(pBuf.join(" "))}</p>`)
        }
        return out.join("\n")
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

/**
 * WorkBrainBody — Terminal Aurora work-brain concept detail page.
 * URL: /work-brain/{slug}  (flat — Framer doesn't resolve nested
 *      static-then-dynamic routes like /work-brain/concepts/:slug)
 * Looks up the slug in wiki.json to find its category, then fetches
 * the .md from the matching category directory in
 * philmora/work-brain-mirror.
 */
export default function WorkBrainBody() {
    const [wiki, setWiki] = useState<WikiIndex | null>(null)
    const [body, setBody] = useState<string | null>(null)
    const [slug, setSlug] = useState<string | null>(null)
    const [category, setCategory] = useState<string | null>(null)
    const [meta, setMeta] = useState<WikiItem | null>(null)
    const [fetchState, setFetchState] = useState<
        "loading" | "ready" | "error"
    >("loading")
    const [scrollPct, setScrollPct] = useState(0)

    useEffect(() => {
        if (typeof window === "undefined") return
        const parts = window.location.pathname.split("/").filter(Boolean)
        if (parts[0] !== "work-brain" || !parts[1]) {
            setFetchState("error")
            return
        }
        const s = parts[1]
        setSlug(s)

        let cancelled = false
        ;(async () => {
            try {
                const wikiRes = await fetch(WIKI_INDEX_URL, {
                    cache: "no-store",
                })
                if (!wikiRes.ok) throw new Error(`wiki ${wikiRes.status}`)
                const w: WikiIndex = await wikiRes.json()
                if (cancelled) return
                setWiki(w)

                const found = findItem(w, s)
                if (!found) {
                    setFetchState("error")
                    return
                }
                setCategory(found.category)
                setMeta(found.item)

                const mdRes = await fetch(
                    `${MIRROR_BASE}/${found.category}/${s}.md`,
                    { cache: "no-store" }
                )
                if (!mdRes.ok) throw new Error(`md ${mdRes.status}`)
                const md = await mdRes.text()
                if (cancelled) return
                setBody(stripTitleAndDek(stripFrontmatter(md)))
                setFetchState("ready")
            } catch (e) {
                if (!cancelled) {
                    console.warn("work-brain fetch failed", e)
                    setFetchState("error")
                }
            }
        })()

        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return
        const onScroll = () => {
            const max =
                document.documentElement.scrollHeight - window.innerHeight
            setScrollPct(max > 0 ? (window.scrollY / max) * 100 : 0)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [body])

    const normalizeBody = useMemo(() => makeNormalizeBody(wiki), [wiki])

    const categoryDisplay = useMemo(() => {
        if (!wiki || !category) return ""
        return (
            wiki._categories?.[category]?.display?.toUpperCase() ??
            category.toUpperCase()
        )
    }, [wiki, category])

    const orderStr =
        meta?.order != null ? String(meta.order).padStart(2, "0") : "—"

    return (
        <>
            <style>{CSS}</style>
            <div
                className="wb-scroll-progress"
                style={{ width: `${scrollPct}%` }}
                aria-hidden="true"
            />
            <main className="wb-detail">
                <div className="wb-page">
                    {slug && (
                        <div className="wb-breadcrumb">
                            <a
                                href="/work-brain"
                                onClick={hardNav("/work-brain")}
                            >
                                work-brain
                            </a>
                            {category && (
                                <>
                                    <span className="sep">/</span>
                                    {category}
                                </>
                            )}
                            <span className="sep">/</span>
                            <span className="current">{slug}</span>
                        </div>
                    )}

                    {meta ? (
                        <>
                            <h1 className="wb-detail-title">
                                <span className="title-mark">
                                    § {orderStr} · {categoryDisplay}
                                </span>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: meta.title,
                                    }}
                                />
                            </h1>
                            {meta.dek && (
                                <p
                                    className="wb-dek"
                                    dangerouslySetInnerHTML={{
                                        __html: meta.dek,
                                    }}
                                />
                            )}
                        </>
                    ) : fetchState === "loading" ? (
                        <h1 className="wb-detail-title">Loading…</h1>
                    ) : (
                        <h1 className="wb-detail-title">
                            Not <em>found.</em>
                        </h1>
                    )}

                    <article className="wb-prose">
                        {body ? (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: normalizeBody(body),
                                }}
                            />
                        ) : fetchState === "loading" ? (
                            <p className="wb-status">Loading concept body…</p>
                        ) : (
                            <p className="wb-status">
                                Concept not found. Check the URL or browse the{" "}
                                <a
                                    href="/work-brain"
                                    onClick={hardNav("/work-brain")}
                                >
                                    work-brain index
                                </a>
                                .
                            </p>
                        )}
                    </article>

                    <a
                        href="/work-brain"
                        className="wb-back-link"
                        onClick={hardNav("/work-brain")}
                    >
                        ← back to work-brain
                    </a>

                    {meta && (
                        <div className="wb-metadata-footer">
                            <span>created {formatDate(meta.date)}</span>
                            <span>updated {formatDate(meta.updated)}</span>
                            <span>via philmora/work-brain-mirror</span>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}

addPropertyControls(WorkBrainBody, {})

const CSS = `
@import url(https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,100..900,0..100;1,9..144,100..900,0..100&family=JetBrains+Mono:ital,wght@0,400..800;1,400..800&display=swap);

.wb-scroll-progress { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: #E26B38; box-shadow: 0 0 8px rgba(226,107,56,0.5); z-index: 200; transition: width 60ms linear; }

.wb-detail { color: #EDE6D7; font-family: 'JetBrains Mono', ui-monospace, monospace; position: relative; z-index: 3; }
.wb-detail * { box-sizing: border-box; }
.wb-detail h1, .wb-detail h2, .wb-detail h3, .wb-detail p, .wb-detail ol, .wb-detail ul, .wb-detail blockquote, .wb-detail li, .wb-detail figure { margin: 0; padding: 0; }
.wb-detail ol, .wb-detail ul { list-style: none; }
.wb-detail a { color: inherit; text-decoration: none; }

.wb-page { max-width: 1100px; margin: 0 auto; padding: 160px clamp(24px, 4vw, 72px) 80px; }

@keyframes wb_pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.75); } }

.wb-breadcrumb { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #7A7568; margin-bottom: 32px; }
.wb-breadcrumb a { color: #7A7568; text-decoration: none; transition: color 160ms; }
.wb-breadcrumb a:hover { color: #E26B38; }
.wb-breadcrumb .sep { margin: 0 10px; color: rgba(237,230,215,0.18); }
.wb-breadcrumb .current { color: #EDE6D7; }

.wb-detail-title { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(48px, 8vw, 112px); letter-spacing: -0.035em; line-height: 0.94; color: #EDE6D7; font-variation-settings: "opsz" 144, "SOFT" 50; margin: 0 0 40px; text-wrap: balance; }
.wb-detail-title .title-mark { display: inline-block; font-family: 'JetBrains Mono', monospace; font-weight: 400; font-size: 0.18em; vertical-align: middle; color: #E26B38; letter-spacing: 0.18em; margin-right: 0.6em; text-transform: uppercase; transform: translateY(-0.4em); }
.wb-detail-title em { font-style: italic; font-weight: 900; color: #E26B38; }

.wb-dek { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(22px, 2.4vw, 32px); line-height: 1.35; letter-spacing: -0.01em; color: #BDB6A8; max-width: 780px; margin: 0; text-wrap: pretty; }
.wb-dek em { color: #E26B38; font-style: italic; font-weight: 400; }

.wb-prose { max-width: 720px; font-family: 'Fraunces', serif; font-weight: 300; font-size: 21px; line-height: 1.7; letter-spacing: -0.005em; color: #BDB6A8; margin-top: 64px; }

.wb-prose h2 { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(28px, 3.4vw, 44px); line-height: 1.1; letter-spacing: -0.02em; color: #EDE6D7; font-variation-settings: "opsz" 144, "SOFT" 50; margin: 88px 0 28px; padding-top: 32px; border-top: 1px solid rgba(237,230,215,0.08); text-wrap: balance; }
.wb-prose h2:first-child { margin-top: 0; padding-top: 0; border-top: none; }
.wb-prose h2 em { font-style: italic; font-weight: 900; color: #E26B38; }

.wb-prose h3 { font-family: 'Fraunces', serif; font-weight: 700; font-size: clamp(22px, 2.4vw, 28px); line-height: 1.2; letter-spacing: -0.015em; color: #EDE6D7; margin: 48px 0 20px; }

.wb-prose p { margin: 0 0 28px; color: #BDB6A8; text-wrap: pretty; }
.wb-prose p em { color: #E26B38; font-style: italic; font-weight: 400; }
.wb-prose p strong { color: #EDE6D7; font-weight: 700; }

.wb-prose a:not(.wb-wikilink) { color: #E26B38; text-decoration: none; border-bottom: 1px solid rgba(226,107,56,0.4); transition: border-color 200ms; }
.wb-prose a:not(.wb-wikilink):hover { border-bottom-color: #E26B38; }

.wb-prose ul { margin: 0 0 36px 0; padding: 0; list-style: none; }
.wb-prose ul li { padding: 10px 0 10px 24px; line-height: 1.5; color: #BDB6A8; position: relative; }
.wb-prose ul li::before { content: "▸"; position: absolute; left: 0; color: #E26B38; font-family: 'JetBrains Mono', monospace; }
.wb-prose ul li strong { color: #EDE6D7; }

.wb-prose ol { margin: 0 0 36px 0; padding: 0; list-style: none; counter-reset: wb-ol-counter; }
.wb-prose ol li { counter-increment: wb-ol-counter; padding: 20px 0 20px 64px; border-top: 1px solid rgba(237,230,215,0.08); position: relative; line-height: 1.5; color: #BDB6A8; }
.wb-prose ol li::before { content: counter(wb-ol-counter, decimal-leading-zero); position: absolute; left: 0; top: 20px; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; color: #E26B38; }
.wb-prose ol li:last-child { border-bottom: 1px solid rgba(237,230,215,0.08); }
.wb-prose ol li strong { color: #EDE6D7; }

.wb-prose pre { font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.55; background: #12141B; border: 1px solid rgba(237,230,215,0.08); border-radius: 4px; padding: 16px 20px; overflow-x: auto; color: #EDE6D7; margin: 0 0 28px; }
.wb-prose code { font-family: 'JetBrains Mono', monospace; font-size: 0.9em; background: #12141B; padding: 2px 6px; border-radius: 3px; color: #EDE6D7; }
.wb-prose pre code { background: transparent; padding: 0; font-size: 13px; }

.wb-prose blockquote { border-left: 2px solid #E26B38; padding: 8px 0 8px 28px; margin: 32px 0; font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(22px, 2.2vw, 28px); line-height: 1.4; color: #EDE6D7; font-style: italic; letter-spacing: -0.015em; text-wrap: pretty; }
.wb-prose blockquote em { color: #E26B38; }

.wb-prose hr { border: 0; border-top: 1px solid rgba(237,230,215,0.08); margin: 48px auto; width: 60%; }

.wb-prose table { width: 100%; border-collapse: collapse; margin: 32px 0; font-family: 'JetBrains Mono', monospace; font-size: 13px; background: rgba(18,20,27,0.4); border: 1px solid rgba(237,230,215,0.08); }
.wb-prose th, .wb-prose td { padding: 12px 16px; text-align: left; border-bottom: 1px solid rgba(237,230,215,0.08); }
.wb-prose th { color: #E26B38; letter-spacing: 0.12em; text-transform: uppercase; font-size: 11px; background: rgba(18,20,27,0.6); }
.wb-prose td { color: #BDB6A8; }
.wb-prose tbody tr:last-child td { border-bottom: none; }
.wb-prose td strong { color: #EDE6D7; }

.wb-wikilink { color: #E26B38; text-decoration: none; border-bottom: 1px dashed rgba(226,107,56,0.5); font-style: italic; font-weight: 400; transition: border-color 200ms, color 200ms; }
.wb-wikilink:hover { color: #EDE6D7; border-bottom-color: #EDE6D7; }
.wb-wikilink.broken { color: #7A7568; border-bottom-color: rgba(237,230,215,0.18); text-decoration: line-through; text-decoration-color: #7A7568; }

.wb-status { font-family: 'Fraunces', serif; font-weight: 300; font-size: 20px; line-height: 1.5; color: #7A7568; font-style: italic; }
.wb-status a { color: #E26B38; text-decoration: none; border-bottom: 1px solid rgba(226,107,56,0.4); }

.wb-back-link { display: inline-block; margin-top: 80px; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #E26B38; text-decoration: none; border-bottom: 1px solid rgba(226,107,56,0.4); transition: color 200ms, border-color 200ms; }
.wb-back-link:hover { color: #EDE6D7; border-bottom-color: #EDE6D7; }

.wb-metadata-footer { margin-top: 64px; padding-top: 32px; border-top: 1px solid rgba(237,230,215,0.08); font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #7A7568; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px; }

@media (max-width: 800px) {
    .wb-page { padding: 120px 20px 60px; }
    .wb-detail-title .title-mark { display: block; margin: 0 0 12px; transform: none; font-size: 14px; }
    .wb-prose { font-size: 19px; line-height: 1.7; }
    .wb-prose h2 { margin: 64px 0 24px; padding-top: 24px; }
    .wb-prose ol li { padding-left: 48px; font-size: 17px; }
    .wb-prose table { font-size: 11px; }
    .wb-prose th, .wb-prose td { padding: 8px 10px; }
    .wb-metadata-footer { flex-direction: column; gap: 8px; }
}
@media (max-width: 480px) {
    .wb-prose table { font-size: 10px; max-width: 100%; table-layout: auto; }
    .wb-prose th, .wb-prose td { padding: 6px 8px; word-break: break-word; }
    .wb-prose th { letter-spacing: 0.08em; font-size: 10px; }
}
`
