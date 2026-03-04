import { createClient } from "@supabase/supabase-js"

export interface BoxOption {
    id: string
    name: string
    description: string
    price: number
    quantity: number
}

export interface PresaleConfig {
    id: string
    occasion: string
    description: string
    date: string
    timeWindow: string
    location: string
    isActive: boolean
    boxOptions: BoxOption[]
}

let _supabase: ReturnType<typeof createClient> | null = null

function getSupabase() {
    if (!_supabase) {
        _supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
    }
    return _supabase
}

const DEFAULT_CONFIG: PresaleConfig = {
    id: "eid-2026",
    occasion: "Eid Al-Fitr '26",
    description: "Our artisanal sets are crafted in limited quantities. Secure yours now for pickup on March 19th.",
    date: "2026-03-19",
    timeWindow: "6:30 PM — 11:00 PM",
    location: "Near Don Mills & Eglinton",
    isActive: true,
    boxOptions: [
        { id: "mini", name: "Cookie Treat", description: "15 treats", price: 25, quantity: 15 },
        { id: "classic", name: "Cake Box", description: "45 treats", price: 55, quantity: 45 },
        { id: "signature", name: "Cookie and Cake", description: "75 treats", price: 85, quantity: 75 }
    ]
}

export async function getPresaleConfig(): Promise<PresaleConfig> {
    try {
        const { data, error } = await getSupabase()
            .from("presale_config")
            .select("*")
            .single()

        if (error || !data) {
            console.error("Error reading presale config from Supabase:", error)
            return DEFAULT_CONFIG
        }

        return data as PresaleConfig
    } catch (err) {
        console.error("Unexpected error reading presale config:", err)
        return DEFAULT_CONFIG
    }
}

export async function updatePresaleConfig(newConfig: PresaleConfig) {
    try {
        const { error } = await getSupabase()
            .from("presale_config")
            .upsert(newConfig)

        if (error) {
            console.error("Error writing presale config to Supabase:", error)
            return { success: false, error: "Failed to save configuration." }
        }

        return { success: true }
    } catch (err) {
        console.error("Unexpected error writing presale config:", err)
        return { success: false, error: "Failed to save configuration." }
    }
}
