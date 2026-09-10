"use server";

import { Resend } from "resend";
import { randomInt } from "node:crypto";
import { renderGiftCouponHtml, renderGiftCouponText, renderGiftCouponNotificationHtml, renderGiftCouponNotificationText } from "./emailTemplates";
import { createCoupon, findCouponByEmail } from "../lib/supabaseAdmin";

export type GiftCouponState = { status: "idle" | "success" | "error"; message?: string; code?: string };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeCode() {
  return `GREET${randomInt(100000, 1000000)}`;
}

export async function secureGift(_prev: GiftCouponState, formData: FormData): Promise<GiftCouponState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!name || !EMAIL_PATTERN.test(email)) return { status: "error", message: "Please enter your name and a valid email address." };

  try {
    if (await findCouponByEmail(email)) return { status: "error", message: "This email has already received a gift coupon." };

    let coupon;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        coupon = await createCoupon(email, makeCode());
        break;
      } catch (error) {
        if (attempt === 2) throw error;
      }
    }
    if (!coupon) throw new Error("Coupon could not be created.");
    if (!process.env.RESEND_API_KEY) throw new Error("Email service is not configured.");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const customerEmailPromise = resend.emails.send({
      from: "Zsofia at KinCollage <hello@kincollage.com>",
      to: email,
      subject: "Your $50 KinCollage gift coupon",
      html: renderGiftCouponHtml(name, coupon.code),
      text: renderGiftCouponText(name, coupon.code),
    });
    const businessEmailPromise = process.env.CONTACT_TO_EMAIL
      ? resend.emails.send({
        from: "KinCollage Signups <hello@kincollage.com>",
        to: process.env.CONTACT_TO_EMAIL,
        replyTo: email,
        subject: `New $50 coupon signup from ${name}`,
        html: renderGiftCouponNotificationHtml(name, email, coupon.code),
        text: renderGiftCouponNotificationText(name, email, coupon.code),
      })
      : Promise.resolve({ data: null, error: new Error("CONTACT_TO_EMAIL is not configured.") });
    const [customerResult, businessResult] = await Promise.all([customerEmailPromise, businessEmailPromise]);
    if (customerResult.error) throw new Error(customerResult.error.message);
    if (businessResult.error) console.error("Gift coupon business notification failed:", businessResult.error);
    console.info("Gift coupon emails accepted by Resend", {
      customerEmailId: customerResult.data?.id,
      businessEmailId: businessResult.data?.id,
    });
    return { status: "success", code: coupon.code, message: "Your coupon is on its way! Check your inbox." };
  } catch (error) {
    console.error("Gift coupon request failed:", error);
    return { status: "error", message: "We couldn't create your coupon right now. Please try again later." };
  }
}

export async function validateCoupon(code: string) {
  const normalized = code.trim().toUpperCase();
  if (!/^GREET\d{6}$/.test(normalized) && !/^VOUCHER\d{8}$/.test(normalized)) return null;
  try {
    const db = await import("../lib/supabaseAdmin");
    return /^VOUCHER/.test(normalized) ? db.findAvailableVoucher(normalized) : db.findAvailableCoupon(normalized);
  } catch (error) {
    console.error("Coupon validation failed:", error);
    return null;
  }
}
