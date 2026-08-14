import type { HomeViewModel } from "../models/site";
import { getHomeViewModel } from "./homeViewModel";

export type ArtistViewModel = {
  name: string;
  portrait: string;
  signature: string;
  careerGallery: { src: string; alt: string; collectionShot: { src: string; title: string; credit: string } };
  pricing: {
    title: string;
    subtitle: string;
    sizes: Array<{
      name: string;
      dimensions: string;
      minimum: string;
      price: string;
      image: string;
      popular?: boolean;
    }>;
  };
  testimonial: {
    rating: number;
    paragraphs: string[];
    highlightedText: string;
    name: string;
    location: string;
  };
  testimonials: HomeViewModel["testimonials"];
};

export function getArtistViewModel(): ArtistViewModel {
  return {
    name: "Zsofia Matrai",
    portrait: "/artist/zsofia.png",
    signature: "/artist/signature.png",
    careerGallery: { src: "/artist/career-gallery.png", alt: "A visual gallery of Zsofia Matrai creative work", collectionShot: { src: "/artist/collection-shot.png", title: "Collection shot", credit: "Camilla" } },
    pricing: {
      title: "Sizes & Pricing",
      subtitle: "Asia Pacific worldwide shipping available",
      sizes: [
        { name: "The Mini", dimensions: "30 x 40 cm", minimum: "Min. 10 artwork required", price: "$950 AUD", image: "/artist/pricing-mini.png" },
        { name: "The Statement", dimensions: "60x80cm", minimum: "Min. 15 artwork required", price: "$1750 AUD", image: "/artist/pricing-statement.png" },
        { name: "The Master", dimensions: "90x120cm", minimum: "Min. 40 artwork required", price: "$3900 AUD", image: "/artist/pricing-master.png", popular: true },
        { name: "The Grand", dimensions: "122 x 183 cm", minimum: "Min. 60 artwork required", price: "$6915 AUD", image: "/artist/pricing-grand.png" },
      ],
    },
    testimonial: {
      rating: 5,
      paragraphs: [
        "Thank you Sophie for our beautiful art, it has exceeded expectations!",
        "The kids love seeing their art on proud display, much better than stored away in the cupboard. And we get so many compliments from visitors, it’s a real centrepiece!",
      ],
      highlightedText: "proud display",
      name: "Elizabeth",
      location: "Sydney, Australia",
    },
    testimonials: getHomeViewModel().testimonials,
  };
}
