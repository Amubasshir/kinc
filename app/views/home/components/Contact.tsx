import Image from "next/image";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="contact min-h-[870px] rounded-[20px] bg-[#008861] bg-[url('/contact-background.png')] bg-cover bg-center bg-no-repeat px-10 py-16 max-[700px]:min-h-0 max-[700px]:rounded-[18px] max-[700px]:px-1 max-[700px]:pt-1 max-[700px]:pb-[29px]" aria-labelledby="contact-heading">
      <div className="contact-panel relative mx-auto flex min-h-[743px] max-w-[1212px] items-center gap-10 max-[700px]:flex-col max-[700px]:gap-[34px]">
        <Image unoptimized
          className="contact-shadow-layer"
          src="/contact-panel-shadow.png"
          alt=""
          width={1199}
          height={678}
          aria-hidden="true"
        />
        <Image unoptimized
          className="contact-green-layer"
          src="/contact-panel-green.png"
          alt=""
          width={1212}
          height={743}
          aria-hidden="true"
        />
        <div className="contact-form-card relative z-[2] w-[55%] rounded-[18px] bg-white p-12 max-[700px]:order-first max-[700px]:w-full max-[700px]:px-[21px] max-[700px]:pt-[43px] max-[700px]:pb-10 [overflow-wrap:anywhere]">
          <h2 className="text-[48px] max-[700px]:font-[Georgia] max-[700px]:text-[34px]" id="contact-heading">Contact us</h2>
          <p>
            Ready to start{" "}
            <strong>
              <em>your KinCollage</em>
            </strong>{" "}
            or have a question
            <br /> about the partnering or anything else?
          </p>

          <ContactForm />
        </div>

        <Image unoptimized
          className="contact-artwork relative z-[2] w-[455px] rounded-[18px] object-cover max-[700px]:order-last max-[700px]:mx-auto max-[700px]:w-[calc(100%-42px)] max-[700px]:aspect-[318/389]"
          src="/contact-artwork.png"
          alt="A finished KinCollage artwork displayed outdoors"
          width={1820}
          height={2328}
          sizes="(max-width: 800px) 90vw, 455px"
        />
      </div>
    </section>
  );
}
