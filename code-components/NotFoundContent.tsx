// @ts-ignore
import { addPropertyControls, ControlType } from "framer"

/**
 * NotFoundContent — 404 "drifted off the map" page body.
 * Simple now that essay detail pages are served natively by Framer CMS
 * at /thoughts/:slug (no URL routing hacks needed).
 */
export default function NotFoundContent() {
    return (
        <>
            <style>{CSS}</style>
            <main className="pm-404">
                <div className="pm-404-eyebrow">
                    <span className="dot" />
                    ERR / 404 · PAGE NOT IN THE SYSTEM
                </div>
                <h1 className="pm-404-title">
                    You drifted off <em>the map.</em>
                </h1>
                <p className="pm-404-lede">
                    This page doesn't exist — but plenty of others do. The
                    infrastructure thesis. The agents-as-teammates argument.
                    The pattern across twelve years of roles. Pick a direction.
                </p>
                <div className="pm-404-ctas">
                    <a href="/" className="btn primary" data-cursor="link">
                        ← BACK HOME
                    </a>
                    <a href="/thoughts" className="btn" data-cursor="link">
                        READ THE BIG PICTURE
                    </a>
                </div>
                <div className="pm-404-coords">
                    <span>LAT 40.5853° N</span>
                    <span>LNG 105.0844° W</span>
                    <span>ALT 5,000 FT</span>
                    <span>SIG —</span>
                </div>
            </main>
        </>
    )
}

addPropertyControls(NotFoundContent, {})

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap");
.pm-404 {
    min-height: 100vh;
    max-width: 1440px;
    margin: 0 auto;
    padding: 180px clamp(24px, 4vw, 72px) 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 32px;
    color: #EDE6D7;
    font-family: 'JetBrains Mono', monospace;
    position: relative;
    z-index: 3;
}
.pm-404 * { box-sizing: border-box; }
.pm-404-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #7A7568; font-weight: 500; display: inline-flex; align-items: center; }
.pm-404-eyebrow .dot { display: inline-block; width: 6px; height: 6px; background: #E26B38; border-radius: 50%; margin-right: 10px; box-shadow: 0 0 12px rgba(226,107,56,0.25); animation: pm_pulse 1.8s ease-in-out infinite; }
@keyframes pm_pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.75); } }
.pm-404-title { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(56px, 10vw, 160px); letter-spacing: -0.03em; line-height: 0.92; color: #EDE6D7; max-width: 1100px; font-variation-settings: "opsz" 144, "SOFT" 50; margin: 0; }
.pm-404-title em { font-style: italic; font-weight: 900; color: #E26B38; }
.pm-404-lede { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(20px, 2vw, 28px); line-height: 1.4; letter-spacing: -0.01em; color: #BDB6A8; max-width: 720px; text-wrap: pretty; margin: 0; }
.pm-404-ctas { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 12px; }
.pm-404 .btn { display: inline-flex; align-items: center; gap: 12px; padding: 14px 22px; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #EDE6D7; text-decoration: none; border: 1px solid rgba(237,230,215,0.2); background: transparent; transition: border-color 200ms, background 200ms, color 200ms; cursor: none; }
.pm-404 .btn:hover { border-color: #E26B38; color: #E26B38; }
.pm-404 .btn.primary { background: #E26B38; color: #0A0B0F; border-color: #E26B38; }
.pm-404 .btn.primary:hover { background: transparent; color: #E26B38; }
.pm-404-coords { margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(237,230,215,0.08); display: flex; gap: 40px; flex-wrap: wrap; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.14em; color: #7A7568; text-transform: uppercase; }
`
