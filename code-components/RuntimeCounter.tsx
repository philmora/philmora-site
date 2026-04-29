// @ts-ignore
import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Props {
    font?: string
    color?: string
    fontSize?: number
    letterSpacing?: number
}

/**
 * RuntimeCounter — HH:MM:SS since component mount.
 * Used in hero runtime strip to show "how long you've been here."
 */
export default function RuntimeCounter(props: Props) {
    const {
        font = "JetBrains Mono, ui-monospace, monospace",
        color = "#EDE6D7",
        fontSize = 13,
        letterSpacing = 0.04,
    } = props
    const [runtime, setRuntime] = useState("00:00:00")

    useEffect(() => {
        if (typeof window === "undefined") return
        const start = Date.now()
        const tick = () => {
            const t = Math.floor((Date.now() - start) / 1000)
            const hh = String(Math.floor(t / 3600)).padStart(2, "0")
            const mm = String(Math.floor((t % 3600) / 60)).padStart(2, "0")
            const ss = String(t % 60).padStart(2, "0")
            setRuntime(`${hh}:${mm}:${ss}`)
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])

    return (
        <span
            style={{
                fontFamily: font,
                color,
                fontSize,
                letterSpacing: `${letterSpacing}em`,
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
            }}
        >
            {runtime}
        </span>
    )
}

addPropertyControls(RuntimeCounter, {
    font: {
        type: ControlType.String,
        title: "Font Stack",
        defaultValue: "JetBrains Mono, ui-monospace, monospace",
    },
    color: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: "#EDE6D7",
    },
    fontSize: {
        type: ControlType.Number,
        title: "Font Size",
        defaultValue: 13,
        min: 8,
        max: 72,
        unit: "px",
    },
    letterSpacing: {
        type: ControlType.Number,
        title: "Letter Spacing",
        defaultValue: 0.04,
        min: -0.1,
        max: 0.5,
        step: 0.01,
        unit: "em",
    },
})
