import Image from "next/image";
import Link from "next/link";
import type { HowStepModel } from "../../../models/site";

export default function HowItWorks({ steps }: { steps: HowStepModel[] }) {
  return (
    <section className="how-it-works min-h-[2350px] rounded-[20px] bg-[#00d18f] px-6 pt-[91px] pb-24 text-[#263443] max-[700px]:min-h-0 max-[700px]:rounded-[18px] max-[700px]:px-7 max-[700px]:pt-[62px] max-[700px]:pb-[58px]" aria-labelledby="how-heading">
      <h2 id="how-heading">
        <mark>How</mark> it works
      </h2>
      <div className="how-steps relative mx-auto mt-[86px] flex w-full max-w-[1010px] flex-col gap-[110px] max-[700px]:mt-[58px] max-[700px]:gap-[62px]">
        {steps.map((step, index) => (
          <article className={`how-step how-step-${index + 1}`} key={step.number}>
            <div className="how-photo">
              <Image
                src={step.image}
                alt={step.alt}
                width={1320}
                height={1320}
                sizes="(max-width: 760px) 82vw, 370px"
              />
            </div>
            <div className="how-copy">
              <div className="how-title-row">
                <span className="how-number">{step.number}</span>
                <h3>{step.title}</h3>
              </div>
              <div className="how-body">
                {step.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {step.action && (
                <Link className="how-cta" href="/commissions">
                  START YOUR COMMISSION
                </Link>
              )}
              {step.scribble && (
                <Image
                  className="how-scribble"
                  src="/how-scribble.png"
                  alt=""
                  width={538}
                  height={545}
                  aria-hidden="true"
                />
              )}
            </div>
          </article>
        ))}
        <Image
          className="how-path how-path-1"
          src="/how-path-1.svg"
          alt=""
          width={502}
          height={190}
          aria-hidden="true"
        />
        <Image
          className="how-path how-path-2"
          src="/how-path-2.svg"
          alt=""
          width={548}
          height={193}
          aria-hidden="true"
        />
        <Image
          className="how-path how-path-3"
          src="/how-path-3.svg"
          alt=""
          width={506}
          height={201}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
