import { getArtistViewModel } from "../view-models/artistViewModel";
import ArtistView from "../views/artist/ArtistView";
export default function ArtistPage() { return <ArtistView viewModel={getArtistViewModel()} />; }
