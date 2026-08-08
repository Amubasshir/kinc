import TestimonialsView from "../views/testimonials/TestimonialsView";
import { getHomeViewModel } from "../view-models/homeViewModel";

export default function TestimonialsPage() {
  return <TestimonialsView testimonials={getHomeViewModel().testimonials} />;
}
