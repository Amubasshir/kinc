export type HowStepModel = {
  number: string;
  title: string;
  image: string;
  alt: string;
  paragraphs: string[];
  action?: boolean;
  scribble?: boolean;
};

export type PricingSizeModel = {
  name: string;
  dimensions: string;
  minimum: string;
  price: string;
  image: string;
  popular?: boolean;
};

export type MerchandiseProductModel = {
  name: string;
  price: string;
  image: string;
  href: string;
  bestseller?: boolean;
};

export type TestimonialModel = {
  name: string;
  location: string;
  image: string;
  quote: string;
  paragraphs: string[];
};

export type StatModel = {
  value: string;
  title: string;
  description: string;
};

export type FaqModel = {
  question: string;
  answer: string;
};

export type HomeViewModel = {
  howSteps: HowStepModel[];
  pricingSizes: PricingSizeModel[];
  merchandiseProducts: MerchandiseProductModel[];
  testimonials: TestimonialModel[];
  stats: StatModel[];
  galleryColumns: number[][];
  faqs: FaqModel[];
};

export type CommissionProductLayout = "visual-left" | "visual-right" | "gallery-left" | "gallery-right";

export type CommissionProductModel = {
  id: string;
  title: string;
  layout: CommissionProductLayout;
  sectionClassName: string;
  contentClassName: string;
  descriptionClassName: string;
  swatchesClassName: string;
  detailsClassName: string;
  mainImage?: string;
  mainImageAlt?: string;
  secondaryImage?: string;
  toneClassName?: string;
  galleryImages?: string[];
  galleryClassName?: string;
  galleryAlt: (index: number) => string;
};

export type CommissionsViewModel = {
  categories: string[];
  products: CommissionProductModel[];
};

// Keyed to CommissionProductModel.id so a "Buy Now" link's ?addOn= query param
// can pre-check the matching add-on below. priceId is the Stripe Price for this
// product (all $70 AUD) — recorded in deposit metadata for reporting; the $45
// in-commission bundle price in CommissionOrderForm is intentionally separate.
// NOTE: these are TEST MODE price IDs — swap for the live ones (see git history
// or the Stripe Dashboard) before going to production.
export const ADD_ON_PRODUCTS = [
  { id: "phone-case", label: "Phone Case", priceId: "price_1U7fpzCigo148yNRJMZs8Z2r" },
  { id: "tote-bag", label: "Tote Bag", priceId: "price_1U7fq0Cigo148yNRykdD5Mb8" },
  { id: "travel-tumbler", label: "Travel Tumbler", priceId: "price_1U7fq1Cigo148yNR3vjW8oyI" },
  { id: "tshirt", label: "T-shirt", priceId: "price_1U7fq2Cigo148yNRC1DvwzpM" },
  { id: "linen-journal", label: "Linen Journal", priceId: "price_1U7fq2Cigo148yNRl9l7g16m" },
  { id: "canvas-prints", label: "Digital Canvas Prints", priceId: "price_1U7fq3Cigo148yNRQXjMxueC" },
  { id: "special-card", label: "Greeting Card", priceId: "price_1U7fq4Cigo148yNR17YBV21C" },
  { id: "postcard", label: "Postcard Sets", priceId: "price_1U7fq5Cigo148yNRdoUwC72O" },
] as const;

export type GalleryTileModel = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type GalleryPageViewModel = {
  columns: GalleryTileModel[][];
};
