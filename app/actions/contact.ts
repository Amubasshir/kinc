"use server";

import { Resend } from "resend";
import { renderContactConfirmationHtml, renderContactConfirmationText } from "./emailTemplates";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in all fields." };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  try {
    const { error } = await resend.emails.send({
      from: "KinCollage <hello@kincollage.com>",
      to: process.env.CONTACT_TO_EMAIL!,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return { status: "error", message: "Something went wrong. Please try again later." };
    }

    const { error: confirmationError } = await resend.emails.send({
      from: "Zsofia at KinCollage <hello@kincollage.com>",
      to: email,
      subject: "We've received your message",
      html: renderContactConfirmationHtml(name),
      text: renderContactConfirmationText(name),
    });

    if (confirmationError) {
      console.error("Resend confirmation error:", confirmationError);
    }

    return { status: "success", message: "Thanks! Your message has been sent — we'll be in touch soon." };
  } catch (err) {
    console.error("Contact form send failed:", err);
    return { status: "error", message: "Something went wrong. Please try again later." };
  }
}
