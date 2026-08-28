import "server-only";

import { unstable_cache } from "next/cache";
import Stripe from "stripe";
import type { PricingSizeModel } from "../models/site";

const PRODUCT_PRESENTATION = [
  { key: "mini", dimensions: "30 x 40 cm", minimum: "(Min. 20 art required)", image: "/pricing-mini.png" },
  { key: "statement", dimensions: "80 x 100 cm", minimum: "(Min. 50 art required)", image: "/pricing-statement.png" },
  { key: "master", dimensions: "90 x 120 cm", minimum: "(Min. 60 art required)", image: "/pricing-master.png", popular: true },
  { key: "grand", dimensions: "122 x 183 cm", minimum: "(Min. 80 art required)", image: "/pricing-grand.png" },
] as const;

function formatPrice(unitAmount: number, currency: string) {
  const currencyCode = currency.toUpperCase();
  const amount = unitAmount / 100;
  const value = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${value} ${currencyCode}`;
}

const loadStripePricingSizes = unstable_cache(
  async (): Promise<PricingSizeModel[]> => {
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
        name: product.name.replace(/^KinCollage\s+/i, "").replace(/\s+\d.*$/, ""),
        dimensions: presentation.dimensions,
        minimum: presentation.minimum,
        price: formatPrice(price.unit_amount, price.currency),
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
    const sizes = await loadStripePricingSizes();
    return sizes.length === PRODUCT_PRESENTATION.length ? sizes : fallback;
  } catch (error) {
    console.error("Failed to load Stripe pricing; using the website fallback prices.", error);
    return fallback;
  }
}
