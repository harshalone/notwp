"use client"

import { getCalApi } from "@calcom/embed-react"
import { useEffect } from "react"
import Button from "./Button"

export default function BookMeeting() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "notwp-support" })
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" })
    })()
  }, [])

  return (
    <Button
      size="lg"
      variant="outline"
      className="w-full sm:w-auto bg-transparent"
      data-cal-namespace="notwp-support"
      data-cal-link="podcastwithash/notwp-support"
      data-cal-config='{"layout":"month_view"}'
    >
      Book Meeting With Us
    </Button>
  )
}
