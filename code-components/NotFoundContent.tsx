// @ts-ignore
import { addPropertyControls, ControlType } from "framer"
import { useState } from "react"

/**
 * NotFoundContent: cinematic, on-brand, self-contained 404 (ink, Unbounded, amber/cobalt).
 * Carries the real site menubar (logomark + Home / Dispatches / Shinka / Connect + mobile
 * hamburger). CSS-only cosmic background, no image dependency. All links point to live pages.
 */
export default function NotFoundContent() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="nf">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="glow" />
      <div className="grain" />

      <nav className="nav">
        <a className="logo" href="/"><span className="lm" />PHIL MORA</a>
        <span className="sp" />
        <a className="lnk" href="/">Home</a>
        <a className="lnk" href="/essays">Dispatches</a>
        <a className="lnk" href="/the-build">Shinka <span className="kj">進化</span></a>
        <a className="lnk" href="/#connect">Connect</a>
        <button
          className={"burger" + (menuOpen ? " open" : "")}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={"mobnav" + (menuOpen ? " open" : "")}>
        <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="/essays" onClick={() => setMenuOpen(false)}>Dispatches</a>
        <a href="/the-build" onClick={() => setMenuOpen(false)}>Shinka <span className="kj">進化</span></a>
        <a href="/#connect" onClick={() => setMenuOpen(false)}>Connect</a>
      </div>

      <div className="wrap">
        <div className="eyebrow"><span className="dot" /> Error 404 · off the map</div>
        <h1 className="big">You drifted off <em>the map.</em></h1>
        <p className="lede">This page does not exist. Plenty of others do. Pick a direction and keep building.</p>
        <div className="ctas">
          <a className="btn primary" href="/">← Back home</a>
          <a className="btn" href="/essays">Read the dispatches</a>
        </div>
      </div>

      <div className="foot">philmora · northern colorado · 5,000 ft</div>
    </div>
  )
}

addPropertyControls(NotFoundContent, {})

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.nf{
  --ink:#060509; --paper:#F6F3EC; --c2:#2E6BFF; --c5:#FF7A1A; --c6:#FFD23E; --neon:#2FD0FF;
  --f:'Space Grotesk',sans-serif; --disp:'Unbounded',sans-serif; --mono:'JetBrains Mono',monospace;
  position:relative; width:100%; min-height:100vh; background:var(--ink); color:var(--paper);
  font-family:var(--f); -webkit-font-smoothing:antialiased; overflow:hidden;
  display:flex; flex-direction:column; justify-content:center; padding:120px clamp(24px,6vw,80px) 90px;
}
.nf *{ box-sizing:border-box; margin:0; padding:0; }
.nf a{ color:inherit; text-decoration:none; }

.nf .glow{ position:absolute; inset:0; z-index:0; pointer-events:none;
  background:radial-gradient(58% 50% at 16% 22%, rgba(255,122,26,.20), transparent 60%),
             radial-gradient(55% 50% at 86% 28%, rgba(46,107,255,.22), transparent 62%),
             radial-gradient(72% 60% at 62% 110%, rgba(47,208,255,.10), transparent 66%); }
.nf .grain{ position:absolute; inset:0; z-index:1; pointer-events:none; opacity:.05; mix-blend-mode:overlay;
  background-image:repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 2px); }

/* NAV — the real site menubar */
.nf .nav{ position:absolute; z-index:6; top:0; left:0; right:0; display:flex; align-items:center; gap:14px; padding:14px clamp(24px,6vw,80px); color:#fff; }
.nf .nav .logo{ display:inline-flex; align-items:center; gap:11px; font-family:var(--disp); font-weight:800; font-size:16px; letter-spacing:-.02em; white-space:nowrap; }
.nf .nav .lm{ width:28px; height:28px; border-radius:6px; background:var(--c2); box-shadow:0 2px 14px rgba(46,107,255,.5); flex:0 0 auto; }
.nf .nav .sp{ flex:1; }
.nf .nav a.lnk{ font-size:12px; font-weight:600; letter-spacing:.05em; text-transform:uppercase; white-space:nowrap; opacity:.82; transition:opacity .2s; padding:7px 0; }
.nf .nav a.lnk:hover{ opacity:1; }
.nf .nav a.lnk .kj{ color:var(--c5); font-family:var(--mono); font-size:.92em; letter-spacing:.04em; margin-left:5px; }
.nf .burger{ display:none; flex-direction:column; justify-content:center; gap:5px; width:38px; height:38px; padding:9px 7px; background:none; border:0; cursor:pointer; }
.nf .burger span{ display:block; height:2px; width:100%; background:#fff; border-radius:2px; transition:transform .3s, opacity .2s; box-shadow:0 1px 6px rgba(0,0,0,.5); }
.nf .burger.open span:nth-child(1){ transform:translateY(7px) rotate(45deg); }
.nf .burger.open span:nth-child(2){ opacity:0; }
.nf .burger.open span:nth-child(3){ transform:translateY(-7px) rotate(-45deg); }
.nf .mobnav{ position:absolute; top:0; left:0; right:0; z-index:5; min-height:100vh; display:flex; flex-direction:column; gap:2px;
  padding:92px 24px 40px; background:rgba(6,5,9,.98); -webkit-backdrop-filter:blur(16px); backdrop-filter:blur(16px);
  transform:translateY(-102%); pointer-events:none; transition:transform .36s cubic-bezier(0.16,1,0.3,1); }
.nf .mobnav.open{ transform:translateY(0); pointer-events:auto; }
.nf .mobnav a{ font-family:var(--disp); font-weight:800; text-transform:uppercase; font-size:30px; letter-spacing:-.01em; color:#fff; opacity:.92; padding:16px 0; border-bottom:1px solid rgba(255,255,255,.08); }
.nf .mobnav a .kj{ color:var(--c5); font-family:var(--mono); font-size:.5em; letter-spacing:.04em; margin-left:10px; vertical-align:middle; }

.nf .wrap{ position:relative; z-index:2; max-width:840px; }
.nf .eyebrow{ font-family:var(--mono); font-size:12px; letter-spacing:.24em; text-transform:uppercase; color:var(--neon); display:flex; align-items:center; gap:11px; margin-bottom:3vh; }
.nf .eyebrow .dot{ width:8px; height:8px; border-radius:50%; background:var(--c5); box-shadow:0 0 12px var(--c5); flex:0 0 auto; }
.nf .big{ font-family:var(--disp); font-weight:800; text-transform:uppercase; letter-spacing:-.03em; line-height:.95; font-size:clamp(40px,8vw,92px); color:#fff; }
.nf .big em{ font-style:italic; color:var(--c5); }
.nf .lede{ font-size:clamp(16px,1.7vw,20px); line-height:1.55; color:rgba(246,243,236,.8); max-width:52ch; margin-top:3.5vh; }
.nf .ctas{ display:flex; gap:14px; flex-wrap:wrap; margin-top:5vh; }
.nf .btn{ display:inline-flex; align-items:center; gap:8px; padding:15px 24px; font-family:var(--mono); font-size:12px; letter-spacing:.1em; text-transform:uppercase; border:1px solid rgba(246,243,236,.22); border-radius:8px; color:var(--paper); transition:border-color .2s, color .2s, transform .2s; cursor:pointer; }
.nf .btn:hover{ border-color:#fff; transform:translateY(-2px); }
.nf .btn.primary{ background:var(--c5); color:var(--ink); border-color:var(--c5); font-weight:700; }
.nf .btn.primary:hover{ filter:brightness(1.06); color:var(--ink); }

.nf .foot{ position:absolute; bottom:30px; left:clamp(24px,6vw,80px); z-index:3; font-family:var(--mono); font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:rgba(246,243,236,.4); }

@media(max-width:640px){
  .nf{ padding:104px 22px 84px; }
  .nf .nav a.lnk{ display:none; }
  .nf .burger{ display:flex; }
  .nf .nav{ padding:12px 22px; }
  .nf .nav .logo{ font-size:15px; } .nf .nav .lm{ width:24px; height:24px; }
  .nf .big{ font-size:50px; line-height:.98; }
}
@media(prefers-reduced-motion:reduce){ .nf .mobnav{ transition:none; } }
`
