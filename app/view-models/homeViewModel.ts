import type { HomeViewModel } from "../models/site";

export function getHomeViewModel(): HomeViewModel {
  return {
    howSteps: [
      {
        number: "1.",
        title: "Inquiry form",
        image: "/how-inquiry.png",
        alt: "A collection of children's artwork ready for a commission",
        paragraphs: [
          "Start your commission by filling out the form, and get a 15-minute free consultation & creative deep dive to align your child's artistic spirit with your home's aesthetic.",
        ],
        action: true,
      },
      {
        number: "2.",
        title: "The Collection",
        image: "/how-collection.png",
        alt: "A mother and child gathering children's artwork",
        paragraphs: [
          "Gather your child's artworks & mail them to us either by your choice of box or order a box from us via email.",
          "From sketches and photos to sculptures, fabrics and cards, if you love it, pack it! The more variations, the merrier!",
        ],
      },
      {
        number: "3.",
        title: "The Curation",
        image: "/how-curation.png",
        alt: "Children's drawings cut out and arranged for curation",
        paragraphs: [
          "I thoughtfully hand-cut, compose and layer the story, cutting out the best shapes and colours through a collage, layering them on professional-grade canvas and varnish to preserve them.",
          "Lastly, I add the touch of my hand print to fill in the blanks.",
        ],
        scribble: true,
      },
      {
        number: "4.",
        title: "The Delivery",
        image: "/how-delivery.png",
        alt: "A child proudly standing beside two finished collage artworks",
        paragraphs: ["Receive a premium quality collage ready to hang proudly in your home."],
      },
    ],
    pricingSizes: [
      {
        name: "The Mini",
        dimensions: "30 x 40 cm",
        minimum: "(Min. 10 artwork required)",
        price: "$950 AUD",
        image: "/pricing-mini.png",
      },
      {
        name: "The Statement",
        dimensions: "60x80cm",
        minimum: "(Min. 15 artwork required)",
        price: "$1750 AUD",
        image: "/pricing-statement.png",
      },
      {
        name: "The Master",
        dimensions: "90x 120cm",
        minimum: "(Min. 40 artwork required)",
        price: "$3900 AUD",
        image: "/pricing-master.png",
        popular: true,
      },
      {
        name: "The Grand",
        dimensions: "122 x 183 cm",
        minimum: "(Min. 60 artwork required)",
        price: "$6915 AUD",
        image: "/pricing-grand.png",
      },
    ],
    merchandiseProducts: [
      { name: "Phone Case", price: "$70 AUD", image: "/merch-phone-case.png", bestseller: true },
      { name: "Tote Bag", price: "$70 AUD", image: "/merch-tote-bag.png" },
      { name: "Travel Tumbler", price: "$70 AUD", image: "/merch-tumbler.png" },
      { name: "T-shirt", price: "$70 AUD", image: "/merch-tshirt.png" },
      { name: "Linen Journal", price: "$70 AUD", image: "/merch-journal.png" },
      { name: "Canvas prints", price: "$70 AUD", image: "/merch-canvas.png" },
      { name: "Special Card", price: "$70 AUD", image: "/merch-card.png" },
      { name: "Postcard", price: "$70 AUD", image: "/merch-postcard.png" },
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
        title: "Artworks curated",
        description:
          "From loose preschool sketches to home made scribbles, we’ve sorted, preserved, and transformed over a thousand memories into permanent history.",
      },
      {
        value: "40+",
        title: "Hours work per piece",
        description:
          "Every single collage undergoes a physical layout process to ensure the final composition matches your vision.",
      },
      {
        value: "0+",
        title: "Forgotten stories",
        description:
          "Instead of sitting hidden in a storage bin or a dark drawer, these fleeting moments of childhood imagination are now proudly displayed on living room walls.",
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
