import Link from "next/link";
import { commissionAddOns, commissionSizes } from "../../view-models/commissionFormViewModel";
import ArtistStory from "../artist/components/ArtistStory";
import GiftCard from "../home/components/GiftCard";

const inputClass = "mt-1 h-10 w-full rounded-full border border-[#aaaab5] bg-white px-4 text-[13px] outline-none transition focus:border-[#00a879] focus:ring-2 focus:ring-[#00a879]/15";
const labelClass = "block text-[12px] uppercase tracking-[.02em] text-[#626267]";

export default function CommissionFormView() {
  return (
    <>
      <section className="rounded-[20px] bg-white px-6 py-[70px] text-[#626267] max-[700px]:rounded-[18px] max-[700px]:px-5 max-[700px]:py-12">
        <div className="mx-auto max-w-[650px]">
          <h1 className="text-center font-[Georgia] text-[48px] font-normal leading-tight max-[700px]:text-[36px]">Commission form</h1>
          <div className="mx-auto mt-12 max-w-[570px] text-[13px] leading-[1.45] text-[#8a8a8f] max-[700px]:mt-8">
            <p>Welcome to <strong className="italic">Kin &amp; Collage.</strong></p>
            <p>I believe that every scrap of paper &amp; childhood sketch holds a story worth telling. Your custom artwork starts here. This is our live commission form, simply complete the details below to officially order your custom piece today. If you are unsure on the size, just fill out the form and I&apos;ll get in touch with you to discuss the options.</p>
            <p className="mt-4"><strong className="italic">Prefer to have a free chat first?</strong><br />Get in touch with me <Link className="underline" href="/#contact">here</Link>.</p>
            <p className="mt-4">Please share a few details about your vision and let&apos;s begin the journey of creating your family heirloom that celebrates and captures your children&apos;s&apos; unique seasons of history.</p>
          </div>

          <form className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-7 max-[600px]:grid-cols-1 max-[600px]:gap-6">
              <label className={labelClass}>First name *<input className={inputClass} name="firstName" placeholder="Sammy" required /></label>
              <label className={labelClass}>Last name *<input className={inputClass} name="lastName" placeholder="Gordon" required /></label>
            </div>
            <label className={labelClass}>Email *<input className={inputClass} name="email" type="email" placeholder="your.email@email.com" required /></label>
            <label className={labelClass}>Address *<span className="mt-1 block normal-case text-[11px] text-[#aaaab0]">Used for delivery/pickup from Sydney, Australia.</span><input className={inputClass} name="address" required /></label>
            <label className={labelClass}>Which product or service are you inquiring about? *
              <span className="mt-1 block normal-case text-[11px] text-[#aaaab0]">If you&apos;re asking about multiple products, create a new inquiry for your other request.</span>
              <select className={inputClass} defaultValue="" name="product" required><option value="" disabled>Select a product or service</option><option>Original KinCollage artwork</option><option>Printed products</option><option>Gift voucher</option></select>
            </label>
            <label className={labelClass}>Tell us the story behind this commission<span className="mt-1 block normal-case text-[11px] text-[#aaaab0]">Specify if it&apos;s for a special milestone, a gift, or to preserve a specific era of childhood.</span><input className={inputClass} name="story" /></label>

            <fieldset><legend className={labelClass}>Which size(s) are you ordering? *</legend><p className="mt-1 text-[11px] text-[#aaaab0]">Note: AUD prices below reflect design curation and canvas printing. Framing can be added.</p><div className="mt-3 space-y-2">{commissionSizes.map((size) => <label className="flex items-start gap-3 text-[12px] text-[#8b8b91]" key={size}><input className="mt-0.5 accent-[#00a879]" type="checkbox" name="sizes" value={size} />{size}</label>)}</div><input className={inputClass} aria-label="Specify another size" name="otherSize" /></fieldset>
            <fieldset><legend className={labelClass}>Choose any add-on products with your collage printed on them</legend><p className="mt-1 text-[11px] leading-[1.4] text-[#aaaab0]">We can beautifully adapt your child&apos;s custom collage layout into a limited collection of premium everyday essentials. Select any pieces you would like to include as exclusive duplicates for your household or as gifts for grandparents. <Link className="underline" href="/commissions#product-options">See product range here.</Link></p><div className="mt-3 space-y-2">{commissionAddOns.map((item) => <label className="flex items-start gap-3 text-[12px] text-[#8b8b91]" key={item.id ?? item.name}><input className="mt-0.5 accent-[#00a879]" type="checkbox" name="addOns" value={item.name} /><span>{item.name} <em>({item.description})</em></span></label>)}</div></fieldset>
            <fieldset><legend className={labelClass}>Do you require a box to be sent to you for collecting the artworks? *</legend><p className="mt-1 text-[11px] text-[#aaaab0]">Price is calculated based on number of artwork.</p><div className="mt-3 space-y-2">{["No thanks, I will pack and mail the artwork using my own packaging.", "If you do, specify number of artworks and note the largest artwork size."].map((item) => <label className="flex gap-3 text-[12px] text-[#8b8b91]" key={item}><input className="accent-[#00a879]" type="radio" name="box" value={item} required />{item}</label>)}</div><input className={inputClass} aria-label="Artwork box details" name="boxDetails" /></fieldset>
            <fieldset><legend className={labelClass}>Would you like custom framing? (Natural raw oak, 55 mm profile)</legend><div className="mt-3 flex gap-7">{["Yes", "No", "Decide later"].map((item) => <label className="flex gap-2 text-[12px] text-[#8b8b91]" key={item}><input className="accent-[#00a879]" type="radio" name="framing" value={item} />{item}</label>)}</div></fieldset>
            <label className={labelClass}>Coupon code<input className={inputClass} name="coupon" /></label>
            <label className={labelClass}>Your note or question<span className="mt-1 block normal-case text-[11px] text-[#aaaab0]">Include any special requests you may have.</span><input className={inputClass} name="note" /></label>

            <button className="inline-flex min-h-12 w-fit items-center justify-center rounded-full bg-[#97ff77] px-7 font-[var(--font-tenor-sans)] text-[12px] text-[#263443] shadow-[0_4px_8px_rgb(25_93_69/20%)] transition hover:-translate-y-0.5" type="submit">START YOUR COMMISSION</button>
          </form>
        </div>
      </section>

      <section className="commission-next-steps rounded-t-[20px] rounded-b-none bg-[#00d18f] px-6 py-[105px] text-[#263443] max-[700px]:rounded-t-[18px] max-[700px]:rounded-b-none max-[700px]:px-6 max-[700px]:py-16">
        <div className="mx-auto max-w-[650px]"><h2 className="text-center font-[Georgia] text-[45px] font-normal max-[700px]:text-[34px]">Next steps</h2><div className="mt-8 space-y-7 text-[13px] leading-[1.5]"><p>I&apos;m so excited to help you turn these precious fragments into a lasting work of art!</p><p><mark className="bg-[#97ff77] px-1">TELL ME</mark> YOUR VISION (OPTIONAL)<br />To discuss anything you&apos;re unsure about, schedule a complimentary 15-minute Design Consultation.</p><p><mark className="bg-[#97ff77] px-1">REVIEW</mark> YOUR SUBMISSION<br />I&apos;ll personally review your inquiry and send a secure custom Stripe link for your final approval and payment.</p><p><mark className="bg-[#97ff77] px-1">CHECK</mark> YOUR EMAIL<br />Once confirmed, we can move your piece straight into the curation phase.</p></div></div>
      </section>
      <ArtistStory videoOnly />
      <GiftCard />
    </>
  );
}
