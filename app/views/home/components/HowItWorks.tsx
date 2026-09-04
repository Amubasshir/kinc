import Image from "next/image";
import Link from "next/link";
import type { HowStepModel } from "../../../models/site";

function renderParagraph(paragraph: string, stepIndex: number, paragraphIndex: number) {
  if (stepIndex !== 0 || paragraphIndex !== 0) return paragraph;

  const [beforeOrderForm, afterOrderForm] = paragraph.split("order form");
  const [beforeHere, afterHere] = afterOrderForm.split("here");

  return (
    <>
      {beforeOrderForm}
      <Link className="font-bold" href="/start-your-commission">
        Order Form
      </Link>
      {beforeHere}
      <a className="font-bold" href="https://calendly.com/zsofimatrai/new-meeting?month=2026-09" target="_blank" rel="noopener noreferrer">
        Here
      </a>
      {afterHere}
    </>
  );
}

export default function HowItWorks({ steps }: { steps: HowStepModel[] }) {
  return (
    <section id="how-it-works" className="how-it-works scroll-mt-6 rounded-[20px] bg-white px-6 pt-[91px] pb-24 text-[#263443] max-[700px]:rounded-[18px] max-[700px]:px-7 max-[700px]:pt-[62px] max-[700px]:pb-[58px]" aria-labelledby="how-heading">
      <h2 id="how-heading">
        <mark>How</mark> it works
      </h2>
      <div className="how-steps relative mx-auto mt-[86px] flex h-[1664px] w-full max-w-[1010px] flex-col gap-[110px] max-[760px]:h-auto max-[700px]:mt-[58px] max-[700px]:gap-[62px]">
        {steps.map((step, index) => (
          <article className={`how-step how-step-${index + 1}`} key={step.number}>
            <div className="how-photo">
              {step.image.toLowerCase().endsWith(".mov") ? (
                <video
                  src={step.image}
                  aria-label={step.alt}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <Image unoptimized
                  src={step.image}
                  alt={step.alt}
                  width={1320}
                  height={1320}
                  sizes="(max-width: 760px) 82vw, 370px"
                />
              )}
            </div>
            <div className="how-copy">
              <div className="how-title-row">
                <span className="how-number">{step.number}</span>
                <h3>{step.title}</h3>
              </div>
              <div className="how-body">
                {step.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraph}>{renderParagraph(paragraph, index, paragraphIndex)}</p>
                ))}
              </div>
              {step.action && (
                <Link className="how-cta" href="/start-your-commission">
                  START YOUR ORDER
                </Link>
              )}
              {step.scribble && (
                <Image unoptimized
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
        <Image unoptimized
          className="how-path how-path-1"
          src="/how-path-1.svg"
          alt=""
          width={502}
          height={190}
          aria-hidden="true"
        />
        <Image unoptimized
          className="how-path how-path-2"
          src="/how-path-2.svg"
          alt=""
          width={548}
          height={193}
          aria-hidden="true"
        />
        <Image unoptimized
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
