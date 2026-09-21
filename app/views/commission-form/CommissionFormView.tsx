import Image from "next/image";
import Link from "next/link";
// import ArtistStory from "../artist/components/ArtistStory";
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
          <h2><mark>Please note:</mark></h2>
          <p className="commission-order-hero-note">I accept a limited number of requests each month to give every artwork my full design care. Submitting this form today officially locks in our exclusive launch pricing for 2026. Once our launch period ends, rates will return to standard pricing for 2027. Once your physical pieces of art arrive at the studio, I will provide your estimated completion date.</p>
          <p>Prefer to have a free chat first?<br />Get in touch with me <Link className="underline underline-offset-2" href="/#contact">here</Link>.</p>
        </div>
        <div className="commission-order-hero-art" aria-hidden="true">
          <Image unoptimized className="commission-order-composition" src="/commission/hero-composition.png" alt="" width={573} height={539} priority />
        </div>
      </section>

      <section className="commission-order-main" id="commission-order-main" aria-labelledby="commission-details-title">
        <div className="commission-order-container">
          <h2 id="commission-details-title">Share the details</h2>
          <div className="commission-order-information">
            <p><strong>Thank you so much for trusting me with your child&apos;s precious artwork. Saving these scribbles and turning them into modern family heirlooms is at heart of what I do.</strong></p>
            <h3>🎁 YOUR 2026 LAUNCH BONUS INCLUDES</h3>
            <p>Every commission placed today automatically includes a FREE Custom Magnet ($20 Value) framing a piece of your child&apos;s original drawing, plus a FREE Archival Greeting Card ($50 Value) for studio email subscribers!</p>
            <h3>PRIORITY COMPLETION DATES</h3>
            <p>If you require your piece by a specific date (eg. special occasion), we offer a <strong>priority option for an additional 30% rush fee</strong> that guarantees your chosen completion date. You can request it in the form below.</p>
          </div>
          <CommissionOrderForm commissionProducts={commissionProducts} requestedAddOnId={requestedAddOnId} requestedProductId={requestedProductId} />
        </div>
      </section>

      {/* <ArtistStory videoOnly controls /> */}
      <GiftCard />
    </>
  );
}
