// @ts-ignore
import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Props {
    trackSections?: boolean
}

type NavLink = { id: string; idx: string; label: string; kicker: string; href?: string }

/**
 * SiteNav — Phil Mora fixed top navigation.
 * Sigil mark · 6 anchor links (01-06) · status bead + SFO/PHL/FoCo/RNS.
 * On mobile (≤720px) the inline links are replaced by a hamburger that
 * opens a full-screen overlay menu (two-tier kicker + label, italic-Fraunces
 * accent on the active link).
 *
 * Active state:
 *  - On the home page (or anywhere with trackSections=true): scroll
 *    position determines which 01–05 slot is active.
 *  - On /work-brain or /work-brain/:slug: slot 06 is active.
 *  - On /thoughts or /essays/:slug: slot 05 (THE BIG PICTURE) is active.
 *  - Otherwise: no slot active.
 */
export default function SiteNav(props: Props) {
    const trackSections = props.trackSections ?? true
    const [active, setActive] = useState(-1)
    const [menuOpen, setMenuOpen] = useState(false)

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

    // Body scroll lock while menu is open.
    useEffect(() => {
        if (typeof window === "undefined") return
        const prev = document.body.style.overflow
        if (menuOpen) document.body.style.overflow = "hidden"
        else document.body.style.overflow = prev
        return () => {
            document.body.style.overflow = prev
        }
    }, [menuOpen])

    // ESC closes the menu.
    useEffect(() => {
        if (typeof window === "undefined" || !menuOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [menuOpen])

    const paper = "#EDE6D7"
    const paperMute = "#7A7568"
    const paperDim = "#BDB6A8"
    const ink = "#0A0B0F"
    const signal = "#E26B38"
    const ok = "#4FBA87"
    const mono = "'JetBrains Mono', ui-monospace, monospace"
    const serif = "'Fraunces', Georgia, serif"

    const links: NavLink[] = [
        { id: "now", idx: "01", label: "NOW", kicker: "LIVE NOW" },
        { id: "pattern", idx: "02", label: "PATTERN", kicker: "THE ARC" },
        { id: "believe", idx: "03", label: "BELIEVE", kicker: "OPERATING" },
        { id: "voices", idx: "04", label: "VOICES", kicker: "ON RECORD" },
        { id: "thoughts", idx: "05", label: "THE BIG PICTURE", kicker: "ESSAYS" },
        { id: "work-brain", idx: "06", label: "WORK BRAIN", kicker: "THE WIKI", href: "/work-brain" },
    ]

    const smartNav = (href: string, closeMenu: boolean) =>
        (ev: React.MouseEvent<HTMLAnchorElement>) => {
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
            if (closeMenu) setMenuOpen(false)
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

    const Sigil = ({ size = 18 }: { size?: number }) => (
        <span
            style={{
                width: size,
                height: size,
                border: `1.5px solid ${paper}`,
                position: "relative",
                transform: "rotate(45deg)",
                display: "inline-block",
                flexShrink: 0,
            }}
        >
            <span
                style={{
                    position: "absolute",
                    inset: size > 14 ? 3 : 2,
                    background: signal,
                    display: "block",
                }}
            />
        </span>
    )

    return (
        <>
            <style>{`
                @keyframes pm_nav_pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.75); }
                }
                @keyframes pm_nav_overlay_in {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes pm_nav_link_in {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .pm-nav a:hover { color: ${paper} !important; }
                .pm-nav a.active { color: ${paper} !important; }
                .pm-nav-hamburger {
                    display: none;
                    width: 36px; height: 36px;
                    align-items: center; justify-content: center;
                    background: transparent;
                    border: 1px solid rgba(237,230,215,0.18);
                    color: ${paper};
                    cursor: pointer;
                    padding: 0;
                    transition: border-color 160ms, color 160ms;
                }
                .pm-nav-hamburger:hover {
                    border-color: ${signal};
                    color: ${signal};
                }
                @media (max-width: 900px) {
                    .pm-nav-links { gap: 20px !important; }
                    .pm-nav-links a { font-size: 11px !important; }
                }
                @media (max-width: 720px) {
                    .pm-nav { padding: 14px 20px !important; }
                    .pm-nav-links { display: none !important; }
                    .pm-nav-status { display: none !important; }
                    .pm-nav-hamburger { display: inline-flex; }
                }

                .pm-nav-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 150;
                    background: ${ink};
                    color: ${paper};
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                    animation: pm_nav_overlay_in 180ms ease-out;
                }
                .pm-nav-overlay-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px clamp(20px, 5vw, 32px);
                    border-bottom: 1px solid rgba(237,230,215,0.08);
                }
                .pm-nav-overlay-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: ${paper};
                    text-decoration: none;
                    font-family: ${mono};
                    font-size: 12px;
                    letter-spacing: 0.08em;
                    font-weight: 600;
                }
                .pm-nav-close {
                    width: 36px; height: 36px;
                    display: inline-flex;
                    align-items: center; justify-content: center;
                    background: transparent;
                    border: 1px solid rgba(237,230,215,0.18);
                    color: ${paper};
                    cursor: pointer;
                    padding: 0;
                    transition: border-color 160ms, color 160ms;
                }
                .pm-nav-close:hover {
                    border-color: ${signal};
                    color: ${signal};
                }
                .pm-nav-overlay-body {
                    flex: 1 1 auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 32px clamp(20px, 5vw, 32px);
                    gap: 0;
                }
                .pm-nav-overlay-link {
                    display: grid;
                    grid-template-columns: 56px 1fr;
                    gap: 16px;
                    align-items: center;
                    padding: 12px 0;
                    text-decoration: none;
                    color: ${paper};
                    border-bottom: 1px solid rgba(237,230,215,0.06);
                    animation: pm_nav_link_in 280ms ease-out backwards;
                    transition: padding 200ms;
                }
                .pm-nav-overlay-link:last-child { border-bottom: none; }
                .pm-nav-overlay-link:hover { padding-left: 8px; }
                .pm-nav-overlay-link .num {
                    font-family: ${mono};
                    font-size: 13px;
                    letter-spacing: 0.18em;
                    color: ${signal};
                    text-transform: uppercase;
                    font-weight: 500;
                }
                .pm-nav-overlay-link .text {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    min-width: 0;
                }
                .pm-nav-overlay-link .kicker {
                    font-family: ${mono};
                    font-size: 9px;
                    font-weight: 500;
                    letter-spacing: 0.22em;
                    color: ${paperMute};
                    text-transform: uppercase;
                    transition: color 160ms;
                }
                .pm-nav-overlay-link .label {
                    font-family: ${serif};
                    font-weight: 500;
                    font-style: normal;
                    font-size: clamp(22px, 5.5vw, 30px);
                    line-height: 1.1;
                    letter-spacing: -0.015em;
                    color: ${paper};
                    text-transform: uppercase;
                    font-variation-settings: "opsz" 144, "SOFT" 50;
                    text-wrap: balance;
                    transition: color 160ms;
                }
                .pm-nav-overlay-link:hover .label,
                .pm-nav-overlay-link.active .label {
                    color: ${signal};
                    font-style: italic;
                    font-weight: 900;
                }
                .pm-nav-overlay-link.active .kicker {
                    color: ${signal};
                }
                .pm-nav-overlay-foot {
                    padding: 20px clamp(20px, 5vw, 32px);
                    border-top: 1px solid rgba(237,230,215,0.08);
                    font-family: ${mono};
                    font-size: 11px;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: ${paperMute};
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .pm-nav-overlay-foot .locator {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .pm-nav-overlay-foot .status-dot {
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: ${ok};
                    box-shadow: 0 0 8px ${ok};
                    display: inline-block;
                }
                .pm-nav-overlay-foot .tag {
                    color: ${signal};
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
                    onClick={smartNav("/", false)}
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
                    <Sigil />
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
                                onClick={smartNav(href, false)}
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
                    <span>SFO / PHL / FoCo / RNS</span>
                </div>
                <button
                    className="pm-nav-hamburger"
                    aria-label="Open menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(true)}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M2 5h14M2 9h14M2 13h14"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </nav>

            {menuOpen && (
                <div
                    className="pm-nav-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Site navigation"
                >
                    <div className="pm-nav-overlay-head">
                        <a
                            href="/"
                            className="pm-nav-overlay-brand"
                            onClick={smartNav("/", true)}
                        >
                            <Sigil />
                            <span>PHIL&nbsp;MORA</span>
                        </a>
                        <button
                            className="pm-nav-close"
                            aria-label="Close menu"
                            onClick={() => setMenuOpen(false)}
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M4 4l10 10M14 4l-10 10"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="pm-nav-overlay-body">
                        {links.map((l, i) => {
                            const href = l.href ?? `/#${l.id}`
                            return (
                                <a
                                    key={l.id}
                                    href={href}
                                    className={
                                        "pm-nav-overlay-link" +
                                        (active === i ? " active" : "")
                                    }
                                    onClick={smartNav(href, true)}
                                    style={{
                                        animationDelay: `${i * 40 + 80}ms`,
                                    }}
                                >
                                    <span className="num">§ {l.idx}</span>
                                    <span className="text">
                                        <span className="kicker">{l.kicker}</span>
                                        <span className="label">{l.label}</span>
                                    </span>
                                </a>
                            )
                        })}
                    </div>
                    <div className="pm-nav-overlay-foot">
                        <span className="locator">
                            <span className="status-dot" />
                            SFO / PHL / FoCo / RNS
                        </span>
                        <span className="tag">§ BUILDER · OPERATOR</span>
                    </div>
                </div>
            )}
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
