"use client"

import { Assistant } from "@/components/Assistant"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function BookingAIPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden bg-andalusi">
            {/* Background Ornaments */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-7xl flex flex-col items-center"
            >
                <Link href="/" className="mb-12">
                    <div className="relative h-20 w-20 hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/images/lutfi-logo.png"
                            alt="Loffy's Little Treats Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </Link>

                <Assistant />

                <footer className="mt-16 text-xs text-muted-foreground uppercase tracking-widest text-center">
                    <p>Loffy's Little Treats © {new Date().getFullYear()}</p>
                </footer>
            </motion.div>
        </div>
    )
}
