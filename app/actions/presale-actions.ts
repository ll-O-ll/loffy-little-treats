"use server"

import nodemailer from "nodemailer"
import { z } from "zod"

const presaleSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    instagram: z.string().min(1, "Instagram handle is required"),
    items: z.array(z.object({
        type: z.enum(["mini", "classic", "signature"]),
        quantity: z.number().min(1),
    })).min(1, "At least one box must be selected"),
    allergyAcknowledgment: z.boolean().refine(val => val === true, "Allergy acknowledgment is required"),
})

export type PresaleData = z.infer<typeof presaleSchema>

export async function submitPresaleOrder(data: PresaleData) {
    console.log("Processing Presale Order:", data)

    // Validate data
    const validatedData = presaleSchema.safeParse(data)
    if (!validatedData.success) {
        return { success: false, error: "Invalid form data. Please check your inputs." }
    }

    const { firstName, lastName, phone, instagram, items, allergyAcknowledgment } = validatedData.data

    // SMTP Settings (reusing from booking-actions if possible, or defaulting)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("Missing SMTP credentials. Order will be processed without email notification.")
        // Still return success so the user can see the IG summary
        return { success: true, note: "Order recorded on server (no email sent)." }
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.office365.com",
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })

    const itemSummary = items.map(item => {
        const label = {
            mini: "The Mini (15 treats - $25)",
            classic: "The Classic (45 treats - $55)",
            signature: "The Signature (75 treats - $85)"
        }[item.type]
        return `${label} x ${item.quantity}`
    }).join("\n")

    const htmlItemSummary = items.map(item => {
        const label = {
            mini: "The Mini (15 treats - $25)",
            classic: "The Classic (45 treats - $55)",
            signature: "The Signature (75 treats - $85)"
        }[item.type]
        return `<li><strong>${label}</strong>: ${item.quantity}</li>`
    }).join("")

    const fullName = `${firstName} ${lastName}`

    const mailOptions = {
        from: `"Loffy's Orders" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to Luftiyah
        subject: `New Presale Order: ${fullName}`,
        text: `
New Presale Order Received!

Client: ${fullName}
Phone: ${phone}
Instagram: ${instagram || "Not provided"}

Order Details:
${itemSummary}

Allergy Acknowledgment: ${allergyAcknowledgment ? "YES" : "NO"}

Pickup Details: March 19, 2026, 6:30pm-11:00pm near Don Mills & Eglinton
    `,
        html: `
      <h2>New Presale Order</h2>
      <p><strong>Client:</strong> ${fullName}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Instagram:</strong> ${instagram || "Not provided"}</p>
      <hr />
      <h3>Order Summary</h3>
      <ul>
        ${htmlItemSummary}
      </ul>
      <p><strong>Allergy Acknowledgment:</strong> Confirmed</p>
      <p><strong>Pickup:</strong> March 19, 2026, 6:30pm-11:00pm near Don Mills & Eglinton</p>
    `
    }

    try {
        await transporter.sendMail(mailOptions)
        return { success: true }
    } catch (error) {
        console.error("Error sending presale email:", error)
        return { success: false, error: "Failed to submit order. Please try again later." }
    }
}
