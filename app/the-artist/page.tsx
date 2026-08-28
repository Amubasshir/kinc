import { getArtistViewModel } from "../view-models/artistViewModel";
import { getStripePricingSizes } from "../lib/stripePricing";
import { getHomeViewModel } from "../view-models/homeViewModel";
import ArtistView from "../views/artist/ArtistView";
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
