import type React from "react"
import type { Metadata } from "next"
import { Inter, Spectral } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-spectral",
})

export const metadata: Metadata = {
  title: "Loffy’s Little Treats",
  description:
    "Artisanal treats and bespoke cookie sets for every occasion. Experience the magic of Loffy's Pâtissier.",
  generator: "v0.app",
  icons: {
    icon: "/images/lutfi-logo.png",
    apple: "/images/lutfi-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spectral.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
