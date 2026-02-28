"use client"

import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import {
    Activity,
    Calendar,
    FileText,
    Settings,
    User,
    Sparkles,
    LogOut
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { fetchPresaleConfig, savePresaleConfig } from "@/app/actions/dashboard-actions"
import { PresaleConfig, BoxOption } from "@/lib/presale-config"

export default function DashboardPage() {
    const [config, setConfig] = useState<PresaleConfig | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        async function loadConfig() {
            const data = await fetchPresaleConfig()
            setConfig(data)
        }
        loadConfig()
    }, [])

    const handleSave = async () => {
        if (!config) return
        setIsSaving(true)
        const res = await savePresaleConfig(config)
        setIsSaving(false)
        if (res.success) {
            toast.success("Presale configuration saved successfully!")
        } else {
            toast.error("Failed to save configuration.")
        }
    }

    const updateBox = (index: number, field: keyof BoxOption, value: any) => {
        if (!config) return
        const newBoxes = [...config.boxOptions]
        newBoxes[index] = { ...newBoxes[index], [field]: value }
        setConfig({ ...config, boxOptions: newBoxes })
    }

    if (!config) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground animate-pulse font-medium">Loading Loffy's Dashboard...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Top Bar */}
            <div className="border-b border-border bg-card sticky top-0 z-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="font-serif text-xl font-bold text-primary tracking-widest uppercase">Loffy's Little Treats</div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive transition-colors hidden sm:flex"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full bg-muted/50">
                            <User className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto p-4 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-serif font-bold mb-2">Welcome, Luftiyah</h1>
                        <p className="text-muted-foreground">Manage your treats, orders, and special presales.</p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-full px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground"
                    >
                        {isSaving ? "Saving..." : "Save All Changes"}
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-12">
                    <Card className="bg-primary/5 border-primary/20 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Calendar className="h-12 w-12 text-primary" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-primary/70">Pending Inquiries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-serif font-bold">12</div>
                            <p className="text-xs text-muted-foreground font-light mt-1">Loffy's Pâtissier Assistant</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Active Presale</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-serif font-bold text-primary">{config.occasion}</div>
                            <p className="text-xs text-muted-foreground font-light mt-1">Status: Accepting Orders</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Monthly Growth</CardTitle>
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-serif font-bold text-emerald-600">+24%</div>
                            <p className="text-xs text-muted-foreground font-light mt-1">Compared to last period</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-muted/50 p-1 rounded-full border border-border">
                        <TabsTrigger value="overview" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">Overview</TabsTrigger>
                        <TabsTrigger value="presales" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">Presale Creator</TabsTrigger>
                        <TabsTrigger value="inquiries" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">Inquiries</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border-border bg-card shadow-sm overflow-hidden">
                                <CardHeader className="pb-4 bg-muted/20 border-b border-border/50">
                                    <CardTitle className="font-serif">Presale Status</CardTitle>
                                    <CardDescription>Your current active presale performance.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-between">
                                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Total Revenue</div>
                                            <div className="text-3xl font-serif font-bold text-primary">$1,240.00</div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-secondary/50 border border-secondary flex flex-col justify-between">
                                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Boxes Reserved</div>
                                            <div className="text-3xl font-serif font-bold text-primary">34</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-sm overflow-hidden">
                                <CardHeader className="pb-4 bg-muted/20 border-b border-border/50">
                                    <CardTitle className="font-serif">Recent Activity</CardTitle>
                                    <CardDescription>Latest interactions with Loffy's Pâtissier.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-3">
                                        {[
                                            { name: "Sarah J.", action: "Inquired about Wedding Set", date: "2h ago" },
                                            { name: "Eid Presale", action: "New Signature Box Order", date: "5h ago" },
                                            { name: "Zaid K.", action: "Inquired about Gift Box", date: "Yesterday" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 border border-border/50 rounded-xl hover:bg-muted/30 transition-all group cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-sm shadow-sm transition-transform group-hover:scale-110">
                                                        {item.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm group-hover:text-primary transition-colors">{item.name}</div>
                                                        <div className="text-xs text-muted-foreground line-clamp-1">{item.action}</div>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-medium text-muted-foreground/60 whitespace-nowrap">{item.date}</div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="presales" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {/* General Settings */}
                            <Card className="lg:col-span-1 shadow-sm h-fit">
                                <CardHeader>
                                    <CardTitle className="font-serif flex items-center gap-2">
                                        <Settings className="h-4 w-4 text-primary" />
                                        General Settings
                                    </CardTitle>
                                    <CardDescription>Basic information for the presale form.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="occasion">Occasion Name</Label>
                                        <Input
                                            id="occasion"
                                            value={config.occasion}
                                            onChange={(e) => setConfig({ ...config, occasion: e.target.value })}
                                            className="rounded-xl border-border focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Form Description</Label>
                                        <Textarea
                                            id="description"
                                            value={config.description}
                                            onChange={(e) => setConfig({ ...config, description: e.target.value })}
                                            className="min-h-[120px] rounded-xl border-border focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 pt-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Pickup Date</Label>
                                            <Input
                                                id="date"
                                                type="date"
                                                value={config.date}
                                                onChange={(e) => setConfig({ ...config, date: e.target.value })}
                                                className="rounded-xl border-border focus:ring-primary/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="time">Time Window</Label>
                                            <Input
                                                id="time"
                                                value={config.timeWindow}
                                                onChange={(e) => setConfig({ ...config, timeWindow: e.target.value })}
                                                placeholder="e.g. 6:30 PM - 11:00 PM"
                                                className="rounded-xl border-border focus:ring-primary/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                value={config.location}
                                                onChange={(e) => setConfig({ ...config, location: e.target.value })}
                                                placeholder="e.g. Near Don Mills & Eglinton"
                                                className="rounded-xl border-border focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Box Options */}
                            <Card className="md:col-span-2 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="font-serif flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        Box Sets & Pricing
                                    </CardTitle>
                                    <CardDescription>Configure the treats available for this presale.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {config.boxOptions.map((box, index) => (
                                            <div key={box.id} className="p-5 rounded-2xl border border-border bg-muted/5 space-y-4 transition-all hover:bg-muted/10 border-dashed hover:border-solid hover:border-primary/30">
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <div className="flex-1 space-y-2">
                                                        <Label className="text-xs uppercase tracking-tighter text-muted-foreground font-bold">Box Name</Label>
                                                        <Input
                                                            value={box.name}
                                                            onChange={(e) => updateBox(index, 'name', e.target.value)}
                                                            className="rounded-xl font-semibold border-border/50"
                                                        />
                                                    </div>
                                                    <div className="w-full sm:w-32 space-y-2">
                                                        <Label className="text-xs uppercase tracking-tighter text-muted-foreground font-bold">Price ($)</Label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                                            <Input
                                                                type="number"
                                                                value={box.price}
                                                                onChange={(e) => updateBox(index, 'price', parseInt(e.target.value))}
                                                                className="rounded-xl pl-7 border-border/50"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="w-full sm:w-32 space-y-2">
                                                        <Label className="text-xs uppercase tracking-tighter text-muted-foreground font-bold">Treat Count</Label>
                                                        <Input
                                                            type="number"
                                                            value={box.quantity}
                                                            onChange={(e) => updateBox(index, 'quantity', parseInt(e.target.value))}
                                                            className="rounded-xl border-border/50"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs uppercase tracking-tighter text-muted-foreground font-bold">Display Description</Label>
                                                    <Input
                                                        value={box.description}
                                                        onChange={(e) => updateBox(index, 'description', e.target.value)}
                                                        className="rounded-xl border-border/50"
                                                        placeholder="e.g. 15 treats for $25"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="inquiries" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="min-h-[400px] flex flex-col items-center justify-center border border-border/60 rounded-3xl bg-card shadow-inner p-8 text-center bg-andalusi/10">
                            <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center text-primary/30 mb-6">
                                <FileText className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-2">Recent Inquiries</h3>
                            <p className="text-muted-foreground max-w-sm mb-8">Clients who have reached out via Loffy's Pâtissier Assistant. Connect with them for custom orders.</p>
                            <Button variant="outline" className="rounded-full px-8 border-primary/20 hover:bg-primary/5 text-primary transition-all hover:scale-105 active:scale-95">View Full Inbox</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
