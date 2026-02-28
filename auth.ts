import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            const allowedEmails = process.env.ALLOWED_ADMIN_EMAIL?.split(",").map(e => e.trim()) || []
            if (user.email && allowedEmails.includes(user.email)) {
                return true
            }
            return false // Access denied for anyone else
        },
    },
    pages: {
        signIn: "/admin-loffy",
        error: "/admin-loffy?error=AccessDenied",
    },
})
