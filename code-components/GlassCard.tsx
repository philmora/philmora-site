import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"

/**
 * GlassCard — Apple-style frosted glass container
 * Uses backdrop-filter for blur effect with teal-tinted borders
 */
export default function GlassCard(props) {
    const {
        children,
        blurAmount = 20,
        bgOpacity = 0.4,
        bgColor = "10, 14, 26",
        borderOpacity = 0.12,
        borderColor = "0, 229, 204",
        borderRadius = 12,
        padding = 48,
        glowOnHover = false,
        hoverGlowColor = "0, 229, 204",
        hoverGlowOpacity = 0.08,
        style,
    } = props

    return (
        <motion.div
            style={{
                position: "relative",
                width: "100%",
                height: "fit-content",
                borderRadius: borderRadius,
                overflow: "hidden",
                ...style,
            }}
            whileHover={glowOnHover ? {
                boxShadow: `0 0 40px rgba(${hoverGlowColor}, ${hoverGlowOpacity}), inset 0 0 40px rgba(${hoverGlowColor}, 0.03)`,
            } : undefined}
            transition={{ duration: 0.3 }}
        >
            {/* Glass background layer */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: `rgba(${bgColor}, ${bgOpacity})`,
                    backdropFilter: `blur(${blurAmount}px)`,
                    WebkitBackdropFilter: `blur(${blurAmount}px)`,
                    border: `1px solid rgba(${borderColor}, ${borderOpacity})`,
                    borderRadius: borderRadius,
                    zIndex: 0,
                }}
            />

            {/* Subtle top highlight for glass depth */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    background: `linear-gradient(90deg, transparent 0%, rgba(${borderColor}, 0.2) 50%, transparent 100%)`,
                    borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
                    zIndex: 1,
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    padding: padding,
                    width: "100%",
                }}
            >
                {children}
            </div>
        </motion.div>
    )
}

addPropertyControls(GlassCard, {
    children: {
        type: ControlType.ComponentInstance,
        title: "Content",
    },
    blurAmount: {
        type: ControlType.Number,
        title: "Blur",
        defaultValue: 20,
        min: 0,
        max: 60,
        step: 2,
        description: "Backdrop blur intensity",
    },
    bgOpacity: {
        type: ControlType.Number,
        title: "BG Opacity",
        defaultValue: 0.4,
        min: 0,
        max: 1,
        step: 0.05,
        description: "Background darkness",
    },
    bgColor: {
        type: ControlType.String,
        title: "BG Color (RGB)",
        defaultValue: "10, 14, 26",
        description: "RGB values e.g. '10, 14, 26'",
    },
    borderOpacity: {
        type: ControlType.Number,
        title: "Border",
        defaultValue: 0.12,
        min: 0,
        max: 0.5,
        step: 0.02,
    },
    borderColor: {
        type: ControlType.String,
        title: "Border Color (RGB)",
        defaultValue: "0, 229, 204",
        description: "RGB values for border tint",
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Radius",
        defaultValue: 12,
        min: 0,
        max: 32,
        step: 2,
    },
    padding: {
        type: ControlType.Number,
        title: "Padding",
        defaultValue: 48,
        min: 0,
        max: 96,
        step: 4,
    },
    glowOnHover: {
        type: ControlType.Boolean,
        title: "Hover Glow",
        defaultValue: false,
    },
    hoverGlowColor: {
        type: ControlType.String,
        title: "Glow Color (RGB)",
        defaultValue: "0, 229, 204",
        hidden: (props) => !props.glowOnHover,
    },
    hoverGlowOpacity: {
        type: ControlType.Number,
        title: "Glow Intensity",
        defaultValue: 0.08,
        min: 0,
        max: 0.3,
        step: 0.02,
        hidden: (props) => !props.glowOnHover,
    },
})