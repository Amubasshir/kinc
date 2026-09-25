export type HowStepModel = {
  number: string;
  title: string;
  image: string;
  alt: string;
  /** Still frame shown before a video step loads. Ignored for image steps. */
  poster?: string;
  paragraphs: string[];
  action?: boolean;
  scribble?: boolean;
};

export type PricingSizeModel = {
  name: string;
  dimensions: string;
  inchDimensions?: string;
  minimum: string;
  price: string;
  image: string;
  popular?: boolean;
  purchaseId?: string;
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

export type CommissionProductLayout =
  | 'visual-left'
  | 'visual-right'
  | 'gallery-left'
  | 'gallery-right';

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
// NOTE: these are LIVE MODE price IDs — they won't exist in a test/sandbox account.
export const ADD_ON_PRODUCTS = [
  {
    id: 'phone-case',
    label: 'Phone Case',
    priceId: 'price_1U7UvqCigo148yNRD9a5HZrC',
  },
  {
    id: 'tote-bag',
    label: 'Tote Bag',
    priceId: 'price_1U7UwECigo148yNRBRitjFwH',
  },
  {
    id: 'travel-tumbler',
    label: 'Travel Tumbler',
    priceId: 'price_1U7UwXCigo148yNRdsWStz7x',
  },
  { id: 'tshirt', label: 'T-shirt', priceId: 'price_1U7V1WCigo148yNRoXhweI8n' },
  {
    id: 'linen-journal',
    label: 'Linen Journal',
    priceId: 'price_1U7V1qCigo148yNR30mbfZC0',
  },
  {
    id: 'canvas-prints',
    label: 'Digital Canvas Prints',
    priceId: 'price_1U7V41Cigo148yNRUx2Ra0hr',
  },
  {
    id: 'special-card',
    label: 'Greeting Card',
    priceId: 'price_1U7V39Cigo148yNRhaBvlP4w',
  },
  {
    id: 'postcard',
    label: 'Postcard Sets',
    priceId: 'price_1U7V2sCigo148yNRTRtT7He3',
  },
] as const;

export type GalleryMediaKind = 'image' | 'video';

export type GalleryMediaModel = {
  kind: GalleryMediaKind;
  src: string;
  fallbackSrc?: string;
  width: number;
  height: number;
  alt: string;
};

export type GalleryPageViewModel = {
  media: GalleryMediaModel[];
  columns: GalleryMediaModel[][];
};
