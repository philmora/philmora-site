import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * Parallax Hero Background
 * Creates a subtle parallax effect on the background image
 */
export default function ParallaxHero(props) {
    const {
        backgroundImage,
        parallaxStrength = 0.15,
        overlayOpacity = 0.4,
        height = 600,
        children,
    } = props

    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", `${parallaxStrength * 100}%`])

    return (
        <div
            ref={ref}
            style={{
                position: "relative",
                width: "100%",
                height: height,
                overflow: "hidden",
            }}
        >
            {/* Parallax Background */}
            <motion.div
                style={{
                    position: "absolute",
                    top: "-10%",
                    left: 0,
                    right: 0,
                    bottom: "-10%",
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    y,
                }}
            />

            {/* Dark Overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                {children}
            </div>
        </div>
    )
}

addPropertyControls(ParallaxHero, {
    backgroundImage: {
        type: ControlType.Image,
        title: "Background",
    },
    parallaxStrength: {
        type: ControlType.Number,
        title: "Parallax",
        defaultValue: 0.15,
        min: 0,
        max: 0.5,
        step: 0.05,
    },
    overlayOpacity: {
        type: ControlType.Number,
        title: "Overlay",
        defaultValue: 0.4,
        min: 0,
        max: 1,
        step: 0.1,
    },
    height: {
        type: ControlType.Number,
        title: "Height",
        defaultValue: 600,
        min: 200,
        max: 1200,
        step: 50,
    },
    children: {
        type: ControlType.ComponentInstance,
        title: "Content",
    },
})