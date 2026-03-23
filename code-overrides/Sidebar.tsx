import type { ComponentType } from "react"
import { atom, useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import React from "react"

type SidebarProps = {
    id: string
    layoutId?: string
    height: string
    width: string
    variant?: string
    name?: string
    onClick?: () => void
}

// Create an atom for sidebar state
// false = expanded, true = collapsed
const sidebarStateAtom = atomWithStorage("dashfolioSidebarState", false)
// Create an atom for window width
const windowWidthAtom =
    typeof window !== "undefined" ? atom(window.innerWidth) : atom(0)

export const withSaveSidebarState = (
    Component: ComponentType<SidebarProps>
): ComponentType<SidebarProps> => {
    return (props: SidebarProps) => {
        const [sidebarSate, setSidebarState] = useAtom(sidebarStateAtom)

        const handleClick = () => {
            let newSidebarState = !sidebarSate
            setSidebarState(newSidebarState)
            window.dispatchEvent(new Event("sidebarStateChanged"))
        }

        return <Component {...props} onClick={handleClick} />
    }
}

export const withSidebarSate = (
    Component: ComponentType<SidebarProps>
): ComponentType<SidebarProps> => {
    return (props: SidebarProps) => {
        const [sidebarSate, setSidebarState] = useAtom(sidebarStateAtom)
        const [windowWidth, setWindowWidth] = useAtom(windowWidthAtom)

        if (typeof window !== "undefined") {
            React.useEffect(() => {
                const handleResize = () => {
                    setWindowWidth(window.innerWidth)
                }

                window.addEventListener("resize", handleResize)

                // Cleanup
                return () => {
                    window.removeEventListener("resize", handleResize)
                }
            }, [])
        }

        if (sidebarSate && windowWidth >= 1200) {
            return <Component {...props} variant="Collapsed" />
        } else {
            return <Component {...props} />
        }
    }
}
