import Image from "next/image";
import Link from "next/link";
import ArtistStory from "../artist/components/ArtistStory";
import GiftCard from "../home/components/GiftCard";
import CommissionOrderForm from "./CommissionOrderForm";
import type { StripeCommissionProduct } from "../../lib/stripePricing";

export default function CommissionFormView({ commissionProducts, requestedAddOnId, requestedProductId }: { commissionProducts: StripeCommissionProduct[]; requestedAddOnId?: string; requestedProductId?: string }) {
  return (
    <>
      <section className="commission-order-hero" aria-labelledby="commission-order-title">
        <div className="commission-order-hero-copy">
          <h1 id="commission-order-title">Collage order form</h1>
          <p>Thank you for your interest in commissioning a KinCollage heirloom.</p>
          <p>Filling out this short form secures your spot in my upcoming studio batch.</p>
          <h2><mark>Please note:</mark></h2>
          <p className="commission-order-hero-note">I accept a limited number of requests each month to give every artwork my full design care. Submitting this form and confirming your 50% deposit officially locks in your studio slot. I&apos;ll confirm your order via email within 24 hours, and you will receive your estimated completion date once your artwork arrives at the studio. The remaining 50% balance is due upon completion of your piece.</p>
          <p>Prefer to have a free chat first?<br />Get in touch with me <Link href="/#contact">here</Link>.</p>
        </div>
        <div className="commission-order-hero-art" aria-hidden="true">
          <Image unoptimized className="commission-order-composition" src="/commission/hero-composition.png" alt="" width={573} height={539} priority />
        </div>
      </section>

      <section className="commission-order-main" id="commission-order-main" aria-labelledby="commission-details-title">
        <div className="commission-order-container">
          <h2 id="commission-details-title">Share the details</h2>
          <div className="commission-order-information">
            <h3><mark>Shipping &amp; Delivery</mark></h3>
            <p>Shipping is calculated upon completing the form below based on your selected canvas size and location.</p>
            <p>✧ <strong>Australia-Wide:</strong> Estimated delivery times after dispatch are 2–8 business days for Standard and 1–4 business days for Express. (Local Sydney studio collection is also available).</p>
            <p>✧ <strong>International Orders:</strong> We ship worldwide! International transit typically takes 6–9 business days for the USA, 4–7 business days for NZ, and 10–14 business days for the rest of the world.</p>
            <h3><mark>Priority Completion Dates</mark></h3>
            <p>If you require your piece by a specific date (e.g. special occasion), we offer a <strong>priority option for an additional 30% rush fee</strong> that guarantees your chosen completion date. You can request it in the form below.</p>
            <h3><mark>Next Steps &amp; Deposit</mark></h3>
            <p>✧ Submitting this form and confirming your <strong>50% deposit officially locks in your studio slot.</strong> I&apos;ll confirm your order via email within 24 hours, and the <strong>remaining 50% balance will be due upon completion of your piece.</strong><br />✧ Once confirmed, you&apos;ll receive our <em>Studio Care Guide</em> with instructions on how to send your child&apos;s original artwork to our Sydney studio (or order a prepaid collection box).<br />✧ Once I receive your physical artwork in the studio, please allow up to 6 weeks for your completed collage (including custom framing, if added).</p>
            <p><strong>Thank you so much for trusting me with your child&apos;s precious artwork. Saving these scribbles and turning them into modern family heirlooms is at the heart of what I do.</strong></p>
            <p><strong>I am deeply honoured to preserve their creations and craft a bespoke piece of fine art for your home!</strong></p>
          </div>
          <CommissionOrderForm commissionProducts={commissionProducts} requestedAddOnId={requestedAddOnId} requestedProductId={requestedProductId} />
        </div>
      </section>

      <ArtistStory videoOnly controls />
      <GiftCard commission />
    </>
  );
}
