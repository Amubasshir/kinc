import type { FaqModel } from "../../../models/site";
export default function Faqs({ faqs }: { faqs: FaqModel[] }) {
  return (
    <section id="faqs" className="faqs" aria-labelledby="faqs-heading">
      <h2 id="faqs-heading">FAQs</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <details className="faq-item" key={faq.question} open={index === 0}>
            <summary>
              <span>{faq.question}</span>
              <i aria-hidden="true" />
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}