import BrandLogos from "./components/BrandLogos";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Pricing from "./components/Pricing";
import Welcome from "./components/Welcome";

export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <BrandLogos />
      <HowItWorks />
      <Pricing />
    </>
  );
}