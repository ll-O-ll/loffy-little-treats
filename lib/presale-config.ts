import fs from "fs"
import path from "path"

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

const CONFIG_PATH = path.join(process.cwd(), "presale-config.json")

const DEFAULT_CONFIG: PresaleConfig = {
    id: "eid-2026",
    occasion: "Eid Al-Fitr '26",
    description: "Our artisanal sets are crafted in limited quantities. Secure yours now for pickup on March 19th.",
    date: "2026-03-19",
    timeWindow: "6:30 PM — 11:00 PM",
    location: "Near Don Mills & Eglinton",
    isActive: true,
    boxOptions: [
        { id: "mini", name: "The Mini", description: "15 treats", price: 25, quantity: 15 },
        { id: "classic", name: "The Classic", description: "45 treats", price: 55, quantity: 45 },
        { id: "signature", name: "The Signature", description: "75 treats", price: 85, quantity: 75 }
    ]
}

export async function getPresaleConfig(): Promise<PresaleConfig> {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const data = fs.readFileSync(CONFIG_PATH, "utf-8")
            return JSON.parse(data)
        }
    } catch (err) {
        console.error("Error reading presale config:", err)
    }
    return DEFAULT_CONFIG
}

export async function updatePresaleConfig(newConfig: PresaleConfig) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2), "utf-8")
        return { success: true }
    } catch (err) {
        console.error("Error writing presale config:", err)
        return { success: false, error: "Failed to save configuration." }
    }
}
