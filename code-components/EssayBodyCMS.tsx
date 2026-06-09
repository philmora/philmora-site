import { addPropertyControls, ControlType } from "framer"
import { useEffect, useMemo, useState } from "react"

interface Props {
  title?: string
  dek?: string
  date?: string
  readingTime?: number
  order?: number
  body?: string
  heroImage?: { src?: string } | string
}

const CONTENT_BASE = "https://raw.githubusercontent.com/philmora/essays/main/content"
const INDEX_URL = "https://raw.githubusercontent.com/philmora/essays/main/essays.json"

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
  dek?: string
  date: string
  reading_time: number
  published?: boolean
  order?: number
}

function fmt(iso: string | undefined): string {
  if (!iso) return ""
  try {
    const d = new Date(iso.length <= 10 ? iso + "T12:00:00Z" : iso)
    if (isNaN(d.getTime())) return iso
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).toUpperCase()
  } catch { return iso }
}
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
function stripFrontmatter(md: string): string { const m = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/.exec(md); return m ? md.slice(m[0].length) : md }
function emphLastWord(html: string): string { if (/[<]/.test(html)) return html; return html.replace(/(\S+)(\s*)$/, "<em>$1</em>$2") }
function enrichTitle(title: string): string {
  if (!title) return ""
  if (/<em>/i.test(title)) return title
  const m = /^(.*?\.)\s+(.+\.?)\s*$/.exec(title)
  if (m && m[2].length > 4 && m[2].length < 60) return m[1] + " <em>" + m[2] + "</em>"
  return emphLastWord(title)
}
function extractSections(md: string): { id: string; idx: string; title: string }[] {
  const out: { id: string; idx: string; title: string }[] = []
  const re = /^##\s+§\s+(\d+)\s*·\s*(.+)$/gm
  let m: RegExpExecArray | null
  while ((m = re.exec(md)) !== null) {
    out.push({ id: "s" + m[1], idx: "§" + m[1], title: m[2].replace(/<[^>]+>/g, "").replace(/\*+/g, "").trim() })
  }
  return out
}
function normalizeBody(input: string): string {
  if (!input) return ""
  if (/<\/?(p|h[1-6]|ul|ol|li|blockquote|pre|hr|em|strong|a|br)\b/i.test(input)) return input
  const lines = input.split(/\r?\n/)
  const out: string[] = []
  let i = 0, inCode = false
  let codeBuf: string[] = []
  const inline = (raw: string): string => {
    let s = esc(raw)
    s = s.replace(/`([^`]+)`/g, (_m, c) => "<code>" + c + "</code>")
    s = s.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, t, u) => '<a href="' + u + '" target="_blank" rel="noopener">' + t + "</a>")
    return s
  }
  while (i < lines.length) {
    const line = lines[i]
    if (/^```/.test(line)) { if (inCode) { out.push("<pre><code>" + esc(codeBuf.join("\n")) + "</code></pre>"); codeBuf = []; inCode = false } else inCode = true; i++; continue }
    if (inCode) { codeBuf.push(line); i++; continue }
    if (/^---\s*$/.test(line)) { out.push("<hr />"); i++; continue }
    if (/^\s*$/.test(line)) { i++; continue }
    const h = /^(#{1,4})\s+(.*)$/.exec(line)
    if (h) {
      const level = h[1].length, text = h[2]
      const sec = /^§\s+(\d+)\s*·\s*(.+)$/.exec(text)
      if (level === 2 && sec) {
        out.push('<div class="section-marker" id="s' + sec[1] + '"><div class="idx">§ ' + sec[1] + '</div><h2 class="title">' + emphLastWord(inline(sec[2])) + "</h2></div>")
      } else { out.push("<h" + (level + 1) + ">" + emphLastWord(inline(text)) + "</h" + (level + 1) + ">") }
      i++; continue
    }
    if (/^>\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, "")); i++ }
      const text = buf.join(" ").trim()
      if (text.length < 140) out.push('<blockquote class="pullquote"><span class="marks">"</span>' + inline(text) + "</blockquote>")
      else out.push("<blockquote>" + inline(text) + "</blockquote>")
      continue
    }
    if (/^[-*]\s+/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) { buf.push("<li>" + inline(lines[i].replace(/^[-*]\s+/, "")) + "</li>"); i++ }
      out.push("<ul>" + buf.join("") + "</ul>"); continue
    }
    if (/^\d+\.\s+/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) { buf.push("<li>" + inline(lines[i].replace(/^\d+\.\s+/, "")) + "</li>"); i++ }
      out.push("<ol>" + buf.join("") + "</ol>"); continue
    }
    const pBuf: string[] = [line]; i++
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,4}\s|[-*]\s|\d+\.\s|>\s|---\s*$|```)/.test(lines[i])) { pBuf.push(lines[i]); i++ }
    out.push("<p>" + inline(pBuf.join(" ")) + "</p>")
  }
  return out.join("\n")
}
const hardNav = (href: string) => (ev: any) => {
  if (ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return
  ev.preventDefault()
  if (typeof window !== "undefined") window.location.assign(href)
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.pp-progress{ position:fixed; top:0; left:0; height:2px; width:0%; background:#FF7A1A; box-shadow:0 0 8px rgba(255,90,40,.6); z-index:200; transition:width 60ms linear; }
.pp{
  --bg-0:#0A0608; --ink-1:#FBF7EF; --ink-2:rgba(251,247,239,.80); --ink-3:rgba(251,247,239,.52);
  --line:rgba(251,247,239,.10); --line-2:rgba(251,247,239,.18); --prose:rgba(251,247,239,.83);
  --a:#FF8A24; --c4:#16E0CE; --c2:#2E6BFF; --c1:#FF2E93; --c6:#FFD23E; --neon:#2FD0FF;
  --grad:linear-gradient(100deg,#FF4D3D 0%,#FF7A1A 48%,#FFC23C 100%);
  --wash:radial-gradient(120% 80% at 12% 0%, rgba(255,122,26,.32), transparent 55%), radial-gradient(90% 70% at 88% 8%, rgba(255,184,70,.24), transparent 60%), radial-gradient(100% 80% at 60% 100%, rgba(255,77,61,.26), transparent 66%), radial-gradient(60% 55% at 38% 60%, rgba(22,224,206,.12), transparent 66%);
  --f:'Space Grotesk',sans-serif; --disp:'Unbounded',sans-serif; --mono:'JetBrains Mono',monospace;
  --sp-4:16px; --sp-5:24px; --sp-6:32px; --sp-7:48px; --sp-8:64px; --sp-9:96px; --sp-10:128px;
  --radius:6px; --radius-lg:12px; --maxw:1180px; --gutter:clamp(20px,4vw,64px); --lsw:.32em; --ease:cubic-bezier(0.16,1,0.3,1);
  position:relative; width:100%; background:var(--bg-0); color:var(--ink-1); font-family:var(--f); -webkit-font-smoothing:antialiased; overflow-x:clip;
}
.pp *{ box-sizing:border-box; margin:0; padding:0; }
.pp a{ color:inherit; text-decoration:none; } .pp ol,.pp ul{ list-style:none; }
.pp .grain{ position:fixed; inset:0; z-index:60; pointer-events:none; opacity:.05; mix-blend-mode:overlay; background-image:repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 2px); }

/* NAV — matches the site (cobalt logomark + Unbounded wordmark + mobile hamburger) */
.pp .nav{ position:fixed; z-index:50; top:0; left:0; right:0; display:flex; align-items:center; gap:14px; padding:14px 30px; color:#fff; }
.pp .nav .logo{ display:inline-flex; align-items:center; gap:11px; font-family:var(--disp); font-weight:800; font-size:16px;
  letter-spacing:-.02em; white-space:nowrap; opacity:1; text-shadow:0 1px 16px rgba(0,0,0,.55); }
.pp .nav .logomark{ width:28px; height:28px; border-radius:6px; background:var(--c2); flex:0 0 auto; box-shadow:0 2px 14px rgba(46,107,255,.5); }
.pp .nav .sp{ flex:1; }
.pp .nav a{ font-size:12px; font-weight:600; letter-spacing:.05em; text-transform:uppercase; white-space:nowrap; opacity:.82;
  transition:opacity .2s, color .2s; cursor:pointer; padding:7px 0; text-shadow:0 1px 14px rgba(0,0,0,.5); }
.pp .nav a.logo{ opacity:1; } .pp .nav a:hover{ opacity:1; }
.pp .nav a .kj{ color:var(--a); font-family:var(--mono); font-size:.92em; letter-spacing:.04em; margin-left:5px; }
.pp .burger{ display:none; flex-direction:column; justify-content:center; gap:5px; width:38px; height:38px; padding:9px 7px;
  background:none; border:0; cursor:pointer; z-index:52; }
.pp .burger span{ display:block; height:2px; width:100%; background:#fff; border-radius:2px; transition:transform .3s, opacity .2s; box-shadow:0 1px 6px rgba(0,0,0,.5); }
.pp .burger.open span:nth-child(1){ transform:translateY(7px) rotate(45deg); }
.pp .burger.open span:nth-child(2){ opacity:0; }
.pp .burger.open span:nth-child(3){ transform:translateY(-7px) rotate(-45deg); }
.pp .mobnav{ position:fixed; top:0; left:0; right:0; z-index:49; min-height:100vh; display:flex; flex-direction:column; gap:2px;
  padding:92px 24px 40px; background:rgba(10,6,8,.98); -webkit-backdrop-filter:blur(16px); backdrop-filter:blur(16px);
  transform:translateY(-102%); pointer-events:none; transition:transform .36s var(--ease); }
.pp .mobnav.open{ transform:translateY(0); pointer-events:auto; }
.pp .mobnav a{ font-family:var(--disp); font-weight:800; text-transform:uppercase; font-size:30px; letter-spacing:-.01em;
  color:#fff; opacity:.92; padding:16px 0; border-bottom:1px solid rgba(255,255,255,.08); }
.pp .mobnav a .kj{ color:var(--a); font-family:var(--mono); font-size:.5em; letter-spacing:.04em; margin-left:10px; vertical-align:middle; }

.pp .hero{ position:relative; min-height:84vh; display:flex; flex-direction:column; justify-content:flex-end; padding:120px 5.5vw 7vh; overflow:hidden; isolation:isolate; }
.pp .hero .media{ position:absolute; inset:0; z-index:-3; }
.pp .hero .media img{ width:100%; height:100%; object-fit:cover; object-position:center 32%; display:block; filter:saturate(1.1) contrast(1.02) brightness(1.04); }
.pp .hero .wash{ position:absolute; inset:0; z-index:-2; background:var(--wash); mix-blend-mode:soft-light; opacity:.85; }
.pp .hero .scrim{ position:absolute; inset:0; z-index:-1; background:linear-gradient(180deg, rgba(10,6,8,.28) 0%, rgba(10,6,8,.48) 48%, rgba(10,6,8,.94) 100%); }
.pp .hero-top{ position:absolute; top:84px; left:5.5vw; right:5.5vw; display:flex; justify-content:space-between; align-items:center; gap:18px; }
.pp .pill{ display:inline-flex; align-items:center; gap:10px; padding:8px 14px; border:1px solid var(--line-2); border-radius:100px; font-family:var(--mono); font-size:11px; letter-spacing:var(--lsw); text-transform:uppercase; color:var(--ink-2); background:rgba(10,6,8,.5); }
.pp .pill-dot{ width:8px; height:8px; border-radius:50%; background:var(--a); box-shadow:0 0 12px rgba(255,90,40,.85); }
.pp .hero-eyebrow{ display:flex; align-items:center; gap:12px; margin-bottom:22px; }
.pp .hero-eyebrow .dash{ width:42px; height:3px; background:var(--grad); border-radius:3px; }
.pp .eyebrow{ font-family:var(--mono); font-size:12px; letter-spacing:var(--lsw); text-transform:uppercase; color:var(--ink-2); }
.pp .post-title{ font-family:var(--disp); font-weight:800; text-transform:uppercase; letter-spacing:-.03em; line-height:.94; font-size:calc(clamp(34px,6.6vw,96px) * .82); color:#fff; max-width:16ch; text-shadow:0 4px 40px rgba(0,0,0,.5); }
.pp .post-title em{ font-style:italic; background:var(--grad); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.pp .post-dek{ margin-top:26px; font-size:clamp(16px,1.7vw,21px); line-height:1.5; color:rgba(255,255,255,.8); max-width:58ch; }
.pp .post-band{ display:flex; gap:var(--sp-7); flex-wrap:wrap; margin-top:30px; padding-top:22px; border-top:1px solid var(--line-2); }
.pp .post-band .cell .v{ font-family:var(--disp); font-weight:800; font-size:26px; line-height:1; color:#fff; letter-spacing:-.02em; }
.pp .post-band .cell .v .u{ color:var(--a); }
.pp .post-band .cell .k{ font-family:var(--mono); font-size:10px; letter-spacing:var(--lsw); text-transform:uppercase; color:var(--ink-3); margin-top:7px; display:block; }

.pp .body-wrap{ max-width:var(--maxw); margin:0 auto; padding:var(--sp-9) 5.5vw var(--sp-7); display:grid; grid-template-columns:1fr 240px; gap:var(--sp-8); }
.pp .prose{ max-width:680px; font-size:17px; line-height:1.78; letter-spacing:.003em; color:var(--prose); }
.pp .prose p{ margin:0 0 24px; }
.pp .prose p em,.pp .prose li em,.pp .prose blockquote em{ color:var(--a); font-style:italic; font-weight:600; }
.pp .prose p strong,.pp .prose li strong{ color:#fff; font-weight:600; }
.pp .prose a{ color:var(--a); border-bottom:1px solid rgba(255,138,36,.4); transition:border-color .2s; } .pp .prose a:hover{ border-bottom-color:var(--a); }
.pp .prose .section-marker{ display:grid; grid-template-columns:auto 1fr; gap:20px; align-items:baseline; margin:76px 0 30px; padding-top:30px; border-top:1px solid var(--line); scroll-margin-top:80px; }
.pp .prose .section-marker .idx{ font-family:var(--mono); font-size:12px; letter-spacing:.22em; color:var(--c4); text-transform:uppercase; padding-top:12px; font-weight:500; }
.pp .prose .section-marker .title{ font-family:var(--disp); font-weight:800; font-size:clamp(24px,3vw,36px); line-height:1.08; letter-spacing:-.03em; color:#fff; } .pp .prose .section-marker .title em{ font-style:italic; color:var(--a); }
.pp .prose h3,.pp .prose h4{ font-family:var(--f); font-weight:700; color:#fff; line-height:1.3; margin:38px 0 14px; } .pp .prose h3{ font-size:22px; } .pp .prose h4{ font-size:18px; } .pp .prose h3 em,.pp .prose h4 em{ font-style:italic; color:var(--a); }
.pp .prose .pullquote{ margin:60px 0; padding:42px 0; border-top:1px solid rgba(255,90,40,.32); border-bottom:1px solid rgba(255,90,40,.32); text-align:center; font-family:var(--disp); font-weight:800; font-size:clamp(22px,3vw,34px); line-height:1.2; letter-spacing:-.02em; background:var(--grad); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; text-wrap:balance; }
.pp .prose .pullquote .marks{ display:block; opacity:.4; font-size:.6em; margin-bottom:6px; -webkit-text-fill-color:var(--a); }
.pp .prose blockquote:not(.pullquote){ border-left:2px solid var(--a); padding:6px 0 6px 22px; margin:30px 0; font-style:italic; font-size:clamp(16px,1.7vw,19px); line-height:1.6; color:#fff; }
.pp .prose ul,.pp .prose ol{ margin:0 0 28px; }
.pp .prose ul li{ position:relative; padding:8px 0 8px 24px; line-height:1.65; } .pp .prose ul li::before{ content:"▸"; position:absolute; left:0; top:8px; color:var(--a); font-size:.85em; }
.pp .prose ol{ counter-reset:pp-ol; } .pp .prose ol li{ counter-increment:pp-ol; position:relative; padding:16px 0 16px 56px; border-top:1px solid var(--line); line-height:1.65; } .pp .prose ol li::before{ content:counter(pp-ol,decimal-leading-zero); position:absolute; left:0; top:18px; font-family:var(--mono); font-size:11px; letter-spacing:.18em; color:var(--c4); } .pp .prose ol li:last-child{ border-bottom:1px solid var(--line); }
.pp .prose hr{ border:0; border-top:1px solid var(--line); margin:44px auto; width:60%; }
.pp .prose code{ font-family:var(--mono); font-size:.9em; background:rgba(255,255,255,.06); padding:2px 6px; border-radius:4px; color:#fff; }
.pp .prose pre{ font-family:var(--mono); font-size:13px; line-height:1.55; background:rgba(255,255,255,.04); border:1px solid var(--line); border-radius:10px; padding:16px 20px; overflow-x:auto; margin:0 0 26px; } .pp .prose pre code{ background:transparent; padding:0; }
.pp .prose-status{ font-size:16px; line-height:1.6; color:var(--ink-3); font-style:italic; } .pp .prose-status a{ color:var(--a); }

.pp .rail{ position:sticky; top:80px; align-self:start; max-height:calc(100vh - 120px); overflow:hidden; }
.pp .toc{ border:1px solid var(--line-2); border-radius:14px; background:rgba(255,255,255,.02); backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); padding:18px; }
.pp .toc .hd{ font-family:var(--mono); font-size:9px; letter-spacing:.22em; text-transform:uppercase; color:var(--ink-3); padding-bottom:10px; margin-bottom:10px; border-bottom:1px solid var(--line); }
.pp .toc a{ display:block; padding:6px 0; font-size:11px; color:var(--ink-3); line-height:1.4; transition:color .16s; } .pp .toc a:hover{ color:#fff; } .pp .toc a .n{ color:var(--c4); margin-right:8px; } .pp .toc a.active{ color:var(--a); }

.pp .marquee{ border-top:1px solid var(--line); border-bottom:1px solid var(--line); overflow:hidden; padding:18px 0; }
.pp .marquee-track{ display:flex; gap:48px; align-items:center; animation:ppmarq 40s linear infinite; white-space:nowrap; width:max-content; }
.pp .marquee-item{ font-family:var(--disp); font-weight:800; font-size:clamp(22px,2.6vw,38px); text-transform:uppercase; letter-spacing:-.01em; } .pp .marquee-item.mute{ color:transparent; -webkit-text-stroke:1.4px var(--ink-3); } .pp .marquee-item.acc{ color:var(--a); } .pp .marquee-dot{ color:var(--a); font-size:.5em; }
@keyframes ppmarq{ from{ transform:translateX(0);} to{ transform:translateX(-50%);} }

.pp .foot{ max-width:var(--maxw); margin:0 auto; padding:var(--sp-8) 5.5vw 0; }
.pp .nav2{ display:grid; grid-template-columns:1fr 1fr; gap:18px; }
.pp .nav2 .card{ display:flex; flex-direction:column; gap:8px; padding:24px; border:1px solid var(--line-2); border-radius:16px; background:rgba(255,255,255,.02); transition:border-color .2s, background .2s; }
.pp .nav2 .card:hover:not(.disabled){ border-color:var(--a); background:rgba(255,138,36,.05); } .pp .nav2 .card.disabled{ opacity:.4; } .pp .nav2 .card.next{ text-align:right; }
.pp .nav2 .dir{ font-family:var(--mono); font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:var(--c4); }
.pp .nav2 .ti{ font-family:var(--disp); font-weight:800; font-size:19px; line-height:1.12; letter-spacing:-.02em; color:#fff; } .pp .nav2 .ti em{ font-style:italic; color:var(--a); }
.pp .wordmark-wrap{ text-align:center; padding:var(--sp-9) 0 var(--sp-7); }
.pp .wordmark{ font-family:var(--disp); font-weight:800; text-transform:uppercase; letter-spacing:-.02em; font-size:clamp(40px,12vw,150px); line-height:.86; background:var(--grad); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; filter:drop-shadow(0 0 40px rgba(255,90,40,.26)); }
.pp .foot-meta{ display:flex; justify-content:space-between; flex-wrap:wrap; gap:14px; padding:0 5.5vw var(--sp-8); max-width:var(--maxw); margin:0 auto; font-family:var(--mono); font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:var(--ink-3); } .pp .foot-meta a{ color:var(--a); }

@media(max-width:1000px){ .pp .body-wrap{ grid-template-columns:1fr; gap:0; } .pp .rail{ position:static; max-height:none; margin-top:56px; padding-top:28px; border-top:1px solid var(--line); } .pp .nav2{ grid-template-columns:1fr; } }
@media(max-width:640px){ .pp .nav a:not(.logo){ display:none; } .pp .burger{ display:flex; } .pp .nav{ padding:12px 22px; } .pp .hero{ min-height:76vh; } .pp .prose{ font-size:16px; } .pp .prose .section-marker{ grid-template-columns:1fr; gap:8px; } .pp .post-band{ gap:var(--sp-6); } .pp .foot-meta{ flex-direction:column; gap:8px; } }
@media(prefers-reduced-motion:reduce){ .pp .marquee-track{ animation:none; } .pp .mobnav{ transition:none; } }
`

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function EssayBodyCMS(props: Props) {
  const propHeroSrc = typeof props.heroImage === "string" ? props.heroImage : (props.heroImage && props.heroImage.src) || ""
  const [fetchedMeta, setFetchedMeta] = useState<EssayMeta | null>(null)
  const [body, setBody] = useState<string>("")
  const [state, setState] = useState<"loading" | "ok" | "error">("loading")
  const [heroSrc, setHeroSrc] = useState<string>(HERO_FALLBACK)
  const [neighbors, setNeighbors] = useState<{ prev: EssayMeta | null; next: EssayMeta | null }>({ prev: null, next: null })
  const [scrollPct, setScrollPct] = useState(0)
  const [activeSec, setActiveSec] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const navClose = (href: string) => (ev: any) => { setMenuOpen(false); hardNav(href)(ev) }

  useEffect(() => {
    if (typeof window === "undefined") return
    const parts = window.location.pathname.split("/").filter(Boolean)
    if (parts[0] !== "essays" || !parts[1]) return
    const slug = parts[1]
    setHeroSrc(HERO[slug] || propHeroSrc || HERO_FALLBACK)
    let cancelled = false
    setState("loading")
    ;(async () => {
      try {
        const r = await fetch(CONTENT_BASE + "/" + slug + ".md", { cache: "no-store" })
        if (!r.ok) throw new Error("HTTP " + r.status)
        const text = await r.text()
        if (cancelled) return
        setBody(stripFrontmatter(text)); setState("ok")
      } catch (e) { if (!cancelled) setState("error") }
    })()
    ;(async () => {
      try {
        const r = await fetch(INDEX_URL, { cache: "no-store" })
        if (!r.ok) return
        const data = await r.json()
        const items: EssayMeta[] = Array.isArray(data && data.essays) ? data.essays : []
        const pub = items.filter((e) => e.published !== false).sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
        const idx = pub.findIndex((e) => e.slug === slug)
        if (cancelled || idx === -1) return
        setFetchedMeta(pub[idx]); setNeighbors({ prev: pub[idx + 1] ?? null, next: pub[idx - 1] ?? null })
      } catch (e) {}
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(max > 0 ? (window.scrollY / max) * 100 : 0)
      const markers = Array.from(document.querySelectorAll(".pp .section-marker")) as any[]
      const y = window.scrollY + 240
      let act: string | null = null
      for (const el of markers) { if (el.offsetTop <= y) act = el.id }
      setActiveSec(act)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [body])

  const sections = useMemo(() => extractSections(body), [body])
  const titleHtml = fetchedMeta?.title || enrichTitle(props.title ?? "")
  const dek = fetchedMeta?.dek ?? props.dek ?? ""
  const date = fetchedMeta?.date ?? props.date ?? ""
  const reading = fetchedMeta?.reading_time ?? props.readingTime
  const order = fetchedMeta?.order ?? props.order
  const bodySrc = body || props.body || ""

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pp-progress" style={{ width: scrollPct + "%" }} aria-hidden="true" />
      <div className="pp">
        <div className="grain" />
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

        <header className="hero">
          <div className="media"><img src={heroSrc} alt="" /></div>
          <div className="wash" />
          <div className="scrim" />
          <div className="hero-top">
            <span className="pill"><span className="pill-dot" /> Dispatch · engine</span>
            <a className="eyebrow" href="/essays" rel="external" onClick={hardNav("/essays")} style={{ cursor: "pointer" }}>← All dispatches</a>
          </div>
          <div className="hero-eyebrow"><span className="dash" /><span className="eyebrow">{order != null ? "№" + String(order).padStart(3, "0") : "Essay"} · philmora</span></div>
          {titleHtml ? <h1 className="post-title" dangerouslySetInnerHTML={{ __html: titleHtml }} /> : <h1 className="post-title">Loading</h1>}
          {dek ? <p className="post-dek">{dek}</p> : null}
          <div className="post-band">
            {date ? <div className="cell"><div className="v">{fmt(date).split(",")[0]}</div><span className="k">Filed</span></div> : null}
            {reading != null ? <div className="cell"><div className="v">{reading}<span className="u">m</span></div><span className="k">Read time</span></div> : null}
            <div className="cell"><div className="v">CC<span className="u"> BY</span></div><span className="k">Open · 4.0</span></div>
          </div>
        </header>

        <div className="body-wrap">
          <article className="prose">
            {bodySrc ? <div dangerouslySetInnerHTML={{ __html: normalizeBody(bodySrc) }} />
              : state === "loading" ? <p className="prose-status">Loading…</p>
              : <p className="prose-status">This dispatch is loading from <a href="https://github.com/philmora/essays" target="_blank" rel="noopener">github.com/philmora/essays</a>.</p>}
          </article>
          {sections.length > 0 ? (
            <aside className="rail">
              <div className="toc">
                <div className="hd">Contents</div>
                {sections.map((s) => (
                  <a key={s.id} href={"#" + s.id} className={activeSec === s.id ? "active" : ""}><span className="n">{s.idx}</span>{s.title}</a>
                ))}
              </div>
            </aside>
          ) : null}
        </div>

        <div className="marquee">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, r) => (
              <span key={r} style={{ display: "flex", gap: "48px", alignItems: "center" }}>
                <span className="marquee-item acc">Engine ⇄ Muse</span><span className="marquee-dot">✦</span>
                <span className="marquee-item mute">Built between shipping</span><span className="marquee-dot">✦</span>
                <span className="marquee-item acc">Field-tested</span><span className="marquee-dot">✦</span>
                <span className="marquee-item mute">Not in theory</span><span className="marquee-dot">✦</span>
              </span>
            ))}
          </div>
        </div>

        <footer className="foot">
          <div className="nav2">
            {neighbors.prev ? (
              <a className="card prev" href={"/essays/" + neighbors.prev.slug} rel="external" onClick={hardNav("/essays/" + neighbors.prev.slug)}>
                <span className="dir">← Previous</span><span className="ti" dangerouslySetInnerHTML={{ __html: neighbors.prev.title }} />
              </a>
            ) : <div className="card prev disabled"><span className="dir">← Previous</span><span className="ti">First dispatch.</span></div>}
            {neighbors.next ? (
              <a className="card next" href={"/essays/" + neighbors.next.slug} rel="external" onClick={hardNav("/essays/" + neighbors.next.slug)}>
                <span className="dir">Next →</span><span className="ti" dangerouslySetInnerHTML={{ __html: neighbors.next.title }} />
              </a>
            ) : <div className="card next disabled"><span className="dir">Next →</span><span className="ti">Latest dispatch.</span></div>}
          </div>
        </footer>

        <div className="wordmark-wrap"><div className="wordmark">PHIL MORA</div></div>
        <div className="foot-meta">
          <a href="/essays" rel="external" onClick={hardNav("/essays")}>← All dispatches</a>
          <span>© 2026 Phil Mora · CC BY 4.0</span>
          <span>Northern Colorado · 5,000 ft</span>
        </div>
      </div>
    </>
  )
}

addPropertyControls(EssayBodyCMS, {
  title: { type: ControlType.String, title: "Title", defaultValue: "", placeholder: "Bind to CMS: Title" },
  dek: { type: ControlType.String, title: "Dek", defaultValue: "", displayTextArea: true, placeholder: "Bind to CMS: Dek" },
  date: { type: ControlType.String, title: "Date", defaultValue: "", placeholder: "Bind to CMS: Date" },
  readingTime: { type: ControlType.Number, title: "Reading Time", defaultValue: 0, min: 0, max: 180 },
  order: { type: ControlType.Number, title: "Order", defaultValue: 0, min: 0, max: 999 },
  body: { type: ControlType.String, title: "Body (fallback)", defaultValue: "", displayTextArea: true, placeholder: "Auto-fetched from philmora/essays." },
  heroImage: { type: ControlType.ResponsiveImage, title: "Hero" },
})
