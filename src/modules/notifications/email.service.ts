import nodemailer from "nodemailer";
import { env } from "../../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

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