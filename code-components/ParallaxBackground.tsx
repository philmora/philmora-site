import { useRef, useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Props {
    image: string
    parallaxSpeed: number
    overlay: string
    overlayOpacity: number
    style?: React.CSSProperties
}

export default function ParallaxBackground({
    image,
    parallaxSpeed = 0.15,
    overlay = "rgba(0,0,0,0.4)",
    overlayOpacity = 0.4,
    style,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                const scrolled = window.scrollY
                setOffset(scrolled * parallaxSpeed)
            }
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [parallaxSpeed])

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
                ...style,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transform: `translateY(${offset}px)`,
                    willChange: "transform",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: overlay,
                    opacity: overlayOpacity,
                }}
            />
        </div>
    )
}

addPropertyControls(ParallaxBackground, {
    image: {
        type: ControlType.Image,
        title: "Background Image",
    },
    parallaxSpeed: {
        type: ControlType.Number,
        title: "Parallax Speed",
        defaultValue: 0.15,
        min: 0,
        max: 0.5,
        step: 0.05,
    },
    overlay: {
        type: ControlType.Color,
        title: "Overlay Color",
        defaultValue: "rgba(0,0,0,0.4)",
    },
    overlayOpacity: {
        type: ControlType.Number,
        title: "Overlay Opacity",
        defaultValue: 0.4,
        min: 0,
        max: 1,
        step: 0.1,
    },
})