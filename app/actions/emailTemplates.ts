const HEADING_FONT = "'Tenor Sans', Georgia, 'Times New Roman', serif";
const BODY_FONT = "'Montserrat', Arial, Helvetica, sans-serif";

function applySemiboldEmailMarkup(html: string) {
  return html.replaceAll("<strong>", '<span style="font-weight:600;">').replaceAll("</strong>", "</span>");
}

export function renderGiftCouponHtml(name: string, code: string): string {
  const safeName = name.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  return `<!doctype html><html lang="en"><body style="margin:0;padding:40px 16px;background:#f7f7f7;color:#515151;font-family:${BODY_FONT};"><table role="presentation" width="100%" style="max-width:600px;margin:auto;background:#fff;border:1px solid #e5e5e5;border-radius:20px;overflow:hidden;"><tr><td style="padding:34px;text-align:center;background:#00d18f;font-family:${HEADING_FONT};font-size:27px;color:#263443;">KinCollage</td></tr><tr><td style="padding:42px;text-align:center;"><h1 style="font-family:${HEADING_FONT};font-weight:400;">Your $50 gift is here!</h1><p>Hi ${safeName}, thank you for signing up. Use this coupon on your first commission:</p><p style="display:inline-block;padding:14px 22px;background:#97ff77;border-radius:10px;font-size:24px;font-weight:600;letter-spacing:2px;color:#263443;">${code}</p><p>This coupon is valid once for a $50 discount and can be entered on the commission page.</p><p style="font-family:${HEADING_FONT};font-size:19px;">Warmly,<br />Zsofia</p></td></tr></table></body></html>`;
}

export function renderGiftCouponText(name: string, code: string): string {
  return `Hi ${name},\n\nThank you for signing up! Your $50 KinCollage gift coupon is:\n\n${code}\n\nEnter this code on the commission page. It is valid once for a $50 discount.\n\nWarmly,\nZsofia`;
}

export function renderGiftCouponNotificationHtml(name: string, email: string, code: string): string {
  return `<!doctype html><html lang="en"><body style="font-family:${BODY_FONT};color:#34343c;"><h1 style="font-family:${HEADING_FONT};font-weight:400;">New KinCollage gift coupon signup</h1><p>A new subscriber received a $50 first-commission coupon.</p><table cellpadding="8" cellspacing="0" style="border-collapse:collapse;"><tr><td><span style="font-weight:600;">Name</span></td><td>${name}</td></tr><tr><td><span style="font-weight:600;">Email</span></td><td>${email}</td></tr><tr><td><span style="font-weight:600;">Coupon</span></td><td>${code}</td></tr><tr><td><span style="font-weight:600;">Discount</span></td><td>$50</td></tr></table></body></html>`;
}

export function renderGiftCouponNotificationText(name: string, email: string, code: string): string {
  return `New KinCollage gift coupon signup\n\nName: ${name}\nEmail: ${email}\nCoupon: ${code}\nDiscount: $50`;
}

export function renderVoucherHtml(email: string, code: string, amount: string): string {
  return `<!doctype html><html lang="en"><body style="margin:0;padding:40px 16px;background:#f7f7f7;color:#515151;font-family:${BODY_FONT};"><table role="presentation" width="100%" style="max-width:600px;margin:auto;background:#fff;border:1px solid #e5e5e5;border-radius:20px;overflow:hidden;"><tr><td style="padding:34px;text-align:center;background:#00d18f;font-family:${HEADING_FONT};font-size:27px;color:#263443;">KinCollage</td></tr><tr><td style="padding:42px;text-align:center;"><h1 style="font-family:${HEADING_FONT};font-weight:400;">A gift of memories</h1><p>Your digital KinCollage voucher is ready.</p><p style="font-size:20px;">Voucher value: <span style="font-weight:600;">${amount}</span></p><p style="display:inline-block;padding:14px 22px;background:#97ff77;border-radius:10px;font-size:23px;font-weight:600;letter-spacing:2px;color:#263443;">${code}</p><p>Use this code when booking a KinCollage commission.</p><p style="font-family:${HEADING_FONT};font-size:19px;">Warmly,<br />Zsofia</p></td></tr></table></body></html>`;
}

export function renderVoucherText(email: string, code: string, amount: string): string {
  return `Your KinCollage digital voucher is ready!\n\nVoucher value: ${amount}\nVoucher code: ${code}\n\nUse this code when booking a KinCollage commission.\n\nWarmly,\nZsofia`;
}

export function renderVoucherNotificationHtml(email: string, code: string, amount: string, paymentIntentId: string): string {
  return `<!doctype html><html lang="en"><body style="font-family:${BODY_FONT};color:#34343c;"><h1 style="font-family:${HEADING_FONT};font-weight:400;">New KinCollage voucher purchase</h1><p>A digital voucher has been paid for and created.</p><table cellpadding="8" cellspacing="0"><tr><td><span style="font-weight:600;">Recipient email</span></td><td>${email}</td></tr><tr><td><span style="font-weight:600;">Amount</span></td><td>${amount}</td></tr><tr><td><span style="font-weight:600;">Voucher code</span></td><td>${code}</td></tr><tr><td><span style="font-weight:600;">Payment ID</span></td><td>${paymentIntentId}</td></tr></table></body></html>`;
}

export function renderVoucherNotificationText(email: string, code: string, amount: string, paymentIntentId: string): string {
  return `New KinCollage voucher purchase\n\nRecipient email: ${email}\nAmount: ${amount}\nVoucher code: ${code}\nPayment ID: ${paymentIntentId}`;
}

export function renderContactConfirmationHtml(name: string): string {
  const firstName = name.split(" ")[0] || name;

  return applySemiboldEmailMarkup(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>We've received your message</title>
    <!--[if mso]>
    <style>
      * { font-family: Georgia, 'Times New Roman', serif !important; }
    </style>
    <![endif]-->
  </head>
  <body style="margin:0; padding:0; background-color:#F9F9F9;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9F9;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%; max-width:600px; background-color:#ffffff; border:1px solid #E5E5E5; border-radius:20px; overflow:hidden;">
            <tr>
              <td align="center" style="background-color:#00D18F; padding:36px 24px;">
                <span style="font-family:${HEADING_FONT}; font-size:26px; letter-spacing:1px; color:#ffffff;">KinCollage</span>
              </td>
            </tr>
            <tr>
              <td style="padding:44px 48px 8px;">
                <h1 style="margin:0 0 20px; font-family:${HEADING_FONT}; font-weight:400; font-size:30px; line-height:1.2; color:#515151;">
                  We've received your message
                </h1>
                <p style="margin:0 0 18px; font-family:${BODY_FONT}; font-size:16px; line-height:1.6; color:#515151;">
                  Hi ${firstName},
                </p>
                <p style="margin:0 0 18px; font-family:${BODY_FONT}; font-size:16px; line-height:1.6; color:#515151;">
                  Thank you so much for reaching out about your KinCollage. I've received your message and will get back to you soon — usually within 1&ndash;2 business days.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 28px; border-left:3px solid #97FF77; background-color:#F9F9F9; border-radius:0 10px 10px 0;">
                  <tr>
                    <td style="padding:16px 20px; font-family:${HEADING_FONT}; font-style:italic; font-size:16px; line-height:1.5; color:#515151;">
                      Every collage begins with a story — I can't wait to hear yours.
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 4px; font-family:${HEADING_FONT}; font-style:italic; font-size:20px; color:#515151;">
                  Warmly,
                </p>
                <p style="margin:0 0 32px; font-family:${HEADING_FONT}; font-style:italic; font-size:20px; color:#515151;">
                  Zsofia
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 24px 32px; border-top:1px solid #F0F0F0;">
                <p style="margin:0; font-family:${BODY_FONT}; font-size:12px; line-height:1.6; color:#B0B0B0;">
                  &copy; ${new Date().getFullYear()} KinCollage. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`);
}

export function renderContactConfirmationText(name: string): string {
  const firstName = name.split(" ")[0] || name;
  return `Hi ${firstName},

Thank you so much for reaching out about your KinCollage. I've received your message and will get back to you soon — usually within 1-2 business days.

Every collage begins with a story — I can't wait to hear yours.

Warmly,
Zsofia`;
}

export type CommissionEmailDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  product: string;
  sizes: string;
  otherSize: string;
  addOns: string;
  framing: string;
  box: string;
  boxDetails: string;
  priorityDate: string;
  story: string;
  note: string;
  coupon: string;
  discount?: string;
  total: string;
  deposit: string;
  paymentReference: string;
  paymentPlan?: string;
  installmentNumber?: string;
  shipping?: string;
  rushFee?: string;
  quoteOnly?: boolean;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function detailRows(details: CommissionEmailDetails) {
  const rows = [
    ["Customer", `${details.firstName} ${details.lastName}`],
    ["Email", details.email],
    ["Phone", details.phone],
    ["Address", details.address],
    ["Product", details.product],
    ["Canvas size(s)", details.sizes],
    ["Custom size", details.otherSize],
    ["Add-ons", details.addOns],
    ["Framing", details.framing],
    ["Collection box", details.box],
    ["Box details", details.boxDetails],
    ["Priority date", details.priorityDate],
    ["Payment plan", details.paymentPlan ?? ""],
    ["Installment", details.installmentNumber ?? ""],
    ["Shipping", details.shipping ?? ""],
    ["Rush fee", details.rushFee ?? ""],
    ["Story", details.story],
    ["Note", details.note],
    ["Coupon", details.coupon],
    ["Voucher discount", details.discount ?? ""],
    ["Estimated total", details.total],
    [details.quoteOnly ? "Payment" : "Deposit paid", details.deposit],
    ["Reference", details.paymentReference],
  ].filter(([, value]) => value);

  return rows;
}

export function renderCommissionConfirmationHtml(details: CommissionEmailDetails): string {
  const firstName = escapeHtml(details.firstName);
  const greetingName = firstName || "there";
  const greeting = details.quoteOnly && !firstName ? "Thank you!" : `Thank you, ${greetingName}!`;
  const statusCopy = details.quoteOnly
    ? "Your custom-size request has been received. We will review it and email your tailored quote shortly."
    : details.paymentPlan === "Full payment"
      ? `Your full payment of <span style="font-weight:600;">${escapeHtml(details.deposit)}</span> has been received and your studio slot is now secured.`
      : `Your first installment of <span style="font-weight:600;">${escapeHtml(details.deposit)}</span> has been received and your studio slot is now secured.`;
  const priorityDate = details.priorityDate
    ? new Date(`${details.priorityDate}T00:00:00`).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })
    : "";
  const summaryRows = [
    ["Canvas size(s)", details.sizes],
    ["Payment plan", details.paymentPlan ?? ""],
    ["Shipping", details.shipping ?? ""],
    ["Priority date", priorityDate],
    ["Amount paid", details.deposit],
    ["Voucher discount", details.discount ?? ""],
    ["Order total", details.total],
  ].filter(([, value]) => value).map(([label, value]) => `<tr><td width="34%" style="width:34%;padding:11px 14px;border-bottom:1px solid #ededed;font-weight:600;line-height:1.45;white-space:nowrap;vertical-align:top;color:#515151;">${escapeHtml(label)}</td><td width="66%" style="width:66%;padding:11px 14px;border-bottom:1px solid #ededed;line-height:1.5;vertical-align:top;color:#515151;">${escapeHtml(value)}</td></tr>`).join("");

  return applySemiboldEmailMarkup(`<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f7f7f7;color:#515151;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;overflow:hidden;border:1px solid #e5e5e5;border-radius:20px;background:#ffffff;">
          <tr><td align="center" style="padding:34px 24px;background:#00d18f;font-family:${HEADING_FONT};font-size:27px;color:#263443;">KinCollage</td></tr>
          <tr><td style="padding:42px 46px;font-family:${BODY_FONT};font-size:14px;line-height:1.6;">
            <h1 style="margin:0 0 22px;font-family:${HEADING_FONT};font-size:30px;font-weight:400;line-height:1.2;color:#515151;">${greeting}</h1>
            <p style="margin:0 0 18px;">${statusCopy}</p>
            <p style="margin:0 0 18px;">Your order summary and instructions for safely sending your child&apos;s original artwork to the Sydney studio will follow shortly.</p>
            ${details.quoteOnly ? "<p style=\"margin:0 0 18px;\"><strong>No payment has been taken. We’ll confirm your tailored quote before requesting payment.</strong></p>" : details.paymentPlan === "Full payment" ? "" : "<p style=\"margin:0 0 18px;\"><strong>The remaining balance will be due before dispatch.</strong></p>"}
            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:24px 0 10px;border:1px solid #ededed;border-radius:10px;overflow:hidden;font-family:${BODY_FONT};font-size:12px;">${summaryRows}</table>
            <p style="margin:28px 0 0;font-family:${HEADING_FONT};font-size:19px;">Warmly,<br />Zsofia</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`);
}

export function renderCommissionConfirmationText(details: CommissionEmailDetails): string {
  const greetingName = details.firstName || "there";
  const greeting = details.quoteOnly && !details.firstName ? "Hi there," : `Hi ${greetingName},`;
  const statusCopy = details.quoteOnly
    ? "Your custom-size request has been received. We will review it and email your tailored quote shortly."
    : details.paymentPlan === "Full payment"
      ? `Your full payment of ${details.deposit} has been received and your studio slot is now secured.`
      : `Your first installment of ${details.deposit} has been received and your studio slot is now secured.`;

  return `${greeting}

Thank you for your KinCollage order. ${statusCopy}

Your order summary and instructions for safely sending your child's original artwork to the Sydney studio will follow shortly.

Canvas size(s): ${details.sizes}
Payment plan: ${details.paymentPlan ?? ""}
Shipping: ${details.shipping ?? ""}
Priority date: ${details.priorityDate || "None"}
Amount paid: ${details.deposit}
Voucher discount: ${details.discount || "None"}
Order total: ${details.total}

${details.quoteOnly ? "No payment has been taken. We’ll confirm your tailored quote before requesting payment.\n\n" : details.paymentPlan === "Full payment" ? "" : "The remaining balance will be due before dispatch.\n\n"}

Warmly,
Zsofia`;
}

export function renderCommissionNotificationHtml(details: CommissionEmailDetails): string {
  const rows = detailRows(details)
    .map(([label, value]) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #ededed;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #ededed;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`)
    .join("");

  return `<!doctype html><html lang="en"><body style="font-family:${BODY_FONT};color:#34343c;"><h1 style="font-family:${HEADING_FONT};font-weight:400;">New KinCollage ${details.quoteOnly ? "quote request" : "paid order"}</h1><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:760px;border:1px solid #ededed;border-radius:12px;overflow:hidden;">${rows}</table></body></html>`;
}

export function renderCommissionNotificationText(details: CommissionEmailDetails): string {
  return detailRows(details).map(([label, value]) => `${label}: ${value}`).join("\n");
}
