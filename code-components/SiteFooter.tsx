// @ts-ignore
import { addPropertyControls, ControlType } from "framer"

/**
 * SiteFooter — standalone footer matching the home page footer.
 * Used on /thoughts, /404, and any secondary pages.
 *
 * Mobile (≤720px): grid collapses from 3-col to single stack, left-aligned,
 * tighter gutters. Matches the home page footer's mobile pattern.
 */
export default function SiteFooter() {
    return (
        <>
            <style>{`
                .pm-foot {
                    border-top: 1px solid rgba(237,230,215,0.18);
                    padding: 24px clamp(24px, 4vw, 72px);
                    width: 100%;
                    max-width: 1440px;
                    margin: 40px auto 0;
                    box-sizing: border-box;
                    font-family: 'JetBrains Mono', ui-monospace, monospace;
                    font-size: 11px;
                    color: #7A7568;
                    letter-spacing: 0.04em;
                }
                .pm-foot-row {
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    gap: 32px;
                    align-items: center;
                }
                .pm-foot-brand {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    color: #EDE6D7;
                    letter-spacing: 0.1em;
                    font-weight: 500;
                }
                .pm-foot-sigil {
                    width: 14px;
                    height: 14px;
                    border: 1.2px solid #EDE6D7;
                    transform: rotate(45deg);
                    position: relative;
                    display: inline-block;
                }
                .pm-foot-sigil::before {
                    content: "";
                    position: absolute;
                    inset: 2px;
                    background: #E26B38;
                    display: block;
                }
                .pm-foot-mid {
                    text-align: center;
                    font-size: 12px;
                    line-height: 1.6;
                    letter-spacing: 0.02em;
                }
                .pm-foot-sys {
                    text-align: right;
                    color: #BDB6A8;
                    font-size: 12px;
                    letter-spacing: 0.02em;
                }
                @media (max-width: 720px) {
                    .pm-foot {
                        padding: 20px;
                        margin-top: 32px;
                    }
                    .pm-foot-row {
                        grid-template-columns: 1fr;
                        gap: 12px;
                        text-align: left;
                    }
                    .pm-foot-mid {
                        text-align: left;
                        font-size: 11px;
                        line-height: 1.55;
                    }
                    .pm-foot-sys {
                        text-align: left;
                        font-size: 11px;
                    }
                }
            `}</style>
            <footer className="pm-foot">
                <div className="pm-foot-row">
                    <span className="pm-foot-brand">
                        <span className="pm-foot-sigil" />
                        PHIL MORA / 2026
                    </span>
                    <span className="pm-foot-mid">
                        © 2026. No humans were harmed in the making of this
                        experience. Several AIs were caffeinated. Made at
                        5,000ft in Northern Colorado.
                    </span>
                    <span className="pm-foot-sys">
                        ALL SYSTEMS OPERATIONAL · LAST DEPLOY APR 20, 2026
                    </span>
                </div>
            </footer>
        </>
    )
}

addPropertyControls(SiteFooter, {})
