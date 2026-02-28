"use server"

import { auth } from "@/auth"
import { getPresaleConfig, updatePresaleConfig, PresaleConfig } from "@/lib/presale-config"
import { revalidatePath } from "next/cache"

export async function savePresaleConfig(config: PresaleConfig) {
    const session = await auth()
    if (!session) {
        return { success: false, error: "Unauthorized" }
    }

    const res = await updatePresaleConfig(config)
    if (res.success) {
        revalidatePath("/presale")
        revalidatePath("/dashboard")
    }
    return res
}

export async function fetchPresaleConfig() {
    return await getPresaleConfig()
}

export async function getDashboardStats() {
    const config = await getPresaleConfig()

    // Mocking stats for now - in a real app, these would come from an orders DB
    return {
        revenue: 1240,
        boxesReserved: 34,
        inquiries: 12,
        recentActivity: [
            { name: "Sarah J.", action: "Inquired about Wedding Set", date: "2 hours ago" },
            { name: "Eid Presale", action: "New Signature Box Order", date: "5 hours ago" },
            { name: "Zaid K.", action: "Inquired about Corporate Gifting", date: "Yesterday" }
        ]
    }
}
