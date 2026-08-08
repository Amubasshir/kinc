export type LegalSection = {
  id: "terms" | "shipping" | "privacy";
  title: string;
  updated: string;
  introduction: string[];
  clauses: Array<{ heading: string; paragraphs?: string[]; bullets?: string[] }>;
};

export type LegalViewModel = { navigation: Array<{ label: string; href: string }>; sections: LegalSection[] };

export function getLegalViewModel(): LegalViewModel {
  return {
    navigation: [
      { label: "TERMS AND CONDITIONS", href: "#terms" },
      { label: "SHIPPING POLICY", href: "#shipping" },
      { label: "PRIVACY POLICY", href: "#privacy" },
    ],
    sections: [
      {
        id: "terms",
        title: "Terms and Conditions",
        updated: "Aug 2026",
        introduction: [
          "Welcome to our website. By browsing this website, submitting an intake form, or purchasing a custom commission, you agree to be bound by the following Terms and Conditions, which together with our Privacy Policy govern our relationship with you.",
        ],
        clauses: [
          {
            heading: "1. CUSTOM COMMISSIONS & DESIGN APPROVALS",
            bullets: [
              "The Intake Process: Commissions begin when an intake form is submitted and payment is secured.",
              "Client Assets: You guarantee that you own the rights to or have permission to share all images, files, or drawings uploaded for your custom commission. You retain ownership of your original materials.",
              "Design Approval Track: We will present a digital layout proof for your review. Once you provide explicit digital approval of the layout, the design is locked. No further modifications can be made, and the piece moves directly into physical manufacturing.",
            ],
          },
          {
            heading: "2. INTELLECTUAL PROPERTY & STUDIO RIGHTS",
            bullets: [
              "The final aggregated collage layout, website content, branding assets, custom layouts, and overall visual expressions designed by our studio remain the intellectual property of the business.",
              "We reserve the right to display digital mockups or process videos of finished commissions on our website and social media channels for marketing purposes. If your commission is highly sensitive or a private gift and you wish to opt out of marketing displays, please notify us explicitly during intake.",
            ],
          },
          {
            heading: "3. PAYMENT, PRICING, & ADD-ONS",
            bullets: [
              "All prices are listed in Australian Dollars (AUD) unless stated otherwise.",
              "Full payment or an agreed deposit structure is required before design curation work begins.",
              "Exclusive lifestyle add-on products can only be ordered in conjunction with a core custom art commission layout.",
            ],
          },
          {
            heading: "4. AUSTRALIAN CONSUMER LAW (REFUNDS & RETURNS)",
            bullets: [
              "Custom Goods: Because our products are entirely customized, handcrafted, and printed to order using your unique assets, we do not accept returns, cancellations, or refunds for change of mind once design work or manufacturing has commenced.",
              "Consumer Guarantees: Our goods come with guarantees that cannot be excluded under the Australian Consumer Law (ACL). You are entitled to a replacement or refund for a major failure or defect in materials or manufacturing quality.",
            ],
          },
          {
            heading: "5. GOVERNING LAW",
            paragraphs: [
              "These terms are governed by and construed in accordance with the laws of New South Wales, Australia. Any disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts of NSW.",
            ],
          },
        ],
      },
      {
        id: "shipping",
        title: "Shipping Policy",
        updated: "Aug 2026",
        introduction: [
          "Thank you for commissioning a piece with us. Because each artwork is custom-designed, printed, and framed to order, our shipping timelines reflect the bespoke nature of our craftsmanship.",
        ],
        clauses: [
          {
            heading: "1. PROCESSING & PRODUCTION TIMES",
            bullets: [
              "Custom Commissions: Standard curation and production takes [X]–[X] weeks from the date your initial design layout is finalized and approved.",
              "Add-On Products: Lifestyle add-on items (apparel, journals, phone cases, etc.) are processed alongside your main custom piece and will ship either together or in separate coordinated packages depending on production streams.",
            ],
          },
          {
            heading: "2. SHIPPING RATES & DESTINATIONS",
            bullets: [
              "We ship Australia-wide via reliable carrier networks (including Australia Post and selected premium couriers).",
              "Domestic Shipping: Flat-rate or weight-based shipping is calculated dynamically at checkout.",
              "International Shipping: We currently ship to selected international destinations. Rates and estimated transit times are calculated automatically at checkout based on your delivery address.",
            ],
          },
          {
            heading: "3. TRACKING & DELIVERY",
            paragraphs: [
              "Once your order has been dispatched from our studio, you will receive a confirmation email containing a tracking link. Please allow 24–48 hours for tracking details to update.",
            ],
          },
          {
            heading: "4. LOST, DELAYED, OR DAMAGED ITEMS",
            paragraphs: [
              "Every artwork is packed securely with museum-grade protective wrapping. In the rare event that an item arrives damaged during transit, please contact us at [Your Contact Email] within 48 hours of delivery with clear photographs of the packaging and the product. We will work swiftly to see what we can do.",
            ],
          },
        ],
      },
      {
        id: "privacy",
        title: "Privacy Policy",
        updated: "Aug 2026",
        introduction: [
          "We value your privacy and are committed to protecting your personal data in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).",
        ],
        clauses: [
          {
            heading: "1. INFORMATION WE COLLECT",
            paragraphs: [
              "We collect information necessary to fulfill your custom art commissions and provide a seamless web experience, including:",
            ],
            bullets: [
              "Identity & Contact Data: Your name, email address, phone number, and shipping/billing addresses.",
              "Commission Assets: Digital files, images, and artwork uploads provided via our intake forms (such as Tally) to fulfill your custom order.",
              "Transaction Data: Details of payments handled via our secure third-party payment processors (e.g., Stripe). We do not store your raw credit card information.",
            ],
          },
          {
            heading: "2. HOW WE USE YOUR DATA",
            paragraphs: ["We use your personal data strictly to:"],
            bullets: [
              "Process, curate, and manufacture your custom artwork and lifestyle add-ons.",
              "Communicate with you regarding your design proofs, approvals, and shipping status.",
              "Send occasional brand updates or marketing newsletters (if you have explicitly opted in). You may opt out at any time.",
            ],
          },
          {
            heading: "3. SHARING YOUR INFORMATION",
            paragraphs: [
              "We never sell your personal information. We only share data with trusted third-party service providers required to operate our business, including:",
            ],
            bullets: [
              "Direct print-on-demand and professional framing partners to manufacture your physical products.",
              "Shipping carriers and fulfillment networks.",
              "Cloud software tools used for website hosting and business operations.",
            ],
          },
          {
            heading: "4. SECURITY & RETENTION",
            paragraphs: [
              "We implement standard technical safeguards to protect your data. Your uploaded image assets are stored securely and retained only for as long as necessary to fulfill your custom commission requirements and handle potential future duplicate reprint requests.",
            ],
          },
          {
            heading: "5. CONTACT US",
            paragraphs: [
              "If you have any questions or wish to request access to, correction of, or deletion of your personal details, please contact us at [Your Contact Email].",
            ],
          },
        ],
      },
    ],
  };
}
