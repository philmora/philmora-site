import type { ComponentType } from "react"
import { useRef, useEffect, useState } from "react"

// Generic props type for wrapped components
interface WrappedProps {
    style?: React.CSSProperties
    [key: string]: any
}

// Slow Motion Video - set playback speed to 0.6x
export function withSlowMotion<T extends WrappedProps>(
    Component: ComponentType<T>
): ComponentType<T> {
    return (props: T) => {
        const wrapperRef = useRef<HTMLDivElement>(null)

        useEffect(() => {
            if (!wrapperRef.current) return

            const videoElement = wrapperRef.current.querySelector('video')

            if (videoElement) {
                videoElement.playbackRate = 0.6

                const setSpeed = () => {
                    videoElement.playbackRate = 0.6
                }

                videoElement.addEventListener('loadeddata', setSpeed)
                videoElement.addEventListener('play', setSpeed)

                return () => {
                    videoElement.removeEventListener('loadeddata', setSpeed)
                    videoElement.removeEventListener('play', setSpeed)
                }
            }
        }, [])

        return (
            <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
                <Component {...props} />
            </div>
        )
    }
}

// Parallax Background - moves slower than scroll for depth effect
export function withParallax<T extends WrappedProps>(
    Component: ComponentType<T>
): ComponentType<T> {
    return (props: T) => {
        const ref = useRef<HTMLDivElement>(null)
        const [offset, setOffset] = useState(0)

        useEffect(() => {
            const handleScroll = () => {
                if (!ref.current) return

                const rect = ref.current.getBoundingClientRect()
                const scrollProgress = -rect.top
                const parallaxOffset = scrollProgress * 0.3

                setOffset(parallaxOffset)
            }

            window.addEventListener('scroll', handleScroll)
            handleScroll()

            return () => window.removeEventListener('scroll', handleScroll)
        }, [])

        return (
            <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Component
                    {...props}
                    style={{
                        ...props.style,
                        transform: `translateY(${offset}px)`,
                        willChange: 'transform',
                    }}
                />
            </div>
        )
    }
}

// Fade In - simple opacity animation on scroll into view
export function withFadeIn<T extends WrappedProps>(
    Component: ComponentType<T>
): ComponentType<T> {
    return (props: T) => {
        const ref = useRef<HTMLDivElement>(null)
        const [isVisible, setIsVisible] = useState(false)

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true)
                        observer.disconnect()
                    }
                },
                { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
            )

            if (ref.current) {
                observer.observe(ref.current)
            }

            return () => observer.disconnect()
        }, [])

        return (
            <div ref={ref}>
                <Component
                    {...props}
                    style={{
                        ...props.style,
                        opacity: isVisible ? 1 : 0,
                        transition: "opacity 0.6s ease-out",
                    }}
                />
            </div>
        )
    }
}

// Fade Up - fade in plus translate from below
export function withFadeUp<T extends WrappedProps>(
    Component: ComponentType<T>
): ComponentType<T> {
    return (props: T) => {
        const ref = useRef<HTMLDivElement>(null)
        const [isVisible, setIsVisible] = useState(false)

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true)
                        observer.disconnect()
                    }
                },
                { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
            )

            if (ref.current) {
                observer.observe(ref.current)
            }

            return () => observer.disconnect()
        }, [])

        return (
            <div ref={ref}>
                <Component
                    {...props}
                    style={{
                        ...props.style,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0)" : "translateY(30px)",
                        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
                    }}
                />
            </div>
        )
    }
}

// Scale Settle - fade in with subtle scale down (1.02 -> 1.0)
export function withScaleSettle<T extends WrappedProps>(
    Component: ComponentType<T>
): ComponentType<T> {
    return (props: T) => {
        const ref = useRef<HTMLDivElement>(null)
        const [isVisible, setIsVisible] = useState(false)

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true)
                        observer.disconnect()
                    }
                },
                { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
            )

            if (ref.current) {
                observer.observe(ref.current)
            }

            return () => observer.disconnect()
        }, [])

        return (
            <div ref={ref}>
                <Component
                    {...props}
                    style={{
                        ...props.style,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "scale(1)" : "scale(1.02)",
                        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
                    }}
                />
            </div>
        )
    }
}

// Stagger Fade - for testimonial cards (use index prop)
export function withStaggerFade<T extends WrappedProps & { index?: number }>(
    Component: ComponentType<T>
): ComponentType<T> {
    return (props: T) => {
        const ref = useRef<HTMLDivElement>(null)
        const [isVisible, setIsVisible] = useState(false)
        const index = props.index || 0
        const delay = index * 0.1

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true)
                        observer.disconnect()
                    }
                },
                { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
            )

            if (ref.current) {
                observer.observe(ref.current)
            }

            return () => observer.disconnect()
        }, [])

        return (
            <div ref={ref}>
                <Component
                    {...props}
                    style={{
                        ...props.style,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0)" : "translateY(20px)",
                        transition: `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`,
                    }}
                />
            </div>
        )
    }
}

// Hero Load Animation - immediate fade up on page load
export function withHeroLoad<T extends WrappedProps>(
    Component: ComponentType<T>
): ComponentType<T> {
    return (props: T) => {
        const [isLoaded, setIsLoaded] = useState(false)

        useEffect(() => {
            const timer = setTimeout(() => setIsLoaded(true), 100)
            return () => clearTimeout(timer)
        }, [])

        return (
            <Component
                {...props}
                style={{
                    ...props.style,
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
                }}
            />
        )
    }
}