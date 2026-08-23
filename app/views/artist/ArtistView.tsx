import type { ArtistViewModel } from "../../view-models/artistViewModel";
import type { PricingSizeModel, TestimonialModel } from "../../models/site";
import StayConnected from "../shared/StayConnected";
import Testimonials from "../shared/Testimonials";
import Pricing from "../home/components/Pricing";
import ArtistCareerGallery from "./components/ArtistCareerGallery";
import ArtistHero from "./components/ArtistHero";
import ArtistStory from "./components/ArtistStory";
import ArtistTestimonial from "./components/ArtistTestimonial";

export default function ArtistView({
  viewModel,
  pricingSizes,
  testimonials,
}: {
  viewModel: ArtistViewModel;
  pricingSizes: PricingSizeModel[];
  testimonials: TestimonialModel[];
}) {
  return (
    <>
      <ArtistHero viewModel={viewModel} />
      <ArtistCareerGallery gallery={viewModel.careerGallery} />
      <ArtistStory controls />
      <Pricing sizes={pricingSizes} />
      <ArtistTestimonial testimonial={viewModel.testimonial} />
      <Testimonials testimonials={testimonials} />
      <StayConnected />
    </>
  );
}
