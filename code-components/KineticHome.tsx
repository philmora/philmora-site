import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

const WORDS = ["BUILD", "SHIP", "WRITE", "PLAY", "MAKE"]

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.km{
  --ink:#060509; --paper:#F6F3EC;
  --c1:#FF2E93; --c2:#2E6BFF; --c3:#9B4DFF; --c4:#16E0CE; --c5:#FF7A1A; --c6:#FFD23E;
  --neon:#2FD0FF;
  --f:'Space Grotesk',sans-serif; --disp:'Unbounded',sans-serif; --mono:'JetBrains Mono',monospace;
  --disp-w:800; --disp-tr:-.03em; --disp-tt:uppercase; --disp-lh:.98; --disp-sc:0.82;
  position:relative; width:100%; background:var(--ink); color:var(--paper);
  font-family:var(--f); -webkit-font-smoothing:antialiased; overflow-x:clip;
}
.km *{ box-sizing:border-box; margin:0; padding:0; }
.km a{ color:inherit; text-decoration:none; }

.km .grain{ position:fixed; inset:0; z-index:30; pointer-events:none; opacity:.05; mix-blend-mode:overlay;
  background-image:repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 2px); }
.km .topscrim{ position:fixed; top:0; left:0; right:0; height:84px; z-index:35; pointer-events:none;
  background:linear-gradient(180deg, rgba(6,5,9,.5), rgba(6,5,9,0)); }

.km .nav{ position:fixed; z-index:40; top:0; left:0; right:0; display:flex; align-items:center; gap:14px;
  padding:14px 30px; color:#fff; }
.km .nav .logo{ display:inline-flex; align-items:center; gap:11px; font-family:var(--disp); font-weight:800;
  font-size:16px; letter-spacing:-.02em; white-space:nowrap; opacity:1; cursor:pointer; padding:6px 0;
  text-shadow:0 1px 16px rgba(0,0,0,.55); }
.km .nav .logomark{ width:28px; height:28px; border-radius:6px; background:var(--c2); flex:0 0 auto;
  box-shadow:0 2px 14px rgba(46,107,255,.5); }
.km .nav .sp{ flex:1; }
.km .nav a{ font-size:12px; font-weight:600; letter-spacing:.05em; text-transform:uppercase; white-space:nowrap;
  opacity:.82; transition:opacity .2s, color .2s; cursor:pointer; padding:7px 0; text-shadow:0 1px 14px rgba(0,0,0,.5); }
.km .nav a:hover{ opacity:1; }
.km .nav a.active{ opacity:1; color:var(--c5); }
.km .nav a .kj{ color:var(--c5); font-family:var(--mono); font-size:.92em; letter-spacing:.04em; margin-left:5px; }

/* Mobile hamburger + slide-down menu */
.km .burger{ display:none; flex-direction:column; justify-content:center; gap:5px; width:38px; height:38px; padding:9px 7px;
  background:none; border:0; cursor:pointer; z-index:42; }
.km .burger span{ display:block; height:2px; width:100%; background:#fff; border-radius:2px; transition:transform .3s, opacity .2s;
  box-shadow:0 1px 6px rgba(0,0,0,.5); }
.km .burger.open span:nth-child(1){ transform:translateY(7px) rotate(45deg); }
.km .burger.open span:nth-child(2){ opacity:0; }
.km .burger.open span:nth-child(3){ transform:translateY(-7px) rotate(-45deg); }
.km .mobnav{ position:fixed; top:0; left:0; right:0; z-index:39; min-height:100vh; display:flex; flex-direction:column; gap:2px;
  padding:92px 24px 40px; background:rgba(6,5,9,.98); -webkit-backdrop-filter:blur(16px); backdrop-filter:blur(16px);
  transform:translateY(-102%); pointer-events:none; transition:transform .36s cubic-bezier(0.16,1,0.3,1); }
.km .mobnav.open{ transform:translateY(0); pointer-events:auto; }
.km .mobnav a{ font-family:var(--disp); font-weight:800; text-transform:uppercase; font-size:30px; letter-spacing:-.01em;
  color:#fff; opacity:.92; padding:16px 0; border-bottom:1px solid rgba(255,255,255,.08); }
.km .mobnav a .kj{ color:var(--c5); font-family:var(--mono); font-size:.5em; letter-spacing:.04em; margin-left:10px; vertical-align:middle; }

@media(max-width:640px){ .km .nav a:not(.logo){ display:none; } .km .burger{ display:flex; } .km .nav{ gap:12px; padding:12px 22px; }
  .km .nav .logo{ font-size:15px; } .km .nav .logomark{ width:24px; height:24px; } }

.km .panel{ position:relative; z-index:5; min-height:100vh; display:flex; flex-direction:column; justify-content:center;
  padding:0 5.5vw; overflow:hidden; }
@media(max-width:640px){ .km .panel{ padding-top:78px; padding-bottom:48px; } }
.km .media{ position:absolute; inset:0; z-index:-2; will-change:transform; }
.km .media img, .km .media video{ width:100%; height:100%; object-fit:cover; display:block; }
.km .pmedia{ transform:scale(1.22); }
.km .scrim{ position:absolute; inset:0; z-index:-1; }
.km .content{ position:relative; z-index:2; width:100%; }

.km .eyebrow{ font-size:13px; font-weight:600; letter-spacing:.24em; text-transform:uppercase; opacity:.9;
  margin-bottom:3vh; display:flex; align-items:center; gap:13px; }
.km .eyebrow .dot{ width:9px; height:9px; border-radius:50%; background:var(--c4); box-shadow:0 0 12px var(--c4); flex:0 0 auto; }
.km .eyebrow .dot.magenta{ background:var(--c1); box-shadow:0 0 12px var(--c1); }

.km .giant{ font-family:var(--disp); font-weight:var(--disp-w); text-transform:var(--disp-tt);
  letter-spacing:var(--disp-tr); line-height:var(--disp-lh); }
.km .support{ font-size:clamp(15px,1.7vw,20px); line-height:1.55; max-width:48ch; margin-top:3.5vh; opacity:.94; }
.km .support strong{ font-weight:600; color:#fff; }

.km .outline{ color:transparent; -webkit-text-fill-color:transparent; -webkit-text-stroke-color:#fff;
  text-shadow:0 2px 26px rgba(0,0,0,.55); }
.km .hero .outline{ -webkit-text-stroke-width:1.7px; }
.km #now .outline{ -webkit-text-stroke-width:1.5px; }
.km .giant .ac, .km .giant.outline .swap{ color:var(--c5); -webkit-text-fill-color:var(--c5); -webkit-text-stroke:0; }

.km .hero .giant{ font-size:calc(clamp(34px,7vw,104px) * var(--disp-sc)); }
.km .hero .swap{ display:inline-block; transition:opacity .3s, transform .3s; }
@media(max-width:640px){ .km .hero .giant{ font-size:54px; line-height:.96; } .km .hero .support{ font-size:16px; } }

.km .panel.sec .giant{ font-size:calc(clamp(38px,7.4vw,108px) * var(--disp-sc)); color:#fff; }
.km #work .giant.sm{ font-size:calc(clamp(38px,7.4vw,108px) * var(--disp-sc)); color:transparent; -webkit-text-fill-color:transparent;
  -webkit-text-stroke:1.8px #fff; text-shadow:0 0 16px rgba(47,208,255,.55), 0 0 44px rgba(47,208,255,.32), 0 2px 30px rgba(0,0,0,.5); }
.km #connect .giant em{ font-style:italic; color:var(--c5); -webkit-text-fill-color:var(--c5);
  text-shadow:0 0 30px rgba(255,122,26,.6); }
@media(max-width:640px){ .km .panel.sec .giant, .km #work .giant.sm{ font-size:36px; } }

.km .hero .scrim{ background:linear-gradient(180deg, rgba(6,5,9,.32) 0%, rgba(6,5,9,.34) 55%, rgba(6,5,9,.72) 100%); }
.km .tint-thesis .scrim{ background:linear-gradient(95deg, rgba(6,5,9,.9) 0%, rgba(6,5,9,.78) 32%, rgba(6,5,9,.4) 60%, rgba(6,5,9,.55) 100%), linear-gradient(180deg, rgba(6,5,9,.3), rgba(6,5,9,.2) 40%, rgba(6,5,9,.7)); }
.km .tint-violet .scrim{ background:linear-gradient(110deg, rgba(6,5,9,.84) 38%, rgba(155,77,255,.5)); }
.km .tint-magenta .scrim{ background:linear-gradient(180deg, rgba(255,46,147,.32), rgba(6,5,9,.8)); }
.km .tint-dark .scrim{ background:linear-gradient(180deg, rgba(22,224,206,.18), rgba(6,5,9,.88)); }
.km #now .support{ max-width:42ch; }

.km .figs{ display:flex; gap:6vw; margin-top:4vh; flex-wrap:wrap; }
.km .figs .n{ font-family:var(--disp); font-weight:var(--disp-w); font-size:calc(clamp(38px,7vw,88px) * var(--disp-sc));
  line-height:.85; letter-spacing:var(--disp-tr); background:linear-gradient(96deg,var(--c4),var(--c2));
  -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.km .figs .k{ font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:.06em; opacity:.85; margin-top:.5em; }
.km .career{ display:flex; flex-wrap:wrap; align-items:center; gap:8px 12px; margin-top:3.5vh; font-family:var(--f);
  font-size:12.5px; letter-spacing:.06em; text-transform:uppercase; color:rgba(255,255,255,.66); }
.km .career b{ color:#fff; font-weight:600; }
.km .career .sep{ opacity:.4; }
.km .career .cur b{ color:var(--c5); }

.km .feeds{ display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:3.5vh; max-width:1060px; }
@media(max-width:760px){ .km .feeds{ grid-template-columns:1fr; } }
.km .fcard{ display:flex; flex-direction:column; border:1px solid rgba(255,255,255,.3); border-radius:18px; overflow:hidden;
  background:rgba(6,5,9,.32); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); transition:transform .22s, border-color .22s; }
.km .fcard:hover{ transform:translateY(-5px); border-color:rgba(255,255,255,.62); }
.km .fcard .fcimg{ position:relative; aspect-ratio:16/9; overflow:hidden; background:rgba(255,255,255,.04); }
.km .fcard .fcimg img{ width:100%; height:100%; object-fit:cover; transition:transform .5s; display:block; }
.km .fcard:hover .fcimg img{ transform:scale(1.05); }
.km .fcard .fcbody{ padding:22px 24px 24px; display:flex; flex-direction:column; flex:1; }
.km .fcard .fck{ font-family:var(--f); font-size:10.5px; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
  display:flex; align-items:center; gap:8px; }
.km .fcard .fck::before{ content:""; width:7px; height:7px; border-radius:50%; }
.km .fcard.eng .fck{ color:var(--c5); } .km .fcard.eng .fck::before{ background:var(--c5); box-shadow:0 0 10px var(--c5); }
.km .fcard.muse .fck{ color:var(--c1); } .km .fcard.muse .fck::before{ background:var(--c1); box-shadow:0 0 10px var(--c1); }
.km .fcard .fct{ font-family:var(--disp); font-weight:var(--disp-w); text-transform:uppercase; font-size:clamp(20px,1.95vw,28px);
  line-height:1.06; margin:12px 0 12px; letter-spacing:-.01em; color:#fff; }
.km .fcard .fct em{ font-style:italic; }
.km .fcard.eng .fct em{ color:var(--c5); } .km .fcard.muse .fct em{ color:var(--c1); }
.km .fcard .fcs{ font-size:13.5px; line-height:1.62; color:rgba(255,255,255,.72); }
.km .fcard .fcm{ display:flex; align-items:center; gap:12px; margin-top:auto; padding-top:18px; font-family:var(--f);
  font-size:11px; letter-spacing:.05em; text-transform:uppercase; color:rgba(255,255,255,.5); }
.km .fcard .fcgo{ margin-left:auto; font-weight:700; transition:transform .18s; }
.km .fcard.eng .fcgo{ color:var(--c5); } .km .fcard.muse .fcgo{ color:var(--c1); }
.km .fcard:hover .fcgo{ transform:translateX(4px); }

.km .alllink{ display:inline-flex; align-items:center; gap:8px; margin-top:26px; font-family:var(--f); font-size:13px;
  font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--c5); transition:transform .18s, opacity .18s; opacity:.9; }
.km .alllink:hover{ transform:translateX(4px); opacity:1; }

.km .cta{ display:inline-block; margin-top:4vh; font-family:var(--disp); font-weight:var(--disp-w); text-transform:uppercase;
  letter-spacing:-.02em; line-height:1; font-size:clamp(20px,1.8vw,24px); color:#fff;
  text-shadow:0 2px 26px rgba(0,0,0,.5); transition:transform .2s, color .2s; }
.km .cta:hover{ color:var(--c1); transform:translateX(6px); }

/* CONNECT · centered CTA — full-opacity media, gentler zoom (less cropped), scrim from Connect Dim prop */
.km #connect{ text-align:center; align-items:center; }
.km #connect .media{ transform:scale(1.06); }
.km #connect .connect-vid{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 30%;
  opacity:0; transition:opacity .9s ease; pointer-events:none; }
.km #connect .connect-vid.on{ opacity:1; }

.km #connect .ccore{ position:relative; z-index:2; display:flex; flex-direction:column; align-items:center; }
.km #connect .ceye{ font-family:var(--mono); font-size:12px; letter-spacing:.28em; text-transform:uppercase;
  color:var(--c4); margin-bottom:1.6vh; white-space:nowrap; }

/* CONNECT · github pill — Apple "Liquid Glass". Base = near-clear fill + blur (Safari/iOS fallback) + single specular
   highlight + bright rim. In Chromium the cpill effect swaps backdrop-filter to a canvas-built displacement map
   (#pmGlassLens) for true edge refraction + chromatic aberration. Near-pure transparency: fill at 0.8%. */
.km .cpill{ position:relative; display:inline-flex; align-items:center; margin-top:4.4vh; padding:20px 40px; border-radius:50px;
  color:#fff; font-family:var(--f); font-size:17px; font-weight:600; overflow:hidden;
  background:rgba(255,255,255,.008);
  -webkit-backdrop-filter:blur(4px) saturate(1.7) brightness(1.1);
  backdrop-filter:blur(4px) saturate(1.7) brightness(1.1);
  border:1px solid rgba(255,255,255,.42);
  box-shadow:inset 0 1.5px .5px rgba(255,255,255,.85), 0 12px 36px rgba(0,0,0,.42);
  text-shadow:0 1px 8px rgba(0,0,0,.5); transition:transform .22s, box-shadow .22s; }
.km .cpill::before{ content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none; z-index:1;
  background:radial-gradient(150% 90% at 27% -18%, rgba(255,255,255,.2), rgba(255,255,255,0) 50%); }
.km .cpill .lbl{ position:relative; z-index:2; display:inline-flex; align-items:center; gap:14px; }
.km .cpill .ar{ transition:transform .2s; }
.km .cpill:hover{ transform:translateY(-3px) scale(1.02);
  box-shadow:inset 0 1.5px .5px rgba(255,255,255,.95), 0 18px 48px rgba(0,0,0,.46), 0 10px 40px rgba(255,122,26,.28); }
.km .cpill:hover .ar{ transform:translateX(4px); }
.km .calt{ margin-top:2.4vh; display:flex; gap:26px; justify-content:center; flex-wrap:wrap; font-family:var(--mono);
  font-size:13px; color:rgba(255,255,255,.6); }
.km .calt a{ transition:.2s; padding:6px 4px; } .km .calt a:hover{ color:#fff; }

.km .scrollcue{ position:absolute; bottom:3.5vh; left:5.5vw; font-size:11px; font-weight:600; letter-spacing:.16em;
  text-transform:uppercase; opacity:.7; z-index:6; }
.km .cfoot{ position:absolute; bottom:3.5vh; left:5.5vw; font-family:var(--mono); font-size:11px; letter-spacing:.1em;
  text-transform:uppercase; color:rgba(255,255,255,.42); z-index:6; }
.km #connect .cfoot{ left:0; right:0; text-align:center; }

@media (prefers-reduced-motion:reduce){ .km .hero .swap{ transition:none; } .km .mobnav{ transition:none; } }
`

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function KineticHome(props: any) {
  const {
    heroBg = { src: "https://files.catbox.moe/7udyh5.jpg" },
    allInBg = { src: "https://files.catbox.moe/ctpk4k.jpg" },
    dispatchesBg = { src: "https://files.catbox.moe/bgcvyk.jpg" },
    cardEngineImg = { src: "https://files.catbox.moe/l8tl4v.jpg" },
    cardMuseImg = { src: "https://files.catbox.moe/l37naq.jpg" },
    studioBg = { src: "https://files.catbox.moe/nmfual.jpg" },
    connectBg = { src: "https://files.catbox.moe/ryykge.jpg" },
    allInVideo = "https://files.catbox.moe/6i8wue.mp4",
    allInUseVideo = true,
    connectVideo = "https://files.catbox.moe/rq4too.mp4",
    connectDim = 0.46,
  } = props

  const [wi, setWi] = useState(0)
  const [show, setShow] = useState(true)
  const [active, setActive] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  const topRef = useRef<any>(null)
  const nowRef = useRef<any>(null)
  const workRef = useRef<any>(null)
  const studioRef = useRef<any>(null)
  const connectRef = useRef<any>(null)
  const heroMediaRef = useRef<any>(null)
  const allInMediaRef = useRef<any>(null)
  const allInVidRef = useRef<any>(null)
  const dispatchesMediaRef = useRef<any>(null)
  const studioMediaRef = useRef<any>(null)
  const connectMediaRef = useRef<any>(null)
  const connectVidRef = useRef<any>(null)
  const cpillRef = useRef<any>(null)
  const glassSvgRef = useRef<any>(null)

  const reduced = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // Hero word cycler
  useEffect(() => {
    if (reduced()) return
    const id = window.setInterval(() => {
      setShow(false)
      window.setTimeout(() => {
        setWi((w) => (w + 1) % WORDS.length)
        setShow(true)
      }, 300)
    }, 1700)
    return () => window.clearInterval(id)
  }, [])

  // Nav scroll-spy
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return
    const map: [string, any][] = [
      ["now", nowRef],
      ["work", workRef],
      ["studio", studioRef],
      ["connect", connectRef],
    ]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const found = map.find(([, r]) => r.current === e.target)
            if (found) setActive(found[0])
          }
        })
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    )
    map.forEach(([, r]) => {
      if (r.current) io.observe(r.current)
    })
    return () => io.disconnect()
  }, [])

  // ALL IN: force muted inline autoplay (mobile browsers ignore the bare autoplay attribute)
  useEffect(() => {
    if (typeof window === "undefined") return
    const v = allInVidRef.current
    if (!v) return
    v.muted = true
    v.setAttribute("muted", "")
    v.playsInline = true
    const tryPlay = () => {
      try {
        const p = v.play()
        if (p && typeof p.catch === "function") p.catch(() => {})
      } catch (e) {}
    }
    tryPlay()
    const onGesture = () => tryPlay()
    window.addEventListener("touchstart", onGesture, { passive: true })
    window.addEventListener("pointerdown", onGesture)
    let io: any = null
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) tryPlay() }),
        { threshold: 0.15 }
      )
      io.observe(v)
    }
    return () => {
      window.removeEventListener("touchstart", onGesture)
      window.removeEventListener("pointerdown", onGesture)
      if (io) io.disconnect()
    }
  }, [allInVideo, allInUseVideo])

  // Scroll-depth parallax on all panel media (Connect uses a gentler zoom + drift so it reads less cropped)
  useEffect(() => {
    if (reduced() || typeof window === "undefined") return
    const items = [heroMediaRef, allInMediaRef, dispatchesMediaRef, studioMediaRef, connectMediaRef]
    let ticking = false
    const update = () => {
      ticking = false
      const vh = window.innerHeight || 1
      items.forEach((r) => {
        const m = r.current
        if (!m || !m.parentElement) return
        const rect = m.parentElement.getBoundingClientRect()
        const prog = (rect.top + rect.height / 2 - vh / 2) / vh
        if (r === connectMediaRef) {
          m.style.transform = "translate3d(0," + (prog * -2.5).toFixed(2) + "%,0) scale(1.06)"
        } else {
          m.style.transform = "translate3d(0," + (prog * -9).toFixed(2) + "%,0) scale(1.22)"
        }
      })
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(update)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  // Connect: background video, lazy-loaded only as it nears view (no bandwidth contention with ALL IN at the top)
  useEffect(() => {
    if (typeof window === "undefined") return
    const v = connectVidRef.current
    if (!v || !connectVideo) return
    const rm = window.matchMedia("(prefers-reduced-motion:reduce)")
    v.muted = true
    v.setAttribute("muted", "")
    v.playsInline = true
    const start = () => {
      if (rm.matches) { v.pause(); v.classList.remove("on"); return }
      if (!v.src) v.src = connectVideo
      const p = v.play()
      if (p && typeof p.then === "function") p.then(() => v.classList.add("on")).catch(() => {})
      else v.classList.add("on")
    }
    let io: any = null
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) start() }),
        { threshold: 0, rootMargin: "500px 0px" }
      )
      io.observe(v)
    } else {
      start()
    }
    const onGesture = () => { if (v.src) start() }
    window.addEventListener("touchstart", onGesture, { passive: true })
    return () => {
      window.removeEventListener("touchstart", onGesture)
      if (io) io.disconnect()
    }
  }, [connectVideo])

  // CONNECT github pill — Apple "Liquid Glass" true refraction (Chromium only; Safari/iOS keep the CSS blur fallback).
  // Builds a canvas displacement map sized to the pill (neutral-gray center, R/B channel ramps at the edges),
  // then a 3-pass chromatic-aberration SVG filter, and swaps backdrop-filter to url(#pmGlassLens).
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return
    const el = cpillRef.current
    const svg = glassSvgRef.current
    if (!el || !svg) return
    if (!/Chrome\//.test(navigator.userAgent || "")) return

    const FILTER_ID = "pmGlassLens"
    const SCALE = -100
    const AB = [0, 10, 20]

    const buildMap = (w: number, h: number, radius: number) => {
      const maxD = Math.max(Math.abs(SCALE) * 0.5, 20)
      const padX = Math.ceil(maxD), padY = Math.ceil(maxD)
      const totalW = w + padX * 2, totalH = h + padY * 2
      const cv = document.createElement("canvas")
      cv.width = totalW
      cv.height = totalH
      const ctx: any = cv.getContext("2d")
      if (!ctx) return null
      const rrect = (x: number, y: number, ww: number, hh: number, r: number) => {
        ctx.beginPath()
        if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, ww, hh, r)
        else ctx.rect(x, y, ww, hh)
      }
      ctx.fillStyle = "rgb(128,128,128)"
      ctx.fillRect(0, 0, totalW, totalH)
      const ox = padX, oy = padY
      ctx.save()
      rrect(ox, oy, w, h, radius)
      ctx.clip()
      ctx.fillStyle = "#000000"
      ctx.fillRect(ox, oy, w, h)
      const rg = ctx.createLinearGradient(ox + w, oy, ox, oy)
      rg.addColorStop(0, "#000000")
      rg.addColorStop(1, "#ff0000")
      ctx.fillStyle = rg
      ctx.fillRect(ox, oy, w, h)
      ctx.globalCompositeOperation = "difference"
      const bg = ctx.createLinearGradient(ox, oy, ox, oy + h)
      bg.addColorStop(0, "#000000")
      bg.addColorStop(1, "#0000ff")
      ctx.fillStyle = bg
      ctx.fillRect(ox, oy, w, h)
      ctx.globalCompositeOperation = "source-over"
      const borderPx = Math.min(w, h) * 0.035
      ctx.filter = "blur(11px)"
      ctx.fillStyle = "hsla(0,0%,50%,0.93)"
      rrect(ox + borderPx, oy + borderPx, w - borderPx * 2, h - borderPx * 2, radius)
      ctx.fill()
      ctx.restore()
      return { uri: cv.toDataURL(), padX, padY, totalW, totalH }
    }

    const build = () => {
      const r = el.getBoundingClientRect()
      const w = Math.round(r.width), h = Math.round(r.height)
      if (!w || !h) return
      const m = buildMap(w, h, h / 2)
      if (!m) return
      const NS = "http://www.w3.org/2000/svg"
      const f = document.createElementNS(NS, "filter")
      f.setAttribute("id", FILTER_ID)
      f.setAttribute("color-interpolation-filters", "sRGB")
      f.setAttribute("x", "-50%")
      f.setAttribute("y", "-50%")
      f.setAttribute("width", "200%")
      f.setAttribute("height", "200%")
      f.innerHTML =
        '<feImage href="' + m.uri + '" x="' + (-m.padX) + '" y="' + (-m.padY) + '" width="' + m.totalW + '" height="' + m.totalH + '" preserveAspectRatio="none" result="map"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale="' + (SCALE + AB[0]) + '" result="dr"/>' +
        '<feColorMatrix in="dr" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cr"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale="' + (SCALE + AB[1]) + '" result="dg"/>' +
        '<feColorMatrix in="dg" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cg"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale="' + (SCALE + AB[2]) + '" result="db"/>' +
        '<feColorMatrix in="db" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cb"/>' +
        '<feBlend in="cr" in2="cg" mode="screen" result="rg"/>' +
        '<feBlend in="rg" in2="cb" mode="screen"/>'
      svg.innerHTML = ""
      svg.appendChild(f)
      el.style.setProperty("backdrop-filter", "url(#" + FILTER_ID + ") saturate(1.5) brightness(1.08)")
      el.style.setProperty("-webkit-backdrop-filter", "url(#" + FILTER_ID + ") saturate(1.5) brightness(1.08)")
    }

    build()
    const fonts: any = (document as any).fonts
    if (fonts && fonts.ready && typeof fonts.ready.then === "function") fonts.ready.then(build)
    let ro: any = null
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(build)
      ro.observe(el)
    }
    window.addEventListener("resize", build)
    return () => {
      if (ro) ro.disconnect()
      window.removeEventListener("resize", build)
    }
  }, [])

  const go = (ref: any) => (e: any) => {
    if (e && e.preventDefault) e.preventDefault()
    const el = ref.current
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" })
    }
  }

  const goClose = (ref: any) => (e: any) => {
    setMenuOpen(false)
    go(ref)(e)
  }

  const cls = (id: string, opt: boolean) =>
    (opt ? "opt" : "") + (active === id ? " active" : "")

  const _dC = Math.max(0.2, Math.min(0.85, Number(connectDim) || 0.46))
  const _dE = Math.min(0.95, _dC + 0.33)
  const connectScrim =
    "radial-gradient(120% 90% at 50% 47%, rgba(6,5,9," + _dC.toFixed(2) + "), rgba(6,5,9," + _dE.toFixed(2) + "))"

  return (
    <div className="km">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="grain" />
      <div className="topscrim" />

      {/* Liquid-glass refraction filter — populated at runtime (Chromium) by the cpill effect; Safari falls back to CSS blur */}
      <svg ref={glassSvgRef} width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" />

      <nav className="nav">
        <a className="logo" href="#top" onClick={go(topRef)}><span className="logomark" />PHIL MORA</a>
        <span className="sp" />
        <a className={cls("now", true)} href="#now" onClick={go(nowRef)}>All in</a>
        <a className={cls("work", false)} href="/essays">Dispatches</a>
        <a href="/the-build">Shinka <span className="kj">進化</span></a>
        <a className={cls("studio", true)} href="#studio" onClick={go(studioRef)}>Studio</a>
        <a className={cls("connect", false)} href="#connect" onClick={go(connectRef)}>Connect</a>
        <button
          className={"burger" + (menuOpen ? " open" : "")}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile slide-down menu */}
      <div className={"mobnav" + (menuOpen ? " open" : "")}>
        <a href="#now" onClick={goClose(nowRef)}>All in</a>
        <a href="/essays" onClick={() => setMenuOpen(false)}>Dispatches</a>
        <a href="/the-build" onClick={() => setMenuOpen(false)}>Shinka <span className="kj">進化</span></a>
        <a href="#studio" onClick={goClose(studioRef)}>Studio</a>
        <a href="#connect" onClick={goClose(connectRef)}>Connect</a>
      </div>

      {/* HERO */}
      <section className="panel hero" id="top" ref={topRef}>
        <div className="media pmedia" ref={heroMediaRef}>
          {heroBg && heroBg.src ? <img src={heroBg.src} srcSet={heroBg.srcSet} alt="" /> : null}
        </div>
        <div className="scrim" />
        <div className="content">
          <div className="eyebrow"><span className="dot" /> Phil Mora · builder in the agentic era</div>
          <div className="giant outline">
            I&nbsp;
            <span
              className="swap"
              style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(-10px)" }}
            >
              {WORDS[wi]}
            </span>
            <br />THINGS WORTH<br />BUILDING.
          </div>
          <div className="support">
            Software, stories, and a studio where the machines make the art. A broad-spectrum builder with agency and taste, at machine scale.
          </div>
        </div>
        <div className="scrollcue">Scroll ↓</div>
      </section>

      {/* ALL IN */}
      <section className="panel sec tint-thesis" id="now" ref={nowRef}>
        <div className="media pmedia" ref={allInMediaRef}>
          {allInUseVideo && allInVideo && !reduced() ? (
            <video
              ref={allInVidRef}
              src={allInVideo}
              poster={allInBg && allInBg.src ? allInBg.src : undefined}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          ) : allInBg && allInBg.src ? (
            <img src={allInBg.src} srcSet={allInBg.srcSet} alt="" />
          ) : null}
        </div>
        <div className="scrim" />
        <div className="content">
          <div className="eyebrow"><span className="dot" /> The bet</div>
          <div className="giant outline">ALL<br /><span className="ac">IN.</span></div>
          <div className="support">
            <strong>Something broke:</strong>{" the space between idea and working software collapsed. I've built with AI since 2015, back when it meant CUDA and silicon at "}<strong>Nvidia</strong>{". The leverage got absurd, so I decided to use all of it. Taste is the bottleneck now, not headcount, so I bet on taste."}
          </div>
          <div className="figs">
            <div><div className="n">2015</div><div className="k">building with AI<br />since</div></div>
            <div><div className="n">12 yrs</div><div className="k">in silicon<br />at Nvidia</div></div>
            <div><div className="n">$200B</div><div className="k">in payments I now<br />help automate / yr</div></div>
          </div>
          <div className="career">
            <span><b>Nvidia</b></span><span className="sep">→</span>
            <span><b>League</b></span><span className="sep">→</span>
            <span><b>Nutrien</b></span><span className="sep">→</span>
            <span><b>Sikka</b></span><span className="sep">→</span>
            <span className="cur"><b>Machinify</b> · today</span>
          </div>
        </div>
        <div className="scrollcue">Keep going ↓</div>
      </section>

      {/* DISPATCHES */}
      <section className="panel sec tint-violet" id="work" ref={workRef}>
        <div className="media pmedia" ref={dispatchesMediaRef}>
          {dispatchesBg && dispatchesBg.src ? (
            <img src={dispatchesBg.src} srcSet={dispatchesBg.srcSet} alt="" style={{ objectPosition: "center 30%" }} />
          ) : null}
        </div>
        <div className="scrim" />
        <div className="content">
          <div className="eyebrow"><span className="dot" /> The latest · engine ⇄ muse</div>
          <div className="giant sm">DISPATCHES</div>
          <div className="feeds">
            <a className="fcard eng" href="/essays/the-second-brain">
              <div className="fcimg">
                {cardEngineImg && cardEngineImg.src ? <img src={cardEngineImg.src} srcSet={cardEngineImg.srcSet} alt="" /> : null}
              </div>
              <div className="fcbody">
                <div className="fck">The engine · philmora</div>
                <div className="fct">The Second <em>Brain.</em></div>
                <div className="fcs">Why personal knowledge management always failed, and why, for the first time, it works. Part one of The Compounding Mind.</div>
                <div className="fcm">Essay · Jun 2026 · 11 min<span className="fcgo">Read →</span></div>
              </div>
            </a>
            <a className="fcard muse" href="https://butchsonic.com/album/acier-trempe" target="_blank" rel="noopener">
              <div className="fcimg">
                {cardMuseImg && cardMuseImg.src ? <img src={cardMuseImg.src} srcSet={cardMuseImg.srcSet} alt="" /> : null}
              </div>
              <div className="fcbody">
                <div className="fck">The muse · butchsonic</div>
                <div className="fct">Force Majeure: <em>Acier Trempé.</em></div>
                <div className="fcs">The flagship drop. Seven tracks of flame trance, forged at 128 BPM and mixed for supersonic delivery. Made end to end by machines.</div>
                <div className="fcm">Album · Apr 2026 · 7 tracks<span className="fcgo">Listen →</span></div>
              </div>
            </a>
          </div>
          <a className="alllink" href="/essays">All dispatches →</a>
        </div>
      </section>

      {/* STUDIO */}
      <section className="panel sec tint-magenta" id="studio" ref={studioRef}>
        <div className="media pmedia" ref={studioMediaRef}>
          {studioBg && studioBg.src ? (
            <img src={studioBg.src} srcSet={studioBg.srcSet} alt="" style={{ objectPosition: "center 32%" }} />
          ) : null}
        </div>
        <div className="scrim" />
        <div className="content">
          <div className="eyebrow"><span className="dot magenta" /> Studio / after hours · the muse</div>
          <div className="giant">The machines<br />make the art.</div>
          <div className="support">
            <strong>butchsonic</strong>{" is the creative lab where the music, the characters, and the films are made end to end by machines, and the only human in the room is the one with taste."}
          </div>
          <a className="cta" href="https://butchsonic.com" target="_blank" rel="noopener">Enter butchsonic →</a>
        </div>
      </section>

      {/* CONNECT · centered CTA */}
      <section className="panel sec tint-dark" id="connect" ref={connectRef}>
        <div className="media" ref={connectMediaRef}>
          {connectBg && connectBg.src ? (
            <img src={connectBg.src} srcSet={connectBg.srcSet} alt="" style={{ objectPosition: "center 30%" }} />
          ) : null}
          <video className="connect-vid" ref={connectVidRef} loop muted playsInline preload="none" />
        </div>
        <div className="scrim" style={{ background: connectScrim }} />

        <div className="ccore">
          <div className="ceye">Say hello</div>
          <div className="giant">{"Let's build "}<em>together.</em></div>
          <a className="cpill" ref={cpillRef} href="https://github.com/philmora" target="_blank" rel="noopener"><span className="lbl">github.com/philmora <span className="ar">→</span></span></a>
          <div className="calt">
            <a href="mailto:hi@philmora.com">hi@philmora.com</a>
            <a href="https://butchsonic.com" target="_blank" rel="noopener">butchsonic.com</a>
          </div>
        </div>

        <div className="cfoot">© 2026 Phil Mora · Northern Colorado · 5,000 ft</div>
      </section>
    </div>
  )
}

addPropertyControls(KineticHome, {
  heroBg: { type: ControlType.ResponsiveImage, title: "Hero BG" },
  allInBg: { type: ControlType.ResponsiveImage, title: "All In BG" },
  dispatchesBg: { type: ControlType.ResponsiveImage, title: "Dispatches BG" },
  cardEngineImg: { type: ControlType.ResponsiveImage, title: "Card Engine" },
  cardMuseImg: { type: ControlType.ResponsiveImage, title: "Card Muse" },
  studioBg: { type: ControlType.ResponsiveImage, title: "Studio BG" },
  connectBg: { type: ControlType.ResponsiveImage, title: "Connect BG" },
  allInUseVideo: {
    type: ControlType.Boolean,
    title: "All In Video",
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  allInVideo: {
    type: ControlType.File,
    title: "All In Video File",
    allowedFileTypes: ["mp4", "webm", "mov"],
    hidden: (p: any) => !p.allInUseVideo,
  },
  connectVideo: {
    type: ControlType.File,
    title: "Connect Video File",
    allowedFileTypes: ["mp4", "webm", "mov"],
  },
  connectDim: {
    type: ControlType.Number,
    title: "Connect Dim",
    min: 0.28,
    max: 0.72,
    step: 0.02,
    defaultValue: 0.46,
    displayStepper: false,
  },
})
