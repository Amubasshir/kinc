import type { Metadata } from "next";
import Image from "next/image";
import GiftCard from "../views/home/components/GiftCard";
import ArtistStory from "../views/artist/components/ArtistStory";

export const metadata: Metadata = {
  title: "Thank You | KinCollage",
  description: "Your KinCollage request has been received.",
};

type ThankYouPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const params = await searchParams;
  const type = Array.isArray(params.type) ? params.type[0] : params.type;
  const isQuote = type === "quote";

  return (
    <>
      <section className="commission-order-thanks" aria-labelledby="commission-thanks-title">
        <div>
          <h2 id="commission-thanks-title">
            Thank You!
            <br />
            <span>{isQuote ? "Your request has been received" : "Your order is received"}</span>
          </h2>
          <p>I’m so excited to help you turn these precious scribbles into a lasting work of art!</p>
          <h3>
            <mark>CHECK your inbox</mark>
          </h3>
          {isQuote ? (
            <p>
              Look out for a <strong className="commission-confirmation-label">confirmation email</strong> coming your way shortly. We&apos;ll review your custom
              size request and follow up with a personalised quote within 24–48 hours, before any payment is taken.
            </p>
          ) : (
            <p>
              Look out for a <strong className="commission-confirmation-label">confirmation email</strong> coming your way shortly. It will contain your receipt
              along with simple instructions on how to send your child’s original artwork to the studio, so we can
              move straight into the curation phase.
            </p>
          )}
          <h3>
            <mark>Optional: Book Your Design Consultation</mark>
          </h3>
          <p>
            If you’d like to discuss your vision, align on colours, or ask any questions before sending your art,
            feel free to pick a time for a complimentary 15-minute chat:
            <br />
            <a className="font-semibold underline underline-offset-2" href="https://calendly.com/zsofimatrai/new-meeting?month=2026-09" target="_blank" rel="noopener noreferrer">
              Schedule your 15-minute consultation here
            </a>
          </p>
          <p>
            I can&apos;t wait to see the magic your little artists have created and begin crafting your family heirloom!
          </p>
          <Image unoptimized src="/signature.svg" alt="Zsofia Matrai" width={207} height={49} />
        </div>
      </section>

      <ArtistStory videoOnly controls />
      <GiftCard />
    </>
  );
}
