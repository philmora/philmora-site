import { Override } from "framer"
import React, { useState, useEffect } from "react"

function useClock(timezone) {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date()
            const options = {
                timeZone: timezone,
                hour: "2-digit",
                minute: "2-digit",
            }
            const formatter = new Intl.DateTimeFormat("en-US", options)
            setTime(formatter.format(date))
        }, 1000)

        return () => clearInterval(interval)
    }, [timezone])

    return time
}

export function ClockOverride(): Override {
    const timezone = "America/New_York" // Change this to your desired timezone
    const time = useClock(timezone)

    return {
        text: time,
    }
}
