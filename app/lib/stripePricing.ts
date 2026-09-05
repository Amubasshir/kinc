import "server-only";

import { unstable_cache } from "next/cache";
import Stripe from "stripe";
import type { PricingSizeModel } from "../models/site";

export type StripeCommissionProduct = {
  productId: string;
  priceId: string;
  name: string;
  dimensions: string;
  inchDimensions?: string;
  minimum: string;
  price: string;
  unitAmount: number;
  currency: string;
  image: string;
  popular?: boolean;
};

const PRODUCT_PRESENTATION = [
  { key: "mini", dimensions: "30 x 40 cm", inchDimensions: "12\" x 16\"", minimum: "(Min. 20 art required)", price: "$350 USD", image: "/pricing-mini.png" },
  { key: "statement", dimensions: "80 x 100 cm", inchDimensions: "32\" x 40\"", minimum: "(Min. 50 art required)", price: "$1,500 USD", image: "/pricing-statement.png" },
  { key: "master", dimensions: "90 x 120 cm", inchDimensions: "36\" x 48\"", minimum: "(Min. 60 art required)", price: "$2,000 USD", image: "/pricing-master.png", popular: true },
  { key: "grand", dimensions: "122 x 183 cm", inchDimensions: "48\" x 72\"", minimum: "(Min. 80 art required)", price: "$3,500 USD", image: "/pricing-grand.png" },
] as const;

const loadStripeCommissionProducts = unstable_cache(
  async (): Promise<StripeCommissionProduct[]> => {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not configured.");

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const products = await stripe.products.list({
      active: true,
      limit: 100,
      expand: ["data.default_price"],
    });

    return PRODUCT_PRESENTATION.flatMap((presentation) => {
      const product = products.data.find((item) => item.name.toLowerCase().includes(presentation.key));
      const price = product && typeof product.default_price !== "string" ? product.default_price : null;

      if (!product || !price || !price.active || price.type !== "one_time" || price.unit_amount === null) return [];

      return [{
        productId: product.id,
        priceId: price.id,
        name: product.name.replace(/^KinCollage\s+/i, "").replace(/\s+\d.*$/, ""),
        dimensions: presentation.dimensions,
        inchDimensions: presentation.inchDimensions,
        minimum: presentation.minimum,
        price: presentation.price,
        unitAmount: price.unit_amount,
        currency: price.currency,
        image: presentation.image,
        popular: "popular" in presentation ? presentation.popular : undefined,
      }];
    });
  },
  ["stripe-home-pricing-v1"],
  { revalidate: 3600 }
);

export async function getStripePricingSizes(fallback: PricingSizeModel[]) {
  try {
    const products = await loadStripeCommissionProducts();
    if (products.length !== PRODUCT_PRESENTATION.length) return fallback;
    return products.map((product) => ({
      name: product.name,
      dimensions: product.dimensions,
      inchDimensions: product.inchDimensions,
      minimum: product.minimum,
      price: product.price,
      image: product.image,
      popular: product.popular,
      purchaseId: product.productId,
    }));
  } catch (error) {
    console.error("Failed to load Stripe pricing; using the website fallback prices.", error);
    return fallback;
  }
}

export async function getStripeCommissionProducts() {
  try {
    const products = await loadStripeCommissionProducts();
    return products.length === PRODUCT_PRESENTATION.length ? products : [];
  } catch (error) {
    console.error("Failed to load Stripe products for the commission form.", error);
    return [];
  }
}
