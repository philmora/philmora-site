// @ts-ignore
import { addPropertyControls, ControlType } from "framer"

/**
 * SiteFooter — D5 brutalist footer for interior pages (/thoughts, /essays/:slug).
 * Mirrors the footer baked into HomeContent. JetBrains Mono, chartreuse marker.
 * Container queries (not @media) for the mobile collapse.
 */
export default function SiteFooter() {
    return (
        <div className="pm-d5-foot-wrap">
            <style dangerouslySetInnerHTML={{ __html: `
.pm-d5-foot-wrap {
  --ink: #0A0B0E;
  --paper: #E8E6DC;
  --paper-dim: #989384;
  --paper-mute: #5A5750;
  --line: rgba(232, 230, 220, 0.14);
  --signal: #C8FF3D;
  width: 100%;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  -webkit-font-smoothing: antialiased;
  container-type: inline-size;
}
.pm-d5-foot-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
.pm-d5-foot {
  max-width: 1320px;
  margin: 48px auto 0;
  padding: 24px clamp(20px, 3cqw, 56px) 36px;
  border-top: 1px solid var(--line);
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 24px;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--paper-mute);
  align-items: baseline;
}
.pm-d5-foot .k { color: var(--paper-mute); }
.pm-d5-foot .k::before { content: "▍"; color: var(--signal); margin-right: 6px; }
.pm-d5-foot .copy { color: var(--paper-dim); line-height: 1.6; }
.pm-d5-foot .sys { text-align: right; white-space: nowrap; }

@container (max-width: 980px) {
  .pm-d5-foot { grid-template-columns: 1fr; gap: 12px; }
  .pm-d5-foot .sys { text-align: left; white-space: normal; }
}
` }} />
            <footer className="pm-d5-foot">
                <span className="k">v.01</span>
                <span className="copy">
                    © 2026 · Made at 5,000 ft in Northern Colorado · No humans
                    were harmed. Several AIs were caffeinated.
                </span>
                <span className="sys">Set in JetBrains Mono</span>
            </footer>
        </div>
    )
}

addPropertyControls(SiteFooter, {})
