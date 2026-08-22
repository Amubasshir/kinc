import Link from "next/link";
import type { LegalViewModel } from "../../view-models/legalViewModel";

export default function LegalView({ viewModel }: { viewModel: LegalViewModel }) {
  return (
    <>
      <nav
        className="flex min-h-[78px] items-center justify-center gap-8 rounded-[20px] bg-white px-6 text-[14px] text-[#777] max-[700px]:min-h-0 max-[700px]:flex-wrap max-[700px]:gap-x-5 max-[700px]:gap-y-3 max-[700px]:rounded-[18px] max-[700px]:px-4 max-[700px]:py-6"
        aria-label="Legal policies"
      >
        {viewModel.navigation.map((item) => (
          <Link className="transition-colors hover:text-[#008d60]" href={item.href} key={item.href}>
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
          <div className="mx-auto mt-[62px] max-w-[1050px] text-[15px] leading-[1.35] max-[700px]:mt-10 max-[700px]:text-[14px] max-[700px]:leading-[1.5]">
            <p>Last Updated: {section.updated}</p>
            <div className="mt-7 space-y-4">
              {section.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-7 space-y-7">
              {section.clauses.map((clause) => (
                <article key={clause.heading}>
                  <h2 className="text-[15px] text-[#777]">{clause.heading}</h2>
                  {clause.paragraphs?.map((paragraph) => (
                    <p className="mt-1" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                  {clause.bullets && (
                    <ul className="mt-1 list-disc space-y-0.5 pl-6">
                      {clause.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
