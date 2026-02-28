"use server"

import nodemailer from "nodemailer"

interface BookingData {
    firstName: string
    lastName: string
    email: string
    notes: string
    receiptType: string
    sessionType: string
    serviceType: string
    hasInsurance: boolean | null
}

export async function sendBookingEmails(data: BookingData) {
    console.log("Attempting to send booking emails for:", data.email)

    const {
        firstName,
        lastName,
        email,
        notes,
        receiptType,
        sessionType,
        serviceType,
    } = data

    // 1. Validate Environment Variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Missing SMTP credentials in environment variables.")
        return { success: false, error: "Server configuration error. Please contact support." }
    }

    // 2. Configure Transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.office365.com", // Default to Outlook if not set
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })

    // 3. Prepare Content
    const sessionLabel = {
        'workout': 'Workout',
        'therapy': 'Therapy',
        'combo': 'Workout/Therapy'
    }[sessionType] || sessionType

    const serviceLabel = serviceType === 'pack' ? 'Transformation Pack (4 Sessions)' : 'Single Session'
    const receiptLabel = {
        'massage': 'Massage Therapy Receipt',
        'fitness': 'Fitness/Training Receipt',
        'none': 'No receipt needed'
    }[receiptType] || receiptType

    const fullName = firstName ? `${firstName} ${lastName}` : "Client (Name not provided)"
    const clientEmail = email || "Not provided"

    // --- Email 1: To Yasir (Admin) ---
    const adminMailOptions = {
        from: `"Booking System" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to self
        subject: `New Booking Request: ${fullName}`,
        text: `
New Booking Received!

Client: ${fullName}
Email: ${clientEmail}
Service: ${serviceLabel}
Session Type: ${sessionLabel}
Receipt Requested: ${receiptLabel}
Notes: ${notes || "None"}

Please verify payment (E-Transfer) and confirm the session.
        `,
        html: `
            <h2>New Booking Request</h2>
            <p><strong>Client:</strong> ${fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${clientEmail}">${clientEmail}</a></p>
            <hr />
            <h3>Booking Details</h3>
            <ul>
                <li><strong>Service:</strong> ${serviceLabel}</li>
                <li><strong>Session Type:</strong> ${sessionLabel}</li>
                <li><strong>Receipt Preference:</strong> ${receiptLabel}</li>
            </ul>
            <p><strong>Notes:</strong><br/>${notes || "None"}</p>
        `
    }

    // --- Email 2: To Client (Confirmation) ---
    // Only send if we have a valid client email
    const clientMailOptions = {
        from: `"Yasir Gangat - Coach" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Booking Confirmation - ${serviceLabel}`,
        text: `
Hi ${firstName || "there"},

Thanks for your booking request! Here are the details:

Service: ${serviceLabel}
Session Type: ${sessionLabel}

NEXT STEPS:
1. Please complete your E-Transfer to: yasir_gangat@hotmail.com
   (Auto-deposit enabled. Please reference your name in the memo.)

${receiptType !== 'none' ? "IMPORTANT: You requested an insurance receipt. Please ensure the name provided matches your legal name for insurance purposes." : ""}

I will confirm your slot once payment is received.

Best,
Yasir Gangat
        `,
        html: `
            <div style="font-family: sans-serif; max-width: 600px;">
                <h2>Booking Received!</h2>
                <p>Hi ${firstName || "there"},</p>
                <p>Thanks for booking with me. Here is a summary of your request:</p>
                
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Service:</strong> ${serviceLabel}</p>
                    <p style="margin: 5px 0;"><strong>Session Details:</strong> ${sessionLabel}</p>
                </div>

                <h3>Next Steps</h3>
                <p>To secure your spot, please send an E-Transfer to:</p>
                <p style="font-size: 1.1em; font-weight: bold; background-color: #e5e7eb; padding: 10px; display: inline-block;">yasir_gangat@hotmail.com</p>
                <p style="font-size: 0.9em; color: #666;">(Auto-deposit is enabled. Please reference your name in the memo.)</p>

                ${receiptType !== 'none'
                ? `<div style="border-left: 4px solid #f59e0b; padding-left: 10px; margin-top: 20px;">
                        <p style="color: #b45309; font-weight: bold;">Insurance Receipt Info</p>
                        <p>You requested a <strong>${receiptLabel}</strong>. Please ensure the name you provided (${fullName}) matches your legal name required for insurance claims.</p>
                       </div>`
                : ""
            }

                <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;" />
                <p>I will confirm your appointment personally once payment is received.</p>
                <p>Best,<br>Yasir Gangat</p>
            </div>
        `
    }

    try {
        // Send Admin Email
        await transporter.sendMail(adminMailOptions)
        console.log("Admin email sent.")

        // Send Client Email (if email exists)
        if (email && email.includes("@")) {
            await transporter.sendMail(clientMailOptions)
            console.log("Client email sent.")
        }

        return { success: true }
    } catch (error) {
        console.error("Error sending emails:", error)
        return { success: false, error: "Failed to send email notifications." }
    }
}
