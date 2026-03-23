/*
Active – active link variant handling for Framer (Dashfolio Edition)

v1.0.0

© 2023 by Dominik Hofer
*/

import type { ComponentType } from "react"
import { atom, useAtom } from "jotai"
import React from "react"

type LinkProps = {
    id: string
    layoutId?: string
    height: string
    width: string
    variant?: string
}

// Create an atom for window width
const windowWidthAtom =
    typeof window !== "undefined" ? atom(window.innerWidth) : atom(0)

export const withActiveLinkVariant = (
    Component: ComponentType<LinkProps>
): ComponentType<LinkProps> => {
    return (props: LinkProps) => {
        const lizardContainerRef = React.useRef<HTMLElement | null>(null)
        const [isActive, setIsActive] = React.useState(false)
        const [sidebarState, setSidebarState] = React.useState(
            localStorage.getItem("dashfolioSidebarState")
                ? JSON.parse(
                      localStorage.getItem("dashfolioSidebarState") as string
                  )
                : false
        )
        const [windowWidth, setWindowWidth] = useAtom(windowWidthAtom)

        const checkActiveLink = () => {
            const container = lizardContainerRef.current

            if (container) {
                const link = container.querySelector("a")
                if (link) {
                    const currentPath = window.location.pathname
                    const href = link.getAttribute("href")
                    if (href) {
                        const absoluteHref = new URL(href, window.location.href)
                            .pathname

                        if (currentPath === absoluteHref) {
                            setIsActive(true)
                        } else {
                            setIsActive(false)
                        }
                    } else {
                        console.error(`Error: No href attribute found.`)
                    }
                } else {
                    console.error(`Error: No link found.`)
                }
            } else {
                console.error(
                    `Error: The active link variant isn't working properly.`
                )
            }
        }

        React.useEffect(() => {
            checkActiveLink()
        }, [])

        if (typeof window !== "undefined") {
            React.useEffect(() => {
                const handleResize = () => {
                    setWindowWidth(window.innerWidth)
                }

                window.addEventListener("resize", handleResize)

                return () => {
                    window.removeEventListener("resize", handleResize)
                }
            }, [])

            React.useEffect(() => {
                const handleSidebarChange = () => {
                    const newState = localStorage.getItem(
                        "dashfolioSidebarState"
                    )
                        ? JSON.parse(
                              localStorage.getItem(
                                  "dashfolioSidebarState"
                              ) as string
                          )
                        : false
                    setSidebarState(newState)
                }

                window.addEventListener(
                    "sidebarStateChanged",
                    handleSidebarChange
                )

                return () => {
                    window.removeEventListener(
                        "sidebarStateChanged",
                        handleSidebarChange
                    )
                }
            }, [])
        }

        return (
            <span ref={lizardContainerRef}>
                {isActive ? (
                    windowWidth >= 1200 ? (
                        !sidebarState ? (
                            <Component
                                {...props}
                                variant="active"
                                data-variant={"active"}
                            />
                        ) : (
                            <Component
                                {...props}
                                variant="active-small"
                                data-variant={"active"}
                            />
                        )
                    ) : (
                        <Component
                            {...props}
                            variant="active-mobile"
                            data-variant={"active"}
                        />
                    )
                ) : (
                    <Component {...props} data-variant={"inactive"} />
                )}
            </span>
        )
    }
}
