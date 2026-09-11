import type { Metadata } from "next";
import { getArtistViewModel } from "../view-models/artistViewModel";
import { getStripePricingSizes } from "../lib/stripePricing";
import { getHomeViewModel } from "../view-models/homeViewModel";
import ArtistView from "../views/artist/ArtistView";

export const metadata: Metadata = {
  title: "Zsófia Mátrai | KinCollage Artist",
  description:
    "Meet Zsófia Mátrai, founder and artist behind KinCollage. Discover how she hand-curates original child scribbles into archival framed fine art.",
  keywords: ["Zsofia Matrai", "KinCollage founder", "bespoke collage artist", "kids art curator"],
};

export default async function ArtistPage() {
  const homeViewModel = getHomeViewModel();
  const pricingSizes = await getStripePricingSizes(homeViewModel.pricingSizes);

  return (
    <ArtistView
      viewModel={getArtistViewModel()}
      pricingSizes={pricingSizes}
      testimonials={homeViewModel.testimonials}
    />
  );
}
