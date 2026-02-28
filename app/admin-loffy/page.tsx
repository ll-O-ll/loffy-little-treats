"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "next-auth/react"
import { ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    return (
        <Card className="w-full max-w-md border-border bg-card shadow-xl">
            <CardHeader className="space-y-1 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Lock className="h-6 w-6" />
                </div>
                <CardTitle className="text-3xl font-serif">Admin Access</CardTitle>
                <CardDescription>
                    Sign in with your authorized Google account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {error === "AccessDenied" && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center mb-2">
                        Access Denied: This account is not authorized.
                    </div>
                )}

                <Button
                    variant="outline"
                    className="w-full h-12 border-border hover:bg-muted flex items-center justify-center gap-2"
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </Button>

                <div className="mt-4 text-center">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 bg-andalusi">
            <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
                <LoginContent />
            </Suspense>
        </div>
    )
}
