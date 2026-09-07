import type { HomeViewModel, PricingSizeModel } from "../models/site";

export function getHomeViewModel(pricingSizes?: PricingSizeModel[]): HomeViewModel {
  return {
    howSteps: [
      {
        number: "1.",
        title: "Submit your order",
        image: "/how-inquiry.png",
        alt: "A collection of children's artwork ready for a commission",
        paragraphs: [
          "Start your commission by filling out the order form and paying for your collage to lock in your studio slot. If you have any questions, contact me here to get your complimentary 15-minute consultation ($100 Value) to help you select artwork, pick the right size, and plan your custom layout.",
        ],
      },
      {
        number: "2.",
        title: "Gather the scribbles",
        image: "/how-collection.png",
        alt: "A mother and child gathering children's artwork",
        paragraphs: [
          "Pack up your child's original artworks (30+ pieces) and mail them to our Sydney studio in your own mailing satchel.",
          "🛡️ Every single piece is photographed on my phone for digital backup as soon as your package arrives.",
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
          "Receive your custom framed family heirloom artwork, ready to hang in your family home.",
          "🚚 Premium courier delivery: Hand-packed with care and safely delivered to your door in 6–8 weeks via top-rated courier partners along with tracking updates.",
        ],
        action: true,
      },
    ],
    pricingSizes: pricingSizes ?? [
      {
        name: "Mini",
        dimensions: "30 x 40 cm",
        inchDimensions: "12\" x 16\"",
        minimum: "(Min. 20 art required)",
        price: "$350 USD",
        image: "/pricing-mini.png",
      },
      {
        name: "Statement",
        dimensions: "80 x 100 cm",
        inchDimensions: "32\" x 40\"",
        minimum: "(Min. 50 art required)",
        price: "$1,500 USD",
        image: "/pricing-statement.png",
      },
      {
        name: "Master",
        dimensions: "90 x 120 cm",
        inchDimensions: "36\" x 48\"",
        minimum: "(Min. 60 art required)",
        price: "$2,000 USD",
        image: "/pricing-master.png",
        popular: true,
      },
      {
        name: "Grand",
        dimensions: "122 x 183 cm",
        inchDimensions: "48\" x 72\"",
        minimum: "(Min. 80 art required)",
        price: "$3,500 USD",
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
    ],
    stats: [
      {
        value: "55+",
        title: "Heirloom pieces created",
        description:
          "From loose preschool sketches to everyday drawings, I’ve transformed hundreds of childhood drawings into permanent framed family heirlooms.",
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
          "Instead of sitting hidden in a storage bin or a dark drawer, these special moments of childhood are proudly displayed in your family home forever.",
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
        "How many pieces of art should I provide?",
        "Quantity depends on your chosen canvas size, but typically 30 to 60 pieces allow for a diverse range of colors and textures.",
      ],
      [
        "Do you add your own artistic marks or paint to the work?",
        "Yes. I may add subtle painted details and my handprint where needed to connect the composition and complete the story while keeping your child’s artwork at its heart.",
      ],
      [
        "Are custom sizes or bespoke framing available?",
        "Yes! Every standard commission already includes custom solid oak framing. If you need a specific custom canvas dimension or alternative timber finishes, we can easily accommodate custom requests. Contact us for more.",
      ],
      [
        "What is the final piece created on, and is it ready to hang?",
        "The final artwork is created on professional-grade canvas and finished so it arrives ready to become a feature in your home. Framing can also be discussed separately.",
      ],
      [
        "Why is a KinCollage fine art a premium investment?",
        "Every collage is a bespoke piece of fine art developed over time. Your child's original drawings are individually hand-cut, thoughtfully curated, and physically montaged onto premium canvas. Finished on archival gallery stretchers and encased in custom solid oak framing, each commission is a museum-quality heirloom crafted to last for generations.",
      ],
      [
        "How do you ensure the artwork is protected over time?",
        "The completed collage is carefully sealed and varnished to protect its surface and preserve the colours and details for years to come.",
      ],
      [
        "Is there a ‘perfect’ age to capture their art?",
        "There is no perfect age. Any stage that holds meaning for your family can become a beautiful visual record, from early scribbles through to more detailed childhood artwork.",
      ],
      [
        "What is the expected timeline for a commission?",
        "The estimated timeframe is approximately six weeks from the point the artwork and commission details are ready, depending on the scale and complexity of the piece.",
      ],
      [
        "Can multiple children be featured on a single canvas?",
        "Absolutely. Artwork from siblings can be thoughtfully combined into one cohesive family piece while preserving the personality of each child.",
      ],
      [
        "How do logistics and shipping work?",
        "After your consultation, you will receive guidance for securely packing and mailing the artwork. Delivery arrangements and shipping costs are confirmed as part of the commission process.",
      ],
      [
        "Do you offer Gift Vouchers?",
        "Yes. Digital vouchers are available for any amount and make a thoughtful gift for milestone birthdays, Mother’s Day, baby showers and other special occasions.",
      ],
      [
        "What types of media are suitable for a collage?",
        "Drawings, paintings, photographs, cards, fabric and lightweight sculptural pieces can all be considered. We will review your collection together before you send it.",
      ],
      [
        "Can I see the layout before it is permanently glued down?",
        "Yes. The proposed composition can be reviewed before the artwork is permanently assembled, giving you confidence in the final direction.",
      ],
      [
        "Do you offer installment or split payment options?",
        "Yes! You can choose to pay in full upfront or select our 3 fortnightly installment option at checkout. Our 3-part installment plan allows you to split your commission over 4 weeks (3 fortnightly payments). A 15% plan & administration fee is included in the installment schedule to cover manual invoicing and extended studio scheduling. Your piece enters production immediately, with final dispatch following your third payment.",
      ],
    ].map(([question, answer]) => ({ question, answer })),
  };
}
