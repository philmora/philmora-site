// @ts-ignore
import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Props {
    trackSections?: boolean
}

type NavLink = { id: string; idx: string; label: string; href?: string }

/**
 * SiteNav — Phil Mora fixed top navigation.
 * Sigil mark · 6 anchor links (01-06) · status bead + SFO/PHL/FoCo/RNS.
 *
 * Slots 01–05 link to /#section anchors on the home page. Slot 06 (WORK
 * BRAIN) links to the standalone /work-brain section.
 *
 * Active state:
 *  - On the home page (or anywhere with trackSections=true): scroll
 *    position determines which 01–05 slot is active.
 *  - On /work-brain or /work-brain/:slug: slot 06 is active.
 *  - On /thoughts or /essays/:slug: slot 05 (THE BIG PICTURE) is active.
 *  - Otherwise: no slot active.
 *
 * On narrow viewports (≤720px) the section links and location text are
 * hidden — the page scrolls end-to-end and IS the nav. Logo still returns
 * home.
 */
export default function SiteNav(props: Props) {
    const trackSections = props.trackSections ?? true
    const [active, setActive] = useState(-1)

    useEffect(() => {
        if (typeof window === "undefined") return

        const path = window.location.pathname

        // Path-based active state for cross-page consistency.
        if (path.startsWith("/work-brain")) {
            setActive(5)
            return
        }
        if (
            path.startsWith("/thoughts") ||
            path.startsWith("/essays")
        ) {
            setActive(4)
            return
        }

        // Home page: scroll-position section tracking.
        if (!trackSections) return
        const ids = ["now", "pattern", "believe", "voices", "thoughts"]
        const onScroll = () => {
            const y = window.scrollY + 200
            let a = -1
            ids.forEach((id, i) => {
                const el = document.getElementById(id)
                if (el && el.offsetTop <= y) a = i
            })
            setActive(a)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [trackSections])

    const paper = "#EDE6D7"
    const paperMute = "#7A7568"
    const signal = "#E26B38"
    const ok = "#4FBA87"
    const mono = "'JetBrains Mono', ui-monospace, monospace"

    const links: NavLink[] = [
        { id: "now", idx: "01", label: "NOW" },
        { id: "pattern", idx: "02", label: "PATTERN" },
        { id: "believe", idx: "03", label: "BELIEVE" },
        { id: "voices", idx: "04", label: "VOICES" },
        { id: "thoughts", idx: "05", label: "THE BIG PICTURE" },
        { id: "work-brain", idx: "06", label: "WORK BRAIN", href: "/work-brain" },
    ]

    const smartNav = (href: string) => (ev: React.MouseEvent<HTMLAnchorElement>) => {
        if (
            ev.button !== 0 ||
            ev.ctrlKey ||
            ev.metaKey ||
            ev.shiftKey ||
            ev.altKey
        )
            return
        if (typeof window === "undefined") return
        const url = new URL(href, window.location.href)
        if (url.pathname === window.location.pathname) {
            // Same page — allow native fragment scroll to happen.
            return
        }
        ev.preventDefault()
        window.location.assign(href)
    }

    const linkBase: React.CSSProperties = {
        color: paperMute,
        textDecoration: "none",
        transition: "color 160ms",
        fontFamily: mono,
        fontSize: 12,
        letterSpacing: "0.04em",
        display: "inline-flex",
        alignItems: "center",
    }

    return (
        <>
            <style>{`
                @keyframes pm_nav_pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.75); }
                }
                .pm-nav a:hover { color: ${paper} !important; }
                .pm-nav a.active { color: ${paper} !important; }
                @media (max-width: 900px) {
                    .pm-nav-links { gap: 20px !important; }
                    .pm-nav-links a { font-size: 11px !important; }
                }
                @media (max-width: 720px) {
                    .pm-nav { padding: 14px 20px !important; }
                    .pm-nav-links { display: none !important; }
                    .pm-nav-status-text { display: none !important; }
                }
            `}</style>
            <nav
                className="pm-nav"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    padding: "20px clamp(24px, 4vw, 72px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontFamily: mono,
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    background:
                        "linear-gradient(to bottom, rgba(10,11,15,0.7), rgba(10,11,15,0))",
                    color: paper,
                }}
            >
                <a
                    href="/"
                    data-cursor="link"
                    rel="external"
                    onClick={smartNav("/")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: paper,
                        textDecoration: "none",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                    }}
                >
                    <span
                        style={{
                            width: 18,
                            height: 18,
                            border: `1.5px solid ${paper}`,
                            position: "relative",
                            transform: "rotate(45deg)",
                            display: "inline-block",
                        }}
                    >
                        <span
                            style={{
                                content: '""',
                                position: "absolute",
                                inset: 3,
                                background: signal,
                                display: "block",
                            }}
                        />
                    </span>
                    <span>PHIL&nbsp;MORA</span>
                </a>
                <div className="pm-nav-links" style={{ display: "flex", gap: 32 }}>
                    {links.map((l, i) => {
                        const href = l.href ?? `/#${l.id}`
                        return (
                            <a
                                key={l.id}
                                href={href}
                                data-cursor="link"
                                rel="external"
                                onClick={smartNav(href)}
                                className={active === i ? "active" : ""}
                                style={linkBase}
                            >
                                <span
                                    style={{
                                        color: signal,
                                        marginRight: 6,
                                        fontWeight: 500,
                                    }}
                                >
                                    {l.idx}
                                </span>
                                {l.label}
                            </a>
                        )
                    })}
                </div>
                <div
                    className="pm-nav-status"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: paperMute,
                    }}
                >
                    <span
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: ok,
                            boxShadow: `0 0 8px ${ok}`,
                            display: "inline-block",
                        }}
                    />
                    <span className="pm-nav-status-text">SFO / PHL / FoCo / RNS</span>
                </div>
            </nav>
        </>
    )
}

addPropertyControls(SiteNav, {
    trackSections: {
        type: ControlType.Boolean,
        title: "Track Active Section",
        defaultValue: true,
    },
})
