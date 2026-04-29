// @ts-ignore
import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Props {
    timeZone?: string
    suffix?: string
    font?: string
    color?: string
    fontSize?: number
    letterSpacing?: number
}

/**
 * LiveClock — ticking clock in a given IANA time zone.
 * Defaults to America/Denver (Mountain Time).
 */
export default function LiveClock(props: Props) {
    const {
        timeZone = "America/Denver",
        suffix = "MT",
        font = "JetBrains Mono, ui-monospace, monospace",
        color = "#EDE6D7",
        fontSize = 13,
        letterSpacing = 0.02,
    } = props
    const [time, setTime] = useState("--:--:--")

    useEffect(() => {
        if (typeof window === "undefined") return
        const f = new Intl.DateTimeFormat("en-US", {
            timeZone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        })
        const tick = () => {
            const parts = f.formatToParts(new Date())
            const hh = parts.find((p) => p.type === "hour")?.value ?? "--"
            const mm = parts.find((p) => p.type === "minute")?.value ?? "--"
            const ss = parts.find((p) => p.type === "second")?.value ?? "--"
            setTime(`${hh}:${mm}:${ss}`)
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [timeZone])

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
            {time}
            {suffix ? ` ${suffix}` : ""}
        </span>
    )
}

addPropertyControls(LiveClock, {
    timeZone: {
        type: ControlType.String,
        title: "Time Zone",
        defaultValue: "America/Denver",
    },
    suffix: {
        type: ControlType.String,
        title: "Suffix",
        defaultValue: "MT",
    },
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
        defaultValue: 0.02,
        min: -0.1,
        max: 0.5,
        step: 0.01,
        unit: "em",
    },
})
