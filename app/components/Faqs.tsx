const faqs = [
  {
    question: "HOW MANY PIECES OF ART SHOULD I PROVIDE?",
    answer: "Quantity depends on your chosen canvas size, but typically 20 to 50 pieces allow for a diverse range of colors and textures. During our consultation, we will discuss the ‘hero’ pieces you definitely want included versus the ‘texture’ pieces I can use for background layering.",
  },
  {
    question: "ARE CUSTOM SIZES OR BESPOKE FRAMING AVAILABLE?",
    answer: "Yes. Custom canvas sizes are available upon request, and bespoke framing can be arranged as an optional add-on sourced locally.",
  },
  {
    question: "WHY IS A KIN & COLLAGE COMMISSION A PREMIUM INVESTMENT?",
    answer: "Every collage is individually curated, hand-cut and composed over many hours, then professionally finished as a unique piece of fine art designed to preserve your family’s story.",
  },
  {
    question: "IS THERE A ‘PERFECT’ AGE TO CAPTURE THEIR ART?",
    answer: "There is no perfect age. Any stage that holds meaning for your family can become a beautiful visual record, from early scribbles through to more detailed childhood artwork.",
  },
  {
    question: "CAN MULTIPLE CHILDREN BE FEATURED ON A SINGLE CANVAS?",
    answer: "Absolutely. Artwork from siblings can be thoughtfully combined into one cohesive family piece while preserving the personality of each child.",
  },
  {
    question: "WHAT TYPES OF MEDIA ARE SUITABLE FOR A COLLAGE?",
    answer: "Drawings, paintings, photographs, cards, fabric and lightweight sculptural pieces can all be considered. We will review your collection together before you send it.",
  },
  {
    question: "DO YOU ADD YOUR OWN ARTISTIC MARKS OR PAINT TO THE WORK?",
    answer: "Yes. I may add subtle painted details and my handprint where needed to connect the composition and complete the story while keeping your child’s artwork at its heart.",
  },
  {
    question: "WHAT IS THE FINAL PIECE CREATED ON, AND IS IT READY TO HANG?",
    answer: "The final artwork is created on professional-grade canvas and finished so it arrives ready to become a feature in your home. Framing can also be discussed separately.",
  },
  {
    question: "HOW DO YOU ENSURE THE ARTWORK IS PROTECTED OVER TIME?",
    answer: "The completed collage is carefully sealed and varnished to protect its surface and preserve the colours and details for years to come.",
  },
  {
    question: "WHAT IS THE EXPECTED TIMELINE FOR A COMMISSION?",
    answer: "The estimated timeframe is approximately six weeks from the point the artwork and commission details are ready, depending on the scale and complexity of the piece.",
  },
  {
    question: "HOW DO LOGISTICS AND SHIPPING WORK?",
    answer: "After your consultation, you will receive guidance for securely packing and mailing the artwork. Delivery arrangements and shipping costs are confirmed as part of the commission process.",
  },
  {
    question: "DO YOU OFFER GIFT VOUCHERS?",
    answer: "Yes. Digital vouchers are available for any amount and make a thoughtful gift for milestone birthdays, Mother’s Day, baby showers and other special occasions.",
  },
  {
    question: "CAN I SEE THE LAYOUT BEFORE IT IS PERMANENTLY GLUED DOWN?",
    answer: "Yes. The proposed composition can be reviewed before the artwork is permanently assembled, giving you confidence in the final direction.",
  },
];

export default function Faqs() {
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