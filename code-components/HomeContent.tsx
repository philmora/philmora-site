// @ts-ignore
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// Terminal Aurora home page content (hero through footer).
// Direct port of Claude Design export for pixel accuracy.

const ASSETS = {
    cosmic: "https://files.catbox.moe/gq7b82.png",
    prismatic: "https://files.catbox.moe/c7jdor.png",
    spring: "https://files.catbox.moe/cne8z3.png",
    ocean: "https://files.catbox.moe/7vuop2.png",
    titan: "https://files.catbox.moe/4jiv75.png",
    portrait: "https://cdn.jsdelivr.net/gh/philmora/essays@main/images/phil-portrait.png",
}

const TIMELINE = [
    {
        year: "2024—NOW",
        co: "Machinify",
        role: "Sr. Director of Product · Agent-Native Infrastructure",
        body: "Unifying five acquired healthcare payments companies into one AI-native platform. Agents get assigned claims work, take action, flag problems, learn from outcomes.",
        metric: "$200B+ claims · 75+ plans · 160M lives",
        img: ASSETS.cosmic,
    },
    {
        year: "2021—2024",
        co: "League",
        role: "Head of Product · AI-Native Platform",
        body: "Pioneered server-driven UI and intelligent configuration. Called the AI shift before it was fashionable, built the architecture to survive it.",
        metric: "15+ plan deployments · +20% margin · 30% faster dev",
        img: ASSETS.prismatic,
    },
    {
        year: "2019—2021",
        co: "Nutrien",
        role: "Head of Product · Digital Retail",
        body: "Told the company to stop shipping features and build the platform. Was right inside six months. Then a pandemic arrived and we quadrupled through it.",
        metric: "$200M → $1.7B · 24 months · during a pandemic",
        img: ASSETS.spring,
    },
    {
        year: "2017—2019",
        co: "Sikka",
        role: "VP Product · Analytics → Platform",
        body: "Turned an analytics company into an AI-powered healthcare SaaS platform. First place the infrastructure thesis really clicked.",
        metric: "analytics → platform in 18 months",
        img: ASSETS.ocean,
    },
    {
        year: "2005—2017",
        co: "The Engineering Years",
        role: "Nvidia · Semiconductors · Databases · Enterprise Systems",
        body: "Twelve years writing code. Semiconductors, distributed databases, enterprise systems. The foundation every product decision since has stood on.",
        metric: "12 yrs · 4 companies · the baseline",
        img: ASSETS.titan,
    },
]

const POSITIONS = [
    { n: "01", claim: 'AI agents are <em>teammates</em>, not tools.', elab: "The organizations that figure out human-agent collaboration first won't just have an advantage — they'll have a compounding one. Most organizations are not remotely ready. Most of their tooling isn't either." },
    { n: "02", claim: 'The wall between "technical" and "business" is a <em>liability</em>.', elab: "Twelve years writing code before a decade in product. That combination used to be a bonus. It's now the baseline." },
    { n: "03", claim: 'The cost of building dropped to <em>near zero</em>.', elab: "Which means the cost of building the wrong thing is the only cost that matters. That changes what product people are for. Most job descriptions haven't caught up." },
    { n: "04", claim: 'Depth is being <em>commoditized</em> by AI.', elab: "Unusual combinations of knowledge — engineering + product + healthcare + AI — are the new moat. Specialists with one depth are the ones I'm worried about." },
    { n: "05", claim: 'The best platforms are <em>invisible</em>.', elab: "They make everything else possible without calling attention to themselves. If your platform has a brand, it's probably not a platform yet." },
    { n: "06", claim: 'Shipping matters more than <em>talking about</em> shipping.', elab: 'Prototypes replace slide decks. "Let me show you" beats "let me explain to you." A working thing ends the meeting.' },
    { n: "07", claim: 'The PM role is splitting into <em>two futures</em>.', elab: "People who still think the job is writing documents are being automated away. People who become builder-orchestrators are doing work that didn't exist two years ago. Pick which one you're becoming." },
]

const VOICES = [
    { org: "▲ LEAGUE", years: "2021—24", quote: '"Phil possesses a remarkable foresight — particularly evident in his early and accurate conviction regarding the transformative potential of AI."', hidden: "He called the AI shift before most of us could spell agent. We built the platform around that thesis and it was right.", name: "Brad Swerdfeger", role: "Product Manager · League" },
    { org: "▲ LEAGUE", years: "2021—24", quote: '"Deep technical understanding with sharp product instincts. Rare. Critical as we pushed the boundaries of what an AI-native healthcare platform can deliver."', hidden: "Phil is the PM who can read the PR and redline the architecture in the same sitting. It changes the pace of everything.", name: "Vincent Renais", role: "Sr. Engineering Manager · League" },
    { org: "▲ NUTRIEN", years: "2019—21", quote: '"Phil immediately saw the opportunity to propel our company to a position of digital leadership by building an <em>extensible platform</em> — rather than endlessly rolling out one feature after another."', hidden: 'He walked in, said "stop shipping features, build the platform," and was right inside six months.', name: "Sol Goldfarb", role: "Chief Digital Officer · Nutrien" },
    { org: "▲ NUTRIEN / ENGINEERING", years: "2019—21", quote: '"With his leadership, we quadrupled the revenue we bring in through our portal. Phil is a world-class Product Director."', hidden: "", name: "Jerry McCollom", role: "Sr. Software Architect · Nutrien" },
]

const ESSAYS = [
    { slug: "the-pm-is-dead", idx: "008 · APR 2026", mins: "14 MIN", title: "The PM Is Dead. <em>Long Live the Builder.</em>", dek: "Something broke in the last six months. Not broke in a bad way — broke like a dam breaks. Everything that was building up behind it is now rushing through." },
    { slug: "agents-as-teammates", idx: "007 · MAR 2026", mins: "11 MIN", title: "Agents as <em>Teammates</em>, Not Tools.", dek: "On assigning work to something that doesn't have a Slack avatar, doesn't go home, and still manages to surprise you." },
    { slug: "code-wizards-to-cosmic-architects", idx: "006 · MAR 2026", mins: "10 MIN", title: "From Code Wizards to <em>Cosmic Architects</em>.", dek: "Navigating the AI apocalypse in tech. The senior developer's journey through grief — and out the other side as something new." },
    { slug: "the-invisible-platform", idx: "005 · FEB 2026", mins: "09 MIN", title: "The Invisible <em>Platform</em>.", dek: "Five companies, 160 million lives, and one architecture that has to disappear into the floorboards before anyone trusts it." },
    { slug: "the-expertise-inversion", idx: "004 · FEB 2026", mins: "09 MIN", title: "The Expertise <em>Inversion</em>.", dek: "The knowledge that made you valuable is becoming the knowledge AI does best. The game inverted while you were playing it." },
    { slug: "the-combination-premium", idx: "003 · FEB 2026", mins: "10 MIN", title: "The Combination <em>Premium</em>.", dek: "If depth alone isn't the moat anymore, what is? The answer is surprisingly mathematical: combinations." },
    { slug: "the-five-breaks", idx: "002 · JAN 2026", mins: "09 MIN", title: "The Five <em>Breaks</em>.", dek: "Something is happening to the structure of work that's bigger than any single trend. AI is just the most visible part of a deeper shift." },
    { slug: "prototypes-vs-specs", idx: "001 · JAN 2026", mins: "07 MIN", title: "Prototypes > <em>Specs</em>.", dek: "The working thing ends the meeting. A short argument for showing before telling, in a field that is addicted to telling." },
]

const BUILDER = [
    {
        name: "mora-slop",
        tagline: "PM automation factory",
        status: "RUNNING · 12 SKILLS · WEEKLY",
        body: "Claude Code skills, prompts, and schemas built for product work at $200B+ scale. Battle-tested on healthcare claims. Open source. Machine-readable first, human-readable second.",
        link: "https://github.com/vlognow/mora-slop",
        linkLabel: "github.com/vlognow/mora-slop",
    },
    {
        name: "philmora-site",
        tagline: "The site you're reading",
        status: "LIVE · OPEN SOURCE",
        body: "Designed by Claude Design. Implemented by Claude Code via Framer MCP. Every component is a React code file I committed. Not a template. Not a theme. Prompt to production.",
        link: "https://github.com/philmora/philmora-site",
        linkLabel: "github.com/philmora/philmora-site",
    },
    {
        name: "claude-memory",
        tagline: "Persistent memory for agent sessions",
        status: "V1 · ARCHIVED · V2 IN PROGRESS",
        body: "Single-file Python CLI. SQLite FTS5 + optional Claude semantic re-ranking. Zero dependencies. First-generation memory layer — v2 (generalized second-brain) in progress.",
        link: "https://github.com/philmora/claude-memory",
        linkLabel: "github.com/philmora/claude-memory",
    },
    {
        name: "Butchsonic",
        tagline: "Creative AI lab",
        status: "LIVE · SUNO · YOUTUBE · DISCORD",
        body: "Music + visual art + video, end-to-end agent-generated. Separate brand, separate community. Evidence of what's possible when agents do the creative work.",
        link: "https://butchsonic.com",
        linkLabel: "butchsonic.com",
    },
]

const BUILDLOG_URL =
    "https://raw.githubusercontent.com/philmora/essays/main/buildlog.json"

const LOG_FALLBACK = [
    { time: "16:30", project: "philmora-site", note: "builder §05 + live build log shipped" },
    { time: "14:20", project: "philmora/essays", note: "8 dispatches published" },
    { time: "11:02", project: "philmora-site", note: "essay pages rebuilt in Dispatch design" },
    { time: "08:42", project: "vlognow/mora-slop", note: "12 skills running weekly" },
]

const STATS = [
    { n: 200, u: "B+ / yr", l: "annual claims processed" },
    { n: 160, u: "M", l: "covered lives" },
    { n: 75, u: "+", l: "health plans" },
    { n: 5, u: "→ 1", l: "companies, one platform" },
    { n: 500, u: "K / yr", l: "vendor spend replaced w/ internal AI" },
]

export default function HomeContent() {
    const timelineWrapRef = useRef<HTMLDivElement>(null)
    const timelineTrackRef = useRef<HTMLDivElement>(null)
    const railProgressRef = useRef<HTMLDivElement>(null)
    const tlYearRef = useRef<HTMLSpanElement>(null)
    const txDateRef = useRef<HTMLSpanElement>(null)
    const runtimeRef = useRef<HTMLSpanElement>(null)
    const mtClockRef = useRef<HTMLSpanElement>(null)
    const wkRef = useRef<HTMLSpanElement>(null)
    const statRefs = useRef<(HTMLDivElement | null)[]>([])
    const voicesTrackRef = useRef<HTMLDivElement>(null)
    const voicesRailRef = useRef<HTMLDivElement>(null)

    const [openPos, setOpenPos] = useState<Record<number, boolean>>({})
    const [openVoice, setOpenVoice] = useState<Record<number, boolean>>({})
    const [logEntries, setLogEntries] =
        useState<{ time: string; project: string; note: string }[]>(LOG_FALLBACK)

    // Fetch live build log
    useEffect(() => {
        if (typeof window === "undefined") return
        let cancelled = false
        ;(async () => {
            try {
                const r = await fetch(BUILDLOG_URL, { cache: "no-store" })
                if (!r.ok) return
                const data = await r.json()
                const items = Array.isArray(data?.entries)
                    ? data.entries.slice(0, 6)
                    : null
                if (!cancelled && items && items.length > 0) setLogEntries(items)
            } catch {
                // Keep fallback entries on error
            }
        })()
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return

        // TX date
        if (txDateRef.current) {
            const d = new Date()
            const opts: Intl.DateTimeFormatOptions = {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }
            txDateRef.current.textContent = `${d
                .toLocaleDateString("en-US", opts)
                .toUpperCase()} · 05,000 FT`
        }

        // Current week (Mon–Sun). Recomputed each tick so the page handles
        // a Sunday-night → Monday-morning rollover if the tab stays open.
        const fmtWk = () => {
            const now = new Date()
            const day = now.getDay() // 0=Sun, 1=Mon, ..., 6=Sat
            const mondayOffset = day === 0 ? -6 : 1 - day
            const monday = new Date(now)
            monday.setDate(now.getDate() + mondayOffset)
            const sunday = new Date(monday)
            sunday.setDate(monday.getDate() + 6)
            const monStr = monday
                .toLocaleDateString("en-US", { month: "short" })
                .toUpperCase()
            const sunStr = sunday
                .toLocaleDateString("en-US", { month: "short" })
                .toUpperCase()
            const year = sunday.getFullYear()
            if (monday.getMonth() === sunday.getMonth()) {
                return `${monStr} ${monday.getDate()}–${sunday.getDate()} · ${year}`
            }
            return `${monStr} ${monday.getDate()} – ${sunStr} ${sunday.getDate()} · ${year}`
        }

        const pageLoad = Date.now()
        const fmtMT = () => {
            const f = new Intl.DateTimeFormat("en-US", {
                timeZone: "America/Denver",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            })
            const parts = f.formatToParts(new Date())
            const hh = parts.find((p) => p.type === "hour")?.value ?? "--"
            const mm = parts.find((p) => p.type === "minute")?.value ?? "--"
            const ss = parts.find((p) => p.type === "second")?.value ?? "--"
            return `${hh}:${mm}:${ss} MT`
        }
        const tick = () => {
            if (mtClockRef.current)
                mtClockRef.current.textContent = fmtMT()
            if (wkRef.current) wkRef.current.textContent = fmtWk()
            if (runtimeRef.current) {
                const t = Math.floor((Date.now() - pageLoad) / 1000)
                const hh = String(Math.floor(t / 3600)).padStart(2, "0")
                const mm = String(Math.floor((t % 3600) / 60)).padStart(2, "0")
                const ss = String(t % 60).padStart(2, "0")
                runtimeRef.current.textContent = `${hh}:${mm}:${ss}`
            }
        }
        tick()
        const clockId = setInterval(tick, 1000)

        // Stat counters
        const obs = statRefs.current.map((el, i) => {
            if (!el) return null
            const target = STATS[i].n
            const cio = new IntersectionObserver(
                (entries) => {
                    entries.forEach((en) => {
                        if (!en.isIntersecting) return
                        cio.unobserve(en.target)
                        const dur = 1200
                        const start = performance.now()
                        const step = (t: number) => {
                            const p = Math.min(1, (t - start) / dur)
                            const eased = 1 - Math.pow(1 - p, 3)
                            if (el)
                                el.textContent = String(
                                    Math.floor(target * eased)
                                )
                            if (p < 1) requestAnimationFrame(step)
                            else if (el) el.textContent = String(target)
                        }
                        requestAnimationFrame(step)
                    })
                },
                { threshold: 0.4 }
            )
            cio.observe(el)
            return cio
        })

        // Horizontal timeline scroll (page-scroll-driven)
        // Disabled on narrow viewports — mobile gets a native horizontal swipe instead.
        const isMobile = () => window.innerWidth <= 720
        const onScroll = () => {
            const wrap = timelineWrapRef.current
            const track = timelineTrackRef.current
            if (!wrap || !track) return
            if (isMobile()) {
                track.style.transform = ""
                if (railProgressRef.current)
                    railProgressRef.current.style.width = "0%"
                return
            }
            const rect = wrap.getBoundingClientRect()
            const total = wrap.offsetHeight - window.innerHeight
            const progress = Math.max(
                0,
                Math.min(1, -rect.top / Math.max(1, total))
            )
            const maxShift = Math.max(
                0,
                track.scrollWidth - window.innerWidth + 160
            )
            const x = -progress * maxShift
            track.style.transform = `translate3d(${x}px, 0, 0)`
            if (railProgressRef.current)
                railProgressRef.current.style.width = `${progress * 100}%`
            if (tlYearRef.current) {
                const idx = Math.min(
                    TIMELINE.length - 1,
                    Math.floor(progress * TIMELINE.length)
                )
                tlYearRef.current.textContent = TIMELINE[idx].year
            }
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        onScroll()

        // Pattern timeline: horizontal wheel + drag → translates to page scroll
        const tlTrack = timelineTrackRef.current
        const tlWrap = timelineWrapRef.current
        const computeRatio = () => {
            if (!tlTrack || !tlWrap) return 1
            const totalY = Math.max(1, tlWrap.offsetHeight - window.innerHeight)
            const totalX = Math.max(
                1,
                tlTrack.scrollWidth - window.innerWidth + 160
            )
            return totalY / totalX
        }
        const onTimelineWheel = (e: WheelEvent) => {
            if (isMobile()) return
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault()
                window.scrollBy(0, e.deltaX * computeRatio())
            }
        }
        let tlDragging = false
        let tlLastX = 0
        const onTimelinePointerDown = (e: PointerEvent) => {
            if (isMobile()) return
            if (e.pointerType === "mouse" && e.button !== 0) return
            tlDragging = true
            tlLastX = e.clientX
            ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
            ;(e.currentTarget as HTMLElement).style.cursor = "grabbing"
        }
        const onTimelinePointerMove = (e: PointerEvent) => {
            if (!tlDragging) return
            const dx = e.clientX - tlLastX
            tlLastX = e.clientX
            window.scrollBy(0, -dx * computeRatio())
        }
        const onTimelinePointerUp = (e: PointerEvent) => {
            tlDragging = false
            ;(e.currentTarget as HTMLElement).style.cursor = "grab"
        }
        tlTrack?.addEventListener("wheel", onTimelineWheel, { passive: false })
        tlTrack?.addEventListener("pointerdown", onTimelinePointerDown)
        tlTrack?.addEventListener("pointermove", onTimelinePointerMove)
        tlTrack?.addEventListener("pointerup", onTimelinePointerUp)
        tlTrack?.addEventListener("pointercancel", onTimelinePointerUp)

        const vTrack = voicesTrackRef.current
        const onVoicesScroll = () => {
            if (!vTrack || !voicesRailRef.current) return
            const max = vTrack.scrollWidth - vTrack.clientWidth
            const p = max > 0 ? vTrack.scrollLeft / max : 0
            voicesRailRef.current.style.width = `${p * 100}%`
        }
        let vDragging = false
        let vLastX = 0
        let vStartScroll = 0
        const onVoicesPointerDown = (e: PointerEvent) => {
            if (e.pointerType === "mouse" && e.button !== 0) return
            if (!vTrack) return
            vDragging = true
            vLastX = e.clientX
            vStartScroll = vTrack.scrollLeft
            ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
            ;(e.currentTarget as HTMLElement).style.cursor = "grabbing"
        }
        const onVoicesPointerMove = (e: PointerEvent) => {
            if (!vDragging || !vTrack) return
            const dx = e.clientX - vLastX
            vTrack.scrollLeft -= dx
            vLastX = e.clientX
        }
        const onVoicesPointerUp = (e: PointerEvent) => {
            vDragging = false
            ;(e.currentTarget as HTMLElement).style.cursor = "grab"
        }
        vTrack?.addEventListener("scroll", onVoicesScroll, { passive: true })
        vTrack?.addEventListener("pointerdown", onVoicesPointerDown)
        vTrack?.addEventListener("pointermove", onVoicesPointerMove)
        vTrack?.addEventListener("pointerup", onVoicesPointerUp)
        vTrack?.addEventListener("pointercancel", onVoicesPointerUp)
        onVoicesScroll()

        return () => {
            clearInterval(clockId)
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
            obs.forEach((o) => o && o.disconnect())
            tlTrack?.removeEventListener("wheel", onTimelineWheel as any)
            tlTrack?.removeEventListener("pointerdown", onTimelinePointerDown as any)
            tlTrack?.removeEventListener("pointermove", onTimelinePointerMove as any)
            tlTrack?.removeEventListener("pointerup", onTimelinePointerUp as any)
            tlTrack?.removeEventListener("pointercancel", onTimelinePointerUp as any)
            vTrack?.removeEventListener("scroll", onVoicesScroll as any)
            vTrack?.removeEventListener("pointerdown", onVoicesPointerDown as any)
            vTrack?.removeEventListener("pointermove", onVoicesPointerMove as any)
            vTrack?.removeEventListener("pointerup", onVoicesPointerUp as any)
            vTrack?.removeEventListener("pointercancel", onVoicesPointerUp as any)
        }
    }, [])

    return (
        <>
            <style>{CSS}</style>
            <main className="page pm-root">
                <section id="hero" className="hero">
                    <aside className="hero-meta">
                        <div className="meta-block">
                            <div className="label">// TRANSMISSION</div>
                            <div className="value">
                                <span ref={txDateRef}>APR 19, 2026 · 05,000 FT</span>
                            </div>
                        </div>
                        <div className="meta-block">
                            <div className="label">// POSITION</div>
                            <div className="value">40.5853° N &nbsp; 105.0844° W</div>
                        </div>
                        <div className="meta-block">
                            <div className="label">// SIGNAL</div>
                            <div className="value">
                                <span className="sig-bar" />
                                <span className="sig-bar" />
                                <span className="sig-bar" />
                                <span className="sig-bar" />
                                <span className="sig-bar off" />
                            </div>
                        </div>
                    </aside>

                    <div className="hero-type">
                        <div className="eyebrow">
                            <span className="dot" />
                            PHIL MORA — THE BIG PICTURE, EDITION{" "}
                            {String(ESSAYS.length).padStart(2, "0")}
                        </div>

                        <h1 className="display hero-h1">
                            <span className="line">The title</span>
                            <span className="line">is the same.</span>
                            <span className="line">
                                The <em>job</em> is
                            </span>
                            <span className="line">unrecogniz&shy;able.</span>
                        </h1>

                        <div className="hero-foot">
                            <p className="body-lg">
                                Two years ago I managed products. Today I orchestrate
                                builds across humans <em>and</em> AI agents —
                                simultaneously. At Machinify, that means turning
                                five acquired healthcare companies into one platform.
                                $200B+ in claims. 160 million lives. A workflow where
                                agents draft, humans judge, agents iterate, and
                                humans ship.
                            </p>
                            <div className="hero-ctas">
                                <a href="#thoughts" className="btn primary" data-cursor="link">
                                    READ THE BIG PICTURE <span className="arrow">→</span>
                                </a>
                                <a href="#contact" className="btn" data-cursor="link">
                                    START A CONVERSATION <span className="arrow">↗</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="hero-portrait">
                        <div
                            className="portrait-frame"
                            style={{
                                backgroundImage: `url('${ASSETS.portrait}')`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="portrait-scan" />
                        </div>
                        <div className="portrait-caption mono-sm">
                            <span>FIG. 001</span>
                            <span>PHIL MORA / BUILDER-OPERATOR</span>
                            <span>RENDER · 26Q2</span>
                        </div>
                    </div>

                    <div className="runtime">
                        <div className="rt-cell">
                            <span className="rt-k">RUNTIME</span>
                            <span className="rt-v" ref={runtimeRef}>00:00:00</span>
                        </div>
                        <div className="rt-cell">
                            <span className="rt-k">WK</span>
                            <span className="rt-v" ref={wkRef}>APR 27–MAY 3 · 2026</span>
                        </div>
                        <div className="rt-cell">
                            <span className="rt-k">BUILD</span>
                            <span className="rt-v">
                                <span className="rt-live" />
                                &nbsp;AGENT-NATIVE CLAIMS &nbsp;/&nbsp; MACHINIFY
                            </span>
                        </div>
                        <div className="rt-cell">
                            <span className="rt-k">SCROLL</span>
                            <span className="rt-v">↓ KEEP GOING</span>
                        </div>
                    </div>
                </section>

                <div className="rule" />

                <section id="now" className="now">
                    <header className="sec-head">
                        <div className="sec-idx">§01</div>
                        <div className="sec-title">
                            <div className="eyebrow">
                                <span className="dot" />
                                CURRENTLY / Q2 2026
                            </div>
                            <h2 className="display">
                                <span className="line">
                                    What's on the<br /><em>workbench.</em>
                                </span>
                            </h2>
                        </div>
                    </header>

                    <div className="now-grid">
                        <div className="now-main">
                            <p className="body-lg">
                                At Machinify — unifying{" "}
                                <em>five acquired healthcare payments companies</em>{" "}
                                into one AI-native platform. The work is designing
                                systems where AI agents are first-class participants.
                                Not prompted tools. Not hypothetical teammates.
                                Agents that get assigned work, take action, flag
                                problems, and learn from outcomes.
                            </p>
                            <p className="body-lg">
                                It's the most complex thing I've ever built. Also the most fun.
                            </p>
                            <p className="body-lg">
                                Thinking about: what happens to organizations when
                                the PM-to-engineer ratio inverts. Writing about it at{" "}
                                <em>The Big Picture</em>. Building with it every weekday.
                            </p>
                        </div>

                        <aside className="now-stats">
                            {STATS.map((s, i) => (
                                <div className="stat" key={i}>
                                    <div
                                        className="stat-n"
                                        ref={(el) => {
                                            statRefs.current[i] = el
                                        }}
                                    >
                                        {s.n}
                                    </div>
                                    <div className="stat-u">{s.u}</div>
                                    <div className="stat-l">{s.l}</div>
                                </div>
                            ))}
                        </aside>

                        <aside className="now-log">
                            <div className="log-head">
                                <span className="eyebrow">// BUILD LOG</span>
                                <span className="log-live">
                                    <span className="rt-live" />
                                    LIVE
                                </span>
                            </div>
                            <ul className="log-lines">
                                {logEntries.map((entry, i) => (
                                    <li key={i}>
                                        <span className="t">{entry.time}</span>
                                        <span className="c">{entry.project}</span>{" "}
                                        — {entry.note}
                                    </li>
                                ))}
                            </ul>
                        </aside>
                    </div>
                </section>

                <div className="rule" />

                <section id="pattern" className="pattern">
                    <header className="sec-head">
                        <div className="sec-idx">§02</div>
                        <div className="sec-title">
                            <div className="eyebrow">
                                <span className="dot" />
                                THE PATTERN / 2005 — NOW
                            </div>
                            <h2 className="display">
                                <span className="line">Same job.</span>
                                <span className="line">
                                    <em>Different clothes.</em>
                                </span>
                            </h2>
                        </div>
                    </header>

                    <p className="body-lg pattern-lead">
                        I keep getting hired to do the same thing in different
                        industries. Find the mess. See the system hiding inside it.
                        Build the infrastructure layer that makes everything else
                        possible. The technology changes. The pattern doesn't.
                    </p>

                    <div className="timeline-wrap" ref={timelineWrapRef}>
                        <div className="timeline-sticky">
                            <div className="timeline-head">
                                <span className="mono-sm">// DRAG ↔ OR SCROLL</span>
                                <span className="mono-sm" ref={tlYearRef}>2026</span>
                            </div>
                            <div className="timeline-track" ref={timelineTrackRef}>
                                {TIMELINE.map((d, i) => (
                                    <article className="tl-card" data-cursor="link" key={i}>
                                        <div
                                            className="bg-img"
                                            style={{ backgroundImage: `url('${d.img}')` }}
                                        />
                                        <div className="tl-year">{d.year}</div>
                                        <h3 className="tl-co">{d.co}</h3>
                                        <div className="tl-role">{d.role}</div>
                                        <p className="tl-body">{d.body}</p>
                                        <div className="tl-metric">▸ {d.metric}</div>
                                    </article>
                                ))}
                            </div>
                            <div className="timeline-rail">
                                <div className="rail-line" />
                                <div className="rail-progress" ref={railProgressRef} />
                                <div className="rail-ticks">
                                    {TIMELINE.map((_, i) => (
                                        <div className="tick" key={i} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="rule" />

                <section id="believe" className="believe">
                    <header className="sec-head">
                        <div className="sec-idx">§03</div>
                        <div className="sec-title">
                            <div className="eyebrow">
                                <span className="dot" />
                                POSITIONS / NOT VALUES
                            </div>
                            <h2 className="display">
                                <span className="line">Seven things</span>
                                <span className="line">
                                    I will <em>argue</em>
                                </span>
                                <span className="line">about.</span>
                            </h2>
                        </div>
                    </header>

                    <ol className="positions">
                        {POSITIONS.map((p, i) => (
                            <li
                                className={`pos ${openPos[i] ? "open" : ""}`}
                                key={i}
                                onClick={() =>
                                    setOpenPos((s) => ({ ...s, [i]: !s[i] }))
                                }
                            >
                                <div className="pos-n">{p.n}</div>
                                <div className="pos-body">
                                    <h3
                                        className="pos-claim"
                                        dangerouslySetInnerHTML={{ __html: p.claim }}
                                    />
                                    <p className="pos-elab">{p.elab}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <div className="rule" />

                <section id="voices" className="voices">
                    <header className="sec-head">
                        <div className="sec-idx">§04</div>
                        <div className="sec-title">
                            <div className="eyebrow">
                                <span className="dot" />
                                FIELD NOTES FROM PEOPLE WHO SHIPPED WITH ME
                            </div>
                            <h2 className="display">
                                <span className="line">What they</span>
                                <span className="line">
                                    <em>actually</em> said.
                                </span>
                            </h2>
                        </div>
                    </header>

                    <div className="voices-carousel">
                        <div className="voices-head">
                            <span className="mono-sm">// DRAG ↔ OR SCROLL</span>
                            <span className="mono-sm">{VOICES.length} VOICES</span>
                        </div>
                        <div className="voices-track" ref={voicesTrackRef}>
                            {VOICES.map((v, i) => (
                                <figure
                                    className={`voice ${openVoice[i] ? "open" : ""}`}
                                    data-cursor="link"
                                    key={i}
                                    onClick={() =>
                                        setOpenVoice((s) => ({ ...s, [i]: !s[i] }))
                                    }
                                >
                                    <div className="voice-top mono-sm">
                                        <span>{v.org}</span>
                                        <span>{v.years}</span>
                                    </div>
                                    <blockquote
                                        className="voice-quote"
                                        dangerouslySetInnerHTML={{ __html: v.quote }}
                                    />
                                    {v.hidden ? (
                                        <div className="voice-hidden">
                                            <p className="mono-sm">{v.hidden}</p>
                                        </div>
                                    ) : null}
                                    <figcaption className="voice-who">
                                        <span className="who-name">{v.name}</span>
                                        <span className="who-role">{v.role}</span>
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                        <div className="voices-rail">
                            <div className="rail-line" />
                            <div className="rail-progress" ref={voicesRailRef} />
                            <div className="rail-ticks">
                                {VOICES.map((_, i) => (
                                    <div className="tick" key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="rule" />

                <section id="builder" className="builder">
                    <header className="sec-head">
                        <div className="sec-idx">§05</div>
                        <div className="sec-title">
                            <div className="eyebrow">
                                <span className="dot" />
                                STACK / RUNNING SYSTEMS
                            </div>
                            <h2 className="display">
                                <span className="line">Not theory.</span>
                                <span className="line">
                                    <em>Receipts.</em>
                                </span>
                            </h2>
                        </div>
                    </header>

                    <div className="builder-grid">
                        {BUILDER.map((b, i) => (
                            <a
                                key={i}
                                className="builder-card"
                                href={b.link}
                                target="_blank"
                                rel="noopener"
                                data-cursor="link"
                            >
                                <div className="bc-head">
                                    <span className="bc-name">{b.name}</span>
                                    <span className="bc-status mono-sm">
                                        {b.status}
                                    </span>
                                </div>
                                <div className="bc-tagline">{b.tagline}</div>
                                <p className="bc-body">{b.body}</p>
                                <div className="bc-link mono-sm">
                                    {b.linkLabel} <span className="arrow">↗</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                <div className="rule" />

                <section id="thoughts" className="thoughts">
                    <header className="sec-head">
                        <div className="sec-idx">§06</div>
                        <div className="sec-title">
                            <div className="eyebrow">
                                <span className="dot" />
                                THE BIG PICTURE / ESSAY INDEX
                            </div>
                            <h2 className="display">
                                <span className="line">Notes from the</span>
                                <span className="line">
                                    <em>collision</em>
                                </span>
                                <span className="line">in progress.</span>
                            </h2>
                        </div>
                    </header>

                    <ul className="essays">
                        {ESSAYS.map((e, i) => {
                            const href = `/essays/${e.slug}`
                            return (
                                <li key={i}>
                                    <a
                                        className="essay"
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
                                        <div className="essay-meta mono-sm">
                                            <span>{e.idx}</span>
                                            <span>{e.mins}</span>
                                        </div>
                                        <div>
                                            <h3
                                                className="essay-title"
                                                dangerouslySetInnerHTML={{ __html: e.title }}
                                            />
                                            <p className="essay-dek">{e.dek}</p>
                                        </div>
                                        <div className="essay-go mono-sm">
                                            READ <span className="arrow">→</span>
                                        </div>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </section>

                <div className="rule" />

                <section id="contact" className="contact">
                    <div className="contact-grid">
                        <div className="contact-pitch">
                            <div className="eyebrow">
                                <span className="dot" />
                                SAY HELLO / NOT A FORM
                            </div>
                            <h2 className="display">
                                <span className="line">If you're</span>
                                <span className="line">
                                    <em>building</em> too —
                                </span>
                            </h2>
                            <p className="body-lg">
                                I'm always up for a conversation with other
                                operators in the collapse. Advisory calls. Quiet
                                peer reviews of agent-native architectures. The
                                occasional "is this crazy or is it the future"
                                dinner.
                            </p>
                            <div className="contact-ctas">
                                <a
                                    className="btn primary"
                                    href="https://github.com/philmora"
                                    target="_blank"
                                    rel="noopener"
                                    data-cursor="link"
                                >
                                    GITHUB <span className="arrow">↗</span>
                                </a>
                                <a
                                    className="btn"
                                    href="mailto:hi@philmora.com"
                                    data-cursor="link"
                                >
                                    HI@PHILMORA.COM <span className="arrow">↗</span>
                                </a>
                            </div>
                        </div>

                        <div className="contact-card">
                            <div className="card-head mono-sm">
                                <span>// OPERATIONAL STATUS</span>
                                <span className="pulse-text">
                                    <span className="rt-live" />
                                    ONLINE
                                </span>
                            </div>
                            <dl className="card-defs">
                                <div><dt>ROLE</dt><dd>Sr. Director of Product, Machinify</dd></div>
                                <div><dt>BASE</dt><dd>Fort Collins, CO · 5,000 ft</dd></div>
                                <div><dt>ROOTS</dt><dd>SFO / PHL / FoCo / RNS</dd></div>
                                <div><dt>LANGUAGES</dt><dd>EN · FR · TS · PY</dd></div>
                                <div><dt>EDU</dt><dd>Stanford CS (w/ ESIEE Paris) · Santa Clara MBA</dd></div>
                                <div><dt>TEAMMATE</dt><dd>Marshall Tucker, dog</dd></div>
                                <div><dt>SIDE</dt><dd>Butchsonic — AI music & art</dd></div>
                                <div><dt>LOCAL</dt><dd><span ref={mtClockRef}>—</span></dd></div>
                            </dl>
                        </div>
                    </div>
                </section>

                <footer className="foot">
                    <div className="foot-row">
                        <span className="foot-mark">
                            <span className="sigil" />
                            PHIL MORA / 2026
                        </span>
                        <span className="foot-mid mono-sm">
                            © 2026. No humans were harmed in the making of this
                            experience. Several AIs were caffeinated. Made at
                            5,000ft in Northern Colorado.
                        </span>
                        <span className="foot-sys mono-sm">
                            <a href="https://github.com/philmora" target="_blank" rel="noopener" data-cursor="link">GITHUB</a>
                            {" · "}
                            <a href="https://raw.githubusercontent.com/philmora/essays/main/feed.xml" target="_blank" rel="noopener" data-cursor="link">RSS</a>
                            {" · "}
                            <a href="https://www.linkedin.com/in/philippemora/" target="_blank" rel="noopener" data-cursor="link">LINKEDIN</a>
                        </span>
                    </div>
                </footer>
            </main>
        </>
    )
}

addPropertyControls(HomeContent, {})

const CSS = `
@import url(https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,100..900,0..100;1,9..144,100..900,0..100&family=JetBrains+Mono:ital,wght@0,400..800;1,400..800&display=swap);

.pm-root {
    --ink: #0A0B0F; --ink-2: #12141B; --ink-3: #1A1D26;
    --paper: #EDE6D7; --paper-dim: #BDB6A8; --paper-mute: #7A7568;
    --slate: #3A3E48; --slate-dim: #262932;
    --signal: #E26B38; --signal-dim: #9A4A28;
    --signal-glow: rgba(226, 107, 56, 0.25); --ok: #4FBA87;
    --serif: "Fraunces", "Times New Roman", serif;
    --mono: "JetBrains Mono", ui-monospace, monospace;
    --edge: 1px solid rgba(237, 230, 215, 0.08);
    --edge-strong: 1px solid rgba(237, 230, 215, 0.18);
    --page-max: 1440px; --gutter: clamp(24px, 4vw, 72px);
    position: relative; z-index: 3; max-width: var(--page-max);
    margin: 0 auto; padding: 0 var(--gutter);
    color: var(--paper); font-family: var(--mono);
    -webkit-font-smoothing: antialiased;
}
.pm-root *, .pm-root *::before, .pm-root *::after { box-sizing: border-box; }
.pm-root h1, .pm-root h2, .pm-root h3, .pm-root p, .pm-root ol, .pm-root ul, .pm-root dl, .pm-root dd, .pm-root dt, .pm-root figure, .pm-root blockquote, .pm-root li { margin: 0; padding: 0; }
.pm-root ol, .pm-root ul { list-style: none; }
.pm-root a { color: inherit; text-decoration: none; }

@keyframes pm_pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.75); } }

.pm-root .display { font-family: var(--serif); font-weight: 300; letter-spacing: -0.03em; line-height: 0.92; font-size: clamp(56px, 11vw, 180px); font-variation-settings: "opsz" 144, "SOFT" 50; }
.pm-root .display em { font-style: italic; font-weight: 900; color: var(--signal); }
.pm-root .display b { font-weight: 900; font-style: normal; }

.pm-root .eyebrow { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--paper-mute); font-weight: 500; }
.pm-root .eyebrow .dot { display: inline-block; width: 6px; height: 6px; background: var(--signal); border-radius: 50%; margin-right: 10px; vertical-align: 2px; box-shadow: 0 0 12px var(--signal-glow); animation: pm_pulse 1.8s ease-in-out infinite; }

.pm-root .body-lg { font-family: var(--serif); font-weight: 300; font-size: clamp(20px, 2vw, 28px); line-height: 1.4; letter-spacing: -0.01em; color: var(--paper-dim); text-wrap: pretty; }
.pm-root .body-lg em { color: var(--paper); font-style: italic; font-weight: 400; }
.pm-root .mono-sm { font-family: var(--mono); font-size: 12px; line-height: 1.6; letter-spacing: 0.02em; color: var(--paper-mute); }

.pm-root .btn { display: inline-flex; align-items: center; gap: 12px; padding: 14px 22px; font-family: var(--mono); font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--paper); border: 1px solid rgba(237,230,215,0.2); background: transparent; cursor: none; transition: border-color 200ms, background 200ms, color 200ms; }
.pm-root .btn:hover { border-color: var(--signal); color: var(--signal); }
.pm-root .btn.primary { background: var(--signal); color: var(--ink); border-color: var(--signal); }
.pm-root .btn.primary:hover { background: transparent; color: var(--signal); }
.pm-root .btn .arrow { transition: transform 200ms; }
.pm-root .btn:hover .arrow { transform: translateX(4px); }

.pm-root .rule { border-top: var(--edge); width: 100%; margin: 40px 0 0; }

.pm-root .hero { min-height: 100vh; padding-top: 110px; padding-bottom: 80px; display: grid; grid-template-columns: 88px 1fr 340px; grid-template-rows: 1fr auto; grid-template-areas: "meta type portrait" "run run run"; gap: 48px; position: relative; }
.pm-root .hero-meta { grid-area: meta; display: flex; flex-direction: column; gap: 36px; border-right: var(--edge); padding-right: 24px; padding-top: 12px; }
.pm-root .meta-block .label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em; color: var(--paper-mute); margin-bottom: 8px; text-transform: uppercase; }
.pm-root .meta-block .value { font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em; color: var(--paper); writing-mode: vertical-rl; transform: rotate(180deg); min-height: 160px; display: inline-flex; align-items: center; }
.pm-root .sig-bar { display: inline-block; width: 3px; height: 10px; background: var(--signal); margin-right: 3px; vertical-align: middle; box-shadow: 0 0 6px var(--signal-glow); }
.pm-root .sig-bar.off { background: var(--slate); box-shadow: none; }

.pm-root .hero-type { grid-area: type; display: flex; flex-direction: column; justify-content: space-between; min-height: 70vh; padding-top: 12px; }
.pm-root .hero-h1 { margin-top: 28px; }
.pm-root .hero-h1 .line { display: block; overflow: hidden; }
.pm-root .hero-h1 .line:nth-child(4) { text-indent: 2em; }
.pm-root .hero-foot { max-width: 620px; margin-top: 48px; display: flex; flex-direction: column; gap: 28px; }
.pm-root .hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; }

.pm-root .hero-portrait { grid-area: portrait; position: relative; align-self: stretch; display: flex; flex-direction: column; gap: 12px; }
.pm-root .portrait-frame { flex: 1; min-height: 540px; position: relative; border: var(--edge-strong); overflow: hidden; background: var(--ink-2); transition: filter 600ms, transform 4000ms ease; filter: grayscale(0.2) contrast(1.05) saturate(0.9); }
.pm-root .hero-portrait:hover .portrait-frame { filter: grayscale(0) contrast(1.1) saturate(1.15); transform: scale(1.03); }
.pm-root .portrait-scan { position: absolute; inset: 0; background: repeating-linear-gradient(to bottom, transparent 0 3px, rgba(0,0,0,0.15) 3px 4px); pointer-events: none; mix-blend-mode: multiply; opacity: 0.5; }
.pm-root .portrait-frame::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 0%, transparent 60%, rgba(10,11,15,0.7) 100%); pointer-events: none; }
.pm-root .portrait-caption { display: flex; justify-content: space-between; gap: 10px; color: var(--paper-mute); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; }

.pm-root .runtime { grid-area: run; display: grid; grid-template-columns: repeat(4, 1fr); border-top: var(--edge-strong); padding-top: 20px; }
.pm-root .rt-cell { display: flex; flex-direction: column; gap: 6px; padding-right: 24px; border-right: var(--edge); }
.pm-root .rt-cell:last-child { border-right: 0; }
.pm-root .rt-k { font-family: var(--mono); font-size: 10px; letter-spacing: 0.2em; color: var(--paper-mute); }
.pm-root .rt-v { font-family: var(--mono); font-size: 13px; color: var(--paper); letter-spacing: 0.04em; }
.pm-root .rt-live { display: inline-block; width: 7px; height: 7px; background: var(--signal); border-radius: 50%; box-shadow: 0 0 10px var(--signal); animation: pm_pulse 1.4s ease-in-out infinite; }

.pm-root .sec-head { display: grid; grid-template-columns: 88px 1fr; gap: 48px; padding: 120px 0 48px; align-items: end; }
.pm-root .sec-idx { font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; color: var(--signal); padding-bottom: 8px; border-right: var(--edge); padding-right: 24px; align-self: stretch; display: flex; align-items: flex-end; }
.pm-root .sec-title .display { font-size: clamp(48px, 7.5vw, 120px); }
.pm-root .sec-title .eyebrow { display: inline-flex; align-items: center; margin-bottom: 28px; }
.pm-root .sec-title .line { display: block; }

.pm-root .now-grid { display: grid; grid-template-columns: 88px 1fr 360px; gap: 48px; padding-bottom: 80px; }
.pm-root .now-main { grid-column: 2; display: flex; flex-direction: column; gap: 28px; max-width: 720px; }
.pm-root .now-stats { grid-column: 2 / span 2; grid-row: 2; display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: rgba(237,230,215,0.08); border: var(--edge); margin-top: 32px; }
.pm-root .stat { background: var(--ink); padding: 28px 20px; display: flex; flex-direction: column; gap: 4px; position: relative; transition: background 200ms; }
.pm-root .stat:hover { background: var(--ink-2); }
.pm-root .stat-n { font-family: var(--serif); font-weight: 200; font-size: clamp(40px, 5vw, 72px); line-height: 1; letter-spacing: -0.04em; color: var(--paper); }
.pm-root .stat-u { font-family: var(--mono); font-size: 12px; color: var(--signal); letter-spacing: 0.12em; }
.pm-root .stat-l { font-family: var(--mono); font-size: 11px; color: var(--paper-mute); letter-spacing: 0.04em; line-height: 1.4; margin-top: auto; padding-top: 20px; }

.pm-root .now-log { grid-column: 3; grid-row: 1; border: var(--edge-strong); padding: 20px; font-family: var(--mono); font-size: 12px; background: var(--ink-2); max-height: 360px; overflow: hidden; position: relative; }
.pm-root .now-log::after { content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: linear-gradient(to bottom, transparent, var(--ink-2)); pointer-events: none; }
.pm-root .log-head { display: flex; justify-content: space-between; padding-bottom: 12px; margin-bottom: 14px; border-bottom: var(--edge); color: var(--paper); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; }
.pm-root .log-live { display: inline-flex; align-items: center; gap: 8px; color: var(--signal); }
.pm-root .log-lines { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.pm-root .log-lines li { color: var(--paper-dim); line-height: 1.5; }
.pm-root .log-lines .t { color: var(--paper-mute); margin-right: 10px; }
.pm-root .log-lines .c { color: var(--signal); margin-right: 10px; }

.pm-root .pattern-lead { max-width: 780px; margin-left: 136px; margin-bottom: 64px; }
.pm-root .timeline-wrap { height: 260vh; position: relative; }
.pm-root .timeline-sticky { position: sticky; top: 80px; height: 100vh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; padding: 80px 0; }
.pm-root .timeline-head { display: flex; justify-content: space-between; padding: 0 4px 24px; color: var(--paper-mute); }
.pm-root #tl-year, .pm-root .timeline-head span:last-child { font-family: var(--serif); font-size: 72px; font-weight: 200; color: var(--paper); letter-spacing: -0.03em; line-height: 1; }
.pm-root .timeline-track { display: flex; gap: 40px; will-change: transform; padding: 20px 0; cursor: grab; touch-action: pan-y; user-select: none; }
.pm-root .timeline-track:active { cursor: grabbing; }
.pm-root .tl-card { flex: 0 0 560px; min-height: 460px; border: var(--edge-strong); background: var(--ink-2); padding: 32px; display: flex; flex-direction: column; gap: 20px; position: relative; overflow: hidden; }
.pm-root .tl-card .bg-img { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0.18; filter: saturate(1.1); z-index: 0; transition: opacity 400ms; }
.pm-root .tl-card:hover .bg-img { opacity: 0.32; }
.pm-root .tl-card::after { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(10,11,15,0.6) 0%, rgba(10,11,15,0.95) 70%); z-index: 0; }
.pm-root .tl-card > * { position: relative; z-index: 1; }
.pm-root .tl-year { font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; color: var(--signal); }
.pm-root .tl-co { font-family: var(--serif); font-weight: 900; font-size: 48px; line-height: 1; letter-spacing: -0.02em; color: var(--paper); }
.pm-root .tl-role { font-family: var(--mono); font-size: 12px; color: var(--paper-dim); letter-spacing: 0.06em; }
.pm-root .tl-body { font-family: var(--serif); font-weight: 300; font-size: 20px; line-height: 1.4; color: var(--paper-dim); margin-top: auto; }
.pm-root .tl-body em { color: var(--paper); font-style: italic; }
.pm-root .tl-metric { font-family: var(--mono); font-size: 13px; color: var(--signal); border-top: var(--edge); padding-top: 16px; letter-spacing: 0.03em; }
.pm-root .timeline-rail { position: relative; height: 2px; margin-top: 32px; }
.pm-root .rail-line { position: absolute; inset: 0; background: rgba(237,230,215,0.1); }
.pm-root .rail-progress { position: absolute; left: 0; top: 0; bottom: 0; width: 0%; background: var(--signal); box-shadow: 0 0 8px var(--signal-glow); }
.pm-root .rail-ticks { position: absolute; inset: -4px 0; display: flex; justify-content: space-between; }
.pm-root .rail-ticks .tick { width: 1px; height: 10px; background: var(--paper-mute); }

.pm-root .positions { display: flex; flex-direction: column; }
.pm-root .pos { display: grid; grid-template-columns: 88px 1fr; gap: 48px; padding: 48px 0; border-top: var(--edge); align-items: start; transition: background 300ms; position: relative; }
.pm-root .pos:last-child { border-bottom: var(--edge); }
.pm-root .pos:hover { background: var(--ink-2); }
.pm-root .pos::before { content: ""; position: absolute; left: 0; top: 0; height: 2px; width: 0; background: var(--signal); transition: width 400ms cubic-bezier(.2,.8,.2,1); }
.pm-root .pos:hover::before { width: 100%; }
.pm-root .pos-n { font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; color: var(--paper-mute); padding-top: 14px; padding-left: 20px; transition: color 300ms; }
.pm-root .pos:hover .pos-n { color: var(--signal); }
.pm-root .pos-body { max-width: 900px; padding-right: 24px; }
.pm-root .pos-claim { font-family: var(--serif); font-weight: 200; font-size: clamp(28px, 4.2vw, 56px); line-height: 1.05; letter-spacing: -0.03em; color: var(--paper); margin-bottom: 16px; text-wrap: balance; }
.pm-root .pos-claim em { font-style: italic; font-weight: 900; color: var(--signal); }
.pm-root .pos-elab { font-family: var(--mono); font-size: 14px; line-height: 1.6; color: var(--paper-dim); max-height: 0; overflow: hidden; opacity: 0; transition: max-height 500ms cubic-bezier(.2,.8,.2,1), opacity 400ms 80ms; }
.pm-root .pos:hover .pos-elab, .pm-root .pos.open .pos-elab { max-height: 200px; opacity: 1; }

.pm-root .voices-carousel { margin-left: 88px; margin-right: 0; margin-bottom: 64px; padding-right: var(--gutter); }
.pm-root .voices-head { display: flex; justify-content: space-between; padding: 0 4px 16px; color: var(--paper-mute); }
.pm-root .voices-track { display: flex; gap: 1px; background: rgba(237,230,215,0.08); border-top: var(--edge); border-bottom: var(--edge); overflow-x: auto; overflow-y: hidden; scroll-snap-type: x proximity; scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none; cursor: grab; touch-action: pan-x; user-select: none; }
.pm-root .voices-track::-webkit-scrollbar { display: none; }
.pm-root .voices-track:active { cursor: grabbing; }
.pm-root .voices-rail { position: relative; height: 2px; margin-top: 24px; }
.pm-root .voice { background: var(--ink); padding: 32px 28px 28px; display: flex; flex-direction: column; gap: 20px; position: relative; transition: background 300ms; min-height: 360px; flex: 0 0 480px; max-width: 480px; scroll-snap-align: start; }
.pm-root .voice:hover { background: var(--ink-2); }
.pm-root .voice-top { display: flex; justify-content: space-between; color: var(--paper-mute); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; }
.pm-root .voice-top span:first-child { color: var(--signal); }
.pm-root .voice-quote { font-family: var(--serif); font-weight: 300; font-size: clamp(18px, 1.6vw, 22px); line-height: 1.35; letter-spacing: -0.015em; color: var(--paper); text-wrap: pretty; }
.pm-root .voice-quote em { font-style: italic; font-weight: 400; color: var(--signal); }
.pm-root .voice-hidden { max-height: 0; overflow: hidden; opacity: 0; transition: max-height 400ms, opacity 400ms; border-left: 2px solid var(--signal); padding-left: 0; }
.pm-root .voice:hover .voice-hidden, .pm-root .voice.open .voice-hidden { max-height: 140px; opacity: 1; padding-left: 14px; }
.pm-root .voice-who { display: flex; flex-direction: column; gap: 4px; margin-top: auto; padding-top: 16px; border-top: var(--edge); }
.pm-root .who-name { font-family: var(--serif); font-size: 18px; font-weight: 400; color: var(--paper); letter-spacing: -0.01em; }
.pm-root .who-role { font-family: var(--mono); font-size: 11px; color: var(--paper-mute); letter-spacing: 0.06em; }

.pm-root .builder-grid { margin-left: 136px; max-width: 1100px; padding-bottom: 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(237,230,215,0.08); border: var(--edge); }
.pm-root .builder-card { display: flex; flex-direction: column; gap: 14px; padding: 28px 24px; background: var(--ink); color: inherit; text-decoration: none; transition: background 200ms; position: relative; cursor: pointer; }
.pm-root .builder-card:hover { background: var(--ink-2); }
.pm-root .builder-card::before { content: ""; position: absolute; left: 0; top: 0; height: 2px; width: 0; background: var(--signal); transition: width 400ms cubic-bezier(.2,.8,.2,1); }
.pm-root .builder-card:hover::before { width: 100%; }
.pm-root .bc-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.pm-root .bc-name { font-family: var(--serif); font-weight: 400; font-size: 26px; letter-spacing: -0.015em; color: var(--paper); }
.pm-root .builder-card:hover .bc-name { color: var(--signal); }
.pm-root .bc-status { color: var(--signal); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; text-align: right; }
.pm-root .bc-tagline { font-family: var(--serif); font-weight: 300; font-style: italic; font-size: 15px; color: var(--paper-dim); }
.pm-root .bc-body { font-family: var(--serif); font-weight: 300; font-size: 16px; line-height: 1.5; color: var(--paper-dim); text-wrap: pretty; }
.pm-root .bc-link { color: var(--paper-mute); letter-spacing: 0.02em; margin-top: auto; padding-top: 12px; border-top: var(--edge); display: flex; justify-content: space-between; align-items: center; }
.pm-root .bc-link .arrow { transition: transform 200ms; color: var(--signal); }
.pm-root .builder-card:hover .bc-link .arrow { transform: translate(3px, -3px); }
.pm-root .builder-card:hover .bc-link { color: var(--paper-dim); }

.pm-root .essays { margin-left: 136px; max-width: 1100px; padding-bottom: 80px; }
.pm-root .essays > li { border-top: var(--edge); }
.pm-root .essays > li:last-child { border-bottom: var(--edge); }
.pm-root .essay { display: grid; grid-template-columns: 180px 1fr auto; gap: 40px; align-items: baseline; padding: 40px 0; transition: padding 300ms, background 300ms; position: relative; color: inherit; text-decoration: none; cursor: pointer; }
.pm-root .essay::before { content: ""; position: absolute; left: 0; top: 50%; height: 1px; width: 0; background: var(--signal); transition: width 300ms; transform: translateY(-50%); }
.pm-root .essay:hover { padding-left: 28px; }
.pm-root .essay:hover::before { width: 20px; }
.pm-root .essay-meta { display: flex; flex-direction: column; gap: 4px; color: var(--paper-mute); font-size: 11px; letter-spacing: 0.14em; }
.pm-root .essay-meta span:first-child { color: var(--signal); }
.pm-root .essay-title { font-family: var(--serif); font-weight: 200; font-size: clamp(28px, 3.4vw, 46px); line-height: 1.05; letter-spacing: -0.025em; color: var(--paper); margin-bottom: 10px; text-wrap: balance; transition: color 200ms; }
.pm-root .essay-title em { font-style: italic; font-weight: 900; color: var(--signal); }
.pm-root .essay:hover .essay-title { color: var(--signal); }
.pm-root .essay-dek { font-family: var(--serif); font-weight: 300; font-size: 18px; line-height: 1.4; color: var(--paper-dim); max-width: 640px; text-wrap: pretty; }
.pm-root .essay-go { color: var(--paper-mute); letter-spacing: 0.18em; display: flex; align-items: center; gap: 8px; transition: color 200ms; text-transform: uppercase; }
.pm-root .essay:hover .essay-go { color: var(--signal); }
.pm-root .essay-go .arrow { transition: transform 200ms; }
.pm-root .essay:hover .essay-go .arrow { transform: translateX(6px); }

.pm-root .contact { padding: 120px 0 80px; }
.pm-root .contact-grid { display: grid; grid-template-columns: 88px 1fr 380px; gap: 48px; align-items: start; }
.pm-root .contact-pitch { grid-column: 2; display: flex; flex-direction: column; gap: 28px; max-width: 720px; }
.pm-root .contact-pitch .display { font-size: clamp(44px, 6vw, 96px); }
.pm-root .contact-pitch .line { display: block; }
.pm-root .contact-ctas { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 12px; }
.pm-root .contact-card { grid-column: 3; border: var(--edge-strong); background: var(--ink-2); padding: 24px; font-family: var(--mono); }
.pm-root .card-head { display: flex; justify-content: space-between; padding-bottom: 14px; margin-bottom: 14px; border-bottom: var(--edge); color: var(--paper); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; }
.pm-root .pulse-text { color: var(--signal); display: inline-flex; align-items: center; gap: 8px; }
.pm-root .card-defs { display: flex; flex-direction: column; gap: 0; }
.pm-root .card-defs > div { display: grid; grid-template-columns: 88px 1fr; gap: 12px; padding: 10px 0; border-bottom: 1px dashed rgba(237,230,215,0.08); font-size: 11px; }
.pm-root .card-defs > div:last-child { border-bottom: 0; }
.pm-root .card-defs dt { color: var(--paper-mute); letter-spacing: 0.14em; text-transform: uppercase; }
.pm-root .card-defs dd { color: var(--paper); letter-spacing: 0.02em; }

.pm-root .foot { border-top: var(--edge-strong); padding: 24px 0; margin-top: 40px; }
.pm-root .foot-row { display: grid; grid-template-columns: auto 1fr auto; gap: 32px; align-items: center; font-family: var(--mono); font-size: 11px; color: var(--paper-mute); letter-spacing: 0.04em; }
.pm-root .foot-mark { display: inline-flex; align-items: center; gap: 10px; color: var(--paper); letter-spacing: 0.1em; font-weight: 500; }
.pm-root .foot-mark .sigil { width: 14px; height: 14px; border: 1.2px solid var(--paper); transform: rotate(45deg); position: relative; }
.pm-root .foot-mark .sigil::after { content: ""; position: absolute; inset: 2px; background: var(--signal); }
.pm-root .foot-mid { text-align: center; }
.pm-root .foot-sys { text-align: right; color: var(--paper-dim); }
.pm-root .foot-sys a { color: var(--paper-dim); text-decoration: none; transition: color 160ms; }
.pm-root .foot-sys a:hover { color: var(--signal); }

@media (max-width: 1100px) {
    .pm-root .hero { grid-template-columns: 56px 1fr 260px; gap: 24px; }
    .pm-root .now-grid, .pm-root .contact-grid { grid-template-columns: 56px 1fr; }
    .pm-root .now-log { grid-column: 1 / -1; grid-row: auto; max-height: none; }
    .pm-root .now-stats { grid-template-columns: repeat(3, 1fr); }
    .pm-root .contact-card { grid-column: 1 / -1; }
    .pm-root .sec-head { grid-template-columns: 56px 1fr; gap: 24px; }
    .pm-root .pos { grid-template-columns: 56px 1fr; gap: 24px; }
    .pm-root .essays { margin-left: 80px; }
    .pm-root .essay { grid-template-columns: 140px 1fr; }
    .pm-root .essay-go { grid-column: 2; }
    .pm-root .voices-carousel { margin-left: 56px; }
    .pm-root .voice { flex: 0 0 380px; max-width: 380px; }
    .pm-root .builder-grid { margin-left: 80px; }
}
@media (max-width: 720px) {
    .pm-root { padding: 0 20px; }
    .pm-root .hero { min-height: auto; grid-template-columns: 1fr; grid-template-areas: "type" "portrait" "run"; padding-top: 64px; padding-bottom: 28px; gap: 24px; }
    .pm-root .hero-meta { display: none; }
    .pm-root .hero-h1 .line:nth-child(4) { text-indent: 0; }
    .pm-root .hero-type { min-height: auto; }
    .pm-root .portrait-frame { min-height: 220px; }
    .pm-root .runtime { grid-template-columns: 1fr 1fr; gap: 12px 16px; padding-top: 16px; }
    .pm-root .rt-cell { padding-right: 0; border-right: 0; }
    .pm-root .sec-head { grid-template-columns: 1fr; gap: 14px; padding: 48px 0 24px; }
    .pm-root .sec-idx { border-right: 0; padding-right: 0; padding-bottom: 0; }
    .pm-root .sec-title .display { font-size: clamp(36px, 10vw, 56px); }
    .pm-root .now-grid { grid-template-columns: 1fr; gap: 20px; padding-bottom: 32px; }
    .pm-root .now-main { grid-column: 1; }
    .pm-root .now-stats { grid-template-columns: 1fr 1fr; grid-column: 1; margin-top: 12px; }
    .pm-root .stat { padding: 18px 14px; }
    .pm-root .stat-n { font-size: clamp(36px, 9vw, 52px); }
    .pm-root .stat-l { padding-top: 12px; }
    .pm-root .now-log { display: none; }
    .pm-root .pattern-lead { margin-left: 0; margin-bottom: 20px; }
    .pm-root .timeline-wrap { height: auto; }
    .pm-root .timeline-sticky { position: relative; top: 0; height: auto; overflow: visible; padding: 0; }
    .pm-root .timeline-head span:last-child { font-size: 36px; }
    .pm-root .timeline-track { transform: none !important; overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding: 12px 4px; gap: 16px; touch-action: pan-x; will-change: auto; }
    .pm-root .timeline-track::-webkit-scrollbar { display: none; }
    .pm-root .tl-card { flex: 0 0 86vw; max-width: 86vw; min-height: 320px; scroll-snap-align: start; padding: 20px; }
    .pm-root .tl-co { font-size: 32px; }
    .pm-root .timeline-rail { display: none; }
    .pm-root .pos { grid-template-columns: 1fr; gap: 10px; padding: 20px 0; }
    .pm-root .pos-n { padding-top: 0; padding-left: 0; }
    .pm-root .voices-carousel { margin-left: 0; padding-right: 0; }
    .pm-root .voice { flex: 0 0 86vw; max-width: 86vw; min-height: 320px; padding: 24px 20px; }
    .pm-root .voice-hidden { max-height: 200px; opacity: 1; padding-left: 14px; }
    .pm-root .essays { margin-left: 0; padding-bottom: 32px; }
    .pm-root .essay { grid-template-columns: 1fr; gap: 8px; padding: 16px 0; }
    .pm-root .essay:hover { padding-left: 0; }
    .pm-root .essay-title { font-size: clamp(20px, 5.5vw, 26px); }
    .pm-root .essay-dek { font-size: 15px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .pm-root .builder-grid { grid-template-columns: 1fr; margin-left: 0; padding-bottom: 32px; }
    .pm-root .builder-card { padding: 18px 14px; }
    .pm-root .bc-name { font-size: 18px; }
    .pm-root .bc-status { font-size: 9px; letter-spacing: 0.14em; }
    .pm-root .contact { padding: 48px 0 32px; }
    .pm-root .contact-grid { grid-template-columns: 1fr; gap: 24px; }
    .pm-root .contact-pitch { grid-column: 1; }
    .pm-root .contact-pitch .display { font-size: clamp(36px, 10vw, 56px); }
    .pm-root .contact-card { grid-column: 1; padding: 16px; }
    .pm-root .card-defs > div { grid-template-columns: 72px 1fr; gap: 10px; padding: 8px 0; }
    .pm-root .foot-row { grid-template-columns: 1fr; gap: 12px; text-align: left; }
    .pm-root .foot-mid, .pm-root .foot-sys { text-align: left; }
}
@media (min-width: 481px) and (max-width: 720px) {
    .pm-root .builder-grid { grid-template-columns: 1fr 1fr; }
    .pm-root .essays { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
    .pm-root .essays > li { border-top: 1px solid rgba(237,230,215,0.08); }
    .pm-root .essays > li:last-child { border-bottom: 1px solid rgba(237,230,215,0.08); }
    .pm-root .essay-title { font-size: clamp(17px, 3.4vw, 22px); }
    .pm-root .essay-dek { font-size: 13px; -webkit-line-clamp: 3; }
    .pm-root .card-defs { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; }
    .pm-root .card-defs > div { border-bottom: 0; padding: 6px 0; }
}

/* Respect OS-level reduced motion — suppress pulse, drift, hover transforms */
@media (prefers-reduced-motion: reduce) {
    .pm-root *, .pm-root *::before, .pm-root *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
    .pm-root .portrait-frame { transition: none; filter: none; }
    .pm-root .hero-portrait:hover .portrait-frame { transform: none; }
    .pm-root .tl-card .bg-img { transition: none; }
}
`
