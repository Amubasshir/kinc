import type { Metadata } from "next";
import HomeView from "./views/home/HomeView";
import { getStripePricingSizes } from "./lib/stripePricing";
import { getHomeViewModel } from "./view-models/homeViewModel";

export const metadata: Metadata = {
  title: "Custom Children's Artwork Collages | KinCollage",
  description:
    "Turn your child’s drawings into a framed fine art heirloom. The perfect customized parent or grandparent gift. Preserve 30+ memories and order today!",
  keywords: ["children's artwork collage", "custom kids art framing", "preserve child drawings", "custom gift"],
};

export default async function HomePage() {
  const fallbackViewModel = getHomeViewModel();
  const pricingSizes = await getStripePricingSizes(fallbackViewModel.pricingSizes);
  return <HomeView viewModel={getHomeViewModel(pricingSizes)} />;
}
