import "server-only";

import type Stripe from "stripe";
import { PICKUP_SHIPPING_REGION } from "./stripeShippingConstants";

export { PICKUP_SHIPPING_REGION } from "./stripeShippingConstants";
export type CommissionShippingRegion = string;

export type CommissionShippingOption = {
  id: string;
  label: string;
  amount: number;
  rateIds: string[];
};

export type CommissionShippingRates = {
  options: CommissionShippingOption[];
};

export type CommissionShippingQuote = {
  rates: CommissionShippingRates;
};

type ShippingSize = {
  labels: string[];
  dimensions: string[];
};

const SHIPPING_SIZES: ShippingSize[] = [
  { labels: ["mini"], dimensions: ["12 x 16"] },
  { labels: ["small statement"], dimensions: ["24 x 32"] },
  { labels: ["statement"], dimensions: ["32 x 40"] },
  { labels: ["master"], dimensions: ["36 x 48", "36 x 47"] },
  { labels: ["grand"], dimensions: ["48 x 72"] },
];

function normalizeShippingText(value: string) {
  return value
    .toLowerCase()
    .replace(/[\u00d7\u2715\u2716]/g, "x")
    .replace(/[\u0022\u2033]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sizeForProduct(productName: string) {
  const normalized = normalizeShippingText(productName).replace(/\s/g, "");
  return SHIPPING_SIZES.find((size) => size.dimensions.some((dimension) => normalized.includes(normalizeShippingText(dimension).replace(/\s/g, "")))) ?? null;
}

function shippingAmountInCurrency(rate: Stripe.ShippingRate, currency: string) {
  if (!rate.fixed_amount) return null;
  if (rate.fixed_amount.currency === currency) return rate.fixed_amount.amount;
  return rate.fixed_amount.currency_options?.[currency]?.amount ?? null;
}

function shippingRateMatchesSize(rate: Stripe.ShippingRate, size: ShippingSize, currency: string) {
  if (!rate.active || !rate.display_name || shippingAmountInCurrency(rate, currency) === null) return false;
  const normalizedRateName = normalizeShippingText(rate.display_name).replace(/\s/g, "");
  return size.dimensions.some((dimension) => normalizedRateName.includes(normalizeShippingText(dimension).replace(/\s/g, "")));
}

function escapeRegex(value: string) {
  return value.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function dimensionPattern(dimension: string) {
  return new RegExp(
    normalizeShippingText(dimension)
      .split(" ")
      .map((token) => token === "x" ? "[x\\u00d7\\u2715\\u2716]" : escapeRegex(token))
      .join("\\s*"),
    "gi",
  );
}

function sizeLabelPattern(label: string) {
  return new RegExp(normalizeShippingText(label).split(" ").map(escapeRegex).join("\\s+"), "gi");
}

function shippingOptionLabel(rate: Stripe.ShippingRate, size: ShippingSize) {
  const displayName = rate.display_name?.trim() ?? "Shipping";
  const withoutDimension = size.dimensions.reduce(
    (value, dimension) => value.replace(dimensionPattern(dimension), " "),
    displayName,
  );
  const withoutSizeLabel = size.labels.reduce(
    (value, label) => value.replace(sizeLabelPattern(label), " "),
    withoutDimension,
  );
  return withoutSizeLabel
    .replace(/[\u0022\u2033]+/g, " ")
    .replace(/[\s\-\u2013\u2014|:/()[\]]+/g, " ")
    .trim() || displayName;
}

function shippingOptionId(label: string) {
  const slug = normalizeShippingText(label).replace(/\s+/g, "-").slice(0, 80);
  return "shipping-" + (slug || "option");
}

async function getAllActiveShippingRates(stripe: Stripe) {
  const rates: Stripe.ShippingRate[] = [];
  let startingAfter: string | undefined;
  while (true) {
    const page = await stripe.shippingRates.list({
      active: true,
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });
    rates.push(...page.data);
    if (!page.has_more || page.data.length === 0) return rates;
    startingAfter = page.data[page.data.length - 1]?.id;
    if (!startingAfter) return rates;
  }
}

/**
 * Fetches every active Stripe ShippingRate and builds one selectable option
 * for each shipping service/destination represented across the selected sizes.
 * The client only receives the resulting amounts; rate matching and validation
 * remain server-side.
 */
export async function getCommissionShippingQuote(stripe: Stripe, prices: Stripe.Price[]): Promise<CommissionShippingQuote> {
  const currencySet = new Set(prices.map((price) => price.currency.toLowerCase()));
  if (currencySet.size !== 1) throw new Error("Selected commission prices must use one currency for shipping.");
  const currency = [...currencySet][0];
  const shippingRates = await getAllActiveShippingRates(stripe);
  const optionMap = new Map<string, { id: string; label: string; amount: number; rateIds: string[]; sizeIndexes: Set<number> }>();
  const selectedSizeLabels: string[] = [];

  for (const [sizeIndex, price] of prices.entries()) {
    const product = typeof price.product === "string" || price.product.deleted ? null : price.product;
    if (!product) throw new Error("A selected commission product is missing from Stripe.");
    const size = sizeForProduct(product.name);
    if (!size) throw new Error("No Stripe shipping size mapping exists for " + product.name + ".");
    selectedSizeLabels.push(product.name.replace(/^KinCollage\s+/i, "").trim());

    const matchingRates = shippingRates.filter((rate) => shippingRateMatchesSize(rate, size, currency));
    if (matchingRates.length === 0) {
      throw new Error("No active Stripe shipping rate matches " + product.name + ".");
    }

    for (const rate of matchingRates) {
      const amount = shippingAmountInCurrency(rate, currency);
      if (amount === null || amount < 0) continue;
      const label = shippingOptionLabel(rate, size);
      const id = shippingOptionId(label);
      const option = optionMap.get(id) ?? { id, label, amount: 0, rateIds: [], sizeIndexes: new Set<number>() };
      if (option.sizeIndexes.has(sizeIndex)) {
        throw new Error("Multiple active Stripe shipping rates use the same service label for " + product.name + ".");
      }
      option.amount += amount;
      option.rateIds.push(rate.id);
      option.sizeIndexes.add(sizeIndex);
      optionMap.set(id, option);
    }
  }

  const options = [...optionMap.values()]
    .filter((option) => option.sizeIndexes.size === prices.length)
    .sort((left, right) => left.label.localeCompare(right.label))
    .map((option) => ({
      id: option.id,
      label: option.label + " – " + selectedSizeLabels.join(" + "),
      amount: option.amount,
      rateIds: option.rateIds,
    }));
  if (options.length === 0) throw new Error("No common active Stripe shipping rate is available for the selected sizes.");

  return { rates: { options } };
}

export function shippingOptionForRegion(quote: CommissionShippingQuote, region: CommissionShippingRegion) {
  return region === PICKUP_SHIPPING_REGION ? null : quote.rates.options.find((option) => option.id === region) ?? null;
}

export function shippingAmountForRegion(quote: CommissionShippingQuote, region: CommissionShippingRegion) {
  return shippingOptionForRegion(quote, region)?.amount ?? (region === PICKUP_SHIPPING_REGION ? 0 : null);
}

export function shippingRateIdsForRegion(quote: CommissionShippingQuote, region: CommissionShippingRegion) {
  return shippingOptionForRegion(quote, region)?.rateIds ?? [];
}

export function shippingLabelForRegion(quote: CommissionShippingQuote, region: CommissionShippingRegion) {
  return shippingOptionForRegion(quote, region)?.label ?? "Pick up from Sydney studio";
}
