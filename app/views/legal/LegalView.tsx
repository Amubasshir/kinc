import Link from "next/link";
import type { LegalViewModel } from "../../view-models/legalViewModel";

const legalLeadLabels = new Set([
  "Payment & Booking",
  "Installment Option",
  "Priority Scheduling",
  "Rights & Ownership",
  "Shipping Original Art",
  "Return of Originals",
  "Artistic Rights",
  "Studio Portfolio",
  "Domestic Shipping",
  "International Shipping",
  "Custom Goods",
  "Consumer Guarantees",
  "Jurisdiction",
  "Force Majeure",
  "Entire Agreement & Severability",
]);
const legalBulletParagraphLabels = new Set([
  "Mandatory Care",
  "Digital Backups",
  "Signature Required",
  "Damaged in Transit",
]);

function renderLegalText(text: string, options?: { emphasizeLeadLabels?: boolean }) {
  const emphasizeLeadLabels = options?.emphasizeLeadLabels ?? true;
  const leadLabel = [...legalLeadLabels].find((label) => text.startsWith(`${label}:`));
  const content = leadLabel ? text.slice(leadLabel.length + 1).trimStart() : text;
  const renderedContent = content.split(/(hello@kincollage\.com)/g).map((part, index) => part === "hello@kincollage.com"
    ? <a href="mailto:hello@kincollage.com" key={`${text}-${index}`}>{part}</a>
    : part);
  if (!leadLabel) return renderedContent;
  return <>{emphasizeLeadLabels ? <strong>{leadLabel}:</strong> : `${leadLabel}: `}{renderedContent}</>;
}

export default function LegalView({ viewModel }: { viewModel: LegalViewModel }) {
  return (
    <>
      <nav
        className="legal-navigation flex min-h-[78px] items-center justify-center gap-8 rounded-[20px] bg-white px-6 text-[14px] text-[#777] max-[700px]:min-h-0 max-[700px]:flex-col max-[700px]:gap-x-5 max-[700px]:gap-y-3 max-[700px]:rounded-[18px] max-[700px]:px-4 max-[700px]:py-6"
        aria-label="Legal policies"
      >
        {viewModel.navigation.map((item) => (
          <Link className="uppercase transition-colors hover:text-[#008d60]" href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      {viewModel.sections.map((section) => (
        <section
          className="scroll-mt-4 rounded-[20px] bg-white px-8 pt-[66px] pb-[70px] text-[#515151] max-[700px]:rounded-[18px] max-[700px]:px-5 max-[700px]:pt-10 max-[700px]:pb-12"
          id={section.id}
          key={section.id}
        >
          <h1 className="text-center text-[48px] leading-[1.1] text-[#555] max-[700px]:text-[34px]">{section.title}</h1>
          <div className="legal-copy mx-auto mt-[62px] max-w-[1050px] font-[var(--font-montserrat)] text-[16px] leading-[1.35] max-[700px]:mt-10 max-[700px]:text-[16px] max-[700px]:leading-[1.5]">
            <p>Last Updated: {section.updated}</p>
            <div className="mt-7 space-y-4">
              {section.introduction.map((paragraph) => (
                <p key={paragraph}>{renderLegalText(paragraph, { emphasizeLeadLabels: section.id !== "terms" })}</p>
              ))}
            </div>
            <div className="mt-7 space-y-7">
              {section.clauses.map((clause) => {
                const treatParagraphsAsBullets = section.id === "terms";
                const renderSectionText = (text: string) => renderLegalText(text, { emphasizeLeadLabels: section.id !== "terms" });
                const paragraphs = clause.paragraphs ?? [];
                const paragraphBullets = paragraphs.filter((paragraph) => [...legalBulletParagraphLabels].some((label) => paragraph.startsWith(`${label}:`)));
                const plainParagraphs = paragraphs.filter((paragraph) => !paragraphBullets.includes(paragraph));
                return (
                  <article key={clause.heading}>
                    <h2 className="text-[16px] text-[#777] uppercase">{clause.heading}</h2>
                    {treatParagraphsAsBullets && paragraphs.length ? (
                      <ul className="mt-1 list-disc space-y-0.5 pl-6">
                        {paragraphs.map((paragraph) => <li key={`paragraph-${paragraph}`}>{renderSectionText(paragraph)}</li>)}
                        {clause.bullets?.map((bullet) => <li key={`bullet-${bullet}`}>{renderSectionText(bullet)}</li>)}
                      </ul>
                    ) : (
                      <>
                        {plainParagraphs.map((paragraph) => <p className="mt-1" key={paragraph}>{renderSectionText(paragraph)}</p>)}
                        {(paragraphBullets.length || clause.bullets?.length) ? (
                          <ul className="mt-1 list-disc space-y-0.5 pl-6">
                            {paragraphBullets.map((paragraph) => <li key={`paragraph-bullet-${paragraph}`}>{renderSectionText(paragraph)}</li>)}
                            {clause.bullets?.map((bullet) => <li key={bullet}>{renderSectionText(bullet)}</li>)}
                          </ul>
                        ) : null}
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
