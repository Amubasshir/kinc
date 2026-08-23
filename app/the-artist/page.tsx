import { getArtistViewModel } from "../view-models/artistViewModel";
import { getHomeViewModel } from "../view-models/homeViewModel";
import ArtistView from "../views/artist/ArtistView";
export default function ArtistPage() {
  const homeViewModel = getHomeViewModel();

  return (
    <ArtistView
      viewModel={getArtistViewModel()}
      pricingSizes={homeViewModel.pricingSizes}
      testimonials={homeViewModel.testimonials}
    />
  );
}
