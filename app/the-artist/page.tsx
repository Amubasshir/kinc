import { getArtistViewModel } from "../view-models/artistViewModel";
import { getHomeViewModel } from "../view-models/homeViewModel";
import ArtistView from "../views/artist/ArtistView";
export default function ArtistPage() {
  return <ArtistView viewModel={getArtistViewModel()} testimonials={getHomeViewModel().testimonials} />;
}
