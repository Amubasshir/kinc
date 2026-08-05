import About from "./components/About";
import BrandLogos from "./components/BrandLogos";
import GiftCard from "./components/GiftCard";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Merchandise from "./components/Merchandise";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Welcome from "./components/Welcome";

export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <BrandLogos />
      <HowItWorks />
      <Pricing />
      <Merchandise />
      <GiftCard />
      <About />
      <Testimonials />
    </>
  );
}