import CommissionFormView from "../views/commission-form/CommissionFormView";
import { getStripeCommissionProducts } from "../lib/stripePricing";

export default async function CommissionsPage() {
  const commissionProducts = await getStripeCommissionProducts();
  return <CommissionFormView commissionProducts={commissionProducts} />;
}
