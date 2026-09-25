import "server-only";

import type Stripe from "stripe";

export type CommissionShippingRegion = "australia" | "us-canada";

export type CommissionShippingRates = {
  pickup: 0;
  australia: number;
  "us-canada": number;
};

export type CommissionShippingQuote = {
  rates: CommissionShippingRates;
  rateIds: {
    australia: string[];
    "us-canada": string[];
  };
};

type ShippingSize = {
  key: string;
  dimensions: string[];
};

const SHIPPING_SIZES: ShippingSize[] = [
  { key: "mini", dimensions: ["12 x 16"] },
  { key: "small-statement", dimensions: ["24 x 32"] },
  { key: "statement", dimensions: ["32 x 40"] },
  { key: "master", dimensions: ["36 x 48", "36 x 47"] },
  { key: "grand", dimensions: ["48 x 72"] },
];

const REGION_LABELS: Record<CommissionShippingRegion, string> = {
  australia: "australia",
  "us-canada": "us canada",
};

function normalizeShippingText(value: string) {
  return value
    .toLowerCase()
    .replace(/["″]/g, "")
    .replace(/[×]/g, "x")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sizeForProduct(productName: string) {
  const normalized = normalizeShippingText(productName);
  return SHIPPING_SIZES.find((size) => size.dimensions.some((dimension) => normalized.includes(dimension))) ?? null;
}

function shippingAmountInCurrency(rate: Stripe.ShippingRate, currency: string) {
  if (!rate.fixed_amount) return null;
  if (rate.fixed_amount.currency === currency) return rate.fixed_amount.amount;
  return rate.fixed_amount.currency_options?.[currency]?.amount ?? null;
}

function shippingRateMatches(rate: Stripe.ShippingRate, region: CommissionShippingRegion, size: ShippingSize, currency: string) {
  if (!rate.active || !rate.display_name || shippingAmountInCurrency(rate, currency) === null) return false;
  const normalized = normalizeShippingText(rate.display_name);
  const regionLabel = REGION_LABELS[region];
  return normalized.includes(regionLabel) && size.dimensions.some((dimension) => normalized.includes(dimension));
}

function findShippingRate(rates: Stripe.ShippingRate[], region: CommissionShippingRegion, size: ShippingSize, currency: string, productName: string) {
  const matches = rates.filter((rate) => shippingRateMatches(rate, region, size, currency));
  if (matches.length !== 1) {
    throw new Error(`Shipping configuration must contain exactly one active ${currency.toUpperCase()} Stripe rate for ${region} ${productName}.`);
  }
  const rate = matches[0];
  const amount = shippingAmountInCurrency(rate, currency);
  if (amount === null || amount <= 0) throw new Error(`Stripe shipping rate ${rate.id} must have a positive ${currency.toUpperCase()} amount.`);
  return { rate, amount };
}

/**
 * Fetches active Stripe ShippingRate objects and resolves the configured rate
 * for every selected canvas size. The client only receives the resulting
 * amounts; all matching and currency validation remains server-side.
 */
export async function getCommissionShippingQuote(stripe: Stripe, prices: Stripe.Price[]): Promise<CommissionShippingQuote> {
  const currencySet = new Set(prices.map((price) => price.currency.toLowerCase()));
  if (currencySet.size !== 1) throw new Error("Selected commission prices must use one currency for shipping.");
  const currency = [...currencySet][0];
  const shippingRates = await stripe.shippingRates.list({ active: true, limit: 100 });
  if (shippingRates.has_more) throw new Error("Shipping configuration contains more than 100 active Stripe rates; please narrow the catalog.");

  const quote: CommissionShippingQuote = {
    rates: { pickup: 0, australia: 0, "us-canada": 0 },
    rateIds: { australia: [], "us-canada": [] },
  };

  for (const price of prices) {
    const product = typeof price.product === "string" || price.product.deleted ? null : price.product;
    if (!product) throw new Error("A selected commission product is missing from Stripe.");
    const size = sizeForProduct(product.name);
    if (!size) throw new Error(`No Stripe shipping size mapping exists for ${product.name}.`);

    for (const region of ["australia", "us-canada"] as const) {
      const rate = findShippingRate(shippingRates.data, region, size, currency, product.name);
      quote.rates[region] += rate.amount;
      quote.rateIds[region].push(rate.rate.id);
    }
  }

  return quote;
}

export function shippingAmountForRegion(quote: CommissionShippingQuote, region: CommissionShippingRegion) {
  return quote.rates[region];
}
