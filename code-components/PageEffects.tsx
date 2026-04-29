// @ts-ignore
import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Props {
    enableCursor?: boolean
}

/**
 * PageEffects — Terminal Aurora boot layer.
 * Mounts fixed-viewport aurora gradient, noise grain, and custom cursor
 * (dot + ring with lerp). Drop ONE instance at the top of any page.
 */
export default function PageEffects(props: Props) {
    const enableCursor = props.enableCursor ?? true
    const dotRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (typeof window === "undefined") return
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
        if (!fine || !enableCursor) {
            if (dotRef.current) dotRef.current.style.display = "none"
            if (ringRef.current) ringRef.current.style.display = "none"
            return
        }

        document.documentElement.style.setProperty("cursor", "none")
        document.body.style.cursor = "none"

        let mx = window.innerWidth / 2
        let my = window.innerHeight / 2
        let rx = mx
        let ry = my
        let raf = 0

        const onMove = (e: MouseEvent) => {
            mx = e.clientX
            my = e.clientY
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
            }
        }

        const loop = () => {
            rx += (mx - rx) * 0.18
            ry += (my - ry) * 0.18
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
            }
            raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)

        const onOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null
            if (!target || !target.closest) return
            const body = document.body
            if (
                target.closest(
                    '[data-cursor="link"], a, button, .btn, [role="button"]'
                )
            ) {
                body.classList.add("hover-link")
            } else {
                body.classList.remove("hover-link")
            }
            const tagName = target.tagName
            if (
                ["P", "H1", "H2", "H3", "LI", "BLOCKQUOTE"].includes(tagName) &&
                !target.closest('[data-cursor="link"], a, button, .btn')
            ) {
                body.classList.add("hover-text")
            } else {
                body.classList.remove("hover-text")
            }
        }

        window.addEventListener("mousemove", onMove, { passive: true })
        document.addEventListener("mouseover", onOver)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener("mousemove", onMove)
            document.removeEventListener("mouseover", onOver)
            document.documentElement.style.removeProperty("cursor")
            document.body.style.cursor = ""
        }
    }, [enableCursor])

    return (
        <>
            <style>{`
                @keyframes pm_drift {
                    0%   { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(-2%, 1%) scale(1.05); }
                }
                @keyframes pm_pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.75); }
                }
                body.hover-link .pm-cursor-ring {
                    width: 64px !important; height: 64px !important;
                    border-color: #E26B38 !important;
                }
                body.hover-link .pm-cursor-dot {
                    background: #E26B38 !important;
                }
                body.hover-text .pm-cursor-ring {
                    width: 2px !important; height: 22px !important;
                    border-radius: 1px !important;
                }
                body.hover-text .pm-cursor-dot { opacity: 0 !important; }
            `}</style>
            <div
                aria-hidden="true"
                style={{
                    position: "fixed",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 1,
                    background: `
                        radial-gradient(1200px 600px at 15% 10%, rgba(115, 55, 25, 0.35), transparent 60%),
                        radial-gradient(900px 500px at 85% 85%, rgba(40, 45, 90, 0.28), transparent 60%),
                        radial-gradient(700px 400px at 50% 50%, rgba(60, 30, 70, 0.18), transparent 70%)
                    `,
                    animation: "pm_drift 24s ease-in-out infinite alternate",
                    mixBlendMode: "screen",
                }}
            />
            <div
                aria-hidden="true"
                style={{
                    position: "fixed",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 2,
                    opacity: 0.08,
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
                }}
            />
            {enableCursor && (
                <>
                    <div
                        ref={dotRef}
                        className="pm-cursor-dot"
                        aria-hidden="true"
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#EDE6D7",
                            pointerEvents: "none",
                            zIndex: 9999,
                            transform: "translate(-50%, -50%)",
                            mixBlendMode: "difference",
                            transition:
                                "width 180ms, height 180ms, background 180ms",
                        }}
                    />
                    <div
                        ref={ringRef}
                        className="pm-cursor-ring"
                        aria-hidden="true"
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: 36,
                            height: 36,
                            border: "1px solid #EDE6D7",
                            borderRadius: "50%",
                            pointerEvents: "none",
                            zIndex: 9999,
                            transform: "translate(-50%, -50%)",
                            mixBlendMode: "difference",
                            transition:
                                "width 260ms cubic-bezier(.2,.9,.2,1), height 260ms cubic-bezier(.2,.9,.2,1), border-color 200ms",
                        }}
                    />
                </>
            )}
        </>
    )
}

addPropertyControls(PageEffects, {
    enableCursor: {
        type: ControlType.Boolean,
        title: "Custom Cursor",
        defaultValue: true,
    },
})
