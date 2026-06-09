import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

const ESSAYS_JSON_URL =
  "https://raw.githubusercontent.com/philmora/essays/main/essays.json"

const HERO: Record<string, string> = {
  "after-the-prd": "https://files.catbox.moe/tg8wsl.jpg",
  "agents-as-teammates": "https://files.catbox.moe/hy8cm5.jpg",
  "code-wizards-to-cosmic-architects": "https://files.catbox.moe/fx2qar.jpg",
  "the-invisible-platform": "https://files.catbox.moe/qqp12r.jpg",
  "the-expertise-inversion": "https://files.catbox.moe/psoh0e.jpg",
  "the-combination-premium": "https://files.catbox.moe/m5sbfv.jpg",
  "the-five-breaks": "https://files.catbox.moe/xdl4p2.jpg",
  "prototypes-vs-specs": "https://files.catbox.moe/scrnfs.jpg",
  "the-second-brain": "https://files.catbox.moe/l8tl4v.jpg",
  "the-why-layer": "https://files.catbox.moe/leq8pu.jpg",
  "the-work-brain-mesh": "https://files.catbox.moe/3ln4tw.jpg",
  "the-org-proof": "https://files.catbox.moe/8bu6l2.jpg",
  "the-externalized-mind": "https://files.catbox.moe/43whac.jpg",
  "the-measured-mind": "https://files.catbox.moe/mmyr8w.jpg",
  "the-agentic-harness": "https://files.catbox.moe/5d3ysx.jpg",
}
const HERO_FALLBACK = "https://files.catbox.moe/tg8wsl.jpg"

interface EssayMeta {
  slug: string
  title: string
  title_plain?: string
  dek: string
  date: string
  reading_time: number
  published?: boolean
  order?: number
}

const FALLBACK: EssayMeta[] = [
  { slug: "after-the-prd", title: "After the <em>PRD.</em>", dek: "The document that ran software for thirty years just stopped being the unit of work.", date: "2026-04-15", reading_time: 14, published: true, order: 8 },
  { slug: "agents-as-teammates", title: "Agents as <em>teammates</em>, not tools.", dek: "On assigning work to something that doesn't have a Slack avatar, doesn't go home, and still surprises you.", date: "2026-03-12", reading_time: 11, published: true, order: 7 },
  { slug: "code-wizards-to-cosmic-architects", title: "From code wizards to <em>cosmic architects.</em>", dek: "The leverage moved up the stack. What you build now is the system that builds.", date: "2026-03-04", reading_time: 10, published: true, order: 6 },
  { slug: "the-invisible-platform", title: "The invisible <em>platform.</em>", dek: "Five companies, 160 million lives, and one architecture that has to disappear into the floorboards.", date: "2026-02-18", reading_time: 9, published: true, order: 5 },
  { slug: "the-expertise-inversion", title: "The expertise <em>inversion.</em>", dek: "Juniors ship senior output; seniors become editors of machines. The ladder bent.", date: "2026-02-08", reading_time: 9, published: true, order: 4 },
  { slug: "the-combination-premium", title: "The combination <em>premium.</em>", dek: "When generation is free, the value is in the taste that combines the pieces.", date: "2026-02-01", reading_time: 10, published: true, order: 3 },
  { slug: "the-five-breaks", title: "The five <em>breaks.</em>", dek: "Five things that quietly broke in the last six months, and what they broke into.", date: "2026-01-22", reading_time: 9, published: true, order: 2 },
  { slug: "prototypes-vs-specs", title: "Prototypes > <em>specs.</em>", dek: "The working thing ends the meeting. A short argument for showing before telling.", date: "2026-01-12", reading_time: 7, published: true, order: 1 },
]

const pad2 = (n: number | undefined) => (n != null ? String(n).padStart(2, "0") : "—")
const stripEm = (s: string) => (s || "").replace(/<[^>]+>/g, "")
function fmt(date: string): string {
  try {
    const d = new Date(date.length <= 10 ? date + "T12:00:00Z" : date)
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).toUpperCase()
  } catch { return date }
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.bx2{
  --bg-0:#0A0608; --bg-1:#0c0a16; --bg-2:#150e26; --surface:rgba(255,255,255,.03);
  --ink-1:#FBF7EF; --ink-2:rgba(251,247,239,.80); --ink-3:rgba(251,247,239,.52);
  --line:rgba(251,247,239,.10); --line-2:rgba(251,247,239,.18);
  --a:#FF8A24; --c4:#16E0CE; --c2:#2E6BFF; --c1:#FF2E93; --c6:#FFD23E; --neon:#2FD0FF;
  --grad:linear-gradient(100deg,#FF4D3D 0%,#FF7A1A 48%,#FFC23C 100%);
  --wash:radial-gradient(72% 56% at 8% -6%, rgba(255,122,26,.40), transparent 56%),
         radial-gradient(60% 52% at 92% 8%, rgba(255,184,70,.32), transparent 56%),
         radial-gradient(78% 62% at 62% 106%, rgba(255,77,61,.26), transparent 62%),
         radial-gradient(55% 55% at 38% 58%, rgba(22,224,206,.12), transparent 66%);
  --f:'Space Grotesk',sans-serif; --disp:'Unbounded',sans-serif; --mono:'JetBrains Mono',monospace;
  --sp-3:12px; --sp-4:16px; --sp-5:24px; --sp-6:32px; --sp-7:48px; --sp-8:64px; --sp-9:96px; --sp-10:128px;
  --radius:6px; --radius-lg:12px; --maxw:1320px; --gutter:clamp(20px,4vw,64px);
  --ease:cubic-bezier(0.16,1,0.3,1); --lsw:.32em;
  position:relative; width:100%; min-height:100vh; background:var(--bg-0); color:var(--ink-1);
  font-family:var(--f); -webkit-font-smoothing:antialiased; overflow-x:clip;
}
.bx2 *{ box-sizing:border-box; margin:0; padding:0; }
.bx2 a{ color:inherit; text-decoration:none; }
.bx2 .container{ max-width:var(--maxw); margin:0 auto; padding:0 var(--gutter); }
.bx2 .display{ font-family:var(--disp); font-weight:800; text-transform:uppercase; letter-spacing:-.02em; line-height:.9; }
.bx2 .eyebrow{ font-family:var(--mono); font-size:clamp(11px,.78vw,13px); letter-spacing:var(--lsw); text-transform:uppercase; color:var(--ink-2); }

.bx2 .wash{ position:fixed; inset:0; z-index:0; pointer-events:none; background:var(--wash); }
.bx2 .grain{ position:fixed; inset:0; z-index:60; pointer-events:none; opacity:.05; mix-blend-mode:overlay; background-image:repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 2px); }
.bx2 .frame{ position:relative; z-index:1; }

/* NAV — matches the site (cobalt logomark + Unbounded wordmark + mobile hamburger) */
.bx2 .nav{ position:fixed; z-index:50; top:0; left:0; right:0; display:flex; align-items:center; gap:14px; padding:14px 30px; color:#fff; }
.bx2 .nav .logo{ display:inline-flex; align-items:center; gap:11px; font-family:var(--disp); font-weight:800; font-size:16px;
  letter-spacing:-.02em; white-space:nowrap; opacity:1; text-shadow:0 1px 16px rgba(0,0,0,.55); }
.bx2 .nav .logomark{ width:28px; height:28px; border-radius:6px; background:var(--c2); flex:0 0 auto; box-shadow:0 2px 14px rgba(46,107,255,.5); }
.bx2 .nav .sp{ flex:1; }
.bx2 .nav a{ font-size:12px; font-weight:600; letter-spacing:.05em; text-transform:uppercase; white-space:nowrap; opacity:.82;
  transition:opacity .2s, color .2s; cursor:pointer; padding:7px 0; text-shadow:0 1px 14px rgba(0,0,0,.5); }
.bx2 .nav a.logo{ opacity:1; } .bx2 .nav a:hover{ opacity:1; }
.bx2 .nav a .kj{ color:var(--a); font-family:var(--mono); font-size:.92em; letter-spacing:.04em; margin-left:5px; }
.bx2 .burger{ display:none; flex-direction:column; justify-content:center; gap:5px; width:38px; height:38px; padding:9px 7px;
  background:none; border:0; cursor:pointer; z-index:52; }
.bx2 .burger span{ display:block; height:2px; width:100%; background:#fff; border-radius:2px; transition:transform .3s, opacity .2s; box-shadow:0 1px 6px rgba(0,0,0,.5); }
.bx2 .burger.open span:nth-child(1){ transform:translateY(7px) rotate(45deg); }
.bx2 .burger.open span:nth-child(2){ opacity:0; }
.bx2 .burger.open span:nth-child(3){ transform:translateY(-7px) rotate(-45deg); }
.bx2 .mobnav{ position:fixed; top:0; left:0; right:0; z-index:49; min-height:100vh; display:flex; flex-direction:column; gap:2px;
  padding:92px 24px 40px; background:rgba(10,6,8,.98); -webkit-backdrop-filter:blur(16px); backdrop-filter:blur(16px);
  transform:translateY(-102%); pointer-events:none; transition:transform .36s var(--ease); }
.bx2 .mobnav.open{ transform:translateY(0); pointer-events:auto; }
.bx2 .mobnav a{ font-family:var(--disp); font-weight:800; text-transform:uppercase; font-size:30px; letter-spacing:-.01em;
  color:#fff; opacity:.92; padding:16px 0; border-bottom:1px solid rgba(255,255,255,.08); }
.bx2 .mobnav a .kj{ color:var(--a); font-family:var(--mono); font-size:.5em; letter-spacing:.04em; margin-left:10px; vertical-align:middle; }
@media(max-width:640px){ .bx2 .nav a:not(.logo){ display:none; } .bx2 .burger{ display:flex; } .bx2 .nav{ padding:12px 22px; } }

.bx2 .btn{ display:inline-flex; align-items:center; gap:10px; padding:16px 26px; font-family:var(--mono); font-size:12px; letter-spacing:var(--lsw); text-transform:uppercase; border:1px solid var(--line-2); border-radius:var(--radius); color:var(--ink-1); transition:all .18s var(--ease); white-space:nowrap; cursor:pointer; }
.bx2 .btn:hover{ border-color:var(--ink-1); transform:translateY(-1px); }
.bx2 .btn-primary{ background:var(--grad); color:#2a0a00; border:0; font-weight:700; box-shadow:0 8px 30px rgba(255,90,40,.32); }
.bx2 .btn-primary:hover{ filter:brightness(1.05); transform:translateY(-1px); }

.bx2 .hero{ position:relative; min-height:min(900px,100vh); padding-top:var(--sp-7); padding-bottom:var(--sp-9); overflow:hidden; isolation:isolate; }
.bx2 .hero-grid{ position:absolute; inset:0; z-index:-2; background-image:linear-gradient(to right, rgba(251,247,239,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(251,247,239,.05) 1px, transparent 1px); background-size:80px 80px; -webkit-mask-image:radial-gradient(80% 70% at 50% 30%, #000 30%, transparent 90%); mask-image:radial-gradient(80% 70% at 50% 30%, #000 30%, transparent 90%); }
.bx2 .scanlines::after{ content:""; position:absolute; inset:0; pointer-events:none; background:repeating-linear-gradient(to bottom, rgba(255,255,255,.02) 0, rgba(255,255,255,.02) 1px, transparent 1px, transparent 3px); mix-blend-mode:overlay; z-index:1; }
.bx2 .hero-inner{ position:relative; min-height:720px; display:grid; grid-template-columns:1.3fr 1fr; gap:var(--sp-7); align-items:end; padding-top:var(--sp-8); }
.bx2 .hero-topbar{ grid-column:1 / -1; display:flex; justify-content:space-between; align-items:center; gap:var(--sp-5); margin-bottom:auto; padding-top:var(--sp-6); }
.bx2 .pill{ display:inline-flex; align-items:center; gap:10px; padding:8px 14px; border:1px solid var(--line-2); border-radius:100px; font-family:var(--mono); font-size:11px; letter-spacing:var(--lsw); text-transform:uppercase; color:var(--ink-2); background:rgba(255,255,255,.04); }
.bx2 .pill-dot{ width:8px; height:8px; border-radius:50%; background:var(--a); box-shadow:0 0 14px 2px rgba(255,90,40,.85); animation:bxpulse 2s ease-in-out infinite; }
@keyframes bxpulse{ 0%,100%{ opacity:1; transform:scale(1);} 50%{ opacity:.55; transform:scale(.85);} }
.bx2 .hero-left{ align-self:end; min-width:0; }
.bx2 .hero-eyebrow{ display:flex; align-items:center; gap:12px; margin-bottom:var(--sp-5); }
.bx2 .hero-eyebrow .dash{ width:48px; height:3px; background:var(--grad); border-radius:3px; }
.bx2 .hero-title{ font-size:clamp(38px,5.2vw,76px); line-height:.92; margin:0 0 var(--sp-5); letter-spacing:-.03em; }
.bx2 .hero-title .accent{ background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent; display:block; filter:drop-shadow(0 0 28px rgba(255,90,40,.4)); }
.bx2 .hero-title .outline{ color:transparent; -webkit-text-stroke:2px var(--ink-1); display:block; }
.bx2 .hero-sub{ max-width:560px; font-size:18px; line-height:1.45; color:var(--ink-2); margin:0 0 var(--sp-6); }
.bx2 .hero-sub strong{ color:#fff; font-weight:600; }
.bx2 .hero-cta{ display:flex; flex-wrap:wrap; gap:var(--sp-3); margin-bottom:var(--sp-6); }
.bx2 .stats{ display:flex; gap:var(--sp-7); flex-wrap:wrap; padding-top:var(--sp-5); border-top:1px solid var(--line); }
.bx2 .stat-num{ font-family:var(--disp); font-weight:800; font-size:clamp(30px,3.4vw,50px); line-height:.9; color:var(--ink-1); letter-spacing:-.02em; display:block; }
.bx2 .stat-num .unit{ color:var(--a); }
.bx2 .stat-label{ font-family:var(--mono); font-size:10px; letter-spacing:var(--lsw); text-transform:uppercase; color:var(--ink-3); margin-top:6px; display:block; }

.bx2 .hero-right{ align-self:end; }
.bx2 .fcard{ position:relative; border:1px solid var(--line-2); border-radius:var(--radius-lg); padding:var(--sp-5); background:rgba(26,12,6,.5); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); display:flex; flex-direction:column; gap:var(--sp-5); transform-style:preserve-3d; transition:transform .2s var(--ease); box-shadow:0 0 60px rgba(255,90,40,.16); }
.bx2 .fcard-badge{ position:absolute; top:-13px; left:var(--sp-5); background:var(--grad); color:#2a0a00; padding:6px 12px; font-family:var(--mono); font-size:10px; letter-spacing:var(--lsw); text-transform:uppercase; font-weight:700; border-radius:var(--radius); }
.bx2 .fcard-cover{ width:100%; aspect-ratio:16/10; border-radius:var(--radius); overflow:hidden; position:relative; background:linear-gradient(150deg, rgba(255,122,26,.22), rgba(255,77,61,.12) 55%, rgba(21,14,38,.55)); box-shadow:0 20px 60px rgba(0,0,0,.45), 0 0 0 1px var(--line-2), 0 0 44px rgba(255,90,40,.24); }
.bx2 .fcard-cover img{ width:100%; height:100%; object-fit:cover; filter:saturate(1.1) contrast(1.02) brightness(1.04); transition:transform .6s var(--ease); }
.bx2 .fcard:hover .fcard-cover img{ transform:scale(1.04); }
.bx2 .fcard-title{ font-family:var(--disp); font-weight:800; text-transform:uppercase; font-size:24px; line-height:1.04; letter-spacing:-.01em; margin:8px 0 0; color:#fff; }
.bx2 .fcard-title em{ font-style:italic; background:var(--grad); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.bx2 .fcard-meta{ display:grid; grid-template-columns:repeat(3,1fr); gap:var(--sp-3); padding-top:var(--sp-4); border-top:1px solid var(--line); }
.bx2 .fcard-meta dt{ font-family:var(--mono); font-size:10px; letter-spacing:var(--lsw); text-transform:uppercase; color:var(--ink-3); margin-bottom:4px; }
.bx2 .fcard-meta dd{ font-family:var(--mono); font-size:14px; color:var(--ink-1); font-weight:700; }

.bx2 .marquee{ border-top:1px solid var(--line); border-bottom:1px solid var(--line); overflow:hidden; padding:22px 0; background:rgba(10,6,8,.5); position:relative; z-index:3; }
.bx2 .marquee-track{ display:flex; gap:var(--sp-7); align-items:center; animation:bxmarq 42s linear infinite; white-space:nowrap; width:max-content; }
.bx2 .marquee-item{ font-family:var(--disp); font-weight:800; font-size:clamp(28px,3.6vw,56px); text-transform:uppercase; letter-spacing:-.01em; color:var(--ink-1); }
.bx2 .marquee-item.mute{ color:transparent; -webkit-text-stroke:1.5px var(--ink-3); }
.bx2 .marquee-item.acc{ color:var(--a); }
.bx2 .marquee-dot{ color:var(--a); font-size:.5em; }
@keyframes bxmarq{ from{ transform:translateX(0);} to{ transform:translateX(-50%);} }

.bx2 .section-pad{ padding-top:var(--sp-10); padding-bottom:var(--sp-10); }
.bx2 .secheader{ display:flex; justify-content:space-between; align-items:flex-end; gap:var(--sp-6); margin-bottom:var(--sp-7); padding-bottom:var(--sp-5); border-bottom:1px solid var(--line); }
.bx2 .secheader-idx{ font-family:var(--mono); font-size:12px; color:var(--a); letter-spacing:var(--lsw); margin-bottom:14px; display:block; }
.bx2 .secheader h2{ font-family:var(--disp); font-weight:800; font-size:clamp(34px,4.4vw,68px); line-height:.95; letter-spacing:-.02em; text-transform:uppercase; margin:0; max-width:16ch; }
.bx2 .secheader-right{ max-width:360px; color:var(--ink-2); font-size:15px; line-height:1.55; }
.bx2 .grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:var(--sp-5); }
@media(max-width:1100px){ .bx2 .grid{ grid-template-columns:repeat(2,1fr); } }
@media(max-width:560px){ .bx2 .grid{ grid-template-columns:1fr; } }
.bx2 .rel{ display:block; position:relative; overflow:hidden; border-radius:var(--radius-lg); aspect-ratio:4/5; background:linear-gradient(155deg, rgba(255,122,26,.22) 0%, rgba(255,77,61,.12) 52%, rgba(21,14,38,.6) 100%); border:1px solid var(--line-2); transition:transform .4s var(--ease), border-color .3s; cursor:pointer; box-shadow:inset 0 -72px 90px -42px rgba(255,90,40,.34); }
.bx2 .rel:hover{ transform:translateY(-6px); border-color:var(--a); }
.bx2 .rel-img{ position:absolute; inset:0; background-size:cover; background-position:center; filter:saturate(1.1) contrast(1.02) brightness(1.04); transition:transform .7s var(--ease), filter .4s; }
.bx2 .rel:hover .rel-img{ transform:scale(1.08); filter:saturate(1.2) brightness(1.06); }
.bx2 .rel-scrim{ position:absolute; inset:0; background:linear-gradient(180deg, transparent 26%, rgba(10,6,8,.9) 100%); }
.bx2 .rel-meta{ position:absolute; left:0; right:0; bottom:0; padding:var(--sp-5); z-index:2; }
.bx2 .rel-num{ font-family:var(--mono); font-size:10px; letter-spacing:var(--lsw); text-transform:uppercase; color:var(--a); margin-bottom:10px; display:block; }
.bx2 .rel-title{ font-family:var(--disp); font-weight:800; font-size:21px; line-height:1.02; letter-spacing:-.01em; text-transform:uppercase; margin:0 0 8px; color:#fff; }
.bx2 .rel-title em{ font-style:italic; color:var(--a); }
.bx2 .rel-tag{ font-family:var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--ink-2); }
.bx2 .rel-hover{ position:absolute; top:var(--sp-4); right:var(--sp-4); width:44px; height:44px; border-radius:50%; background:var(--grad); color:#2a0a00; display:grid; place-items:center; opacity:0; transform:translateY(-8px); transition:all .3s var(--ease); z-index:2; font-weight:700; }
.bx2 .rel:hover .rel-hover{ opacity:1; transform:none; }

.bx2 .foot{ border-top:1px solid var(--line); padding:var(--sp-9) var(--gutter) var(--sp-8); text-align:center; }
.bx2 .wordmark{ font-family:var(--disp); font-weight:800; text-transform:uppercase; letter-spacing:-.02em; font-size:calc(clamp(40px,12vw,150px)); line-height:.86; background:var(--grad); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; filter:drop-shadow(0 0 40px rgba(255,90,40,.28)); }
.bx2 .foot-line{ margin-top:24px; font-family:var(--mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-3); }

@media(max-width:1000px){
  .bx2 .hero-inner{ grid-template-columns:1fr; gap:var(--sp-6); align-items:start; }
  .bx2 .hero-right{ align-self:stretch; }
  .bx2 .hero-title{ font-size:clamp(40px,11vw,72px); }
  .bx2 .secheader{ flex-direction:column; align-items:flex-start; }
}
@media(prefers-reduced-motion:reduce){ .bx2 .marquee-track, .bx2 .pill-dot{ animation:none; } .bx2 .mobnav{ transition:none; } }
`

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function EssaysIndex(props: any) {
  const [essays, setEssays] = useState<EssayMeta[]>(FALLBACK)
  const [menuOpen, setMenuOpen] = useState(false)
  const cardRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const r = await fetch(ESSAYS_JSON_URL, { cache: "no-store" })
        if (!r.ok) throw new Error("HTTP " + r.status)
        const data = await r.json()
        if (cancelled) return
        const items: EssayMeta[] = Array.isArray(data && data.essays) ? data.essays : []
        const pub = items.filter((e) => e.published !== false).sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
        if (pub.length > 0) setEssays(pub)
      } catch (e) {}
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = cardRef.current
    if (!el) return
    const onMove = (e: any) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = "perspective(1200px) rotateY(" + (px * 5).toFixed(2) + "deg) rotateX(" + (-py * 5).toFixed(2) + "deg)"
    }
    const onLeave = () => { el.style.transform = "" }
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave) }
  }, [essays])

  const hardNav = (href: string) => (ev: any) => {
    if (ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return
    ev.preventDefault()
    if (typeof window !== "undefined") window.location.assign(href)
  }

  const navClose = (href: string) => (ev: any) => {
    setMenuOpen(false)
    hardNav(href)(ev)
  }

  const featured = essays[0]
  const totalMin = essays.reduce((s, e) => s + (e.reading_time || 0), 0)
  const marqueeItems = essays.slice(0, 6).map((e) => stripEm(e.title).replace(/\.$/, ""))

  return (
    <div className="bx2">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wash" />
      <div className="grain" />
      <div className="frame">
      <nav className="nav">
        <a className="logo" href="/" rel="external" onClick={hardNav("/")}><span className="logomark" />PHIL MORA</a>
        <span className="sp" />
        <a href="/" rel="external" onClick={hardNav("/")}>Home</a>
        <a href="/essays" rel="external" onClick={hardNav("/essays")}>Dispatches</a>
        <a href="/the-build" rel="external" onClick={hardNav("/the-build")}>Shinka <span className="kj">進化</span></a>
        <a href="/#connect" rel="external" onClick={hardNav("/#connect")}>Connect</a>
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
        <a href="/" rel="external" onClick={navClose("/")}>Home</a>
        <a href="/essays" rel="external" onClick={navClose("/essays")}>Dispatches</a>
        <a href="/the-build" rel="external" onClick={navClose("/the-build")}>Shinka <span className="kj">進化</span></a>
        <a href="/#connect" rel="external" onClick={navClose("/#connect")}>Connect</a>
      </div>

      <section className="hero scanlines">
        <div className="hero-grid" />
        <div className="container hero-inner">
          <div className="hero-topbar">
            <span className="pill"><span className="pill-dot" /> Live · Dispatches</span>
            <span className="eyebrow">Phil Mora · 2026</span>
          </div>

          <div className="hero-left">
            <div className="hero-eyebrow"><span className="dash" /><span className="eyebrow">The engine ⇄ the muse</span></div>
            <h1 className="display hero-title">
              <span className="accent">Dispatches.</span>
              <span className="outline">From the engine.</span>
            </h1>
            <p className="hero-sub">
              Essays on building in the agentic era: software, agents, and the taste that combines them. <strong>{essays.length} dispatches</strong>, written between shipping, not in theory.
            </p>
            <div className="hero-cta">
              {featured ? (
                <a className="btn btn-primary btn-lg" href={"/essays/" + featured.slug} rel="external" onClick={hardNav("/essays/" + featured.slug)}>▶ Read the latest</a>
              ) : null}
              <a className="btn btn-lg" href="https://github.com/philmora" target="_blank" rel="noopener">github.com/philmora</a>
            </div>
            <div className="stats">
              <div><span className="stat-num">{pad2(essays.length)}</span><span className="stat-label">Dispatches</span></div>
              <div><span className="stat-num">{totalMin}<span className="unit"> min</span></span><span className="stat-label">Total reading</span></div>
              <div><span className="stat-num">2026</span><span className="stat-label">Active since</span></div>
            </div>
          </div>

          <div className="hero-right">
            {featured ? (
              <a className="fcard" ref={cardRef} href={"/essays/" + featured.slug} rel="external" onClick={hardNav("/essays/" + featured.slug)}>
                <span className="fcard-badge">Latest dispatch</span>
                <div className="fcard-cover"><img src={HERO[featured.slug] || HERO_FALLBACK} alt="" /></div>
                <div>
                  <span className="eyebrow">The engine · philmora</span>
                  <h3 className="fcard-title" dangerouslySetInnerHTML={{ __html: featured.title }} />
                </div>
                <dl className="fcard-meta">
                  <div><dt>Filed</dt><dd>{fmt(featured.date)}</dd></div>
                  <div><dt>Read</dt><dd>{featured.reading_time}m</dd></div>
                  <div><dt>No.</dt><dd>{pad2(featured.order)}</dd></div>
                </dl>
                <span className="btn">Read essay →</span>
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <div className="marquee">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, rep) => (
            <span key={rep} style={{ display: "flex", gap: "48px", alignItems: "center" }}>
              {marqueeItems.map((t, i) => (
                <span key={i} style={{ display: "flex", gap: "48px", alignItems: "center" }}>
                  <span className={"marquee-item" + (i % 2 ? " mute" : " acc")}>{t}</span>
                  <span className="marquee-dot">✦</span>
                </span>
              ))}
              <span className="marquee-item mute">Engine ⇄ Muse</span>
              <span className="marquee-dot">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section className="section-pad">
        <div className="container">
          <div className="secheader">
            <div>
              <span className="secheader-idx">§ 01 · ALL DISPATCHES</span>
              <h2>Every dispatch.<br />No filler.</h2>
            </div>
            <div className="secheader-right">
              {essays.length} essays on the collision of software, agents, and taste. A record crate, not a content calendar.
            </div>
          </div>

          <div className="grid">
            {essays.map((e) => {
              const href = "/essays/" + e.slug
              return (
                <a key={e.slug} className="rel" href={href} rel="external" onClick={hardNav(href)}>
                  <div className="rel-img" style={{ backgroundImage: "url(" + (HERO[e.slug] || HERO_FALLBACK) + ")" }} />
                  <div className="rel-scrim" />
                  <div className="rel-hover" aria-hidden>↗</div>
                  <div className="rel-meta">
                    <span className="rel-num">№{pad2(e.order)} · Essay · {fmt(e.date)}</span>
                    <h3 className="rel-title" dangerouslySetInnerHTML={{ __html: e.title }} />
                    <span className="rel-tag">{e.reading_time} min read</span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wordmark">PHIL MORA</div>
        <div className="foot-line">© 2026 Phil Mora · Northern Colorado · 5,000 ft</div>
      </footer>
      </div>
    </div>
  )
}

addPropertyControls(EssaysIndex, {})
