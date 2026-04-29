// @ts-ignore
import { useEffect, useState, useMemo } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Props {
    title?: string
    dek?: string
    date?: string
    readingTime?: number
    order?: number
    body?: string
    heroImage?: { src?: string } | string
}

const ESSAYS_CONTENT_BASE =
    "https://raw.githubusercontent.com/philmora/essays/main/content"
const ESSAYS_INDEX_URL =
    "https://raw.githubusercontent.com/philmora/essays/main/essays.json"

interface EssayMeta {
    slug: string
    title: string
    dek?: string
    date: string
    reading_time: number
    published?: boolean
    order?: number
}

function formatDate(iso: string | undefined): string {
    if (!iso) return ""
    try {
        const d = new Date(iso)
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

function extractSections(
    md: string
): { id: string; idx: string; title: string }[] {
    const out: { id: string; idx: string; title: string }[] = []
    const re = /^##\s+§\s+(\d+)\s*·\s*(.+)$/gm
    let m: RegExpExecArray | null
    while ((m = re.exec(md)) !== null) {
        const num = m[1]
        const title = m[2]
            .replace(/<[^>]+>/g, "")
            .replace(/\*+/g, "")
            .trim()
        out.push({ id: `s${num}`, idx: `§${num}`, title })
    }
    return out
}

function normalizeBody(input: string): string {
    if (!input) return ""
    const looksLikeHTML = /<\/?(p|h[1-6]|ul|ol|li|blockquote|pre|hr|em|strong|a|br)\b/i.test(
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

    while (i < lines.length) {
        const line = lines[i]
        if (/^```/.test(line)) {
            if (inCode) {
                out.push(`<pre><code>${esc(codeBuf.join("\n"))}</code></pre>`)
                codeBuf = []
                inCode = false
            } else inCode = true
            i++
            continue
        }
        if (inCode) { codeBuf.push(line); i++; continue }
        if (/^---\s*$/.test(line)) { out.push("<hr />"); i++; continue }
        if (/^\s*$/.test(line)) { i++; continue }

        const h = /^(#{1,4})\s+(.*)$/.exec(line)
        if (h) {
            const level = h[1].length
            const text = h[2]
            const sec = /^§\s+(\d+)\s*·\s*(.+)$/.exec(text)
            if (level === 2 && sec) {
                const num = sec[1]
                const title = sec[2]
                out.push(
                    `<div class="section-marker" id="s${num}"><div class="idx">§ ${num}</div><h2 class="title">${inline(title)}</h2></div>`
                )
            } else {
                out.push(`<h${level + 1}>${inline(text)}</h${level + 1}>`)
            }
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
            if (text.length < 140) {
                out.push(
                    `<blockquote class="pullquote"><span class="marks">"</span>${inline(text)}</blockquote>`
                )
            } else {
                out.push(`<blockquote>${inline(text)}</blockquote>`)
            }
            continue
        }
        if (/^[-*]\s+/.test(line)) {
            const buf: string[] = []
            while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
                buf.push(`<li>${inline(lines[i].replace(/^[-*]\s+/, ""))}</li>`)
                i++
            }
            out.push(`<ul>${buf.join("")}</ul>`)
            continue
        }
        if (/^\d+\.\s+/.test(line)) {
            const buf: string[] = []
            while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
                buf.push(`<li>${inline(lines[i].replace(/^\d+\.\s+/, ""))}</li>`)
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
            !/^(#{1,4}\s|[-*]\s|\d+\.\s|>\s|---\s*$|```)/.test(lines[i])
        ) {
            pBuf.push(lines[i])
            i++
        }
        out.push(`<p>${inline(pBuf.join(" "))}</p>`)
    }
    return out.join("\n")
}

function enrichTitle(title: string): string {
    if (!title) return ""
    if (/<em>/i.test(title)) return title
    const m = /^(.*?\.)\s+(.+\.?)\s*$/.exec(title)
    if (m && m[2].length > 4 && m[2].length < 60) {
        return `${m[1]} <em>${m[2]}</em>`
    }
    return title
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
 * EssayBodyCMS — Terminal Aurora "Dispatch" essay page.
 */
export default function EssayBodyCMS(props: Props) {
    const title = props.title ?? ""
    const dek = props.dek ?? ""
    const date = props.date ?? ""
    const readingTime = props.readingTime
    const order = props.order

    const [fetchedBody, setFetchedBody] = useState<string | null>(null)
    const [fetchState, setFetchState] = useState<"idle" | "loading" | "error">(
        "idle"
    )
    const [neighbors, setNeighbors] = useState<{
        prev: EssayMeta | null
        next: EssayMeta | null
    }>({ prev: null, next: null })
    const [scrollPct, setScrollPct] = useState(0)
    const [activeSec, setActiveSec] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window === "undefined") return
        const parts = window.location.pathname.split("/").filter(Boolean)
        if (parts[0] !== "essays" || !parts[1]) return
        const slug = parts[1]

        let cancelled = false
        setFetchState("loading")
        ;(async () => {
            try {
                const r = await fetch(`${ESSAYS_CONTENT_BASE}/${slug}.md`, {
                    cache: "no-store",
                })
                if (!r.ok) throw new Error(`HTTP ${r.status}`)
                const text = await r.text()
                if (cancelled) return
                setFetchedBody(stripFrontmatter(text))
                setFetchState("idle")
            } catch (e) {
                if (cancelled) return
                console.warn("essay body fetch failed", e)
                setFetchState("error")
            }
        })()
        ;(async () => {
            try {
                const r = await fetch(ESSAYS_INDEX_URL, { cache: "no-store" })
                if (!r.ok) return
                const data = await r.json()
                const items: EssayMeta[] = Array.isArray(data?.essays)
                    ? data.essays
                    : []
                const pub = items
                    .filter((e) => e.published !== false)
                    .sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
                const idx = pub.findIndex((e) => e.slug === slug)
                if (cancelled || idx === -1) return
                setNeighbors({
                    prev: pub[idx + 1] ?? null,
                    next: pub[idx - 1] ?? null,
                })
            } catch (e) {
                // non-fatal
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

            const markers = Array.from(
                document.querySelectorAll(".section-marker")
            ) as HTMLElement[]
            const y = window.scrollY + 240
            let act: string | null = null
            for (const el of markers) {
                if (el.offsetTop <= y) act = el.id
            }
            setActiveSec(act)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [fetchedBody])

    const body = fetchedBody ?? props.body ?? ""
    const sections = useMemo(() => extractSections(body), [body])
    const orderStr = order != null ? String(order).padStart(3, "0") : "—"
    const dateShort = formatDate(date)

    return (
        <>
            <style>{CSS}</style>
            <div
                className="pm-scroll-progress"
                style={{ width: `${scrollPct}%` }}
                aria-hidden="true"
            />
            <main className="pm-dispatch">
                <div className="pm-page">
                    <header className="pm-masthead">
                        <div className="pm-mh-left">
                            <span>TRANSMISSION · {orderStr}</span>
                            <span className="pm-mh-name">
                                PHIL MORA · THE BIG PICTURE
                            </span>
                        </div>
                        <div className="pm-mh-center">
                            <span className="pm-live-dot" />
                            EDITION {orderStr} · {dateShort || "—"}
                        </div>
                        <div className="pm-mh-right">
                            <span className="pm-coords">
                                40.5853°N · 105.0844°W · 5,000 FT
                            </span>
                            <span className="pm-bars">
                                <span />
                                <span />
                                <span />
                                <span />
                                <span className="off" />
                            </span>
                        </div>
                    </header>

                    <dl className="pm-field-meta">
                        <dt>From</dt>
                        <dd className="accent">
                            Phil Mora · Builder-Operator @ Machinify
                        </dd>
                        <dt>Re</dt>
                        <dd>
                            Issue {orderStr}
                            {title ? " · " : ""}
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: title.replace(/<[^>]+>/g, ""),
                                }}
                            />
                        </dd>
                        <dt>To</dt>
                        <dd>Builders in the collapse</dd>
                        <dt>Class</dt>
                        <dd>
                            OPEN / CC BY 4.0
                            {readingTime != null
                                ? ` / ${readingTime} MIN READ`
                                : ""}
                        </dd>
                    </dl>

                    <section className="pm-title-block">
                        <div className="pm-eyebrow-pulse">
                            DISPATCH · FILED FROM THE FRONT LINE
                        </div>
                        <h1
                            className="pm-essay-title"
                            dangerouslySetInnerHTML={{
                                __html: enrichTitle(title),
                            }}
                        />
                        {dek && <p className="pm-essay-dek">{dek}</p>}
                    </section>

                    <div className="pm-body-wrap">
                        <aside className="pm-rail-left" aria-hidden="true">
                            <div className="pm-rail-meta">
                                <span>
                                    FILE {orderStr} · {dateShort || ""}
                                </span>
                            </div>
                            <div className="pm-rail-meta sig">
                                <span>DISPATCH · OPEN · CC BY 4.0</span>
                            </div>
                            {readingTime != null && (
                                <div className="pm-rail-meta">
                                    <span>{readingTime} MIN READ</span>
                                </div>
                            )}
                        </aside>

                        <article className="pm-prose">
                            {body ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: normalizeBody(body),
                                    }}
                                />
                            ) : fetchState === "loading" ? (
                                <p className="pm-prose-status">Loading…</p>
                            ) : (
                                <p className="pm-prose-status">
                                    Essay in progress. Source will land at{" "}
                                    <a
                                        href="https://github.com/philmora/essays"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        github.com/philmora/essays
                                    </a>
                                    .
                                </p>
                            )}
                        </article>

                        <aside className="pm-rail-right">
                            <div className="pm-rail-card">
                                <div className="pm-rc-hd">
                                    <span>// STATUS</span>
                                    <span className="pm-live">
                                        <span className="pm-live-dot" />
                                        LIVE
                                    </span>
                                </div>
                                <div className="pm-rc-row">
                                    <span className="k">EDITION</span>
                                    <span>{orderStr}</span>
                                </div>
                                {dateShort && (
                                    <div className="pm-rc-row">
                                        <span className="k">FILED</span>
                                        <span>{dateShort}</span>
                                    </div>
                                )}
                                {readingTime != null && (
                                    <div className="pm-rc-row">
                                        <span className="k">READ</span>
                                        <span>{readingTime} MIN</span>
                                    </div>
                                )}
                                <div className="pm-rc-row">
                                    <span className="k">LICENSE</span>
                                    <span>CC BY 4.0</span>
                                </div>
                                <div className="pm-rc-row">
                                    <span className="k">SOURCE</span>
                                    <span className="accent">
                                        philmora/essays
                                    </span>
                                </div>
                            </div>

                            {sections.length > 0 && (
                                <div className="pm-rail-card pm-toc">
                                    <div className="pm-rc-hd">
                                        <span>// CONTENTS</span>
                                    </div>
                                    {sections.map((s) => (
                                        <a
                                            key={s.id}
                                            href={`#${s.id}`}
                                            className={
                                                activeSec === s.id
                                                    ? "active"
                                                    : ""
                                            }
                                        >
                                            <span className="n">{s.idx}</span>
                                            {s.title}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </aside>
                    </div>

                    <footer className="pm-transmission-footer">
                        <div className="pm-eot-bar">
                            END OF TRANSMISSION
                            <span className="pm-cursor-blink" />
                        </div>

                        <div className="pm-nav-dispatches">
                            {neighbors.prev ? (
                                <a
                                    className="pm-nav-dispatch prev"
                                    href={`/essays/${neighbors.prev.slug}`}
                                    rel="external"
                                    onClick={hardNav(
                                        `/essays/${neighbors.prev.slug}`
                                    )}
                                >
                                    <span className="dir">← PREV DISPATCH</span>
                                    <span className="num">
                                        {String(
                                            neighbors.prev.order ?? 0
                                        ).padStart(3, "0")}
                                        {" · "}
                                        {formatDate(neighbors.prev.date)}
                                    </span>
                                    <span
                                        className="title"
                                        dangerouslySetInnerHTML={{
                                            __html: neighbors.prev.title,
                                        }}
                                    />
                                </a>
                            ) : (
                                <div className="pm-nav-dispatch prev disabled">
                                    <span className="dir">← PREV DISPATCH</span>
                                    <span className="num">[NONE]</span>
                                    <span className="title">
                                        First dispatch.
                                    </span>
                                </div>
                            )}
                            {neighbors.next ? (
                                <a
                                    className="pm-nav-dispatch next"
                                    href={`/essays/${neighbors.next.slug}`}
                                    rel="external"
                                    onClick={hardNav(
                                        `/essays/${neighbors.next.slug}`
                                    )}
                                >
                                    <span className="dir">NEXT DISPATCH →</span>
                                    <span className="num">
                                        {String(
                                            neighbors.next.order ?? 0
                                        ).padStart(3, "0")}
                                        {" · "}
                                        {formatDate(neighbors.next.date)}
                                    </span>
                                    <span
                                        className="title"
                                        dangerouslySetInnerHTML={{
                                            __html: neighbors.next.title,
                                        }}
                                    />
                                </a>
                            ) : (
                                <div className="pm-nav-dispatch next disabled">
                                    <span className="dir">NEXT DISPATCH →</span>
                                    <span className="num">[PENDING]</span>
                                    <span className="title">
                                        Next dispatch loading.
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="pm-footer-meta">
                            <a
                                href="/thoughts"
                                rel="external"
                                onClick={hardNav("/thoughts")}
                            >
                                ← ALL DISPATCHES
                            </a>
                            <span>© 2026 PHIL MORA · CC BY 4.0</span>
                            <span>FILED FROM FORT COLLINS, CO</span>
                        </div>
                    </footer>
                </div>
            </main>
        </>
    )
}

addPropertyControls(EssayBodyCMS, {
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "",
        placeholder: "Bind to CMS: Title",
    },
    dek: {
        type: ControlType.String,
        title: "Dek",
        defaultValue: "",
        displayTextArea: true,
        placeholder: "Bind to CMS: Dek",
    },
    date: {
        type: ControlType.String,
        title: "Date",
        defaultValue: "",
        placeholder: "Bind to CMS: Date",
    },
    readingTime: {
        type: ControlType.Number,
        title: "Reading Time",
        defaultValue: 0,
        min: 0,
        max: 180,
    },
    order: {
        type: ControlType.Number,
        title: "Order",
        defaultValue: 0,
        min: 0,
        max: 999,
    },
    body: {
        type: ControlType.String,
        title: "Body (fallback)",
        defaultValue: "",
        displayTextArea: true,
        placeholder: "Auto-fetched from philmora/essays. Leave empty.",
    },
    heroImage: {
        type: ControlType.ResponsiveImage,
        title: "Hero",
    },
})

const CSS = `
@import url(https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,100..900,0..100;1,9..144,100..900,0..100&family=JetBrains+Mono:ital,wght@0,400..800;1,400..800&display=swap);

.pm-scroll-progress { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: #E26B38; box-shadow: 0 0 8px rgba(226,107,56,0.5); z-index: 200; transition: width 60ms linear; }

.pm-dispatch { color: #EDE6D7; font-family: 'JetBrains Mono', ui-monospace, monospace; position: relative; z-index: 3; }
.pm-dispatch * { box-sizing: border-box; }
.pm-dispatch h1, .pm-dispatch h2, .pm-dispatch h3, .pm-dispatch p, .pm-dispatch ol, .pm-dispatch ul, .pm-dispatch dl, .pm-dispatch dd, .pm-dispatch dt, .pm-dispatch blockquote, .pm-dispatch li, .pm-dispatch figure { margin: 0; padding: 0; }
.pm-dispatch ol, .pm-dispatch ul { list-style: none; }
.pm-dispatch a { color: inherit; text-decoration: none; }

.pm-page { max-width: 1440px; margin: 0 auto; padding: 0 clamp(24px, 4vw, 72px); }

@keyframes pm_disp_pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.75); } }
@keyframes pm_disp_blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

.pm-masthead { padding: 112px 0 20px; border-bottom: 1px solid rgba(237,230,215,0.08); display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 32px; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; color: #7A7568; text-transform: uppercase; }
.pm-mh-left { display: flex; flex-direction: column; gap: 4px; }
.pm-mh-left .pm-mh-name { color: #EDE6D7; }
.pm-mh-center { color: #E26B38; font-size: 13px; letter-spacing: 0.18em; white-space: nowrap; display: inline-flex; align-items: center; gap: 10px; }
.pm-live-dot { display: inline-block; width: 7px; height: 7px; background: #E26B38; border-radius: 50%; box-shadow: 0 0 10px #E26B38; animation: pm_disp_pulse 1.4s ease-in-out infinite; }
.pm-mh-right { display: flex; flex-direction: column; gap: 4px; text-align: right; align-items: flex-end; }
.pm-coords { color: #EDE6D7; font-size: 10px; letter-spacing: 0.14em; }
.pm-bars { display: inline-flex; gap: 3px; margin-top: 4px; }
.pm-bars span { display: inline-block; width: 3px; height: 10px; background: #E26B38; box-shadow: 0 0 6px rgba(226,107,56,0.25); }
.pm-bars span.off { background: #3A3E48; box-shadow: none; }

.pm-field-meta { padding: 32px 0; border-bottom: 1px solid rgba(237,230,215,0.08); display: grid; grid-template-columns: 120px 1fr 120px 1fr; row-gap: 12px; column-gap: 24px; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.08em; }
.pm-field-meta dt { color: #7A7568; text-transform: uppercase; font-size: 10px; letter-spacing: 0.2em; padding-top: 2px; }
.pm-field-meta dd { color: #EDE6D7; }
.pm-field-meta dd.accent { color: #E26B38; }

.pm-title-block { padding: 120px 0 80px; max-width: 980px; }
.pm-eyebrow-pulse { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #7A7568; display: inline-flex; align-items: center; margin-bottom: 48px; }
.pm-eyebrow-pulse::before { content: ""; display: inline-block; width: 6px; height: 6px; background: #E26B38; border-radius: 50%; margin-right: 10px; box-shadow: 0 0 12px rgba(226,107,56,0.25); animation: pm_disp_pulse 1.8s ease-in-out infinite; }
.pm-essay-title { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(56px, 8vw, 128px); line-height: 0.94; letter-spacing: -0.035em; color: #EDE6D7; font-variation-settings: "opsz" 144, "SOFT" 50; text-wrap: balance; margin-bottom: 40px; }
.pm-essay-title em { font-style: italic; font-weight: 900; color: #E26B38; }
.pm-essay-dek { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(22px, 2.4vw, 32px); line-height: 1.35; letter-spacing: -0.01em; color: #BDB6A8; max-width: 720px; text-wrap: pretty; }
.pm-essay-dek em { color: #EDE6D7; font-style: italic; font-weight: 400; }

.pm-body-wrap { display: grid; grid-template-columns: 88px 1fr 240px; gap: 48px; padding-bottom: 120px; position: relative; }
.pm-rail-left { border-right: 1px solid rgba(237,230,215,0.08); padding-right: 24px; display: flex; flex-direction: column; gap: 48px; position: sticky; top: 100px; align-self: start; max-height: calc(100vh - 160px); }
.pm-rail-meta { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.22em; color: #7A7568; writing-mode: vertical-rl; transform: rotate(180deg); text-transform: uppercase; }
.pm-rail-meta.sig { color: #E26B38; }

.pm-prose { max-width: 680px; font-family: 'Fraunces', serif; font-weight: 300; font-size: 21px; line-height: 1.7; letter-spacing: -0.005em; color: #BDB6A8; }
.pm-prose p { margin: 0 0 28px; text-wrap: pretty; color: #BDB6A8; }
.pm-prose p em { color: #E26B38; font-style: italic; font-weight: 400; }
.pm-prose p strong { color: #EDE6D7; font-weight: 700; }

.pm-prose .section-marker { display: grid; grid-template-columns: auto 1fr; gap: 20px; align-items: baseline; margin: 96px 0 40px; padding-top: 32px; border-top: 1px solid rgba(237,230,215,0.08); scroll-margin-top: 100px; }
.pm-prose .section-marker .idx { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; color: #E26B38; text-transform: uppercase; padding-top: 16px; }
.pm-prose .section-marker .title { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(32px, 3.4vw, 48px); line-height: 1.05; letter-spacing: -0.02em; color: #EDE6D7; font-variation-settings: "opsz" 144, "SOFT" 50; text-wrap: balance; }
.pm-prose .section-marker .title em { font-style: italic; font-weight: 900; color: #E26B38; }

.pm-prose .pullquote { margin: 80px -40px; padding: 64px 40px; border-top: 1px solid rgba(226,107,56,0.3); border-bottom: 1px solid rgba(226,107,56,0.3); text-align: center; font-family: 'Fraunces', serif; font-weight: 900; font-style: italic; font-size: clamp(32px, 4.2vw, 56px); line-height: 1.1; letter-spacing: -0.025em; color: #E26B38; font-variation-settings: "opsz" 144, "SOFT" 50; text-wrap: balance; position: relative; }
.pm-prose .pullquote::before, .pm-prose .pullquote::after { content: ""; position: absolute; left: 50%; width: 60px; height: 1px; background: #E26B38; transform: translateX(-50%); box-shadow: 0 0 10px rgba(226,107,56,0.5); }
.pm-prose .pullquote::before { top: -1px; }
.pm-prose .pullquote::after { bottom: -1px; }
.pm-prose .pullquote .marks { display: block; font-family: 'Fraunces', serif; color: #E26B38; opacity: 0.35; font-size: 0.6em; margin-bottom: 8px; letter-spacing: 0; }

.pm-prose blockquote:not(.pullquote) { border-left: 2px solid #E26B38; padding: 8px 0 8px 28px; margin: 32px 0; font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(22px, 2.2vw, 28px); line-height: 1.4; color: #EDE6D7; letter-spacing: -0.015em; text-wrap: pretty; }
.pm-prose blockquote em { color: #E26B38; }

.pm-prose ol, .pm-prose ul { margin: 0 0 36px 0; padding: 0; list-style: none; font-family: 'Fraunces', serif; }
.pm-prose ol { counter-reset: pm-ol-counter; }
.pm-prose ol li { counter-increment: pm-ol-counter; padding: 20px 0 20px 64px; border-top: 1px solid rgba(237,230,215,0.08); position: relative; line-height: 1.5; color: #BDB6A8; }
.pm-prose ol li::before { content: counter(pm-ol-counter, decimal-leading-zero); position: absolute; left: 0; top: 20px; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; color: #E26B38; }
.pm-prose ol li:last-child { border-bottom: 1px solid rgba(237,230,215,0.08); }
.pm-prose ol li strong { color: #EDE6D7; }
.pm-prose ul li { padding: 10px 0 10px 24px; line-height: 1.5; color: #BDB6A8; position: relative; }
.pm-prose ul li::before { content: "▸"; position: absolute; left: 0; color: #E26B38; font-family: 'JetBrains Mono', monospace; }
.pm-prose ul li strong { color: #EDE6D7; }

.pm-prose a { color: #E26B38; text-decoration: none; border-bottom: 1px solid rgba(226,107,56,0.4); transition: border-color 200ms; }
.pm-prose a:hover { border-bottom-color: #E26B38; }

.pm-prose hr { border: 0; border-top: 1px solid rgba(237,230,215,0.08); margin: 48px auto; width: 60%; }
.pm-prose code { font-family: 'JetBrains Mono', monospace; font-size: 0.9em; background: #12141B; padding: 2px 6px; border-radius: 3px; color: #EDE6D7; }
.pm-prose pre { font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.55; background: #12141B; border: 1px solid rgba(237,230,215,0.08); border-radius: 4px; padding: 16px 20px; overflow-x: auto; color: #EDE6D7; margin: 0 0 28px; }
.pm-prose pre code { background: transparent; padding: 0; font-size: 13px; }

.pm-prose table { width: 100%; border-collapse: collapse; margin: 28px 0; font-family: 'JetBrains Mono', monospace; font-size: 13px; }
.pm-prose th, .pm-prose td { padding: 12px 16px; text-align: left; border-bottom: 1px solid rgba(237,230,215,0.08); }
.pm-prose th { color: #E26B38; letter-spacing: 0.12em; text-transform: uppercase; font-size: 11px; }
.pm-prose td { color: #BDB6A8; }

.pm-prose-status { font-family: 'Fraunces', serif; font-weight: 300; font-size: 20px; line-height: 1.5; color: #7A7568; font-style: italic; }
.pm-prose-status a { color: #E26B38; text-decoration: none; border-bottom: 1px solid rgba(226,107,56,0.4); }

.pm-rail-right { position: sticky; top: 100px; align-self: start; max-height: calc(100vh - 160px); overflow: hidden; display: flex; flex-direction: column; gap: 20px; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
.pm-rail-card { border: 1px solid rgba(237,230,215,0.18); background: rgba(10,11,15,0.4); backdrop-filter: blur(4px); padding: 16px; }
.pm-rc-hd { display: flex; justify-content: space-between; color: #EDE6D7; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; padding-bottom: 10px; margin-bottom: 12px; border-bottom: 1px solid rgba(237,230,215,0.08); }
.pm-rc-hd .pm-live { color: #E26B38; display: inline-flex; align-items: center; gap: 6px; }
.pm-rc-hd .pm-live .pm-live-dot { width: 6px; height: 6px; }
.pm-rc-row { display: grid; grid-template-columns: 80px 1fr; gap: 8px; padding: 6px 0; color: #BDB6A8; font-size: 10px; letter-spacing: 0.08em; }
.pm-rc-row .k { color: #7A7568; letter-spacing: 0.18em; text-transform: uppercase; font-size: 9px; padding-top: 2px; }
.pm-rc-row .accent { color: #E26B38; }
.pm-toc a { display: block; padding: 6px 0; color: #7A7568; text-decoration: none; font-size: 10px; letter-spacing: 0.08em; transition: color 160ms; line-height: 1.4; }
.pm-toc a:hover { color: #EDE6D7; }
.pm-toc a .n { color: #E26B38; margin-right: 10px; }
.pm-toc a.active { color: #E26B38; }
.pm-toc a.active .n { color: #EDE6D7; }

.pm-transmission-footer { border-top: 1px solid rgba(237,230,215,0.18); padding: 64px 0 80px; display: flex; flex-direction: column; gap: 48px; }
.pm-eot-bar { text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.4em; text-transform: uppercase; color: #E26B38; padding: 32px 0; border-top: 1px solid rgba(226,107,56,0.3); border-bottom: 1px solid rgba(226,107,56,0.3); }
.pm-cursor-blink { display: inline-block; width: 10px; height: 14px; background: #E26B38; vertical-align: middle; margin-left: 8px; animation: pm_disp_blink 1s step-end infinite; }

.pm-nav-dispatches { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
.pm-nav-dispatch { display: flex; flex-direction: column; gap: 8px; padding: 24px; border: 1px solid rgba(237,230,215,0.18); background: rgba(10,11,15,0.4); text-decoration: none; color: inherit; transition: border-color 200ms, background 200ms; }
.pm-nav-dispatch:hover:not(.disabled) { border-color: #E26B38; background: rgba(226,107,56,0.05); }
.pm-nav-dispatch.disabled { opacity: 0.45; cursor: not-allowed; }
.pm-nav-dispatch.next { text-align: right; }
.pm-nav-dispatch .dir { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.22em; color: #E26B38; text-transform: uppercase; }
.pm-nav-dispatch .num { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.18em; color: #7A7568; }
.pm-nav-dispatch .title { font-family: 'Fraunces', serif; font-weight: 300; font-size: 22px; line-height: 1.15; letter-spacing: -0.015em; color: #EDE6D7; font-variation-settings: "opsz" 144, "SOFT" 50; }
.pm-nav-dispatch .title em { font-style: italic; font-weight: 900; color: #E26B38; }

.pm-footer-meta { padding: 24px 0 0; border-top: 1px solid rgba(237,230,215,0.08); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #7A7568; }
.pm-footer-meta a { color: #E26B38; text-decoration: none; }
.pm-footer-meta a:hover { color: #EDE6D7; }

@media (max-width: 1200px) {
    .pm-body-wrap { grid-template-columns: 56px 1fr 220px; gap: 32px; }
    .pm-rail-left { padding-right: 16px; }
}
@media (max-width: 1000px) {
    .pm-body-wrap { grid-template-columns: 1fr; gap: 0; padding-bottom: 80px; }
    .pm-rail-left { display: none; }
    .pm-rail-right { position: static; max-height: none; margin-top: 64px; padding-top: 32px; border-top: 1px solid rgba(237,230,215,0.08); overflow: visible; }
    .pm-field-meta { grid-template-columns: 80px 1fr; }
    .pm-field-meta dt:nth-child(5), .pm-field-meta dt:nth-child(7) { display: none; }
    .pm-field-meta dd:nth-child(6), .pm-field-meta dd:nth-child(8) { display: none; }
    .pm-prose .pullquote { margin: 64px -20px; padding: 48px 20px; }
    .pm-nav-dispatches { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
    .pm-page { padding: 0 20px; }
    .pm-masthead { grid-template-columns: 1fr; gap: 12px; text-align: left; padding: 88px 0 16px; }
    .pm-mh-center, .pm-mh-right { text-align: left; align-items: flex-start; }
    .pm-coords { font-size: 9px; }
    .pm-field-meta { padding: 20px 0; grid-template-columns: 60px 1fr; row-gap: 8px; column-gap: 12px; font-size: 11px; }
    .pm-field-meta dt { font-size: 9px; }
    .pm-title-block { padding: 64px 0 48px; }
    .pm-eyebrow-pulse { margin-bottom: 28px; font-size: 10px; }
    .pm-essay-title { font-size: clamp(40px, 11vw, 64px); margin-bottom: 24px; }
    .pm-essay-dek { font-size: 19px; }
    .pm-prose { font-size: 19px; line-height: 1.7; }
    .pm-prose .section-marker { margin: 64px 0 28px; padding-top: 24px; grid-template-columns: 1fr; gap: 8px; }
    .pm-prose .section-marker .idx { padding-top: 0; }
    .pm-prose .section-marker .title { font-size: 28px; }
    .pm-prose .pullquote { margin: 48px -20px; padding: 40px 20px; font-size: 28px; }
    .pm-prose ol li { padding-left: 48px; font-size: 17px; }
    .pm-prose ol li::before { font-size: 10px; }
    .pm-eot-bar { font-size: 10px; letter-spacing: 0.3em; padding: 20px 0; }
    .pm-nav-dispatch { padding: 18px; }
    .pm-nav-dispatch .title { font-size: 18px; }
    .pm-footer-meta { flex-direction: column; gap: 8px; font-size: 9px; }
}
`
