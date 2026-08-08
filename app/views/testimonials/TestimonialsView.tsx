import type { TestimonialModel } from "../../models/site";
import StayConnected from "../shared/StayConnected";
import Testimonials from "../shared/Testimonials";

export default function TestimonialsView({ testimonials }: { testimonials: TestimonialModel[] }) {
  return (
    <>
      <Testimonials testimonials={testimonials} />
      <StayConnected />
    </>
  );
}
