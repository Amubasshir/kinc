import "server-only";

import { unstable_cache } from "next/cache";
import type { PricingSizeModel } from "../models/site";
import { getStripeServer } from "./stripeServer";

export type StripeCommissionProduct = {
  productId: string;
  priceId: string;
  installmentPriceId: string;
  name: string;
  dimensions: string;
  inchDimensions?: string;
  minimum: string;
  price: string;
  unitAmount: number;
  installmentUnitAmount: number;
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
    const stripe = getStripeServer();
    const products = await stripe.products.list({
      active: true,
      limit: 100,
    });

    const productsWithPrices = await Promise.all(PRODUCT_PRESENTATION.map(async (presentation) => {
      const product = products.data.find((item) => item.name.toLowerCase().includes(presentation.key));
      if (!product) return null;
      const prices = await stripe.prices.list({ product: product.id, active: true, type: "one_time", limit: 100 });
      const price = prices.data.find((item) => item.nickname?.toLowerCase().includes("2026 full price"));
      const installmentPrice = prices.data.find((item) => item.nickname?.toLowerCase().includes("2026") && item.nickname?.toLowerCase().includes("3 instalment"));

      if (!price || !installmentPrice || price.unit_amount === null || installmentPrice.unit_amount === null) return null;

      return {
        productId: product.id,
        priceId: price.id,
        installmentPriceId: installmentPrice.id,
        name: product.name.replace(/^KinCollage\s+/i, "").replace(/\s+\d.*$/, ""),
        dimensions: presentation.dimensions,
        inchDimensions: presentation.inchDimensions,
        minimum: presentation.minimum,
        price: presentation.price,
        unitAmount: price.unit_amount,
        currency: price.currency,
        image: presentation.image,
        popular: "popular" in presentation ? presentation.popular : undefined,
        installmentUnitAmount: installmentPrice.unit_amount,
      };
    }));
    return productsWithPrices.filter((product) => product !== null) as StripeCommissionProduct[];
  },
  ["stripe-home-pricing-v2"],
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
