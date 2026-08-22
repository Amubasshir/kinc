import CommissionFormView from "../views/commission-form/CommissionFormView";

export default async function StartYourCommissionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { addOn } = await searchParams;
  const requestedAddOnId = Array.isArray(addOn) ? addOn[0] : addOn;
  return <CommissionFormView requestedAddOnId={requestedAddOnId} />;
}
