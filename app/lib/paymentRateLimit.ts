import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { checkRateLimit } from "./supabaseAdmin";

export async function enforcePaymentRateLimit(scope: string) {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const identifier = forwardedFor
    || requestHeaders.get("x-real-ip")?.trim()
    || requestHeaders.get("user-agent")?.trim()
    || "unknown";
  const keyHash = createHash("sha256").update(identifier).digest("hex");
  const allowed = await checkRateLimit(scope, keyHash, 10, 10 * 60);
  if (!allowed) throw new Error("Too many payment attempts. Please wait a few minutes and try again.");
}
