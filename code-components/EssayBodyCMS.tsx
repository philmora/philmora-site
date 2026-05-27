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

// Front-page heading pattern: green the final word (with its trailing
// punctuation) in chartreuse-italic-bold. Only applies when the heading has
// no emphasis/markup of its own — so hand-authored *emphasis* always wins.
function greenLastWord(html: string): string {
    if (/[<]/.test(html)) return html
    return html.replace(/(\S+)(\s*)$/, "<em>$1</em>$2")
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
                    `<div class="section-marker" id="s${num}"><div class="idx">§ ${num}</div><h2 class="title">${greenLastWord(inline(title))}</h2></div>`
                )
            } else {
                out.push(`<h${level + 1}>${greenLastWord(inline(text))}</h${level + 1}>`)
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
    return greenLastWord(title)
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
 * EssayBodyCMS — D5 brutalist "Dispatch" post template (/essays/:slug).
 * All JetBrains Mono, sharp corners, chartreuse accents. Headings follow the
 * front-page pattern: thin display base + a chartreuse-italic-bold emphasis
 * word (auto-applied to the final word when the source has no emphasis).
 *
 * Chrome is deliberately lean: one masthead line, a single metadata memo
 * block (the only home for issue/date/reading-time/license), and a Table of
 * Contents rail. No duplicated telemetry.
 *
 * Container queries (not @media) for Framer's full-window render context.
 * The fixed scroll-progress bar is a sibling OUTSIDE the container-type root
 * so containment doesn't break its viewport pinning.
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
    const filedLine = [dateShort, readingTime != null ? `${readingTime} MIN READ` : ""]
        .filter(Boolean)
        .join(" · ")

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: CSS }} />
            <div
                className="pm-scroll-progress"
                style={{ width: `${scrollPct}%` }}
                aria-hidden="true"
            />
            <main className="pm-dispatch">
                <div className="pm-page">
                    <header className="pm-masthead">
                        <span className="pm-mh-brand">
                            PHIL MORA · FIELD NOTES
                        </span>
                        <span className="pm-mh-issue">
                            <span className="pm-live-dot" />
                            TRANSMISSION {orderStr}
                        </span>
                    </header>

                    <dl className="pm-field-meta">
                        <dt>From</dt>
                        <dd className="accent">
                            Phil Mora · Builder-Operator @ Machinify
                        </dd>
                        <dt>Re</dt>
                        <dd
                            dangerouslySetInnerHTML={{
                                __html: title.replace(/<[^>]+>/g, ""),
                            }}
                        />
                        <dt>To</dt>
                        <dd>Builders in the collapse</dd>
                        {filedLine && (
                            <>
                                <dt>Filed</dt>
                                <dd>{filedLine}</dd>
                            </>
                        )}
                        <dt>Class</dt>
                        <dd>OPEN / CC BY 4.0</dd>
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

                        {sections.length > 0 && (
                            <aside className="pm-rail-right">
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
                            </aside>
                        )}
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
                                ← ALL FIELD NOTES
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
.pm-scroll-progress { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: #C8FF3D; box-shadow: 0 0 8px rgba(200,255,61,0.5); z-index: 200; transition: width 60ms linear; }

.pm-dispatch {
  --ink: #0A0B0E;
  --ink-2: #131419;
  --ink-3: #1A1C22;
  --paper: #E8E6DC;
  --paper-dim: #989384;
  --paper-mute: #5A5750;
  --prose: #D2CEC2;
  --line: rgba(232, 230, 220, 0.14);
  --line-strong: rgba(232, 230, 220, 0.30);
  --signal: #C8FF3D;
  --signal-dim: #87a821;
  --slate: #3A3E48;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  color: var(--paper);
  font-family: var(--mono);
  -webkit-font-smoothing: antialiased;
  position: relative;
  container-type: inline-size;
}
.pm-dispatch * { box-sizing: border-box; }
.pm-dispatch h1, .pm-dispatch h2, .pm-dispatch h3, .pm-dispatch p, .pm-dispatch ol, .pm-dispatch ul, .pm-dispatch dl, .pm-dispatch dd, .pm-dispatch dt, .pm-dispatch blockquote, .pm-dispatch li, .pm-dispatch figure { margin: 0; padding: 0; }
.pm-dispatch ol, .pm-dispatch ul { list-style: none; }
.pm-dispatch a { color: inherit; text-decoration: none; }

.pm-page { max-width: 1320px; margin: 0 auto; padding: 0 clamp(20px, 3cqw, 56px); }

@keyframes pm_disp_pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.75); } }
@keyframes pm_disp_blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

.pm-masthead { padding: 84px 0 18px; border-bottom: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; gap: 24px; font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; }
.pm-mh-brand { color: var(--paper); }
.pm-mh-brand::before { content: "▍"; color: var(--signal); margin-right: 8px; }
.pm-mh-issue { color: var(--signal); display: inline-flex; align-items: center; gap: 10px; white-space: nowrap; }
.pm-live-dot { display: inline-block; width: 7px; height: 7px; background: var(--signal); border-radius: 50%; box-shadow: 0 0 10px var(--signal); animation: pm_disp_pulse 1.4s ease-in-out infinite; }

.pm-field-meta { padding: 28px 0; border-bottom: 1px solid var(--line); display: grid; grid-template-columns: 100px 1fr; row-gap: 12px; column-gap: 24px; max-width: 760px; font-family: var(--mono); font-size: 12px; letter-spacing: 0.06em; }
.pm-field-meta dt { color: var(--paper-mute); text-transform: uppercase; font-size: 10px; letter-spacing: 0.2em; padding-top: 2px; }
.pm-field-meta dd { color: var(--paper); }
.pm-field-meta dd.accent { color: var(--signal); }

.pm-title-block { padding: 88px 0 64px; max-width: 1000px; }
.pm-eyebrow-pulse { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--paper-mute); display: inline-flex; align-items: center; margin-bottom: 40px; }
.pm-eyebrow-pulse::before { content: ""; display: inline-block; width: 6px; height: 6px; background: var(--signal); border-radius: 50%; margin-right: 10px; box-shadow: 0 0 12px rgba(200,255,61,0.25); animation: pm_disp_pulse 1.8s ease-in-out infinite; }
.pm-essay-title { font-family: var(--mono); font-weight: 100; font-size: clamp(42px, 8cqw, 112px); line-height: 0.96; letter-spacing: -0.05em; color: var(--paper); text-wrap: balance; margin-bottom: 36px; }
.pm-essay-title em { font-style: italic; font-weight: 800; color: var(--signal); }
.pm-essay-dek { font-family: var(--mono); font-weight: 400; font-size: clamp(15px, 1.6cqw, 19px); line-height: 1.55; letter-spacing: 0.005em; color: var(--paper-dim); max-width: 660px; text-wrap: pretty; }
.pm-essay-dek em { color: var(--signal); font-style: italic; font-weight: 700; }

.pm-body-wrap { display: grid; grid-template-columns: 1fr 240px; gap: 64px; padding-bottom: 120px; position: relative; }
.pm-prose { max-width: 680px; font-family: var(--mono); font-weight: 400; font-size: 16px; line-height: 1.78; letter-spacing: 0.005em; color: var(--prose); }
.pm-prose p { margin: 0 0 24px; text-wrap: pretty; color: var(--prose); }
.pm-prose p em { color: var(--signal); font-style: italic; font-weight: 700; }
.pm-prose p strong { color: var(--paper); font-weight: 700; }

.pm-prose .section-marker { display: grid; grid-template-columns: auto 1fr; gap: 20px; align-items: baseline; margin: 80px 0 32px; padding-top: 30px; border-top: 1px solid var(--line); scroll-margin-top: 72px; }
.pm-prose .section-marker .idx { font-family: var(--mono); font-size: 12px; letter-spacing: 0.22em; color: var(--signal); text-transform: uppercase; padding-top: 14px; font-weight: 700; }
.pm-prose .section-marker .title { font-family: var(--mono); font-weight: 200; font-size: clamp(26px, 3.2cqw, 40px); line-height: 1.08; letter-spacing: -0.04em; color: var(--paper); text-wrap: balance; }
.pm-prose .section-marker .title em { font-style: italic; font-weight: 800; color: var(--signal); }

.pm-prose h3, .pm-prose h4 { font-family: var(--mono); font-weight: 700; color: var(--paper); letter-spacing: -0.01em; line-height: 1.3; margin: 40px 0 14px; }
.pm-prose h3 { font-size: 20px; }
.pm-prose h4 { font-size: 17px; }
.pm-prose h3 em, .pm-prose h4 em { font-style: italic; font-weight: 800; color: var(--signal); }

.pm-prose .pullquote { margin: 64px 0; padding: 44px 0; border-top: 1px solid rgba(200,255,61,0.3); border-bottom: 1px solid rgba(200,255,61,0.3); text-align: center; font-family: var(--mono); font-weight: 700; font-style: italic; font-size: clamp(24px, 3.2cqw, 40px); line-height: 1.2; letter-spacing: -0.03em; color: var(--signal); text-wrap: balance; position: relative; }
.pm-prose .pullquote::before, .pm-prose .pullquote::after { content: ""; position: absolute; left: 50%; width: 60px; height: 1px; background: var(--signal); transform: translateX(-50%); box-shadow: 0 0 10px rgba(200,255,61,0.5); }
.pm-prose .pullquote::before { top: -1px; }
.pm-prose .pullquote::after { bottom: -1px; }
.pm-prose .pullquote .marks { display: block; font-family: var(--mono); color: var(--signal); opacity: 0.4; font-size: 0.6em; margin-bottom: 8px; letter-spacing: 0; }

.pm-prose blockquote:not(.pullquote) { border-left: 2px solid var(--signal); padding: 6px 0 6px 24px; margin: 30px 0; font-family: var(--mono); font-weight: 400; font-style: italic; font-size: clamp(16px, 1.7cqw, 19px); line-height: 1.6; color: var(--paper); letter-spacing: 0.005em; text-wrap: pretty; }
.pm-prose blockquote em { color: var(--signal); }

.pm-prose ol, .pm-prose ul { margin: 0 0 30px 0; padding: 0; list-style: none; font-family: var(--mono); font-size: 16px; }
.pm-prose ol { counter-reset: pm-ol-counter; }
.pm-prose ol li { counter-increment: pm-ol-counter; padding: 16px 0 16px 60px; border-top: 1px solid var(--line); position: relative; line-height: 1.65; color: var(--prose); }
.pm-prose ol li::before { content: counter(pm-ol-counter, decimal-leading-zero); position: absolute; left: 0; top: 18px; font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; color: var(--signal); }
.pm-prose ol li:last-child { border-bottom: 1px solid var(--line); }
.pm-prose ol li strong { color: var(--paper); }
.pm-prose ul li { padding: 8px 0 8px 24px; line-height: 1.65; color: var(--prose); position: relative; }
.pm-prose ul li::before { content: "▸"; position: absolute; left: 0; top: 8px; color: var(--signal); font-family: var(--mono); font-size: 0.85em; }
.pm-prose ul li strong { color: var(--paper); }

.pm-prose a { color: var(--signal); text-decoration: none; border-bottom: 1px solid rgba(200,255,61,0.4); transition: border-color 200ms; }
.pm-prose a:hover { border-bottom-color: var(--signal); }

.pm-prose hr { border: 0; border-top: 1px solid var(--line); margin: 44px auto; width: 60%; }
.pm-prose code { font-family: var(--mono); font-size: 0.92em; background: var(--ink-2); padding: 2px 6px; color: var(--paper); }
.pm-prose pre { font-family: var(--mono); font-size: 13px; line-height: 1.55; background: var(--ink-2); border: 1px solid var(--line); padding: 16px 20px; overflow-x: auto; color: var(--paper); margin: 0 0 26px; }
.pm-prose pre code { background: transparent; padding: 0; font-size: 13px; }

.pm-prose table { width: 100%; border-collapse: collapse; margin: 26px 0; font-family: var(--mono); font-size: 13px; }
.pm-prose th, .pm-prose td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--line); }
.pm-prose th { color: var(--signal); letter-spacing: 0.12em; text-transform: uppercase; font-size: 11px; }
.pm-prose td { color: var(--prose); }

.pm-prose-status { font-family: var(--mono); font-weight: 400; font-size: 16px; line-height: 1.6; color: var(--paper-mute); font-style: italic; }
.pm-prose-status a { color: var(--signal); text-decoration: none; border-bottom: 1px solid rgba(200,255,61,0.4); }

.pm-rail-right { position: sticky; top: 72px; align-self: start; max-height: calc(100vh - 120px); overflow: hidden; display: flex; flex-direction: column; gap: 20px; font-family: var(--mono); font-size: 11px; }
.pm-rail-card { border: 1px solid var(--line-strong); background: rgba(10,11,15,0.4); backdrop-filter: blur(4px); padding: 16px; }
.pm-rc-hd { display: flex; justify-content: space-between; color: var(--paper); font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; padding-bottom: 10px; margin-bottom: 12px; border-bottom: 1px solid var(--line); }
.pm-toc a { display: block; padding: 6px 0; color: var(--paper-mute); text-decoration: none; font-size: 10px; letter-spacing: 0.08em; transition: color 160ms; line-height: 1.4; }
.pm-toc a:hover { color: var(--paper); }
.pm-toc a .n { color: var(--signal); margin-right: 10px; }
.pm-toc a.active { color: var(--signal); }
.pm-toc a.active .n { color: var(--paper); }

.pm-transmission-footer { border-top: 1px solid var(--line-strong); padding: 64px 0 80px; display: flex; flex-direction: column; gap: 48px; }
.pm-eot-bar { text-align: center; font-family: var(--mono); font-size: 12px; letter-spacing: 0.4em; text-transform: uppercase; color: var(--signal); padding: 32px 0; border-top: 1px solid rgba(200,255,61,0.3); border-bottom: 1px solid rgba(200,255,61,0.3); }
.pm-cursor-blink { display: inline-block; width: 10px; height: 14px; background: var(--signal); vertical-align: middle; margin-left: 8px; animation: pm_disp_blink 1s step-end infinite; }

.pm-nav-dispatches { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
.pm-nav-dispatch { display: flex; flex-direction: column; gap: 8px; padding: 24px; border: 1px solid var(--line-strong); background: rgba(10,11,15,0.4); text-decoration: none; color: inherit; transition: border-color 200ms, background 200ms; }
.pm-nav-dispatch:hover:not(.disabled) { border-color: var(--signal); background: rgba(200,255,61,0.05); }
.pm-nav-dispatch.disabled { opacity: 0.45; cursor: not-allowed; }
.pm-nav-dispatch.next { text-align: right; }
.pm-nav-dispatch .dir { font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; color: var(--signal); text-transform: uppercase; }
.pm-nav-dispatch .num { font-family: var(--mono); font-size: 12px; letter-spacing: 0.18em; color: var(--paper-mute); }
.pm-nav-dispatch .title { font-family: var(--mono); font-weight: 200; font-size: 22px; line-height: 1.15; letter-spacing: -0.03em; color: var(--paper); }
.pm-nav-dispatch .title em { font-style: italic; font-weight: 800; color: var(--signal); }

.pm-footer-meta { padding: 24px 0 0; border-top: 1px solid var(--line); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px; font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--paper-mute); }
.pm-footer-meta a { color: var(--signal); text-decoration: none; }
.pm-footer-meta a:hover { color: var(--paper); }

@container (max-width: 1200px) {
    .pm-body-wrap { grid-template-columns: 1fr 220px; gap: 48px; }
}
@container (max-width: 1000px) {
    .pm-body-wrap { grid-template-columns: 1fr; gap: 0; padding-bottom: 80px; }
    .pm-rail-right { position: static; max-height: none; margin-top: 64px; padding-top: 32px; border-top: 1px solid var(--line); overflow: visible; }
    .pm-nav-dispatches { grid-template-columns: 1fr; }
}
@container (max-width: 600px) {
    .pm-masthead { flex-direction: column; align-items: flex-start; gap: 10px; padding: 72px 0 16px; }
    .pm-field-meta { padding: 20px 0; grid-template-columns: 64px 1fr; row-gap: 10px; column-gap: 14px; font-size: 11px; }
    .pm-field-meta dt { font-size: 9px; }
    .pm-title-block { padding: 56px 0 44px; }
    .pm-eyebrow-pulse { margin-bottom: 28px; font-size: 10px; }
    .pm-essay-title { font-size: clamp(36px, 11cqw, 60px); margin-bottom: 24px; }
    .pm-essay-dek { font-size: 15px; }
    .pm-prose { font-size: 15px; line-height: 1.76; }
    .pm-prose .section-marker { margin: 56px 0 28px; padding-top: 24px; grid-template-columns: 1fr; gap: 8px; }
    .pm-prose .section-marker .idx { padding-top: 0; }
    .pm-prose .section-marker .title { font-size: 26px; }
    .pm-prose .pullquote { margin: 48px 0; padding: 36px 0; font-size: 24px; }
    .pm-prose ol li { padding-left: 44px; font-size: 15px; }
    .pm-prose ol li::before { font-size: 10px; }
    .pm-eot-bar { font-size: 10px; letter-spacing: 0.3em; padding: 20px 0; }
    .pm-nav-dispatch { padding: 18px; }
    .pm-nav-dispatch .title { font-size: 18px; }
    .pm-footer-meta { flex-direction: column; gap: 8px; font-size: 9px; }
}
`
