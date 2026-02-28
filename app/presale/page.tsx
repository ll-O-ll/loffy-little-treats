"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Check, Instagram, Phone, User, Sparkles, Send, AlertTriangle, MapPin, Clock, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { submitPresaleOrder } from "@/app/actions/presale-actions"
import { toast } from "sonner"

import { fetchPresaleConfig } from "@/app/actions/dashboard-actions"
import { PresaleConfig } from "@/lib/presale-config"

export default function PresalePage() {
    const [config, setConfig] = React.useState<PresaleConfig | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [formData, setFormData] = React.useState({
        firstName: "",
        lastName: "",
        phone: "",
        instagram: "",
        selections: {} as Record<string, number>,
        allergyAcknowledgment: false,
    })

    React.useEffect(() => {
        async function loadConfig() {
            const data = await fetchPresaleConfig()
            setConfig(data)
        }
        loadConfig()
    }, [])

    const updateSelection = (id: string, increment: boolean) => {
        setFormData(prev => {
            const current = prev.selections[id] || 0
            const next = increment ? current + 1 : Math.max(0, current - 1)
            return {
                ...prev,
                selections: { ...prev.selections, [id]: next }
            }
        })
    }

    const totalPrice = Object.entries(formData.selections).reduce((acc, [id, qty]) => {
        const option = config?.boxOptions.find(o => o.id === id)
        return acc + (option ? option.price * qty : 0)
    }, 0)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const items = Object.entries(formData.selections)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => ({ type: id as any, quantity: qty }))

        if (items.length === 0) {
            toast.error("Please select at least one box.")
            return
        }

        if (!formData.allergyAcknowledgment) {
            toast.error("Please acknowledge the allergy disclaimer.")
            return
        }

        setLoading(true)
        try {
            const res = await submitPresaleOrder({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                instagram: formData.instagram,
                allergyAcknowledgment: formData.allergyAcknowledgment,
                items: items
            })

            if (res.success) {
                setSuccess(true)
                toast.success("Order request prepared!")
            } else {
                toast.error(res.error || "Something went wrong.")
            }
        } catch (err) {
            toast.error("Failed to submit order. Check your connection.")
        } finally {
            setLoading(false)
        }
    }

    const generateSummary = () => {
        const items = Object.entries(formData.selections)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => {
                const option = config?.boxOptions.find(o => o.id === id)
                return `- ${qty}x ${option?.name} ($${(option?.price || 0) * qty})`
            })
            .join("\n")

        return `New Presale Order: ${config?.occasion}\n\n` +
            `Name: ${formData.firstName} ${formData.lastName}\n` +
            `IG: ${formData.instagram}\n` +
            `Phone: ${formData.phone}\n\n` +
            `Order Details:\n${items}\n\n` +
            `Total: $${totalPrice}\n\n` +
            `Pickup: ${config?.date}, ${config?.timeWindow}`
    }

    const handleCopyAndMessage = () => {
        const summary = generateSummary()
        navigator.clipboard.writeText(summary)
        toast.success("Summary copied to clipboard!")
        setTimeout(() => {
            window.open("https://www.instagram.com/direct/t/loffyslittletreats/", "_blank")
        }, 800)
    }

    if (!config) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground animate-pulse font-medium">Preparing The Treats...</p>
        </div>
    )

    if (success) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 bg-andalusi">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
                    <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-8">
                        <Check className="h-12 w-12" />
                    </div>
                    <h1 className="text-4xl font-serif font-bold mb-4">Summary Ready!</h1>
                    <p className="text-muted-foreground mb-6 font-light">
                        We've received your request. To finalize your order, please **copy the summary below** and message us on Instagram.
                    </p>

                    <Card className="p-4 bg-secondary/20 border-border mb-8 text-left">
                        <pre className="text-xs font-sans whitespace-pre-wrap leading-relaxed text-muted-foreground">
                            {generateSummary()}
                        </pre>
                    </Card>

                    <div className="flex flex-col gap-4">
                        <Button
                            onClick={handleCopyAndMessage}
                            className="rounded-full bg-primary text-white px-10 h-14 text-lg w-full"
                        >
                            Copy Summary & Message on IG
                        </Button>
                        <Button asChild variant="ghost" className="rounded-full h-14 w-full">
                            <Link href="/">Return Home</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans bg-andalusi pb-20">
            {/* Header */}
            <nav className="h-20 flex items-center px-4 md:px-8 border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 group">
                    <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-serif text-lg font-bold tracking-widest uppercase text-primary">Loffy's Little Treats</span>
                </Link>
            </nav>

            <main className="max-w-3xl mx-auto px-4 pt-12">
                <div className="mb-12 text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-primary text-xs font-semibold tracking-widest uppercase mb-6">
                        Presale: {config.occasion}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Reserve Your Treats</h1>
                    <p className="text-muted-foreground font-light max-w-xl mx-auto">
                        {config.description}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Contact Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <User className="h-5 w-5" />
                            </div>
                            <h2 className="text-2xl font-serif font-bold">Contact Information</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    required
                                    placeholder="e.g. Salim"
                                    className="h-12 rounded-xl"
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    required
                                    placeholder="e.g. Ahmed"
                                    className="h-12 rounded-xl"
                                    value={formData.lastName}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    required
                                    placeholder="e.g. 416-555-0123"
                                    className="h-12 rounded-xl"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram Handle</Label>
                                <Input
                                    id="instagram"
                                    required
                                    placeholder="@yourhandle"
                                    className="h-12 rounded-xl"
                                    value={formData.instagram}
                                    onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Box Selection */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <h2 className="text-2xl font-serif font-bold">Select Your Box</h2>
                        </div>

                        <div className="grid gap-6">
                            {config.boxOptions.map((option) => (
                                <Card key={option.id} className={cn(
                                    "p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden",
                                    (formData.selections[option.id] || 0) > 0 ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-card"
                                )}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{option.name}</h3>
                                            <p className="text-sm text-muted-foreground font-light mb-2">{option.description}</p>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-bold uppercase tracking-tighter">
                                                {option.quantity} Treats | ${option.price}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 self-center md:self-auto">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-10 w-10 rounded-full"
                                                onClick={() => updateSelection(option.id, false)}
                                            >
                                                -
                                            </Button>
                                            <span className="w-8 text-center font-bold text-lg">{formData.selections[option.id] || 0}</span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-10 w-10 rounded-full border-primary text-primary"
                                                onClick={() => updateSelection(option.id, true)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {totalPrice > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-primary text-white shadow-xl flex justify-between items-center">
                                <span className="text-lg font-light">Subtotal:</span>
                                <span className="text-3xl font-serif font-bold">${totalPrice}</span>
                            </motion.div>
                        )}
                    </section>

                    {/* Allergy Disclaimer */}
                    <section className="bg-orange-50/50 border border-orange-200 p-6 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 text-orange-800">
                            <AlertTriangle className="h-5 w-5" />
                            <h3 className="font-bold">Allergy Disclaimer</h3>
                        </div>
                        <p className="text-sm text-orange-900 leading-relaxed italic">
                            Our kitchen processes common allergens including nuts, dairy, and eggs. While we take precautions, we cannot guarantee a 100% allergen-free environment.
                        </p>
                        <div className="flex items-center space-x-3 pt-2">
                            <Checkbox
                                id="allergy"
                                checked={formData.allergyAcknowledgment}
                                onCheckedChange={(checked) => setFormData({ ...formData, allergyAcknowledgment: checked as boolean })}
                            />
                            <label htmlFor="allergy" className="text-sm font-medium leading-none cursor-pointer">
                                I have read and acknowledge the allergy statement.
                            </label>
                        </div>
                    </section>

                    {/* Pickup Details */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <h2 className="text-2xl font-serif font-bold">Collection Details</h2>
                        </div>
                        <Card className="p-6 border-border rounded-2xl bg-secondary/20">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="flex gap-4">
                                    <Calendar className="h-6 w-6 text-primary shrink-0" />
                                    <div>
                                        <div className="font-bold">{config.date}</div>
                                        <div className="text-sm text-muted-foreground font-light">Presale Collection</div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Clock className="h-6 w-6 text-primary shrink-0" />
                                    <div>
                                        <div className="font-bold">{config.timeWindow}</div>
                                        <div className="text-sm text-muted-foreground font-light font-italic">{config.location}</div>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-6 text-xs text-muted-foreground italic border-t pt-4">
                                * Full address will be shared via Instagram/Phone closer to the pickup date.
                            </p>
                        </Card>
                    </section>

                    <Button
                        type="submit"
                        disabled={loading || totalPrice === 0}
                        className="w-full rounded-2xl h-16 text-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 group"
                    >
                        {loading ? "Processing..." : (
                            <span className="flex items-center gap-2">
                                Generate Order Message <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </span>
                        )}
                    </Button>
                </form>

                <p className="text-center mt-12 text-sm text-muted-foreground font-light pb-8">
                    © {new Date().getFullYear()} Loffy's Little Treats. All orders are custom-made with love.
                </p>
            </main>
        </div >
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
}
