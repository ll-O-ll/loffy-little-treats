"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BookingPageRedirect() {
    const router = useRouter()

    useEffect(() => {
        router.replace('/booking/ai')
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Redirecting to booking system...</p>
        </div>
    )
}
