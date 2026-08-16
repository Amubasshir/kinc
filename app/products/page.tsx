import CommissionsView from "../views/commissions/CommissionsView";
import { getCommissionsViewModel } from "../view-models/commissionsViewModel";
import { getHomeViewModel } from "../view-models/homeViewModel";

export default function ProductsPage() {
  return <CommissionsView viewModel={getCommissionsViewModel()} testimonials={getHomeViewModel().testimonials} />;
}
