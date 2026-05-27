// @ts-ignore

export default function HomeContent() {
  return (
    <div className="pm-d5">
      <style dangerouslySetInnerHTML={{ __html: `
.pm-d5 {
  --ink: #0A0B0E;
  --ink-2: #131419;
  --ink-3: #1A1C22;
  --paper: #E8E6DC;
  --paper-dim: #989384;
  --paper-mute: #5A5750;
  --line: rgba(232, 230, 220, 0.14);
  --line-strong: rgba(232, 230, 220, 0.30);

  --signal: #C8FF3D;
  --signal-dim: #87a821;
  --warn: #FF6B35;

  --gutter: clamp(20px, 3cqw, 56px);

  position: relative;
  background: var(--ink);
  color: var(--paper);
  font-family: "JetBrains Mono", monospace;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  container-type: inline-size;
}
.pm-d5 * { box-sizing: border-box; margin: 0; padding: 0; }
.pm-d5 .page { position: relative; z-index: 3; max-width: 1320px; margin: 0 auto; padding: 0 var(--gutter); }

.pm-d5::before {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background-image:
    linear-gradient(rgba(232, 230, 220, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232, 230, 220, 0.025) 1px, transparent 1px);
  background-size: 80px 80px;
}
.pm-d5::after {
  content: ""; position: absolute; inset: 0; z-index: 2; pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

.pm-d5 .term-bar {
  position: sticky; top: 0; z-index: 50;
  border-top: 4px solid var(--signal);
  border-bottom: 1px solid var(--line);
  background: var(--ink);
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  font-size: 11px;
  letter-spacing: 0.06em;
}
.pm-d5 .tb-cell {
  padding: 12px 18px;
  border-right: 1px solid var(--line);
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--paper-dim);
  text-decoration: none;
}
.pm-d5 .tb-cell:last-child { border-right: 0; justify-content: flex-end; }
.pm-d5 .tb-cell.id { color: var(--paper); font-weight: 700; }
.pm-d5 .tb-cell.id::before { content: "▍"; color: var(--signal); }
.pm-d5 .tb-cell.id .meta {
  color: var(--paper-mute);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  margin-left: 6px;
  font-weight: 500;
}
.pm-d5 .tb-cell.sister {
  color: var(--paper-mute);
  font-weight: 500;
  transition: color 200ms, background 200ms;
  position: relative;
}
.pm-d5 .tb-cell.sister::before {
  content: "▍";
  color: var(--warn);
  margin-right: 8px;
}
.pm-d5 .tb-cell.sister:hover {
  background: var(--ink-2);
  color: var(--warn);
}
.pm-d5 .tb-cell.sister .meta {
  color: var(--paper-mute);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  margin-left: 6px;
}
.pm-d5 .tb-cell.sister:hover .meta { color: var(--warn); }
.pm-d5 .tb-cell .pulse {
  width: 8px; height: 8px; background: var(--signal); border-radius: 50%;
  box-shadow: 0 0 10px var(--signal);
  animation: pm-d5-pulse 1.4s ease-in-out infinite;
}
@keyframes pm-d5-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.pm-d5 .tb-cell .sep { color: var(--paper-mute); }

.pm-d5 .tb-nav { display: flex; gap: 20px; }
.pm-d5 .tb-nav a {
  color: var(--paper-dim);
  text-decoration: none;
  border-bottom: 1px dashed transparent;
  transition: all 200ms;
}
.pm-d5 .tb-nav a:hover { color: var(--signal); border-bottom-color: var(--signal); }
.pm-d5 .tb-nav a::before { content: "["; color: var(--paper-mute); }
.pm-d5 .tb-nav a::after { content: "]"; color: var(--paper-mute); }

.pm-d5 .hero {
  padding: 80px 0 60px;
  border-bottom: 1px solid var(--line);
  position: relative;
  overflow: hidden;
}
.pm-d5 .hero-bg {
  position: absolute;
  inset: -40px calc(-1 * var(--gutter)) -40px calc(-1 * var(--gutter));
  background: url('https://files.catbox.moe/nac0q9.png') center/cover;
  opacity: 0.20;
  filter: saturate(0.9) contrast(1.1) hue-rotate(-10deg);
  z-index: 0;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 45%, black 35%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 45%, black 35%, transparent 80%);
  pointer-events: none;
}
.pm-d5 .hero-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10,11,14,0.4) 0%, transparent 50%, rgba(10,11,14,0.7) 100%);
}
.pm-d5 .hero > * { position: relative; z-index: 1; }
.pm-d5 .hero-row1 {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 24px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--paper-mute);
  margin-bottom: 28px;
}
.pm-d5 .hero-row1 .k { color: var(--signal); }
.pm-d5 .hero h1 {
  font-family: "JetBrains Mono", monospace;
  font-weight: 100;
  font-size: clamp(40px, 11cqw, 144px);
  line-height: 0.95;
  letter-spacing: -0.06em;
  color: var(--paper);
  margin-bottom: 24px;
  max-width: 22ch;
  text-wrap: balance;
}
.pm-d5 .hero h1 .b { font-weight: 800; color: var(--signal); }
.pm-d5 .hero h1 .i { font-weight: 800; font-style: italic; color: var(--paper); }
.pm-d5 .hero h1 br { line-height: 1; }
.pm-d5 .hero-lead-row {
  display: grid;
  grid-template-columns: 80px 1fr 1fr;
  gap: 24px;
  border-top: 1px solid var(--line);
  padding-top: 28px;
  margin-top: 32px;
}
.pm-d5 .hero-lead-row .k {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--paper-mute);
}
.pm-d5 .hero-lead-row .k::before { content: "// "; color: var(--signal); }
.pm-d5 .hero-lead {
  font-size: 14px;
  line-height: 1.6;
  color: var(--paper);
  letter-spacing: 0.005em;
  max-width: 56ch;
}
.pm-d5 .hero-lead b { color: var(--signal); font-weight: 700; }
.pm-d5 .hero-lead i { color: var(--paper); font-style: italic; font-weight: 600; background: rgba(200,255,61,0.08); padding: 1px 4px; }
.pm-d5 .hero-cta-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}
.pm-d5 .btn {
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 12px 18px;
  border: 1px solid var(--paper);
  background: var(--paper);
  color: var(--ink);
  text-decoration: none;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 200ms;
}
.pm-d5 .btn:hover {
  background: var(--signal);
  border-color: var(--signal);
}
.pm-d5 .btn .arr { font-weight: 800; }
.pm-d5 .btn-ghost {
  background: transparent;
  color: var(--paper);
  border: 1px solid var(--line-strong);
}
.pm-d5 .btn-ghost:hover {
  background: var(--paper);
  color: var(--ink);
  border-color: var(--paper);
}

.pm-d5 .sec-head {
  padding: 64px 0 28px;
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 24px;
  align-items: baseline;
  border-bottom: 1px solid var(--line);
}
.pm-d5 .sec-key {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--signal);
}
.pm-d5 .sec-key::before { content: "§"; color: var(--paper-mute); margin-right: 4px; }
.pm-d5 .sec-name {
  font-weight: 100;
  font-size: clamp(30px, 5.5cqw, 72px);
  letter-spacing: -0.05em;
  line-height: 1;
  color: var(--paper);
}
.pm-d5 .sec-name b { font-weight: 800; color: var(--signal); }
.pm-d5 .sec-meta {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--paper-mute);
}
.pm-d5 .sec-meta::before { content: "// "; color: var(--signal-dim); }

.pm-d5 .now {
  padding-bottom: 16px;
}
.pm-d5 .now-grid {
  display: grid;
  grid-template-columns: 80px 1fr 1fr;
  gap: 24px;
  padding: 28px 0 32px;
  border-bottom: 1px solid var(--line);
}
.pm-d5 .now-grid .k {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--paper-mute);
}
.pm-d5 .now-grid .k::before { content: "// "; color: var(--signal); }
.pm-d5 .now-prose {
  font-size: 14px;
  line-height: 1.65;
  color: var(--paper);
  letter-spacing: 0.005em;
}
.pm-d5 .now-prose p { margin-bottom: 14px; }
.pm-d5 .now-prose i { font-style: italic; font-weight: 700; color: var(--signal); background: rgba(200,255,61,0.08); padding: 1px 4px; }
.pm-d5 .now-table {
  font-size: 13px;
  border: 1px solid var(--line-strong);
}
.pm-d5 .now-table-row {
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 11px 14px;
  border-bottom: 1px solid var(--line);
  letter-spacing: 0.04em;
  color: var(--paper-dim);
}
.pm-d5 .now-table-row:last-child { border-bottom: 0; }
.pm-d5 .now-table-row .v {
  color: var(--signal);
  font-weight: 700;
}
.pm-d5 .now-table-row.head {
  background: var(--ink-2);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--paper-mute);
  font-weight: 700;
}
.pm-d5 .now-prev {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 24px;
  margin-top: 12px;
  padding-top: 24px;
  border-top: 1px dashed var(--line-strong);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--paper-dim);
}
.pm-d5 .now-prev .k { color: var(--paper-mute); }
.pm-d5 .now-prev .k::before { content: "▍"; color: var(--signal); margin-right: 6px; }
.pm-d5 .now-prev p { line-height: 1.6; }
.pm-d5 .now-prev p i { color: var(--paper); font-style: italic; font-weight: 600; }

.pm-d5 .builder-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.pm-d5 .b-card {
  padding: 28px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  position: relative;
  min-height: 280px;
  transition: background 240ms;
}
.pm-d5 .b-card:nth-child(even) { border-right: 0; }
.pm-d5 .b-card:nth-child(n+3) { border-bottom: 0; }
.pm-d5 .b-card:hover { background: var(--ink-2); }
.pm-d5 .b-card::before {
  content: "▍";
  position: absolute;
  left: 0; top: 28px;
  color: var(--signal);
  font-size: 14px;
  line-height: 1;
  opacity: 0;
  transition: opacity 200ms;
}
.pm-d5 .b-card:hover::before { opacity: 1; }
.pm-d5 .b-meta {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--paper-mute);
}
.pm-d5 .b-meta .k { color: var(--signal); }
.pm-d5 .b-id {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--paper-mute);
}
.pm-d5 .b-card-name {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--paper);
}
.pm-d5 .b-card-sub {
  font-size: 14px;
  font-style: italic;
  font-weight: 400;
  color: var(--paper-dim);
}
.pm-d5 .b-card-desc {
  font-size: 13px;
  line-height: 1.55;
  color: var(--paper-dim);
  letter-spacing: 0.005em;
}
.pm-d5 .b-card-foot {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px dashed var(--line);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--paper-mute);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pm-d5 .b-card:hover .b-card-foot { color: var(--signal); }

.pm-d5 .fn-table {
  border-top: 1px solid var(--line-strong);
  border-bottom: 1px solid var(--line-strong);
}
.pm-d5 .fn-row {
  display: grid;
  grid-template-columns: 56px 100px 1fr 80px 80px;
  gap: 20px;
  align-items: center;
  padding: 16px 18px;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  font-size: 13px;
  transition: background 200ms, padding-left 200ms;
}
.pm-d5 .fn-row.head {
  background: var(--ink-2);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--paper-mute);
  font-weight: 700;
  cursor: default;
}
.pm-d5 .fn-row.head:hover { background: var(--ink-2); padding-left: 18px; }
.pm-d5 .fn-row:last-child { border-bottom: 0; }
.pm-d5 .fn-row:hover {
  background: var(--ink-2);
  padding-left: 28px;
}
.pm-d5 .fn-no {
  color: var(--signal);
  font-weight: 700;
  letter-spacing: 0.04em;
}
.pm-d5 .fn-date { color: var(--paper-mute); letter-spacing: 0.05em; }
.pm-d5 .fn-title {
  font-weight: 700;
  color: var(--paper);
  letter-spacing: -0.005em;
}
.pm-d5 .fn-title i { font-style: italic; font-weight: 800; color: var(--signal); }
.pm-d5 .fn-time { color: var(--paper-mute); letter-spacing: 0.06em; }
.pm-d5 .fn-action {
  text-align: right;
  color: var(--paper-mute);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 700;
}
.pm-d5 .fn-row:hover .fn-action { color: var(--signal); }

.pm-d5 .contact {
  margin-top: 80px;
  padding: 48px 0;
  border-top: 4px solid var(--signal);
  border-bottom: 1px solid var(--line);
  display: grid;
  grid-template-columns: 80px 1fr 1fr;
  gap: 24px;
  align-items: start;
}
.pm-d5 .contact .k {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--signal);
}
.pm-d5 .contact .k::before { content: "▍"; }
.pm-d5 .contact-h {
  font-weight: 100;
  font-size: clamp(26px, 4.2cqw, 52px);
  letter-spacing: -0.05em;
  line-height: 1;
  color: var(--paper);
}
.pm-d5 .contact-h b { font-weight: 800; color: var(--signal); font-style: italic; }
.pm-d5 .contact-body {
  font-size: 14px;
  line-height: 1.6;
  color: var(--paper-dim);
  margin-top: 16px;
  max-width: 50ch;
}
.pm-d5 .contact-links {
  display: flex;
  flex-direction: column;
  gap: 1px;
  border: 1px solid var(--line-strong);
}
.pm-d5 .contact-links a {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: var(--paper);
  font-size: 13px;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--line);
  transition: all 200ms;
}
.pm-d5 .contact-links a:last-child { border-bottom: 0; }
.pm-d5 .contact-links a:hover {
  background: var(--signal);
  color: var(--ink);
  font-weight: 700;
}
.pm-d5 .contact-links a.warm:hover {
  background: var(--warn);
  color: var(--ink);
}
.pm-d5 .contact-links a .arr { font-weight: 800; }
.pm-d5 .contact-links a .tag {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--paper-mute);
  margin-right: 8px;
}
.pm-d5 .contact-links a.warm .tag { color: var(--warn); }
.pm-d5 .contact-links a.warm:hover .tag { color: var(--ink); }

.pm-d5 .foot {
  margin-top: 48px;
  padding: 24px 0 36px;
  border-top: 1px solid var(--line);
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 24px;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--paper-mute);
}
.pm-d5 .foot .k { color: var(--paper-mute); }
.pm-d5 .foot .k::before { content: "▍"; color: var(--signal); margin-right: 6px; }
.pm-d5 .foot .copy { color: var(--paper-dim); }

@container (max-width: 980px) {
  .pm-d5 .term-bar { grid-template-columns: 1fr; }
  .pm-d5 .tb-cell { border-right: 0; border-bottom: 1px solid var(--line); }
  .pm-d5 .tb-nav { display: none; }
  .pm-d5 .hero-lead-row { grid-template-columns: 1fr; }
  .pm-d5 .now-grid { grid-template-columns: 1fr; }
  .pm-d5 .builder-grid { grid-template-columns: 1fr; }
  .pm-d5 .b-card { border-right: 0; border-bottom: 1px solid var(--line); }
  .pm-d5 .b-card:nth-child(n) { border-right: 0; border-bottom: 1px solid var(--line); }
  .pm-d5 .b-card:last-child { border-bottom: 0; }
  .pm-d5 .fn-row { grid-template-columns: 48px 80px 1fr; gap: 14px; padding: 12px; font-size: 12px; }
  .pm-d5 .fn-time, .pm-d5 .fn-action { display: none; }
  .pm-d5 .contact { grid-template-columns: 1fr; }
  .pm-d5 .foot { grid-template-columns: 1fr; }
}
` }} />

      <header className="term-bar">
        <div className="tb-cell id">PHIL MORA<span className="meta">// the engine</span></div>
        <a className="tb-cell sister" href="https://butchsonic.com" target="_blank" rel="noopener">BUTCHSONIC<span className="meta">// the muse</span></a>
        <nav className="tb-cell tb-nav">
          <a href="#now">now</a>
          <a href="#builder">builder</a>
          <a href="#field-notes">field-notes</a>
          <a href="mailto:hi@philmora.com">say-hello</a>
        </nav>
        <div className="tb-cell"><span className="pulse"></span>LIVE <span className="sep">/</span> FoCo <span className="sep">/</span> 5,000 ft</div>
      </header>

      <main className="page">

        <section className="hero">
          <div className="hero-bg"></div>
          <div className="hero-row1">
            <span className="k">// MARK</span>
            <span>PHIL MORA / BUILDER / MAY 2026 / TRANSMISSION 09</span>
          </div>
          <h1>
            Something <span className="b">broke.</span><br />
            The&nbsp;space between idea<br />
            and working software <span className="i">collapsed.</span>
          </h1>

          <div className="hero-lead-row">
            <span className="k">brief</span>
            <p className="hero-lead">
              I build in the wreckage. <b>Agent-native fintech platform</b> for U.S. healthcare at Machinify — five companies becoming one. $200B+ in flow, 160 million lives. <i>Agents draft, humans judge, agents iterate, humans ship.</i> That's the workflow.
            </p>
            <div className="hero-cta-row">
              <a className="btn" href="#field-notes">Read field notes <span className="arr">→</span></a>
              <a className="btn btn-ghost" href="#builder">See receipts <span className="arr">→</span></a>
            </div>
          </div>
        </section>

        <section id="now" className="now">
          <header className="sec-head">
            <div className="sec-key">01 · NOW</div>
            <h2 className="sec-name">Currently <b>building.</b></h2>
            <div className="sec-meta">Q2 / 2026 / Machinify</div>
          </header>

          <div className="now-grid">
            <span className="k">log</span>
            <div className="now-prose">
              <p>At Machinify — unifying <i>five acquired healthcare payments companies</i> into one AI-native platform. The work is designing systems where AI agents are first-class participants. Not prompted tools. Not hypothetical teammates. Agents that get assigned work, take action, flag problems, and learn from outcomes.</p>
              <p>It's the most complex thing I've ever built. Also the most fun.</p>
              <p>Thinking about: what happens to organizations when the PM-to-engineer ratio inverts. Writing about it in <i>Field Notes</i>. Building with it every weekday.</p>
            </div>

            <div className="now-table">
              <div className="now-table-row head"><span>Metric</span><span>Value</span></div>
              <div className="now-table-row"><span>Annual flow</span><span className="v">$200B+ / yr</span></div>
              <div className="now-table-row"><span>Covered lives</span><span className="v">160M</span></div>
              <div className="now-table-row"><span>Health plans</span><span className="v">75+</span></div>
              <div className="now-table-row"><span>Consolidation</span><span className="v">5 → 1</span></div>
              <div className="now-table-row"><span>Vendor spend now internal</span><span className="v">$500K / yr</span></div>
            </div>

            <div className="now-prev">
              <span className="k">prev</span>
              <p><i>League</i> · <i>Nutrien</i> · <i>Sikka</i> · twelve years at Nvidia and in semiconductors. Same job, different industries.</p>
            </div>
          </div>
        </section>

        <section id="builder">
          <header className="sec-head">
            <div className="sec-key">02 · BUILDER</div>
            <h2 className="sec-name">Not theory. <b>Receipts.</b></h2>
            <div className="sec-meta">Four currently shipping</div>
          </header>

          <div className="builder-grid">
            <a className="b-card" href="https://github.com/philmora/product-factory-mirror">
              <div className="b-meta"><span className="k">i.</span><span>github.com/philmora</span></div>
              <div className="b-id">live · open-source · airlocked</div>
              <div className="b-card-name">product-factory</div>
              <div className="b-card-sub">cross-project shipping recipes</div>
              <p className="b-card-desc">A living catalog of patterns and decisions for shipping software in the agent era. Sanitized mirror of a private wiki. Framer mobile compaction. OG card generation. More to come.</p>
              <div className="b-card-foot"><span>product-factory-mirror</span><span>↗</span></div>
            </a>

            <a className="b-card" href="https://github.com/philmora/philmora-site">
              <div className="b-meta"><span className="k">ii.</span><span>github.com/philmora</span></div>
              <div className="b-id">live · open-source</div>
              <div className="b-card-name">philmora-site</div>
              <div className="b-card-sub">the site you're reading</div>
              <p className="b-card-desc">Designed in Claude Design. Implemented by Claude Code via Framer MCP. Every component is a React code file I committed. Not a template. Prompt to production.</p>
              <div className="b-card-foot"><span>philmora-site</span><span>↗</span></div>
            </a>

            <a className="b-card" href="https://github.com/philmora/ai-agent-memory">
              <div className="b-meta"><span className="k">iii.</span><span>github.com/philmora</span></div>
              <div className="b-id">v1 archived · v2 wip · MIT</div>
              <div className="b-card-name">ai-agent-memory</div>
              <div className="b-card-sub">persistent memory for agents</div>
              <p className="b-card-desc">Single-file Python CLI. SQLite FTS5 + optional LLM semantic re-ranking. Zero dependencies. First-generation memory layer — v2 (generalized second-brain) in progress.</p>
              <div className="b-card-foot"><span>ai-agent-memory</span><span>↗</span></div>
            </a>

            <a className="b-card" href="https://butchsonic.com">
              <div className="b-meta"><span className="k">iv.</span><span>butchsonic.com</span></div>
              <div className="b-id">live · side · creative-lab</div>
              <div className="b-card-name">butchsonic</div>
              <div className="b-card-sub">creative AI lab</div>
              <p className="b-card-desc">Music + visual art + video, end-to-end agent-generated. Separate brand, separate community. Evidence of what's possible when agents do the creative work.</p>
              <div className="b-card-foot"><span>butchsonic.com</span><span>↗</span></div>
            </a>
          </div>
        </section>

        <section id="field-notes">
          <header className="sec-head">
            <div className="sec-key">03 · FIELD NOTES</div>
            <h2 className="sec-name">Notes from the <b>collision.</b></h2>
            <div className="sec-meta">Eight dispatches · 2026</div>
          </header>

          <div className="fn-table">
            <div className="fn-row head"><span>№</span><span>Date</span><span>Title</span><span>Read</span><span></span></div>
            <a className="fn-row" href="/essays/after-the-prd"><span className="fn-no">008</span><span className="fn-date">Apr 2026</span><span className="fn-title"><i>After</i> the PRD.</span><span className="fn-time">14 min</span><span className="fn-action">Read →</span></a>
            <a className="fn-row" href="/essays/agents-as-teammates"><span className="fn-no">007</span><span className="fn-date">Mar 2026</span><span className="fn-title">Agents as <i>teammates</i>, not tools.</span><span className="fn-time">11 min</span><span className="fn-action">Read →</span></a>
            <a className="fn-row" href="/essays/code-wizards-to-cosmic-architects"><span className="fn-no">006</span><span className="fn-date">Mar 2026</span><span className="fn-title">From code wizards to <i>cosmic architects.</i></span><span className="fn-time">10 min</span><span className="fn-action">Read →</span></a>
            <a className="fn-row" href="/essays/the-invisible-platform"><span className="fn-no">005</span><span className="fn-date">Feb 2026</span><span className="fn-title">The invisible <i>platform.</i></span><span className="fn-time">09 min</span><span className="fn-action">Read →</span></a>
            <a className="fn-row" href="/essays/the-expertise-inversion"><span className="fn-no">004</span><span className="fn-date">Feb 2026</span><span className="fn-title">The expertise <i>inversion.</i></span><span className="fn-time">09 min</span><span className="fn-action">Read →</span></a>
            <a className="fn-row" href="/essays/the-combination-premium"><span className="fn-no">003</span><span className="fn-date">Feb 2026</span><span className="fn-title">The combination <i>premium.</i></span><span className="fn-time">10 min</span><span className="fn-action">Read →</span></a>
            <a className="fn-row" href="/essays/the-five-breaks"><span className="fn-no">002</span><span className="fn-date">Jan 2026</span><span className="fn-title">The five <i>breaks.</i></span><span className="fn-time">09 min</span><span className="fn-action">Read →</span></a>
            <a className="fn-row" href="/essays/prototypes-vs-specs"><span className="fn-no">001</span><span className="fn-date">Jan 2026</span><span className="fn-title">Prototypes &gt; <i>specs.</i></span><span className="fn-time">07 min</span><span className="fn-action">Read →</span></a>
          </div>
        </section>

        <section id="say-hello" className="contact">
          <span className="k">say hello</span>
          <div>
            <h2 className="contact-h">If you're<br /><b>building</b> too —</h2>
            <p className="contact-body">I'm always up for a conversation with other operators in the collapse. Advisory calls. Peer reviews of agent-native architectures. The occasional "is this crazy or is it the future" dinner.</p>
          </div>
          <div className="contact-links">
            <a href="https://github.com/philmora"><span><span className="tag">// CODE</span>github.com/philmora</span><span className="arr">↗</span></a>
            <a href="mailto:hi@philmora.com"><span><span className="tag">// MAIL</span>hi@philmora.com</span><span className="arr">↗</span></a>
            <a className="warm" href="https://butchsonic.com" target="_blank" rel="noopener"><span><span className="tag">// THE MUSE</span>butchsonic.com<span style={{ color: "var(--paper-mute)", marginLeft: "8px", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase" }}>the other hemisphere</span></span><span className="arr">↗</span></a>
          </div>
        </section>

        <footer className="foot">
          <span className="k">v.01</span>
          <span className="copy">© 2026 · Made at 5,000 ft in Northern Colorado · No humans were harmed. Several AIs were caffeinated.</span>
          <span>Set in JetBrains Mono</span>
        </footer>

      </main>
    </div>
  )
}
