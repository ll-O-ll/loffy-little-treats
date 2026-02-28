"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BookingPageOne() {
    const router = useRouter()

    const [isBooked, setIsBooked] = useState(false)
    const [showFallback, setShowFallback] = useState(false)

    useEffect(() => {
        // Load Calendly widget script
        const script = document.createElement("script")
        script.src = "https://assets.calendly.com/assets/external/widget.js"
        script.async = true
        document.body.appendChild(script)

        // Event listener for Calendly events
        const isCalendlyEvent = (e: any) => {
            return e.data.event && e.data.event.indexOf('calendly') === 0;
        };

        const handleCalendlyEvent = (e: any) => {
            if (isCalendlyEvent(e) && e.data.event === 'calendly.event_scheduled') {
                setIsBooked(true)
                // We now rely on Calendly's native redirect setting to pass event details (name/email) to /booking-2
                console.log("Event scheduled. Waiting for Calendly redirect...")

                // Show fallback button after 5 seconds if redirect doesn't happen
                setTimeout(() => {
                    setShowFallback(true)
                }, 5000)
            }
        }

        window.addEventListener('message', handleCalendlyEvent);

        return () => {
            window.removeEventListener('message', handleCalendlyEvent);
            // Verify if we should remove script, usually better to leave it if user navigates back and forth
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        }
    }, [router])

    if (isBooked) {
        return (
            <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-center text-center">
                <div className="max-w-md space-y-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {/* We can import Check from lucide-react if not already imported, but let's stick to simple text for safety or assume imports */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h1 className="text-2xl font-serif font-bold">Booking Confirmed!</h1>
                    <p className="text-muted-foreground">Redirecting you to the next step...</p>

                    {showFallback && (
                        <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <p className="text-sm text-yellow-600 mb-4 bg-yellow-50 p-3 rounded-md border border-yellow-100">
                                If you are not automatically redirected, please click below.
                            </p>
                            <Button asChild size="lg" className="w-full">
                                <Link href="/booking-2">
                                    Click here to Continue <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background p-4 sm:py-12 flex flex-col items-center">
            <div className="w-full max-w-5xl">
                <Button asChild variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>

                <h1 className="text-3xl font-serif font-bold text-foreground text-center mb-2">Book Your Session</h1>
                <p className="text-muted-foreground text-center mb-8">Select a time that works for you.</p>

                {/* Calendly Inline Widget */}
                <div
                    className="calendly-inline-widget w-full"
                    data-url="https://calendly.com/yasirgangat/coaching?text_color=000000&primary_color=1d4ed8"
                    style={{ minWidth: "320px", height: "700px" }}
                />
            </div>
        </div>
    )
}
