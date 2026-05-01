// @ts-ignore
import { useEffect, useState, useMemo } from "react"
import { addPropertyControls, ControlType } from "framer"

// NOTE: Currently DORMANT in the project. The /factory/:slug page was deleted
// from the Framer project on 2026-05-01 in favor of linking recipes directly
// to GitHub-rendered markdown (see FactoryIndex.tsx). This component is kept
// in case the dynamic in-site route is ever revived. If you bring it back:
//   1. Recreate the /factory/:slug page in Framer
//   2. Insert this component as the body
//   3. Create a CMS collection (e.g. "Product Factory Recipes") and bind the
//      dynamic route to it (Framer requires this for static generation)
//   4. Add an item per recipe slug

const MIRROR_BASE =
    "https://raw.githubusercontent.com/philmora/product-factory-mirror/main"
const RECIPES_INDEX_URL = `${MIRROR_BASE}/recipes.json`

interface RecipeItem {
    slug: string
    title: string
    dek: string
    date: string
    updated: string
    category: string
    order: number
    tags?: string[]
    "applies-to"?: string[]
}

interface CategoryMeta {
    display: string
    order: number
}

interface RecipesIndex {
    _categories: Record<string, CategoryMeta>
    [key: string]: any
}

function findItem(
    idx: RecipesIndex | null,
    slug: string
): { category: string; item: RecipeItem } | null {
    if (!idx || !idx._categories) return null
    for (const cat of Object.keys(idx._categories)) {
        const items = idx[cat]
        if (!Array.isArray(items)) continue
        const match = (items as RecipeItem[]).find((x) => x.slug === slug)
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

function stripTitleAndDek(md: string): string {
    let s = md.replace(/^\s*\n+/, "")
    s = s.replace(/^#\s+[^\n]+\n+/, "")
    s = s.replace(/^\s*\n+/, "")
    s = s.replace(/^\*[^*\n][^*]*\*\s*\n+/, "")
    return s
}

function makeNormalizeBody() {
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

        const splitTableRow = (s: string): string[] => {
            let trimmed = s.trim()
            if (trimmed.startsWith("|")) trimmed = trimmed.slice(1)
            if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1)
            return trimmed.split("|").map((c) => c.trim())
        }

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

            if (
                /^\s*\|/.test(line) &&
                i + 1 < lines.length &&
                isTableSeparator(lines[i + 1])
            ) {
                const headers = splitTableRow(line)
                i += 2
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
 * FactoryBody — Terminal Aurora Product Factory recipe detail page.
 * URL: /factory/{slug}  (dormant — page deleted 2026-05-01; see header note)
 */
export default function FactoryBody() {
    const [idx, setIdx] = useState<RecipesIndex | null>(null)
    const [body, setBody] = useState<string | null>(null)
    const [slug, setSlug] = useState<string | null>(null)
    const [category, setCategory] = useState<string | null>(null)
    const [meta, setMeta] = useState<RecipeItem | null>(null)
    const [fetchState, setFetchState] = useState<
        "loading" | "ready" | "error"
    >("loading")
    const [scrollPct, setScrollPct] = useState(0)

    useEffect(() => {
        if (typeof window === "undefined") return
        const parts = window.location.pathname.split("/").filter(Boolean)
        if (parts[0] !== "factory" || !parts[1]) {
            setFetchState("error")
            return
        }
        const s = parts[1]
        setSlug(s)

        let cancelled = false
        ;(async () => {
            try {
                const idxRes = await fetch(RECIPES_INDEX_URL, {
                    cache: "no-store",
                })
                if (!idxRes.ok) throw new Error(`recipes ${idxRes.status}`)
                const w: RecipesIndex = await idxRes.json()
                if (cancelled) return
                setIdx(w)

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
                    console.warn("product-factory fetch failed", e)
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

    const normalizeBody = useMemo(() => makeNormalizeBody(), [])

    const categoryDisplay = useMemo(() => {
        if (!idx || !category) return ""
        return (
            idx._categories?.[category]?.display?.toUpperCase() ??
            category.toUpperCase()
        )
    }, [idx, category])

    const orderStr =
        meta?.order != null ? String(meta.order).padStart(2, "0") : "—"

    return (
        <>
            <style>{CSS}</style>
            <div
                className="fb-scroll-progress"
                style={{ width: `${scrollPct}%` }}
                aria-hidden="true"
            />
            <main className="fb-detail">
                <div className="fb-page">
                    {slug && (
                        <div className="fb-breadcrumb">
                            <a
                                href="/factory"
                                onClick={hardNav("/factory")}
                            >
                                product-factory
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
                            <h1 className="fb-detail-title">
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
                                    className="fb-dek"
                                    dangerouslySetInnerHTML={{
                                        __html: meta.dek,
                                    }}
                                />
                            )}
                        </>
                    ) : fetchState === "loading" ? (
                        <h1 className="fb-detail-title">Loading…</h1>
                    ) : (
                        <h1 className="fb-detail-title">
                            Not <em>found.</em>
                        </h1>
                    )}

                    <article className="fb-prose">
                        {body ? (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: normalizeBody(body),
                                }}
                            />
                        ) : fetchState === "loading" ? (
                            <p className="fb-status">Loading recipe body…</p>
                        ) : (
                            <p className="fb-status">
                                Recipe not found. Check the URL or browse the{" "}
                                <a
                                    href="/factory"
                                    onClick={hardNav("/factory")}
                                >
                                    factory index
                                </a>
                                .
                            </p>
                        )}
                    </article>

                    <a
                        href="/factory"
                        className="fb-back-link"
                        onClick={hardNav("/factory")}
                    >
                        ← back to product factory
                    </a>

                    {meta && (
                        <div className="fb-metadata-footer">
                            <span>created {formatDate(meta.date)}</span>
                            <span>updated {formatDate(meta.updated)}</span>
                            <span>via philmora/product-factory-mirror</span>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}

addPropertyControls(FactoryBody, {})

const CSS = `
@import url(https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,100..900,0..100;1,9..144,100..900,0..100&family=JetBrains+Mono:ital,wght@0,400..800;1,400..800&display=swap);

.fb-scroll-progress { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: #E26B38; box-shadow: 0 0 8px rgba(226,107,56,0.5); z-index: 200; transition: width 60ms linear; }

.fb-detail { color: #EDE6D7; font-family: 'JetBrains Mono', ui-monospace, monospace; position: relative; z-index: 3; }
.fb-detail * { box-sizing: border-box; }
.fb-detail h1, .fb-detail h2, .fb-detail h3, .fb-detail p, .fb-detail ol, .fb-detail ul, .fb-detail blockquote, .fb-detail li, .fb-detail figure { margin: 0; padding: 0; }
.fb-detail ol, .fb-detail ul { list-style: none; }
.fb-detail a { color: inherit; text-decoration: none; }

.fb-page { max-width: 1100px; margin: 0 auto; padding: 160px clamp(24px, 4vw, 72px) 80px; }

@keyframes fb_pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.75); } }

.fb-breadcrumb { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #7A7568; margin-bottom: 32px; }
.fb-breadcrumb a { color: #7A7568; text-decoration: none; transition: color 160ms; }
.fb-breadcrumb a:hover { color: #E26B38; }
.fb-breadcrumb .sep { margin: 0 10px; color: rgba(237,230,215,0.18); }
.fb-breadcrumb .current { color: #EDE6D7; }

.fb-detail-title { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(48px, 8vw, 112px); letter-spacing: -0.035em; line-height: 0.94; color: #EDE6D7; font-variation-settings: "opsz" 144, "SOFT" 50; margin: 0 0 40px; text-wrap: balance; }
.fb-detail-title .title-mark { display: inline-block; font-family: 'JetBrains Mono', monospace; font-weight: 400; font-size: 0.18em; vertical-align: middle; color: #E26B38; letter-spacing: 0.18em; margin-right: 0.6em; text-transform: uppercase; transform: translateY(-0.4em); }
.fb-detail-title em { font-style: italic; font-weight: 900; color: #E26B38; }

.fb-dek { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(22px, 2.4vw, 32px); line-height: 1.35; letter-spacing: -0.01em; color: #BDB6A8; max-width: 780px; margin: 0; text-wrap: pretty; }
.fb-dek em { color: #E26B38; font-style: italic; font-weight: 400; }

.fb-prose { max-width: 720px; font-family: 'Fraunces', serif; font-weight: 300; font-size: 21px; line-height: 1.7; letter-spacing: -0.005em; color: #BDB6A8; margin-top: 64px; }

.fb-prose h2 { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(28px, 3.4vw, 44px); line-height: 1.1; letter-spacing: -0.02em; color: #EDE6D7; font-variation-settings: "opsz" 144, "SOFT" 50; margin: 88px 0 28px; padding-top: 32px; border-top: 1px solid rgba(237,230,215,0.08); text-wrap: balance; }
.fb-prose h2:first-child { margin-top: 0; padding-top: 0; border-top: none; }
.fb-prose h2 em { font-style: italic; font-weight: 900; color: #E26B38; }

.fb-prose h3 { font-family: 'Fraunces', serif; font-weight: 700; font-size: clamp(22px, 2.4vw, 28px); line-height: 1.2; letter-spacing: -0.015em; color: #EDE6D7; margin: 48px 0 20px; }

.fb-prose p { margin: 0 0 28px; color: #BDB6A8; text-wrap: pretty; }
.fb-prose p em { color: #E26B38; font-style: italic; font-weight: 400; }
.fb-prose p strong { color: #EDE6D7; font-weight: 700; }

.fb-prose a { color: #E26B38; text-decoration: none; border-bottom: 1px solid rgba(226,107,56,0.4); transition: border-color 200ms; }
.fb-prose a:hover { border-bottom-color: #E26B38; }

.fb-prose ul { margin: 0 0 36px 0; padding: 0; list-style: none; }
.fb-prose ul li { padding: 10px 0 10px 24px; line-height: 1.5; color: #BDB6A8; position: relative; }
.fb-prose ul li::before { content: "▸"; position: absolute; left: 0; color: #E26B38; font-family: 'JetBrains Mono', monospace; }
.fb-prose ul li strong { color: #EDE6D7; }

.fb-prose ol { margin: 0 0 36px 0; padding: 0; list-style: none; counter-reset: fb-ol-counter; }
.fb-prose ol li { counter-increment: fb-ol-counter; padding: 20px 0 20px 64px; border-top: 1px solid rgba(237,230,215,0.08); position: relative; line-height: 1.5; color: #BDB6A8; }
.fb-prose ol li::before { content: counter(fb-ol-counter, decimal-leading-zero); position: absolute; left: 0; top: 20px; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; color: #E26B38; }
.fb-prose ol li:last-child { border-bottom: 1px solid rgba(237,230,215,0.08); }
.fb-prose ol li strong { color: #EDE6D7; }

.fb-prose pre { font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.55; background: #12141B; border: 1px solid rgba(237,230,215,0.08); border-radius: 4px; padding: 16px 20px; overflow-x: auto; color: #EDE6D7; margin: 0 0 28px; }
.fb-prose code { font-family: 'JetBrains Mono', monospace; font-size: 0.9em; background: #12141B; padding: 2px 6px; border-radius: 3px; color: #EDE6D7; }
.fb-prose pre code { background: transparent; padding: 0; font-size: 13px; }

.fb-prose blockquote { border-left: 2px solid #E26B38; padding: 8px 0 8px 28px; margin: 32px 0; font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(22px, 2.2vw, 28px); line-height: 1.4; color: #EDE6D7; font-style: italic; letter-spacing: -0.015em; text-wrap: pretty; }
.fb-prose blockquote em { color: #E26B38; }

.fb-prose hr { border: 0; border-top: 1px solid rgba(237,230,215,0.08); margin: 48px auto; width: 60%; }

.fb-prose table { width: 100%; border-collapse: collapse; margin: 32px 0; font-family: 'JetBrains Mono', monospace; font-size: 13px; background: rgba(18,20,27,0.4); border: 1px solid rgba(237,230,215,0.08); }
.fb-prose th, .fb-prose td { padding: 12px 16px; text-align: left; border-bottom: 1px solid rgba(237,230,215,0.08); }
.fb-prose th { color: #E26B38; letter-spacing: 0.12em; text-transform: uppercase; font-size: 11px; background: rgba(18,20,27,0.6); }
.fb-prose td { color: #BDB6A8; }
.fb-prose tbody tr:last-child td { border-bottom: none; }
.fb-prose td strong { color: #EDE6D7; }

.fb-status { font-family: 'Fraunces', serif; font-weight: 300; font-size: 20px; line-height: 1.5; color: #7A7568; font-style: italic; }
.fb-status a { color: #E26B38; text-decoration: none; border-bottom: 1px solid rgba(226,107,56,0.4); }

.fb-back-link { display: inline-block; margin-top: 80px; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #E26B38; text-decoration: none; border-bottom: 1px solid rgba(226,107,56,0.4); transition: color 200ms, border-color 200ms; }
.fb-back-link:hover { color: #EDE6D7; border-bottom-color: #EDE6D7; }

.fb-metadata-footer { margin-top: 64px; padding-top: 32px; border-top: 1px solid rgba(237,230,215,0.08); font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #7A7568; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px; }

@media (max-width: 800px) {
    .fb-page { padding: 120px 20px 60px; }
    .fb-detail-title .title-mark { display: block; margin: 0 0 12px; transform: none; font-size: 14px; }
    .fb-prose { font-size: 19px; line-height: 1.7; }
    .fb-prose h2 { margin: 64px 0 24px; padding-top: 24px; }
    .fb-prose ol li { padding-left: 48px; font-size: 17px; }
    .fb-prose table { font-size: 11px; }
    .fb-prose th, .fb-prose td { padding: 8px 10px; }
    .fb-metadata-footer { flex-direction: column; gap: 8px; }
}
@media (max-width: 480px) {
    .fb-prose table { font-size: 10px; max-width: 100%; table-layout: auto; }
    .fb-prose th, .fb-prose td { padding: 6px 8px; word-break: break-word; }
    .fb-prose th { letter-spacing: 0.08em; font-size: 10px; }
}
`
