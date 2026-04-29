// @ts-ignore
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Props {
    target?: number
    prefix?: string
    suffix?: string
    duration?: number
    font?: string
    color?: string
    fontSize?: number
    letterSpacing?: number
    lineHeight?: number
    formatThousands?: boolean
}

/**
 * StatCounter — counts up from 0 to `target` on first viewport entry.
 * Used for the big Now-section numbers (160, 200, 5, 12).
 */
export default function StatCounter(props: Props) {
    const {
        target = 100,
        prefix = "",
        suffix = "",
        duration = 1200,
        font = "'Fraunces', 'Times New Roman', serif",
        color = "#EDE6D7",
        fontSize = 72,
        letterSpacing = -0.04,
        lineHeight = 1,
        formatThousands = false,
    } = props
    const [value, setValue] = useState(0)
    const ref = useRef<HTMLDivElement>(null)
    const started = useRef(false)

    useEffect(() => {
        if (typeof window === "undefined") return
        if (!ref.current) return
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((en) => {
                    if (!en.isIntersecting || started.current) return
                    started.current = true
                    io.unobserve(en.target)
                    const start = performance.now()
                    const step = (t: number) => {
                        const p = Math.min(1, (t - start) / duration)
                        const eased = 1 - Math.pow(1 - p, 3)
                        setValue(Math.floor(target * eased))
                        if (p < 1) requestAnimationFrame(step)
                        else setValue(target)
                    }
                    requestAnimationFrame(step)
                })
            },
            { threshold: 0.4 }
        )
        io.observe(ref.current)
        return () => io.disconnect()
    }, [target, duration])

    const formatted = formatThousands
        ? value.toLocaleString("en-US")
        : String(value)

    return (
        <div
            ref={ref}
            style={{
                fontFamily: font,
                color,
                fontSize,
                letterSpacing: `${letterSpacing}em`,
                fontVariantNumeric: "tabular-nums",
                lineHeight,
                fontWeight: 300,
                whiteSpace: "nowrap",
            }}
        >
            {prefix}
            {formatted}
            {suffix}
        </div>
    )
}

addPropertyControls(StatCounter, {
    target: {
        type: ControlType.Number,
        title: "Target",
        defaultValue: 100,
        min: 0,
        max: 1000000000,
        step: 1,
    },
    prefix: {
        type: ControlType.String,
        title: "Prefix",
        defaultValue: "",
    },
    suffix: {
        type: ControlType.String,
        title: "Suffix",
        defaultValue: "",
    },
    duration: {
        type: ControlType.Number,
        title: "Duration",
        defaultValue: 1200,
        min: 200,
        max: 5000,
        step: 100,
        unit: "ms",
    },
    formatThousands: {
        type: ControlType.Boolean,
        title: "Thousands Separator",
        defaultValue: false,
    },
    font: {
        type: ControlType.String,
        title: "Font Stack",
        defaultValue: "'Fraunces', 'Times New Roman', serif",
    },
    color: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: "#EDE6D7",
    },
    fontSize: {
        type: ControlType.Number,
        title: "Font Size",
        defaultValue: 72,
        min: 12,
        max: 240,
        unit: "px",
    },
    letterSpacing: {
        type: ControlType.Number,
        title: "Letter Spacing",
        defaultValue: -0.04,
        min: -0.2,
        max: 0.5,
        step: 0.005,
        unit: "em",
    },
    lineHeight: {
        type: ControlType.Number,
        title: "Line Height",
        defaultValue: 1,
        min: 0.5,
        max: 2,
        step: 0.05,
    },
})
