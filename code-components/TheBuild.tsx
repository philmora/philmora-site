import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

// SHINKA (進化, "evolution") — a philmora manifesto. 11 cinematic, image-backed panels (§00 hero + §01–10).
// Kinetic·Cinematic: full-opacity media + heavy scrim, Unbounded + Space Grotesk, parallax, reduced-motion-guarded.

const ARTICLES = [
  {
    n: "01", theme: "THE PREMISE", title: "Something opened.",
    body: "For most of history the bottleneck was hands. The distance between an idea and the working thing was measured in people and months. That distance just collapsed. The job I am doing today did not exist two years ago, and the leverage one builder can reach went from incremental to absurd. This is not a threat to the people who make things. It is the best thing that has ever happened to them.",
    pq: "The bottleneck was never the machine. It was the world we gave it to work in, and the world is finally catching up.",
  },
  {
    n: "02", theme: "THE TRADE", title: "The machine takes the bookkeeping. The human keeps the thinking.",
    body: "Leverage is not doing more of the same, faster. It is being freed to do only the part that is yours. The indexing, the cross-referencing, the clerical labor that never made anything better, goes to the machine, which does not get bored. The judgment, the taste, the care, stay with you. You end up doing more of the work you love, not less.",
  },
  {
    n: "03", theme: "THE TEAMMATES", title: "Some of the best people on my team do not have a pulse.",
    body: "I build systems where humans and agents work together as participants, not as a person poking at a tool. Agents get assigned the work. They take action, flag what is wrong, and learn from what happens. The newest members of a strong team in 2026 do not have a LinkedIn profile, and the work is better for it. This is not replacement. It is the arrival of colleagues who never sleep and never tire of the parts we always hated.",
    pq: "Not agents as tools. Agents as teammates.",
  },
  {
    n: "04", theme: "THE COMPOUNDING", title: "Knowledge compounds now, instead of decaying.",
    body: "Every system humans built to hold what they knew failed at the same place: it cost more to maintain than it returned. That trap just broke. A system can grow more valuable the longer it runs. So can a codebase. So can a career. Build the things that compound, and let time do the work.",
    pq: "Build systems that get more valuable the longer they run. Build a career that does the same.",
  },
  {
    n: "05", theme: "THE WHY", title: "Code is the residue of the work. The reasoning is the work.",
    body: "For fifteen years we kept the what and threw away the why. The commit survived. The thinking behind it evaporated. Now the reasoning itself can be kept, queried, and handed forward. What you decided matters less than why you decided it, and the why, at last, lasts. A team that keeps its why stops re-deciding the same things and starts compounding its judgment.",
  },
  {
    n: "06", theme: "THE SCALE", title: "Build things that move real weight and check their own work.",
    body: "The same idea, scaled up, moves real weight. My days go to healthcare payments: five companies becoming one platform, more than two hundred billion dollars in claims a year, a hundred and sixty million people whose care depends on it working. At that scale you learn the lesson fast. AI did not make quality cheaper to skip. It freed us to spend all of our judgment on raising it. Build systems that catch and fix their own mistakes before a person ever looks, and that lift the bar on what done means instead of lowering it.",
  },
  {
    n: "07", theme: "THE PATTERN", title: "Find the infrastructure problem hiding inside the business problem.",
    body: "The technology changes. The pattern does not. Semiconductors, then databases, then analytics that wanted to be a platform, then agriculture going digital, then healthcare going AI-native, now healthcare payments rebuilt around agents. Different surface, same core: there is always an infrastructure problem hiding inside the business problem, and the leverage is in finding it. Twelve years of writing code before any of the rest. That used to be a nice bonus. In 2026 it is the baseline.",
    pq: "The technology changes. The pattern does not.",
  },
  {
    n: "08", theme: "THE POSTURE", title: "Optimism is the harder posture, and the right one.",
    body: "It is easy to be clever about why the future will disappoint. It is harder, and far more useful, to build as though it is worth it. Optimism is not naivety. It is the working assumption of everyone who has ever made something that mattered. The builder chooses it on purpose, every morning.",
  },
  {
    n: "09", theme: "WE ARE EARLY", title: "This is the first inning of something enormous.",
    body: "The conditions that make all of this possible are recent, real, and barely explored, and most of the world is not remotely ready for what they unlock. That is not a warning. It is an invitation. The shape of what is coming is already visible, and naming the shape changes how we build toward it. We are not late to something finished. We are early to something wide open.",
  },
  {
    n: "10", theme: "FOR WHOM", title: "For whom.",
    body: "There is a person who would rather make the thing than talk about it. Who sees a new kind of leverage and reaches for all of it, not a careful slice. Who is not waiting for permission, a title, or a finished playbook. Who believes, without apology, that the world can be better and that building is how you say so.",
    body2: "They build software, stories, systems, companies, families, futures. They build things worth building.",
    closer: "If that is you, this was written for you. Let us build.",
  },
]

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@800&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.tb{
  --ink:#060509; --paper:#F6F3EC;
  --c1:#FF2E93; --c2:#2E6BFF; --c4:#16E0CE; --c5:#FF7A1A; --c6:#FFD23E; --neon:#2FD0FF;
  --f:'Space Grotesk',sans-serif; --disp:'Unbounded',sans-serif; --mono:'JetBrains Mono',monospace;
  position:relative; width:100%; background:var(--ink); color:var(--paper);
  font-family:var(--f); -webkit-font-smoothing:antialiased; overflow-x:clip;
}
.tb *{ box-sizing:border-box; margin:0; padding:0; }
.tb a{ color:inherit; text-decoration:none; }

.tb .grain{ position:fixed; inset:0; z-index:30; pointer-events:none; opacity:.05; mix-blend-mode:overlay;
  background-image:repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 2px); }
.tb .topscrim{ position:fixed; top:0; left:0; right:0; height:84px; z-index:35; pointer-events:none;
  background:linear-gradient(180deg, rgba(6,5,9,.55), rgba(6,5,9,0)); }

.tb .nav{ position:fixed; z-index:40; top:0; left:0; right:0; display:flex; align-items:center; gap:14px; padding:14px 30px; color:#fff; }
.tb .nav .logo{ display:inline-flex; align-items:center; gap:11px; font-family:var(--disp); font-weight:800; font-size:16px;
  letter-spacing:-.02em; white-space:nowrap; cursor:pointer; padding:6px 0; text-shadow:0 1px 16px rgba(0,0,0,.55); }
.tb .nav .logomark{ width:28px; height:28px; border-radius:6px; background:var(--c2); flex:0 0 auto; box-shadow:0 2px 14px rgba(46,107,255,.5); }
.tb .nav .sp{ flex:1; }
.tb .nav a.lnk{ font-size:12px; font-weight:600; letter-spacing:.05em; text-transform:uppercase; white-space:nowrap;
  opacity:.82; transition:opacity .2s; cursor:pointer; padding:7px 0; text-shadow:0 1px 14px rgba(0,0,0,.5); }
.tb .nav a.lnk:hover{ opacity:1; }
.tb .nav a.lnk .kj{ color:var(--c5); font-family:var(--mono); font-size:.92em; letter-spacing:.04em; margin-left:5px; }

/* Mobile hamburger + slide-down menu */
.tb .burger{ display:none; flex-direction:column; justify-content:center; gap:5px; width:38px; height:38px; padding:9px 7px;
  background:none; border:0; cursor:pointer; z-index:42; }
.tb .burger span{ display:block; height:2px; width:100%; background:#fff; border-radius:2px; transition:transform .3s, opacity .2s; box-shadow:0 1px 6px rgba(0,0,0,.5); }
.tb .burger.open span:nth-child(1){ transform:translateY(7px) rotate(45deg); }
.tb .burger.open span:nth-child(2){ opacity:0; }
.tb .burger.open span:nth-child(3){ transform:translateY(-7px) rotate(-45deg); }
.tb .mobnav{ position:fixed; top:0; left:0; right:0; z-index:39; min-height:100vh; display:flex; flex-direction:column; gap:2px;
  padding:92px 24px 40px; background:rgba(6,5,9,.98); -webkit-backdrop-filter:blur(16px); backdrop-filter:blur(16px);
  transform:translateY(-102%); pointer-events:none; transition:transform .36s cubic-bezier(0.16,1,0.3,1); }
.tb .mobnav.open{ transform:translateY(0); pointer-events:auto; }
.tb .mobnav a{ font-family:var(--disp); font-weight:800; text-transform:uppercase; font-size:30px; letter-spacing:-.01em;
  color:#fff; opacity:.92; padding:16px 0; border-bottom:1px solid rgba(255,255,255,.08); }
.tb .mobnav a .kj{ color:var(--c5); font-family:var(--mono); font-size:.5em; letter-spacing:.04em; margin-left:10px; vertical-align:middle; }

@media(max-width:640px){ .tb .nav a.lnk{ display:none; } .tb .burger{ display:flex; } .tb .nav{ gap:12px; padding:12px 22px; } .tb .nav .logo{ font-size:15px; } .tb .nav .logomark{ width:24px; height:24px; } }

.tb .panel{ position:relative; z-index:5; min-height:100vh; display:flex; flex-direction:column; justify-content:center; padding:14vh 5.5vw; overflow:hidden; }
@media(max-width:640px){ .tb .panel{ padding:16vh 7vw 12vh; } }
.tb .media{ position:absolute; inset:0; z-index:-2; will-change:transform; }
.tb .media img{ width:100%; height:100%; object-fit:cover; display:block; }
.tb .pmedia{ transform:scale(1.18); }
.tb .scrim{ position:absolute; inset:0; z-index:-1; }
.tb .content{ position:relative; z-index:3; width:100%; max-width:760px; }

.tb .eyebrow{ font-family:var(--mono); font-size:12px; font-weight:500; letter-spacing:.22em; text-transform:uppercase;
  color:var(--neon); margin-bottom:3vh; display:flex; align-items:center; gap:12px; text-shadow:0 1px 12px rgba(0,0,0,.8); }
.tb .eyebrow .dot{ width:8px; height:8px; border-radius:50%; background:var(--c4); box-shadow:0 0 12px var(--c4); flex:0 0 auto; }

/* HERO §00 */
.tb .hero .scrim{ background:linear-gradient(180deg, rgba(6,5,9,.42) 0%, rgba(6,5,9,.46) 52%, rgba(6,5,9,.78) 100%); }
.tb .hero .h1{ font-family:var(--disp); font-weight:800; text-transform:uppercase; letter-spacing:-.03em; line-height:.9;
  font-size:clamp(40px,6.5vw,90px); color:transparent; -webkit-text-fill-color:transparent; -webkit-text-stroke:1.5px #fff;
  text-shadow:0 2px 34px rgba(0,0,0,.6); }
.tb .hero .kanji{ font-family:var(--mono); font-size:clamp(14px,1.6vw,19px); letter-spacing:.3em; color:var(--c5); margin-top:2.2vh;
  text-shadow:0 2px 18px rgba(0,0,0,.7); }
.tb .hero .subt{ font-family:var(--disp); font-weight:800; font-size:clamp(14px,1.9vw,20px); color:var(--c5); margin-top:2.6vh;
  letter-spacing:-.01em; text-transform:uppercase; text-shadow:0 2px 20px rgba(0,0,0,.6); }
.tb .hero .intro{ font-size:clamp(15px,1.5vw,18px); line-height:1.55; color:rgba(246,243,236,.92); margin-top:3vh; max-width:52ch;
  text-shadow:0 1px 16px rgba(0,0,0,.8); }
.tb .scrollcue{ position:absolute; bottom:4vh; left:5.5vw; font-family:var(--mono); font-size:11px; font-weight:500; letter-spacing:.18em;
  text-transform:uppercase; opacity:.75; z-index:6; }

/* ARTICLE §01–10 */
.tb .art .scrim{ background:linear-gradient(100deg, rgba(6,5,9,.92) 0%, rgba(6,5,9,.84) 42%, rgba(6,5,9,.5) 72%, rgba(6,5,9,.4) 100%),
  linear-gradient(180deg, rgba(6,5,9,.25), rgba(6,5,9,.1) 40%, rgba(6,5,9,.62)); }
.tb .art .title{ font-family:var(--disp); font-weight:800; text-transform:uppercase; letter-spacing:-.025em; line-height:1.02;
  font-size:clamp(27px,4.4vw,54px); color:#fff; text-shadow:0 2px 22px rgba(0,0,0,.7); }
.tb .art .body{ font-size:clamp(16px,1.45vw,19px); line-height:1.62; color:rgba(246,243,236,.92); margin-top:3.2vh; max-width:62ch;
  text-shadow:0 1px 14px rgba(0,0,0,.85); }
.tb .art .body + .body{ margin-top:1.6vh; }
.tb .art .pq{ font-style:italic; color:var(--c6); font-size:clamp(18px,2vw,25px); line-height:1.4; margin-top:3.4vh; padding-left:18px;
  border-left:2px solid rgba(255,122,26,.6); max-width:54ch; text-shadow:0 1px 16px rgba(0,0,0,.85); }
.tb .art .closer{ font-family:var(--disp); font-weight:800; text-transform:uppercase; letter-spacing:-.01em; line-height:1.06;
  font-size:clamp(20px,2.6vw,32px); color:var(--c5); margin-top:3.6vh; text-shadow:0 2px 20px rgba(0,0,0,.7); }

.tb .endmark{ position:relative; z-index:5; text-align:center; padding:7vh 5.5vw 9vh; background:var(--ink);
  font-family:var(--mono); font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:rgba(246,243,236,.42); }
.tb .endmark .sq{ display:inline-block; width:10px; height:10px; border-radius:2px; background:var(--c2); margin-right:9px; vertical-align:-1px; box-shadow:0 0 8px rgba(46,107,255,.6); }

@media (prefers-reduced-motion:reduce){ .tb .pmedia{ transform:none; } .tb .mobnav{ transition:none; } }
`

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function TheBuild(props: any) {
  const {
    img00 = { src: "https://files.catbox.moe/qi0nmt.jpg" },
    img01 = { src: "https://files.catbox.moe/jcw5c7.jpg" },
    img02 = { src: "https://files.catbox.moe/33wstq.jpg" },
    img03 = { src: "https://files.catbox.moe/exrg3i.jpg" },
    img04 = { src: "https://files.catbox.moe/xb5ndq.jpg" },
    img05 = { src: "https://files.catbox.moe/undrkg.jpg" },
    img06 = { src: "https://files.catbox.moe/sukycd.jpg" },
    img07 = { src: "https://files.catbox.moe/gupxbx.jpg" },
    img08 = { src: "https://files.catbox.moe/x9sg2m.jpg" },
    img09 = { src: "https://files.catbox.moe/i8puuf.jpg" },
    img10 = { src: "https://files.catbox.moe/cyn6ja.jpg" },
  } = props

  const imgs = [img00, img01, img02, img03, img04, img05, img06, img07, img08, img09, img10]
  const rootRef = useRef<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const reduced = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // Scroll-depth parallax on panel media
  useEffect(() => {
    if (reduced() || typeof window === "undefined") return
    const root = rootRef.current
    if (!root) return
    const medias = Array.from(root.querySelectorAll(".pmedia")) as any[]
    let ticking = false
    const update = () => {
      ticking = false
      const vh = window.innerHeight || 1
      medias.forEach((m) => {
        if (!m || !m.parentElement) return
        const rect = m.parentElement.getBoundingClientRect()
        const prog = (rect.top + rect.height / 2 - vh / 2) / vh
        m.style.transform = "translate3d(0," + (prog * -8).toFixed(2) + "%,0) scale(1.18)"
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

  return (
    <div className="tb" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="grain" />
      <div className="topscrim" />

      <nav className="nav">
        <a className="logo" href="/"><span className="logomark" />PHIL MORA</a>
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

      {/* Mobile slide-down menu */}
      <div className={"mobnav" + (menuOpen ? " open" : "")}>
        <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="/essays" onClick={() => setMenuOpen(false)}>Dispatches</a>
        <a href="/the-build" onClick={() => setMenuOpen(false)}>Shinka <span className="kj">進化</span></a>
        <a href="/#connect" onClick={() => setMenuOpen(false)}>Connect</a>
      </div>

      {/* §00 HERO */}
      <section className="panel hero">
        <div className="media pmedia">
          {img00 && img00.src ? <img src={img00.src} srcSet={img00.srcSet} alt="" /> : null}
        </div>
        <div className="scrim" />
        <div className="content">
          <div className="eyebrow"><span className="dot" /> § 00 · SHINKA · 進化</div>
          <div className="h1">Shinka.</div>
          <div className="kanji">進化 · evolution</div>
          <div className="subt">What it means to build in 2026.</div>
          <div className="intro">A working creed, in progress. Optimistic on purpose. For the people who would rather make the thing than talk about it.</div>
        </div>
        <div className="scrollcue">Read ↓</div>
      </section>

      {/* §01–10 ARTICLES */}
      {ARTICLES.map((a, i) => {
        const im = imgs[i + 1]
        return (
          <section className="panel art" key={a.n}>
            <div className="media pmedia">
              {im && im.src ? <img src={im.src} srcSet={im.srcSet} alt="" /> : null}
            </div>
            <div className="scrim" />
            <div className="content">
              <div className="eyebrow"><span className="dot" /> § {a.n} · {a.theme}</div>
              <div className="title">{a.title}</div>
              <p className="body">{a.body}</p>
              {a.body2 ? <p className="body">{a.body2}</p> : null}
              {a.pq ? <div className="pq">{a.pq}</div> : null}
              {a.closer ? <div className="closer">{a.closer}</div> : null}
            </div>
          </section>
        )
      })}

      <div className="endmark"><span className="sq" />SHINKA · 進化 · philmora · build things worth building</div>
    </div>
  )
}

addPropertyControls(TheBuild, {
  img00: { type: ControlType.ResponsiveImage, title: "§00 Hero" },
  img01: { type: ControlType.ResponsiveImage, title: "§01 Premise" },
  img02: { type: ControlType.ResponsiveImage, title: "§02 Trade" },
  img03: { type: ControlType.ResponsiveImage, title: "§03 Teammates" },
  img04: { type: ControlType.ResponsiveImage, title: "§04 Compounding" },
  img05: { type: ControlType.ResponsiveImage, title: "§05 Why" },
  img06: { type: ControlType.ResponsiveImage, title: "§06 Scale" },
  img07: { type: ControlType.ResponsiveImage, title: "§07 Pattern" },
  img08: { type: ControlType.ResponsiveImage, title: "§08 Posture" },
  img09: { type: ControlType.ResponsiveImage, title: "§09 We Are Early" },
  img10: { type: ControlType.ResponsiveImage, title: "§10 For Whom" },
})
