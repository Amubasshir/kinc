import Image from "next/image";
import Link from "next/link";
import type { HowStepModel } from "../../../models/site";

function renderEmojiText(text: string, keyPrefix: string) {
  return text.split(/(🛡️|🚚)/u).map((part, index) => {
    if (part === "🛡️" || part === "🚚") {
      return <span className="how-emoji" key={`${keyPrefix}-${index}`}>{part}</span>;
    }

    return part;
  });
}

function renderParagraph(paragraph: string, stepIndex: number, paragraphIndex: number) {
  if (stepIndex !== 0 || paragraphIndex !== 0) return renderEmojiText(paragraph, `step-${stepIndex}-${paragraphIndex}`);

  const followupStart = " If you have any questions,";
  const followupIndex = paragraph.indexOf(followupStart);
  const primaryText = followupIndex === -1 ? paragraph : paragraph.slice(0, followupIndex);
  const followupText = followupIndex === -1 ? "" : paragraph.slice(followupIndex + 1);
  const [beforeOrderForm, afterOrderForm] = primaryText.split("order form");
  const [beforeHere, afterHere] = (followupIndex === -1 ? afterOrderForm : followupText).split("here");

  return (
    <>
      {renderEmojiText(beforeOrderForm, "order-before")}
      <Link className="font-semibold underline underline-offset-2" href="/start-your-commission">
        order form
      </Link>
      {renderEmojiText(followupIndex === -1 ? beforeHere : afterOrderForm, "order-middle")}
      {followupIndex !== -1 && <><br />{renderEmojiText(beforeHere, "order-followup")}</>}
        <a className="font-semibold underline underline-offset-2" href="https://calendly.com/zsofimatrai/new-meeting?month=2026-09" target="_blank" rel="noopener noreferrer">
        here
      </a>
      {renderEmojiText(afterHere, "order-after")}
    </>
  );
}

export default function HowItWorks({ steps }: { steps: HowStepModel[] }) {
  return (
    <section id="how-it-works" className="how-it-works scroll-mt-6 rounded-[20px] bg-white px-6 pt-[91px] pb-24 text-[#515151] max-[700px]:rounded-[20px] max-[700px]:px-7 max-[700px]:pt-[62px] max-[700px]:pb-[58px]" aria-labelledby="how-heading">
      <h2 id="how-heading">
        <mark>How</mark> it works
      </h2>
      <div className="how-steps relative mx-auto mt-[86px] flex h-[1664px] w-full max-w-[1010px] flex-col gap-[110px] max-[760px]:h-auto max-[700px]:mt-[58px] max-[700px]:gap-[62px]">
        {steps.map((step, index) => (
          <article className={`how-step how-step-${index + 1}`} key={step.number}>
            <div className="how-photo">
              {/\.(mp4|webm|mov)$/i.test(step.image) ? (
                <video
                  src={step.image}
                  poster={step.poster}
                  aria-label={step.alt}
                  autoPlay
                  loop
                  muted
                  playsInline
                  // Sits well below the fold: hold the poster and let the browser
                  // fetch the video when it scrolls into view, so it never competes
                  // with the hero for bandwidth.
                  preload="none"
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
                <Link className="button-primary how-cta font-[var(--font-tenor-sans)]" href="/start-your-commission">
                  START MY ORDER
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
