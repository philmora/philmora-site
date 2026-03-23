import type { ComponentType } from "react"
import React from "react"

type ShortcutsProps = {
    id: string
    layoutId?: string
    height: string
    width: string
    name?: string
    ref?: React.RefObject<HTMLElement>
}

type PressedKeysEventDetail = string[]
type PressedKeysEvent = CustomEvent<PressedKeysEventDetail>

export function withKeyboardShortcuts(
    Component: ComponentType<ShortcutsProps>
): ComponentType<ShortcutsProps> {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (
            event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement
        ) {
            return
        }
        if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
            return
        }

        let pressedKeys = JSON.parse(
            sessionStorage.getItem("pressedKeys") || "[]"
        )
        pressedKeys.push(event.key)
        if (pressedKeys.length > 1) pressedKeys.shift()
        sessionStorage.setItem("pressedKeys", JSON.stringify(pressedKeys))

        if (typeof window !== "undefined") {
            const customEvent = new CustomEvent("pressedKeysChanged", {
                detail: pressedKeys,
            })
            window.dispatchEvent(customEvent)
        }
    }

    const handleBeforeUnload = () => {
        sessionStorage.removeItem("pressedKeys")
    }

    return (props: ShortcutsProps) => {
        if (typeof window !== "undefined") {
            React.useEffect(() => {
                window.focus()
                window.addEventListener("keydown", handleKeyDown)
                window.addEventListener("beforeunload", handleBeforeUnload)

                return () => {
                    window.removeEventListener("keydown", handleKeyDown)
                    window.removeEventListener(
                        "beforeunload",
                        handleBeforeUnload
                    )
                }
            }, [])
        }

        return <Component {...props} />
    }
}

export function withShortcutTrigger(
    Component: ComponentType<ShortcutsProps>
): ComponentType<ShortcutsProps> {
    const handlePressedKeysChanged = (
        event: PressedKeysEvent,
        key: string,
        containerRef: React.RefObject<HTMLElement>
    ) => {
        const pressedKeys = event.detail

        if (
            pressedKeys[pressedKeys.length - 1].toLowerCase() ===
            key.toLowerCase()
        ) {
            event.preventDefault()
            setTimeout(() => {
                if (containerRef.current) {
                    const button = containerRef.current.querySelector("button")
                    const link = containerRef.current.querySelector("a")
                    if (button) {
                        button.click()
                    } else if (link) {
                        link.click()
                    } else {
                        console.error(
                            `Error: The shortcut trigger element ${key} isn't working properly.`
                        )
                    }
                } else {
                    console.error(
                        `Error: The shortcut trigger element ${key} isn't working properly.`
                    )
                }

                sessionStorage.removeItem("pressedKeys")
            }, 0)
        }
    }

    return (props: ShortcutsProps) => {
        const regExp = /\[(.*?)\]/
        let lizardKeyRegex = props.name?.match(regExp)
        let lizardKey = ""
        let lizardContainerRef = React.useRef(null)

        if (lizardKeyRegex) {
            lizardKey = lizardKeyRegex[1]
        } else {
            console.error(
                `Error: Your shortcut trigger layer (${props.name}) is missing a key in its layer name.`
            )
        }

        if (typeof window !== "undefined") {
            React.useEffect(() => {
                const handlePressedKeysEvent: EventListener = (
                    event: Event
                ) => {
                    const customEvent = event as PressedKeysEvent
                    handlePressedKeysChanged(
                        customEvent,
                        lizardKey,
                        lizardContainerRef
                    )
                }

                window.addEventListener(
                    "pressedKeysChanged",
                    handlePressedKeysEvent
                )
            }, [])
        }

        return (
            <span
                ref={lizardContainerRef}
                data-lizard-shortcuts-trigger={lizardKey}
            >
                <Component {...props} />
            </span>
        )
    }
}
