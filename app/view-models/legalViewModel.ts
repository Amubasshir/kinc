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
          "Welcome to KinCollage. By browsing this website, submitting an intake form, or purchasing a custom commission, you agree to be bound by the following Terms and Conditions, which together with our Privacy Policy govern our relationship with you.",
        ],
        clauses: [
          {
            heading: "1. Custom Commissions & Design Approvals",
            bullets: [
              "Payment & Booking: Full payment is required at the time of order to officially secure your studio slot. We will confirm your order via email within 24 hours of receipt.",
              "Installment Option: If you opt for an installment plan, invoice payments will be split across scheduled milestones. All installments, along with any applicable shipping fees, must be paid completely prior to artwork dispatch.",
              "Priority Scheduling: Priority orders (subject to a 30% priority fee) guarantee an expedited completion date. Priority fees are non-refundable once studio scheduling has commenced.",
            ],
          },
          {
            heading: "2. Client Artwork & Physical Assets",
            bullets: [
              "Rights & Ownership: You guarantee that you own or have explicit permission to use all artwork, sketches, or materials submitted. You retain ownership of your original materials and agree to indemnify KinCollage against any third-party claims regarding intellectual property or copyright within submitted assets.",
              "Shipping Original Art: Clients are responsible for safely shipping original physical artwork to our Sydney studio. KinCollage is not liable for items lost or damaged in transit to us. We recommend using tracked or insured courier services.",
              "Return of Originals: Unless otherwise agreed, original physical artwork used in the creation of your collage will be incorporated into the piece or returned alongside your completed frame.",
            ],
          },
          {
            heading: "3. Design Process, Approval & Artistic Discretion",
            paragraphs: [
              "Every piece undergoes a multi-step physical layout, layering, archival varnishing, and hand-drawn finishing process.",
              "By commissioning KinCollage, you trust the artist’s aesthetic judgment and signature style. Any digital preview or layout review provided is subject to minor handcrafted variations during final assembly and varnishing.",
            ],
          },
          {
            heading: "4. Intellectual Property & Studio Rights",
            bullets: [
              "Artistic Rights: The final collage composition, layout, website content, branding, and custom visual expressions designed by our studio remain the intellectual property of KinCollage.",
              "Studio Portfolio: We reserve the right to share digital mockups, process videos, and photos of finished commissions on our website, portfolio, and social media channels. If your commission is a surprise gift or requires privacy, please explicitly request to opt out during intake.",
            ],
          },
          {
            heading: "5. Pricing & Exclusive Add-Ons",
            paragraphs: [
              "All prices are listed in United States Dollar (USD) unless stated otherwise.",
              "Exclusive lifestyle add-on products (e.g., secondary prints or frames) can only be purchased in conjunction with a core custom art commission layout.",
            ],
          },
          {
            heading: "6. Australian Consumer Law (Refunds & Returns)",
            bullets: [
              "Custom Goods: Because every piece is entirely customized, handcrafted, and created using your unique assets, we do not accept returns, cancellations, or refunds for change of mind once payment is made or curation work has commenced.",
              "Consumer Guarantees: Our goods come with guarantees that cannot be excluded under Australian Consumer Law (ACL). You are entitled to a repair, replacement, or refund for a major defect or failure in materials or manufacturing quality.",
            ],
          },
          {
            heading: "7. Governing Law",
            paragraphs: [
              "Jurisdiction: These terms are governed by and construed in accordance with the laws of New South Wales, Australia. Any disputes shall be subject to the exclusive jurisdiction of the courts of NSW.",
              "Force Majeure: KinCollage is not liable for any delay or failure in performance resulting from causes beyond our reasonable control, including courier disruptions, supply delays, or natural events.",
              "Entire Agreement & Severability: This agreement constitutes the full understanding between both parties. If any provision is deemed unenforceable, all remaining provisions will remain in full force and effect.",
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
