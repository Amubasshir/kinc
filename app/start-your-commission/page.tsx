import type { Metadata } from "next";
import CommissionFormView from "../views/commission-form/CommissionFormView";
import { getStripeCommissionProducts } from "../lib/stripePricing";

export const metadata: Metadata = {
  title: "Start Your Collage Order | KinCollage",
  description:
    "Start your KinCollage commission today. Choose your canvas size, secure $70 USD in free launch bonus gifts, and lock in 2026 launch pricing now!",
  keywords: ["commission kids art collage", "custom child drawing canvas"],
};

export default async function StartYourCommissionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [{ addOn, product }, commissionProducts] = await Promise.all([searchParams, getStripeCommissionProducts()]);
  const requestedAddOnId = Array.isArray(addOn) ? addOn[0] : addOn;
  const requestedProductId = Array.isArray(product) ? product[0] : product;
  return <CommissionFormView commissionProducts={commissionProducts} requestedAddOnId={requestedAddOnId} requestedProductId={requestedProductId} />;
}
