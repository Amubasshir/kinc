import type { HomeViewModel, PricingSizeModel } from "../models/site";

export function getHomeViewModel(pricingSizes?: PricingSizeModel[]): HomeViewModel {
  return {
    howSteps: [
      {
        number: "1.",
        title: "Submit your request",
        image: "/how-inquiry.png",
        alt: "A collection of children's artwork ready for a commission",
        paragraphs: [
          "Start your commission by filling out the order form and paying for your collage to lock in your studio slot. If you have any question, contact me here to get your complimentary 15-minute consultation to discuss your vision.",
        ],
      },
      {
        number: "2.",
        title: "Gather the scribbles",
        image: "/how-collection.png",
        alt: "A mother and child gathering children's artwork",
        paragraphs: [
          "Pack up your child's original artworks (30+ pieces) and ship them to our Sydney studio using your own box, or request an artwork collection kit from us via email.",
          "From loose sketches and paintings to cards and paper cutouts, if you love it, send it in!",
        ],
      },
      {
        number: "3.",
        title: "I craft your heirloom",
        image: "/IMG_3456.MOV",
        alt: "Children's drawings cut out and arranged for curation",
        paragraphs: [
          "Every piece is hand-selected through a multi-step physical layout process: planning the composition, layering the story, applying archival varnish for permanent protection, adding signature hand-drawn patterns, and professional framing.",
        ],
      },
      {
        number: "4.",
        title: "Receive the delivery",
        image: "/how-delivery.png",
        alt: "A child proudly standing beside two finished collage artworks",
        paragraphs: [
          "Receive your custom artwork, ready to hang proudly in your family home.",
          "Delivery: Hand-crafted with care and delivered to your door in 6–8 weeks.",
        ],
        action: true,
      },
    ],
    pricingSizes: pricingSizes ?? [
      {
        name: "Mini",
        dimensions: "30 x 40 cm",
        minimum: "(Min. 20 art required)",
        price: "$350 USD",
        image: "/pricing-mini.png",
      },
      {
        name: "Statement",
        dimensions: "80 x 100 cm",
        minimum: "(Min. 50 art required)",
        price: "$1,950 USD",
        image: "/pricing-statement.png",
      },
      {
        name: "Master",
        dimensions: "90 x 120 cm",
        minimum: "(Min. 60 art required)",
        price: "$2,650 USD",
        image: "/pricing-master.png",
        popular: true,
      },
      {
        name: "Grand",
        dimensions: "122 x 183 cm",
        minimum: "(Min. 80 art required)",
        price: "$5,150 USD",
        image: "/pricing-grand.png",
      },
    ],
    merchandiseProducts: [
      { name: "Phone case", price: "$70 AUD", image: "/merch-phone-case.png", href: "/products#phone-case", bestseller: true },
      { name: "Tote bag", price: "$70 AUD", image: "/merch-tote-bag.png", href: "/products#tote-bag" },
      { name: "Travel tumbler", price: "$70 AUD", image: "/merch-tumbler.png", href: "/products#travel-tumbler" },
      { name: "T-shirt", price: "$70 AUD", image: "/merch-tshirt.png", href: "/products#tshirt" },
      { name: "Linen journal", price: "$70 AUD", image: "/merch-journal.png", href: "/products#linen-journal" },
      { name: "Canvas prints", price: "$70 AUD", image: "/merch-canvas.png", href: "/products#canvas-prints" },
      { name: "Greeting card", price: "$70 AUD", image: "/merch-card.png", href: "/products#special-card" },
      { name: "Postcard", price: "$70 AUD", image: "/merch-postcard.png", href: "/products#postcard" },
    ],
    testimonials: [
      {
        name: "Catherine",
        location: "Sydney, Australia",
        image: "/testimonial-catherine.png",
        quote: "“look into the joy of childhood, the one my family has created”",
        paragraphs: [
          "Not just paper, colour and glue it’s layers of laughter, joy, smiles, mess, tears memories the art work makes my heart glow.",
          "Friends stop and look it offers a moment to pause and look into the joy of childhood, the one my family has created.",
          "Sophie has artistically brought together moments of my mothering journey. My love, my time with my individual children to one canvas to delve into remembering to reflect to see the moments on one canvas is magical.",
        ],
      },
      {
        name: "Matt",
        location: "Sydney, Australia",
        image: "/testimonial-matt.png",
        quote: "“it’s so much more than a collage, it’s a keepsake that we will treasure forever”",
        paragraphs: [
          "We love our KinCollage artwork so much! Sophie was amazing from the start, her passion for her work is clear and her attention to detail comes through in the finished product. She somehow brought so many separate pieces of the kids craft into one, beautiful cohesive artwork - It’s so much more than a collage, it’s a keepsake that we will treasure forever!",
        ],
      },
      {
        name: "Seb",
        location: "Sydney, Australia",
        image: "/testimonial-seb.png",
        quote: "“these special people are my brother and sister”",
        paragraphs: [
          "It’s not one persons artwork it’s a collage of multiple people, these special people are my brother and sister.",
        ],
      },
      {
        name: "Marie",
        location: "Sydney, Australia",
        image: "/testimonial-catherine.png",
        quote: "“de minim veniam, quis nostrud exercitation ullamco”",
        paragraphs: [
          "Not just paper, colour and glue it’s layers of laughter, joy, smiles, mess, tears memories the art work makes my heart glow.",
          "Friends stop and look it offers a moment to pause and look into the joy of childhood, the one my family has created.",
          "Sophie has artistically brought together moments of my mothering journey. My love, my time with my individual children to one canvas to delve into remembering to reflect to see the moments on one canvas is magical.",
        ],
      },
    ],
    stats: [
      {
        value: "55+",
        title: "Heirloom pieces created",
        description:
          "From loose preschool sketches to everyday drawings, I’ve transformed hundreds of childhood drawings into permanent family heirlooms.",
      },
      {
        value: "30+",
        title: "Hours per piece",
        description:
          "Each piece undergoes an intentional multi-step process: planning, deliberate layering, archival varnishing, and my signature hand-drawn finishing touches.",
      },
      {
        value: "0",
        title: "Forgotten stories",
        description:
          "Instead of sitting hidden in a storage bin or a dark drawer, these special moments of childhood are proudly displayed in family homes forever.",
      },
    ],
    galleryColumns: [
      [22, 23, 24],
      [25, 26, 27],
      [28, 29, 30],
      [31, 32, 33],
      [34, 35, 36],
      [37, 38, 39],
    ],
    faqs: [
      [
        "HOW MANY PIECES OF ART SHOULD I PROVIDE?",
        "Quantity depends on your chosen canvas size, but typically 20 to 50 pieces allow for a diverse range of colors and textures. During our consultation, we will discuss the ‘hero’ pieces you definitely want included versus the ‘texture’ pieces I can use for background layering.",
      ],
      [
        "ARE CUSTOM SIZES OR BESPOKE FRAMING AVAILABLE?",
        "Yes. Custom canvas sizes are available upon request, and bespoke framing can be arranged as an optional add-on sourced locally.",
      ],
      [
        "WHY IS A KIN & COLLAGE COMMISSION A PREMIUM INVESTMENT?",
        "Every collage is individually curated, hand-cut and composed over many hours, then professionally finished as a unique piece of fine art designed to preserve your family’s story.",
      ],
      [
        "IS THERE A ‘PERFECT’ AGE TO CAPTURE THEIR ART?",
        "There is no perfect age. Any stage that holds meaning for your family can become a beautiful visual record, from early scribbles through to more detailed childhood artwork.",
      ],
      [
        "CAN MULTIPLE CHILDREN BE FEATURED ON A SINGLE CANVAS?",
        "Absolutely. Artwork from siblings can be thoughtfully combined into one cohesive family piece while preserving the personality of each child.",
      ],
      [
        "WHAT TYPES OF MEDIA ARE SUITABLE FOR A COLLAGE?",
        "Drawings, paintings, photographs, cards, fabric and lightweight sculptural pieces can all be considered. We will review your collection together before you send it.",
      ],
      [
        "DO YOU ADD YOUR OWN ARTISTIC MARKS OR PAINT TO THE WORK?",
        "Yes. I may add subtle painted details and my handprint where needed to connect the composition and complete the story while keeping your child’s artwork at its heart.",
      ],
      [
        "WHAT IS THE FINAL PIECE CREATED ON, AND IS IT READY TO HANG?",
        "The final artwork is created on professional-grade canvas and finished so it arrives ready to become a feature in your home. Framing can also be discussed separately.",
      ],
      [
        "HOW DO YOU ENSURE THE ARTWORK IS PROTECTED OVER TIME?",
        "The completed collage is carefully sealed and varnished to protect its surface and preserve the colours and details for years to come.",
      ],
      [
        "WHAT IS THE EXPECTED TIMELINE FOR A COMMISSION?",
        "The estimated timeframe is approximately six weeks from the point the artwork and commission details are ready, depending on the scale and complexity of the piece.",
      ],
      [
        "HOW DO LOGISTICS AND SHIPPING WORK?",
        "After your consultation, you will receive guidance for securely packing and mailing the artwork. Delivery arrangements and shipping costs are confirmed as part of the commission process.",
      ],
      [
        "DO YOU OFFER GIFT VOUCHERS?",
        "Yes. Digital vouchers are available for any amount and make a thoughtful gift for milestone birthdays, Mother’s Day, baby showers and other special occasions.",
      ],
      [
        "CAN I SEE THE LAYOUT BEFORE IT IS PERMANENTLY GLUED DOWN?",
        "Yes. The proposed composition can be reviewed before the artwork is permanently assembled, giving you confidence in the final direction.",
      ],
    ].map(([question, answer]) => ({ question, answer })),
  };
}
