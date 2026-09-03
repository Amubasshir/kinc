import CommissionFormView from "../views/commission-form/CommissionFormView";
import { getStripeCommissionProducts } from "../lib/stripePricing";

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
