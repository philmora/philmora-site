import { Override } from "framer"
import React, { useState, useEffect } from "react"

function getCurrentHour(timezone) {
    const date = new Date()
    const options = {
        timeZone: timezone,
        hour: "2-digit",
        hour12: false,
    }
    const formatter = new Intl.DateTimeFormat("en-US", options)
    return parseInt(formatter.format(date), 10)
}

export function ActivityOverride(): Override {
    const timezone = "America/New_York" // Change this to your desired timezone
    const currentHour = getCurrentHour(timezone)

    let variant = "night" // Default to night

    if (currentHour >= 9 && currentHour < 18) {
        variant = "day"
    }

    return {
        variant: variant,
    }
}
