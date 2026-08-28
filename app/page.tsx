import HomeView from "./views/home/HomeView";
import { getStripePricingSizes } from "./lib/stripePricing";
import { getHomeViewModel } from "./view-models/homeViewModel";

export default async function HomePage() {
  const fallbackViewModel = getHomeViewModel();
  const pricingSizes = await getStripePricingSizes(fallbackViewModel.pricingSizes);
  return <HomeView viewModel={getHomeViewModel(pricingSizes)} />;
}
