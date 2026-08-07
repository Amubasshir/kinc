import type { ArtistViewModel } from "../../view-models/artistViewModel";
import ArtistHero from "./components/ArtistHero";
import ArtistStory from "./components/ArtistStory";
export default function ArtistView({ viewModel }: { viewModel: ArtistViewModel }) { return <><ArtistHero viewModel={viewModel} /><ArtistStory /></>; }
