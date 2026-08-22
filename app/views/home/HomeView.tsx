import About from "./components/About";
import BrandLogos from "./components/BrandLogos";
import Contact from "./components/Contact";
import Faqs from "./components/Faqs";
import Gallery from "./components/Gallery";
import GiftCard from "./components/GiftCard";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Merchandise from "./components/Merchandise";
import Pricing from "./components/Pricing";
import Stats from "./components/Stats";
import StayConnected from "../shared/StayConnected";
import Testimonials from "../shared/Testimonials";
import Welcome from "./components/Welcome";
import type { HomeViewModel } from "../../models/site";

export default function HomeView({ viewModel }: { viewModel: HomeViewModel }) {
  return (
    <>
      <Hero />
      <BrandLogos />
      <Welcome />
      <HowItWorks steps={viewModel.howSteps} />
      <Pricing sizes={viewModel.pricingSizes} />
      <Merchandise products={viewModel.merchandiseProducts} />
      <GiftCard />
      <About />
      <Testimonials testimonials={viewModel.testimonials} />
      <Stats stats={viewModel.stats} />
      <Gallery columns={viewModel.galleryColumns} />
      <Faqs faqs={viewModel.faqs} />
      <Contact />
      <StayConnected />
    </>
  );
}
