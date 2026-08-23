// Single source of truth for commission pricing — used both client-side (live estimate
// in CommissionOrderForm) and server-side (authoritative deposit amount for Stripe).
// Never trust a client-submitted total: always recompute from raw selections on the server.

export const SIZES = [
  { id: "30x40", label: "30 x 40 cm", price: 385, minimum: 10 },
  { id: "60x80", label: "60 x 80 cm", price: 1515, minimum: 30 },
  { id: "70x100", label: "70 x 100 cm", price: 2175, minimum: 50 },
  { id: "80x100", label: "80 x 100 cm", price: 2485, minimum: 60 },
  { id: "90x120", label: "90 x 120 cm", price: 3335, minimum: 60 },
  { id: "122x183", label: "122 x 183 cm", price: 6915, minimum: 80 },
] as const;

export const ADD_ON_PRICE = 70;
export const RUSH_FEE_RATE = 0.3;

export type CommissionTotals = {
  artwork: number;
  extras: number;
  rush: number;
  total: number;
  deposit: number;
};

export function computeCommissionTotals({
  sizeIds,
  addOnCount,
  rushRequested,
}: {
  sizeIds: string[];
  addOnCount: number;
  rushRequested: boolean;
}): CommissionTotals {
  const artwork = SIZES.filter((size) => sizeIds.includes(size.id)).reduce((sum, size) => sum + size.price, 0);
  const extras = addOnCount * ADD_ON_PRICE;
  const rush = rushRequested ? Math.round((artwork + extras) * RUSH_FEE_RATE) : 0;
  const total = artwork + extras + rush;
  return { artwork, extras, rush, total, deposit: Math.round(total / 2) };
}
