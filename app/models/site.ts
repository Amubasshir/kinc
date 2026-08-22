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
// can both pre-check the matching add-on below and, later, resolve to its Stripe price ID.
export const ADD_ON_PRODUCTS = [
  { id: "phone-case", label: "Phone Case" },
  { id: "tote-bag", label: "Tote Bag" },
  { id: "travel-tumbler", label: "Travel Tumbler" },
  { id: "tshirt", label: "T-shirt" },
  { id: "linen-journal", label: "Linen Journal" },
  { id: "canvas-prints", label: "Digital Canvas Prints" },
  { id: "special-card", label: "Greeting Card" },
  { id: "postcard", label: "Postcard Sets" },
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
