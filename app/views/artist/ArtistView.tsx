import type { ArtistViewModel } from "../../view-models/artistViewModel";
import ArtistHero from "./components/ArtistHero";
export default function ArtistView({ viewModel }: { viewModel: ArtistViewModel }) { return <ArtistHero viewModel={viewModel} />; }
