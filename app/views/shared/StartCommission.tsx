import Image from "next/image";
import Link from "next/link";

export default function StartCommission() {
  return (
    <section className="start-commission" aria-labelledby="start-commission-heading">
      <Image className="start-commission-mark" src="/gallery-page/kin-mark.png" alt="Kin" width={49} height={49} />
      <h2 id="start-commission-heading">Start your commission</h2>
      <p>Create a beautiful statement piece for your home, or a deeply meaningful keepsake for grandparents.</p>
      <div className="start-commission-action">
        <Link href="#commission-heading">GET STARTED</Link>
        {/* <Image className="start-commission-burst" src="/hero-eyelash.svg" alt="" width={51} height={85} aria-hidden="true" /> */}
      </div>
    </section>
  );
}
