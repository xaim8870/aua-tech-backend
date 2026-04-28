// src/modules/notifications/email.service.ts
import dns from "node:dns";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { env } from "../../config/env";

// Railway was trying IPv6 for Gmail SMTP.
// This makes Node prefer IPv4 first.
dns.setDefaultResultOrder("ipv4first");

const smtpPort = Number(env.SMTP_PORT);

const transportOptions: SMTPTransport.Options = {
  host: env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  requireTLS: smtpPort === 587,
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
  dnsTimeout: 5000,
};

const transporter = nodemailer.createTransport(transportOptions);

export const verifyEmailTransport = async () => {
  try {
    await transporter.verify();
    console.log("SMTP connection verified successfully.");
  } catch (error) {
    console.error("SMTP verification failed:", error);
    throw error;
  }
};

export const sendLeadEmail = async (lead: any) => {
  try {
    const info = await transporter.sendMail({
      from: `"AUA Website" <${env.SMTP_USER}>`,
      to: "contactus@auatechnologies.com",
      subject: `New Lead: ${lead.full_name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${lead.full_name}</p>
        <p><strong>Email:</strong> ${lead.email || "N/A"}</p>
        <p><strong>Phone:</strong> ${lead.phone || "N/A"}</p>
        <p><strong>Service:</strong> ${lead.service_interest || "N/A"}</p>
        <p><strong>Budget:</strong> ${lead.budget_range || "N/A"}</p>
        <p><strong>Timeline:</strong> ${lead.timeline || "N/A"}</p>
        <p><strong>Message:</strong> ${lead.message || "N/A"}</p>
        <p><strong>Additional Details:</strong> ${lead.additional_details || "N/A"}</p>
        <p><strong>Source Page:</strong> ${lead.source_page || "N/A"}</p>
        <p><strong>Form Type:</strong> ${lead.form_type || "N/A"}</p>
      `,
    });

    console.log("Lead email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("sendLeadEmail failed:", error);
    throw error;
  }
};