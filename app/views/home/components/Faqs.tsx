import type { FaqModel } from "../../../models/site";
export default function Faqs({ faqs }: { faqs: FaqModel[] }) {
  return (
    <section id="faqs" className="faqs min-h-[790px] rounded-[20px] bg-[#97FF77] px-6 pt-[91px] pb-[70px] text-[#555] max-[700px]:min-h-0 max-[700px]:rounded-[18px] max-[700px]:px-[22px] max-[700px]:pt-[45px] max-[700px]:pb-[31px]" aria-labelledby="faqs-heading">
      <h2 className="text-center text-[48px] max-[700px]:font-[Georgia] max-[700px]:text-[34px]" id="faqs-heading">FAQs</h2>
      <div className="faq-list mx-auto mt-[55px] w-full max-w-[900px] max-[700px]:mt-[39px]">
        {faqs.map((faq, index) => (
          <details className="faq-item border-b border-[#aaaab5] max-[700px]:[&:nth-child(n+4)]:hidden" key={faq.question} open={index === 0}>
            <summary className="flex min-h-[74px] cursor-pointer list-none items-center justify-between text-[17px] max-[700px]:min-h-[83px] max-[700px]:text-[16px]">
              <span>{faq.question}</span>
              <i aria-hidden="true" />
            </summary>
            <p className="mb-6 text-[15px] leading-[1.5]">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
