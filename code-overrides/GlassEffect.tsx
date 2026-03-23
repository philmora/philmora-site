import type { ComponentType } from "react"

/**
 * Glass Effect Overrides
 * Apply these to any Frame to get Apple-style frosted glass
 * The Frame should have a transparent or semi-transparent background
 */

// Standard glass — for section cards (Now, Pattern, Believe, People)
export function withGlass<T extends { style?: React.CSSProperties }>(
    Component: ComponentType<T>
): ComponentType<T> {
    return (props: T) => {
        return (
            <Component
                {...props}
                style={{
                    ...props.style,
                    backgroundColor: "rgba(10, 14, 26, 0.45)",
                    backdropFilter: "blur(24px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(24px) saturate(1.2)",
                    border: "1px solid rgba(0, 229, 204, 0.1)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
                }}
            />
        )
    }
}

// Lighter glass — for testimonial cards and smaller elements
export function withGlassLight<T extends { style?: React.CSSProperties }>(
    Component: ComponentType<T>
): ComponentType<T> {
    return (props: T) => {
        return (
            <Component
                {...props}
                style={{
                    ...props.style,
                    backgroundColor: "rgba(10, 14, 26, 0.3)",
                    backdropFilter: "blur(16px) saturate(1.1)",
                    WebkitBackdropFilter: "blur(16px) saturate(1.1)",
                    border: "1px solid rgba(0, 229, 204, 0.08)",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
                }}
            />
        )
    }
}

// Heavy glass — for hero/about card with more blur and depth
export function withGlassHeavy<T extends { style?: React.CSSProperties }>(
    Component: ComponentType<T>
): ComponentType<T> {
    return (props: T) => {
        return (
            <Component
                {...props}
                style={{
                    ...props.style,
                    backgroundColor: "rgba(10, 14, 26, 0.5)",
                    backdropFilter: "blur(32px) saturate(1.3)",
                    WebkitBackdropFilter: "blur(32px) saturate(1.3)",
                    border: "1px solid rgba(0, 229, 204, 0.12)",
                    boxShadow: "0 16px 48px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                }}
            />
        )
    }
}

// Sidebar glass — taller, thinner blur for the nav sidebar
export function withGlassSidebar<T extends { style?: React.CSSProperties }>(
    Component: ComponentType<T>
): ComponentType<T> {
    return (props: T) => {
        return (
            <Component
                {...props}
                style={{
                    ...props.style,
                    backgroundColor: "rgba(10, 14, 26, 0.55)",
                    backdropFilter: "blur(20px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                    borderRight: "1px solid rgba(0, 229, 204, 0.08)",
                    boxShadow: "4px 0 24px rgba(0, 0, 0, 0.2)",
                }}
            />
        )
    }
}

// Hover glass — adds a glow effect on hover, use on interactive cards
export function withGlassHover<T extends { style?: React.CSSProperties }>(
    Component: ComponentType<T>
): ComponentType<T> {
    return (props: T) => {
        const wrapperStyle: React.CSSProperties = {
            ...props.style,
            backgroundColor: "rgba(10, 14, 26, 0.35)",
            backdropFilter: "blur(20px) saturate(1.2)",
            WebkitBackdropFilter: "blur(20px) saturate(1.2)",
            border: "1px solid rgba(0, 229, 204, 0.08)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
            transition: "all 0.3s ease",
            cursor: "pointer",
        }

        return (
            <div
                style={{ width: "100%", height: "100%" }}
                onMouseEnter={(e) => {
                    const target = e.currentTarget.firstChild as HTMLElement
                    if (target) {
                        target.style.borderColor = "rgba(0, 229, 204, 0.25)"
                        target.style.boxShadow = "0 8px 32px rgba(0, 229, 204, 0.1), 0 16px 48px rgba(0, 0, 0, 0.2)"
                        target.style.transform = "translateY(-2px)"
                    }
                }}
                onMouseLeave={(e) => {
                    const target = e.currentTarget.firstChild as HTMLElement
                    if (target) {
                        target.style.borderColor = "rgba(0, 229, 204, 0.08)"
                        target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.15)"
                        target.style.transform = "translateY(0)"
                    }
                }}
            >
                <Component {...props} style={wrapperStyle} />
            </div>
        )
    }
}