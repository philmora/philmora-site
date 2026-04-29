// @ts-ignore
import { addPropertyControls, ControlType } from "framer"

/**
 * SiteFooter — standalone footer matching the home page footer.
 * Used on /thoughts, /404, and any secondary pages.
 */
export default function SiteFooter() {
    const paper = "#EDE6D7"
    const paperMute = "#7A7568"
    const paperDim = "#BDB6A8"
    const signal = "#E26B38"
    const mono = "'JetBrains Mono', ui-monospace, monospace"

    return (
        <footer
            style={{
                borderTop: "1px solid rgba(237,230,215,0.18)",
                padding: "24px clamp(24px, 4vw, 72px)",
                marginTop: 40,
                width: "100%",
                maxWidth: 1440,
                margin: "40px auto 0",
                boxSizing: "border-box",
                fontFamily: mono,
                fontSize: 11,
                color: paperMute,
                letterSpacing: "0.04em",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 32,
                    alignItems: "center",
                }}
            >
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        color: paper,
                        letterSpacing: "0.1em",
                        fontWeight: 500,
                    }}
                >
                    <span
                        style={{
                            width: 14,
                            height: 14,
                            border: `1.2px solid ${paper}`,
                            transform: "rotate(45deg)",
                            position: "relative",
                            display: "inline-block",
                        }}
                    >
                        <span
                            style={{
                                position: "absolute",
                                inset: 2,
                                background: signal,
                                display: "block",
                            }}
                        />
                    </span>
                    PHIL MORA / 2026
                </span>
                <span
                    style={{
                        textAlign: "center",
                        fontSize: 12,
                        lineHeight: 1.6,
                        letterSpacing: "0.02em",
                    }}
                >
                    © 2026. No humans were harmed in the making of this
                    experience. Several AIs were caffeinated. Made at 5,000ft
                    in Northern Colorado.
                </span>
                <span
                    style={{
                        textAlign: "right",
                        color: paperDim,
                        fontSize: 12,
                        letterSpacing: "0.02em",
                    }}
                >
                    ALL SYSTEMS OPERATIONAL · LAST DEPLOY APR 20, 2026
                </span>
            </div>
        </footer>
    )
}

addPropertyControls(SiteFooter, {})
