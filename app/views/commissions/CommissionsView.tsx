import Testimonials from "../shared/Testimonials";
import CommissionIntro from "./components/CommissionIntro";
import CommissionProductSection from "./components/CommissionProductSection";
import ProductMenu from "./components/ProductMenu";
import StartCommission from "./components/StartCommission";
import type { CommissionsViewModel, TestimonialModel } from "../../models/site";
export default function CommissionsView({
  viewModel,
  testimonials,
}: {
  viewModel: CommissionsViewModel;
  testimonials: TestimonialModel[];
}) {
  return (
    <>
      <CommissionIntro />
      <ProductMenu categories={viewModel.categories} />
      {viewModel.products.map((product) => (
        <CommissionProductSection key={product.id} product={product} />
      ))}
      <StartCommission />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
