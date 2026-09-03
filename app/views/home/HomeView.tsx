import About from "./components/About";
import BrandLogos from "./components/BrandLogos";
import Contact from "./components/Contact";
import Faqs from "./components/Faqs";
import Gallery from "./components/Gallery";
import GiftCard from "./components/GiftCard";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
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
      <Stats stats={viewModel.stats} />
      <HowItWorks steps={viewModel.howSteps} />
      <Pricing sizes={viewModel.pricingSizes} />
      <GiftCard />
      <About />
      <Testimonials testimonials={viewModel.testimonials} />
      <Gallery columns={viewModel.galleryColumns} />
      <StayConnected />
      <Faqs faqs={viewModel.faqs} />
      <Contact />
    </>
  );
}
