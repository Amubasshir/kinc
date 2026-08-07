import type { ArtistViewModel } from "../../view-models/artistViewModel";
import type { TestimonialModel } from "../../models/site";
import StayConnected from "../shared/StayConnected";
import Testimonials from "../shared/Testimonials";
import ArtistCareerGallery from "./components/ArtistCareerGallery";
import ArtistHero from "./components/ArtistHero";
import ArtistPricing from "./components/ArtistPricing";
import ArtistStory from "./components/ArtistStory";
import ArtistTestimonial from "./components/ArtistTestimonial";

export default function ArtistView({
  viewModel,
  testimonials,
}: {
  viewModel: ArtistViewModel;
  testimonials: TestimonialModel[];
}) {
  return (
    <>
      <ArtistHero viewModel={viewModel} />
      <ArtistCareerGallery gallery={viewModel.careerGallery} />
      <ArtistStory />
      <ArtistPricing pricing={viewModel.pricing} />
      <ArtistTestimonial testimonial={viewModel.testimonial} />
      <Testimonials testimonials={testimonials} />
      <StayConnected />
    </>
  );
}
