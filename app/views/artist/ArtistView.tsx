import type { ArtistViewModel } from "../../view-models/artistViewModel";
import StayConnected from "../shared/StayConnected";
import Testimonials from "../shared/Testimonials";
import ArtistHero from "./components/ArtistHero";
import ArtistPricing from "./components/ArtistPricing";
import ArtistStory from "./components/ArtistStory";
import ArtistTestimonial from "./components/ArtistTestimonial";

export default function ArtistView({ viewModel }: { viewModel: ArtistViewModel }) {
  return (
    <>
      <ArtistHero viewModel={viewModel} />
      <ArtistStory />
      <ArtistPricing pricing={viewModel.pricing} />
      <ArtistTestimonial testimonial={viewModel.testimonial} />
      <Testimonials testimonials={viewModel.testimonials} />
      <StayConnected />
    </>
  );
}