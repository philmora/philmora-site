// @ts-ignore
import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Props {
    trackSections?: boolean
}

/**
 * SiteNav — D5 brutalist term-bar for interior pages (/thoughts, /essays/:slug).
 * Mirrors the term-bar baked into HomeContent. JetBrains Mono, chartreuse
 * signal, hot-orange reserved for the Butchsonic (muse) cell only.
 * Fixed full-width bar; container queries (not @media) so it collapses
 * correctly inside Framer's full-window render context.
 *
 * Links: PHIL MORA (home) · BUTCHSONIC // the muse · [field-notes] · [say-hello].
 * Label matches the home nav exactly. [field-notes] is marked active on
 * /thoughts and /essays/:slug.
 */
export default function SiteNav(_props: Props) {
    const [onWriting, setOnWriting] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined") return
        const p = window.location.pathname
        setOnWriting(p.startsWith("/thoughts") || p.startsWith("/essays"))
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
        if (typeof window === "undefined") return
        const url = new URL(href, window.location.href)
        if (url.pathname === window.location.pathname && url.hash) return
        ev.preventDefault()
        window.location.assign(href)
    }

    return (
        <div className="pm-d5-nav">
            <style>{`
.pm-d5-nav {
  --ink: #0A0B0E;
  --ink-2: #131419;
  --paper: #E8E6DC;
  --paper-dim: #989384;
  --paper-mute: #5A5750;
  --line: rgba(232, 230, 220, 0.14);
  --signal: #C8FF3D;
  --warn: #FF6B35;
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  -webkit-font-smoothing: antialiased;
  container-type: inline-size;
}
.pm-d5-nav * { box-sizing: border-box; margin: 0; padding: 0; }

.pm-d5-nav .term-bar {
  border-top: 4px solid var(--signal);
  border-bottom: 1px solid var(--line);
  background: var(--ink);
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  font-size: 11px;
  letter-spacing: 0.06em;
}
.pm-d5-nav .tb-cell {
  padding: 12px 18px;
  border-right: 1px solid var(--line);
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--paper-dim);
  text-decoration: none;
}
.pm-d5-nav .tb-cell:last-child { border-right: 0; justify-content: flex-end; }
.pm-d5-nav .tb-cell.id { color: var(--paper); font-weight: 700; transition: color 200ms; }
.pm-d5-nav .tb-cell.id::before { content: "▍"; color: var(--signal); }
.pm-d5-nav .tb-cell.id:hover { color: var(--signal); }
.pm-d5-nav .tb-cell.id .meta {
  color: var(--paper-mute);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  margin-left: 6px;
  font-weight: 500;
}
.pm-d5-nav .tb-cell.sister {
  color: var(--paper-mute);
  font-weight: 500;
  transition: color 200ms, background 200ms;
}
.pm-d5-nav .tb-cell.sister::before {
  content: "▍";
  color: var(--warn);
  margin-right: 8px;
}
.pm-d5-nav .tb-cell.sister:hover { background: var(--ink-2); color: var(--warn); }
.pm-d5-nav .tb-cell.sister .meta {
  color: var(--paper-mute);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  margin-left: 6px;
}
.pm-d5-nav .tb-cell.sister:hover .meta { color: var(--warn); }
.pm-d5-nav .tb-cell .pulse {
  width: 8px; height: 8px; background: var(--signal); border-radius: 50%;
  box-shadow: 0 0 10px var(--signal);
  animation: pm-d5-nav-pulse 1.4s ease-in-out infinite;
}
@keyframes pm-d5-nav-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.pm-d5-nav .tb-cell .sep { color: var(--paper-mute); }

.pm-d5-nav .tb-nav { display: flex; gap: 20px; }
.pm-d5-nav .tb-nav a {
  color: var(--paper-dim);
  text-decoration: none;
  border-bottom: 1px dashed transparent;
  transition: all 200ms;
}
.pm-d5-nav .tb-nav a:hover { color: var(--signal); border-bottom-color: var(--signal); }
.pm-d5-nav .tb-nav a.active { color: var(--signal); }
.pm-d5-nav .tb-nav a::before { content: "["; color: var(--paper-mute); }
.pm-d5-nav .tb-nav a::after { content: "]"; color: var(--paper-mute); }

@container (max-width: 980px) {
  .pm-d5-nav .term-bar { grid-template-columns: 1fr; }
  .pm-d5-nav .tb-cell { border-right: 0; border-bottom: 1px solid var(--line); }
  .pm-d5-nav .tb-cell:last-child { justify-content: flex-start; }
  .pm-d5-nav .tb-nav { gap: 16px; }
}
`}</style>

            <header className="term-bar">
                <a
                    className="tb-cell id"
                    href="/"
                    rel="external"
                    onClick={hardNav("/")}
                >
                    PHIL MORA<span className="meta">// the engine</span>
                </a>
                <a
                    className="tb-cell sister"
                    href="https://butchsonic.com"
                    target="_blank"
                    rel="noopener"
                >
                    BUTCHSONIC<span className="meta">// the muse</span>
                </a>
                <nav className="tb-cell tb-nav">
                    <a
                        href="/thoughts"
                        rel="external"
                        className={onWriting ? "active" : ""}
                        onClick={hardNav("/thoughts")}
                    >
                        field-notes
                    </a>
                    <a href="mailto:hi@philmora.com">say-hello</a>
                </nav>
                <div className="tb-cell">
                    <span className="pulse" />
                    LIVE <span className="sep">/</span> FoCo{" "}
                    <span className="sep">/</span> 5,000 ft
                </div>
            </header>
        </div>
    )
}

addPropertyControls(SiteNav, {
    trackSections: {
        type: ControlType.Boolean,
        title: "Track Active Section",
        defaultValue: true,
    },
})
