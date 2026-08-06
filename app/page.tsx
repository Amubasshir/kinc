import HomeView from "./views/home/HomeView";
import { getHomeViewModel } from "./view-models/homeViewModel";

export default function HomePage() {
  return <HomeView viewModel={getHomeViewModel()} />;
}
