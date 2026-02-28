"use client"



import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Check, CreditCard, Info, Loader2 } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from "@/components/CheckoutForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)



function BookingContent() {
    const searchParams = useSearchParams()
    const initialType = searchParams.get("type") === "pack" ? "pack" : "single"
    const [selectedService, setSelectedService] = useState(initialType)
    const [sessionType, setSessionType] = useState("workout")
    const [hasInsurance, setHasInsurance] = useState<boolean | null>(null)
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [clientSecret, setClientSecret] = useState("")
    const { toast } = useToast()

    // Form State
    const [formData, setFormData] = useState(() => {
        const firstNameParam = searchParams.get('invitee_first_name')
        const lastNameParam = searchParams.get('invitee_last_name')
        const emailParam = searchParams.get('invitee_email') || searchParams.get('email')
        const fullNameParam = searchParams.get('invitee_full_name') || searchParams.get('name')

        let finalFirstName = firstNameParam || ""
        let finalLastName = lastNameParam || ""

        // Fallback: Try to parse full name if split names aren't provided
        if ((!finalFirstName || !finalLastName) && fullNameParam) {
            const parts = fullNameParam.trim().split(' ')
            if (parts.length > 0) {
                finalFirstName = parts[0]
                finalLastName = parts.slice(1).join(' ') || ""
            }
        }

        return {
            firstName: finalFirstName,
            lastName: finalLastName,
            email: emailParam || "",
            notes: "",
            receiptType: "none"
        }
    })

    useEffect(() => {
        setSelectedService(initialType)
    }, [initialType])

    // Save state to sessionStorage
    useEffect(() => {
        const bookingState = {
            formData,
            selectedService,
            sessionType,
            hasInsurance
        }
        sessionStorage.setItem('bookingState', JSON.stringify(bookingState))
    }, [formData, selectedService, sessionType, hasInsurance])

    // Handle Stripe Redirect
    useEffect(() => {
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (clientSecret) {
            // Restore state
            const savedState = sessionStorage.getItem('bookingState')
            if (savedState) {
                const parsed = JSON.parse(savedState)
                setFormData(parsed.formData)
                setSelectedService(parsed.selectedService)
                setSessionType(parsed.sessionType)
                setHasInsurance(parsed.hasInsurance)
            }

            // Check payment status
            stripePromise.then(stripe => {
                if (!stripe) return
                stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
                    if (paymentIntent && paymentIntent.status === 'succeeded') {
                        setStep(7) // Success Step for Card
                        sessionStorage.removeItem('bookingState')
                    }
                })
            })
        }
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleCompleteBooking = () => {
        setIsLoading(true)

        // Construct Mailto Link
        const sessionLabel = {
            'workout': 'Workout',
            'therapy': 'Therapy',
            'combo': 'Workout/Therapy'
        }[sessionType] || sessionType

        const serviceLabel = selectedService === 'pack' ? 'Transformation Pack (4 Sessions)' : 'Single Session'
        const receiptLabel = {
            'massage': 'Massage Therapy Receipt',
            'fitness': 'Fitness/Training Receipt',
            'none': 'No receipt needed'
        }[formData.receiptType] || formData.receiptType

        const subject = `Booking Request: ${serviceLabel} ${formData.firstName} ${formData.lastName}`.trim()

        const personalDetails = formData.receiptType !== 'none'
            ? `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\n`
            : ''

        const body = `Hi Yasir,

I'd like to confirm my booking details:

${personalDetails}Service: ${serviceLabel}
Session Type: ${sessionLabel}
Receipt: ${receiptLabel}
Notes: ${formData.notes || "None"}

I will send the E-Transfer to yasir_gangat@hotmail.com shortly.`

        const mailtoLink = `mailto:yasirgangat@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

        // Open Email Client
        window.location.href = mailtoLink

        // Move to success step
        setIsLoading(false)
        setStep(6)
        toast({
            title: "Opening Email App...",
            description: "Please send the pre-filled email to Yasir.",
        })
    }

    useEffect(() => {
        if (step === 5) {
            // Create PaymentIntent as soon as the page loads
            fetch("/api/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: selectedService === 'pack' ? 400 : 125,
                    currency: 'cad'
                }),
            })
                .then((res) => res.json())
                .then((data) => setClientSecret(data.clientSecret));
        }
    }, [step, selectedService]);

    const totalSteps = 5

    // Helper to calculate progress
    const getProgress = () => {
        // Steps: 1=Type, 2=Package, 3=Insurance Check, 4=Details(Optional), 5=Payment
        return (step / totalSteps) * 100
    }

    return (
        <div className="min-h-screen bg-background p-4 sm:py-12">
            <div className="max-w-3xl mx-auto">
                <Button asChild variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>

                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-foreground">Complete Your Booking</h1>
                    {step <= totalSteps && (
                        <>
                            <p className="text-muted-foreground mt-2">Step {step} of {totalSteps}</p>
                            <div className="h-1 w-full bg-muted mt-4 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300 ease-out"
                                    style={{ width: `${getProgress()}%` }}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="grid gap-6">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card className="border-border bg-card">
                                    <CardHeader>
                                        <CardTitle>Session Type</CardTitle>
                                        <CardDescription>What kind of session are you looking for?</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RadioGroup
                                            defaultValue={sessionType}
                                            onValueChange={(val) => setSessionType(val)}
                                            className="grid gap-4"
                                        >
                                            <div className={`flex items-center space-x-4 border p-4 rounded-lg cursor-pointer transition-colors ${sessionType === 'workout' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                                <RadioGroupItem value="workout" id="workout" />
                                                <Label htmlFor="workout" className="flex-1 font-semibold cursor-pointer">Workout</Label>
                                            </div>
                                            <div className={`flex items-center space-x-4 border p-4 rounded-lg cursor-pointer transition-colors ${sessionType === 'therapy' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                                <RadioGroupItem value="therapy" id="therapy" />
                                                <Label htmlFor="therapy" className="flex-1 font-semibold cursor-pointer">Therapy</Label>
                                            </div>
                                            <div className={`flex items-center space-x-4 border p-4 rounded-lg cursor-pointer transition-colors ${sessionType === 'combo' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                                <RadioGroupItem value="combo" id="combo" />
                                                <Label htmlFor="combo" className="flex-1 font-semibold cursor-pointer">Workout / Therapy</Label>
                                            </div>
                                        </RadioGroup>
                                    </CardContent>
                                    <CardFooter>
                                        <Button onClick={() => setStep(2)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                            Continue to Packages
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card className="border-border bg-card">
                                    <CardHeader>
                                        <CardTitle>Select Package</CardTitle>
                                        <CardDescription>Choose the package that suits your goals.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RadioGroup
                                            defaultValue={selectedService}
                                            onValueChange={(val) => setSelectedService(val)}
                                            className="grid gap-4"
                                        >
                                            <div className={`flex items-start space-x-4 border p-4 rounded-lg cursor-pointer transition-colors ${selectedService === 'single' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                                <RadioGroupItem value="single" id="single" className="mt-1" />
                                                <div className="flex-1">
                                                    <Label htmlFor="single" className="text-base font-semibold cursor-pointer">Single Session</Label>
                                                    <p className="text-sm text-muted-foreground mt-1">Movement assessment & corrective exercises.</p>
                                                </div>
                                                <div className="text-right font-bold">$125</div>
                                            </div>

                                            <div className={`flex items-start space-x-4 border p-4 rounded-lg cursor-pointer transition-colors ${selectedService === 'pack' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                                <RadioGroupItem value="pack" id="pack" className="mt-1" />
                                                <div className="flex-1">
                                                    <Label htmlFor="pack" className="text-base font-semibold cursor-pointer">Transformation Pack</Label>
                                                    <p className="text-sm text-muted-foreground mt-1">4 Sessions. Deep dive & progressive programming.</p>
                                                    <span className="inline-block mt-2 text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">Save 25%</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold">$400</div>
                                                    <div className="text-xs text-muted-foreground line-through">$500</div>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </CardContent>
                                    <CardFooter className="flex justify-between gap-4">
                                        <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                                        <Button onClick={() => setStep(3)} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                                            Continue
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card className="border-border bg-card">
                                    <CardHeader>
                                        <CardTitle>Insurance Receipt</CardTitle>
                                        <CardDescription>Do you require an official receipt for insurance purposes?</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-4">
                                            <Button
                                                variant={hasInsurance === true ? "default" : "outline"}
                                                className="w-full justify-start h-auto py-4 text-left"
                                                onClick={() => {
                                                    setHasInsurance(true)
                                                    // Reset receipt type if they switch back and forth
                                                    setFormData(prev => ({ ...prev, receiptType: "fitness" }))
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border border-primary flex items-center justify-center ${hasInsurance === true ? "bg-primary text-primary-foreground" : "text-transparent"}`}>
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">Yes, I need a receipt</div>
                                                        <div className="text-sm text-muted-foreground mt-1">I will provide my full name and email for the receipt.</div>
                                                    </div>
                                                </div>
                                            </Button>
                                            <Button
                                                variant={hasInsurance === false ? "default" : "outline"}
                                                className="w-full justify-start h-auto py-4 text-left"
                                                onClick={() => {
                                                    setHasInsurance(false)
                                                    setFormData(prev => ({ ...prev, receiptType: "none", firstName: "", lastName: "", email: "", notes: "" }))
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border border-primary flex items-center justify-center ${hasInsurance === false ? "bg-primary text-primary-foreground" : "text-transparent"}`}>
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">No, I don't need a receipt</div>
                                                        <div className="text-sm text-muted-foreground mt-1">Skip details (already provided in Calendly).</div>
                                                    </div>
                                                </div>
                                            </Button>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between gap-4">
                                        <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                                        <Button
                                            onClick={() => {
                                                if (hasInsurance) {
                                                    setStep(4) // Go to details
                                                } else {
                                                    setStep(5) // Skip details, go to payment
                                                }
                                            }}
                                            disabled={hasInsurance === null}
                                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                                        >
                                            Continue
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card className="border-border bg-card">
                                    <CardHeader>
                                        <CardTitle>Your Details</CardTitle>
                                        <CardDescription>We need this for your insurance receipt.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    placeholder="Yasir"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    placeholder="Gangat"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="notes">Current Goals / Injuries (Optional)</Label>
                                            <Input
                                                id="notes"
                                                placeholder="Lower back pain, wants to squat heavier..."
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between gap-4">
                                        <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                                        <Button
                                            onClick={() => setStep(5)}
                                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                                            disabled={!formData.firstName || !formData.lastName || !formData.email}
                                        >
                                            Continue to Payment
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card className="border-border bg-card">
                                    <CardHeader>
                                        <CardTitle>Payment & Confirmation</CardTitle>
                                        <CardDescription>Secure your spot.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">

                                        <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
                                            <div>
                                                <div className="font-semibold">{selectedService === 'pack' ? 'Transformation Pack (4 Sessions)' : 'Single Session'}</div>
                                                <div className="text-sm text-muted-foreground">{selectedService === 'pack' ? '4 x 60 mins' : '60 mins'}</div>
                                            </div>
                                            <div className="font-bold text-xl">{selectedService === 'pack' ? '$400' : '$125'}</div>
                                        </div>

                                        <Tabs defaultValue="etransfer" className="w-full">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="etransfer">E-Transfer</TabsTrigger>
                                                <TabsTrigger value="card">Credit Card</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="etransfer" className="space-y-4 pt-4">
                                                <div className="border border-primary/20 bg-primary/5 p-4 rounded-lg">
                                                    <div className="font-medium">E-Transfer Details</div>
                                                    <div className="mt-2 text-sm text-muted-foreground">
                                                        Please send <strong>${selectedService === 'pack' ? '400' : '125'}</strong> to:
                                                    </div>
                                                    <div className="mt-2 font-mono bg-background p-2 rounded border border-border inline-block text-primary select-all">
                                                        yasir_gangat@hotmail.com
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        *Auto-deposit is enabled. Please reference your name in the memo.
                                                    </p>
                                                </div>

                                                {hasInsurance && (
                                                    <div className="space-y-2">
                                                        <Label htmlFor="receiptType">Insurance Receipt Type</Label>
                                                        <Select
                                                            value={formData.receiptType}
                                                            onValueChange={(value) => setFormData(prev => ({ ...prev, receiptType: value }))}
                                                        >
                                                            <SelectTrigger id="receiptType">
                                                                <SelectValue placeholder="Select receipt type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="none">No receipt needed</SelectItem>
                                                                <SelectItem value="massage">Massage Therapy Receipt</SelectItem>
                                                                <SelectItem value="fitness">Fitness/Training Receipt</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}

                                                <Button
                                                    onClick={handleCompleteBooking}
                                                    disabled={isLoading}
                                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Sending Request...
                                                        </>
                                                    ) : (
                                                        "Complete Booking (Pay via E-Transfer)"
                                                    )}
                                                </Button>
                                            </TabsContent>

                                            <TabsContent value="card" className="space-y-4 pt-4">
                                                {clientSecret && (
                                                    <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                                                        <CheckoutForm amount={selectedService === 'pack' ? 400 : 125} />
                                                    </Elements>
                                                )}

                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                    <CardFooter className="flex justify-between gap-4">
                                        <Button variant="outline" onClick={() => setStep(hasInsurance ? 4 : 3)}>Back</Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}
                        {step === 6 && (
                            <motion.div
                                key="step6"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Card className="border-border bg-card text-center py-12">
                                    <CardContent className="space-y-6">
                                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                            <Check className="h-8 w-8 text-green-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">Booking Request Sent!</h2>
                                            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                                                Thank you{formData.firstName ? `, ${formData.firstName}` : ""}. Your request has been sent to Yasir.
                                            </p>
                                        </div>
                                        <div className="bg-muted/50 p-6 rounded-lg max-w-sm mx-auto text-left space-y-4">
                                            <div className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Next Steps</div>
                                            <ul className="space-y-3 text-sm">
                                                <li className="flex gap-2">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">1</span>
                                                    <span><strong>Send the email</strong> that just opened (or click the button below).</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">2</span>
                                                    <span>Complete your E-Transfer to <span className="font-mono bg-background px-1 rounded">yasir_gangat@hotmail.com</span></span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Button
                                                className="w-full bg-primary hover:bg-primary/90"
                                                onClick={() => {
                                                    const sessionLabel = {
                                                        'workout': 'Workout',
                                                        'therapy': 'Therapy',
                                                        'combo': 'Workout/Therapy'
                                                    }[sessionType] || sessionType

                                                    const serviceLabel = selectedService === 'pack' ? 'Transformation Pack (4 Sessions)' : 'Single Session'
                                                    const receiptLabel = {
                                                        'massage': 'Massage Therapy Receipt',
                                                        'fitness': 'Fitness/Training Receipt',
                                                        'none': 'No receipt needed'
                                                    }[formData.receiptType] || formData.receiptType

                                                    const subject = `Booking Request: ${serviceLabel} ${formData.firstName} ${formData.lastName}`.trim()

                                                    const personalDetails = formData.receiptType !== 'none'
                                                        ? `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\n`
                                                        : ''

                                                    const body = `Hi Yasir,

I'd like to confirm my booking details:

${personalDetails}Service: ${serviceLabel}
Session Type: ${sessionLabel}
Receipt: ${receiptLabel}
Notes: ${formData.notes || "None"}

I will send the E-Transfer to yasir_gangat@hotmail.com shortly.`

                                                    window.location.href = `mailto:yasirgangat@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                                                }}
                                            >
                                                Open Email App
                                            </Button>
                                            <Button asChild variant="outline" className="w-full">
                                                <Link href="/">Back to Home</Link>
                                            </Button>

                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {step === 7 && (
                            <motion.div
                                key="step7"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, type: "spring" }}
                            >
                                <Card className="border-border bg-card text-center py-12">
                                    <CardContent className="space-y-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                            className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
                                        >
                                            <Check className="h-12 w-12 text-green-600" strokeWidth={3} />
                                        </motion.div>

                                        <div>
                                            <h2 className="text-3xl font-serif font-bold text-foreground">Payment Confirmed!</h2>
                                            <p className="text-muted-foreground mt-2 text-lg">
                                                You're all set{formData.firstName ? `, ${formData.firstName}` : ""}!
                                            </p>
                                        </div>

                                        <div className="bg-muted/50 p-6 rounded-lg max-w-sm mx-auto text-left border border-border">
                                            <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                                                <span className="text-muted-foreground">Amount Paid</span>
                                                <span className="font-bold text-xl">{selectedService === 'pack' ? '$400.00' : '$125.00'}</span>
                                            </div>
                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <p className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    Booking received
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    Receipt sent to {formData.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Button asChild className="w-full max-w-xs bg-primary hover:bg-primary/90">
                                                <Link href="/">Back to Home</Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default function BookingPageTwo() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <BookingContent />
        </Suspense>
    )
}
