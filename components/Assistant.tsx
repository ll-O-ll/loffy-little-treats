"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, ChevronRight, ChevronLeft, Sparkles, Send, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

type Step = "intro" | "date" | "items" | "creative" | "design" | "disclaimers" | "final"

export function Assistant() {
    const [step, setStep] = React.useState<Step>("intro")
    const [data, setData] = React.useState({
        eventDate: undefined as Date | undefined,
        serviceType: "" as "pickup" | "delivery" | "",
        items: "" as string,
        quantity: "" as string,
        creativeFreedom: "" as "freedom" | "specific" | "",
        designDetails: "" as string,
        contactInfo: "" as string,
    })

    const nextStep = (next: Step) => setStep(next)
    const prevStep = (prev: Step) => setStep(prev)

    const steps: Record<Step, React.ReactNode> = {
        intro: (
            <div className="space-y-6 text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-secondary flex items-center justify-center text-primary mb-8 relative">
                    <div className="absolute inset-0 bg-andalusi opacity-10 rounded-full"></div>
                    <Sparkles className="h-10 w-10 relative z-10" />
                </div>
                <h2 className="text-3xl font-serif font-bold">Loffy's Pâtissier</h2>
                <p className="text-muted-foreground font-light text-lg px-4">
                    Experience a seamless discovery. Let's design your perfect set of treats together.
                </p>
                <Button onClick={() => nextStep("date")} className="rounded-full px-10 h-14 text-lg bg-primary hover:bg-primary/90 mt-4 group">
                    Get Started
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>
        ),
        date: (
            <div className="space-y-8">
                <h2 className="text-2xl font-serif font-bold text-center">When is the magic happening?</h2>
                <div className="grid gap-6">
                    <div className="space-y-2">
                        <Label>Event Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal h-12 rounded-xl",
                                        !data.eventDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.eventDate ? format(data.eventDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={data.eventDate}
                                    onSelect={(d) => setData({ ...data, eventDate: d })}
                                    initialFocus
                                    disabled={(date) => date < new Date() || date < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)} // 2 weeks notice
                                />
                            </PopoverContent>
                        </Popover>
                        <p className="text-[10px] text-muted-foreground italic mt-1">
                            * Note: We usually require at least 2 weeks notice for custom orders.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label>How will you get them?</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant={data.serviceType === "pickup" ? "default" : "outline"}
                                onClick={() => setData({ ...data, serviceType: "pickup" })}
                                className="h-16 rounded-xl"
                            >
                                Pickup
                            </Button>
                            <Button
                                variant={data.serviceType === "delivery" ? "default" : "outline"}
                                onClick={() => setData({ ...data, serviceType: "delivery" })}
                                className="h-16 rounded-xl"
                            >
                                Delivery
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between pt-6">
                    <Button variant="ghost" onClick={() => prevStep("intro")}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        disabled={!data.eventDate || !data.serviceType}
                        onClick={() => nextStep("items")}
                        className="rounded-full px-8 bg-primary hover:bg-primary/90"
                    >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        ),
        items: (
            <div className="space-y-8">
                <h2 className="text-2xl font-serif font-bold text-center">What are we baking?</h2>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Item Type</Label>
                        <Input
                            placeholder="e.g. Sugar Cookies, Cupcakes, etc."
                            value={data.items}
                            onChange={(e) => setData({ ...data, items: e.target.value })}
                            className="h-12 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Estimated Quantity (Dozens)</Label>
                        <Input
                            type="number"
                            min="1"
                            placeholder="Minimum 1 dozen"
                            value={data.quantity}
                            onChange={(e) => setData({ ...data, quantity: e.target.value })}
                            className="h-12 rounded-xl"
                        />
                    </div>
                </div>
                <div className="flex justify-between pt-6">
                    <Button variant="ghost" onClick={() => prevStep("date")}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        disabled={!data.items || !data.quantity}
                        onClick={() => nextStep("creative")}
                        className="rounded-full px-8 bg-primary hover:bg-primary/90"
                    >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        ),
        creative: (
            <div className="space-y-8">
                <h2 className="text-2xl font-serif font-bold text-center">Artistic Direction</h2>
                <p className="text-center text-muted-foreground font-light italic">How much creative freedom do I have?</p>
                <div className="grid gap-4">
                    <Button
                        variant={data.creativeFreedom === "freedom" ? "default" : "outline"}
                        onClick={() => setData({ ...data, creativeFreedom: "freedom" })}
                        className="h-20 rounded-xl flex flex-col gap-1 items-center justify-center text-center p-4"
                    >
                        <span className="font-bold">Creative Freedom</span>
                        <span className="text-[10px] opacity-70">I trust your vision (Theme/colors only)</span>
                    </Button>
                    <Button
                        variant={data.creativeFreedom === "specific" ? "default" : "outline"}
                        onClick={() => setData({ ...data, creativeFreedom: "specific" })}
                        className="h-20 rounded-xl flex flex-col gap-1 items-center justify-center text-center p-4"
                    >
                        <span className="font-bold">Specific Design</span>
                        <span className="text-[10px] opacity-70">I have a specific vision/photos</span>
                    </Button>
                </div>
                <div className="flex justify-between pt-6">
                    <Button variant="ghost" onClick={() => prevStep("items")}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        disabled={!data.creativeFreedom}
                        onClick={() => nextStep("design")}
                        className="rounded-full px-8 bg-primary hover:bg-primary/90"
                    >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        ),
        design: (
            <div className="space-y-8">
                <h2 className="text-2xl font-serif font-bold text-center">Design Details</h2>
                <div className="space-y-4">
                    <Label>{data.creativeFreedom === "freedom" ? "Describe your Theme & Colors" : "Describe your specific Vision"}</Label>
                    <Textarea
                        placeholder={data.creativeFreedom === "freedom" ? "e.g. Pastel blues, clouds, and stars" : "e.g. I want exactly these shapes from the photo I will send on Instagram..."}
                        className="min-h-[150px] rounded-2xl p-4"
                        value={data.designDetails}
                        onChange={(e) => setData({ ...data, designDetails: e.target.value })}
                    />
                    <p className="text-[11px] text-muted-foreground italic bg-secondary/30 p-4 rounded-lg flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 text-primary" />
                        <span>Reminder: Treat costs vary depending on intricacy, number of colors, etc. Colors may vary slightly from photos.</span>
                    </p>
                </div>
                <div className="flex justify-between pt-6">
                    <Button variant="ghost" onClick={() => prevStep("creative")}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        disabled={!data.designDetails}
                        onClick={() => nextStep("disclaimers")}
                        className="rounded-full px-8 bg-primary hover:bg-primary/90"
                    >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        ),
        disclaimers: (
            <div className="space-y-8">
                <h2 className="text-2xl font-serif font-bold text-center">Our Policies</h2>
                <div className="space-y-4">
                    {[
                        "50% deposit required to secure your booking date.",
                        "Remaining 50% due before pick-up or delivery.",
                        "We do not accept fondant or printed design orders currently.",
                        "Electronic Transfer (ET) is our only accepted payment method."
                    ].map((p, i) => (
                        <div key={i} className="flex gap-3 items-center bg-background border border-border p-4 rounded-xl">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            <span className="text-sm">{p}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between pt-6">
                    <Button variant="ghost" onClick={() => prevStep("design")}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        onClick={() => nextStep("final")}
                        className="rounded-full px-8 bg-primary hover:bg-primary/90"
                    >
                        I Understand <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        ),
        final: (
            <div className="space-y-8">
                <h2 className="text-2xl font-serif font-bold text-center">Almost Done!</h2>
                <div className="space-y-4 text-center">
                    <p className="text-muted-foreground font-light">
                        Please leave your Instagram handle or Phone number so I can reach out to finalize the quote and design.
                    </p>
                    <Input
                        placeholder="@yourhandle or 555-0123"
                        className="h-14 rounded-xl text-center text-lg"
                        value={data.contactInfo}
                        onChange={(e) => setData({ ...data, contactInfo: e.target.value })}
                    />
                </div>
                <div className="flex justify-between pt-6">
                    <Button variant="ghost" onClick={() => prevStep("disclaimers")}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                        disabled={!data.contactInfo}
                        className="rounded-full px-10 h-14 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                        onClick={() => {
                            console.log("Discovery Data:", data)
                            // In a real app, send this to an API or Discord/Slack hook
                            alert("Thank you! Your inquiry has been captured. Loffy will reach out soon.")
                        }}
                    >
                        Submit Inquiry <Send className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4 relative">
            <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-card/60 backdrop-blur-xl overflow-hidden relative border border-white/20">
                <div className="absolute top-0 left-0 right-0 h-2 bg-secondary flex">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(Object.keys(steps).indexOf(step) + 1) / Object.keys(steps).length * 100}%` }}
                    />
                </div>
                <div className="p-8 sm:p-12 md:p-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-andalusi opacity-10 pointer-events-none"></div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="relative z-10"
                        >
                            {steps[step]}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </Card>

            <p className="text-center mt-12 text-sm text-muted-foreground font-light">
                <Link href="/" className="hover:text-primary underline underline-offset-4">Return Home</Link>
            </p>
        </div>
    )
}
