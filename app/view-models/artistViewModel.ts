import type { HomeViewModel } from "../models/site";
import { getHomeViewModel } from "./homeViewModel";

export type ArtistViewModel = {
  name: string;
  portrait: string;
  signature: string;
  careerGallery: {
    src: string;
    alt: string;
    collectionShot: { src: string; title: string; credit: string };
    images: Array<{
      src: string;
      alt: string;
      left: number;
      top: number;
      width: number;
      height: number;
      caption?: { title: string; credit: string };
    }>;
  };
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
    signature: "/signature.svg",
    careerGallery: {
      src: "/artist/career-gallery.png",
      alt: "A visual gallery of Zsofia Matrai creative work",
      collectionShot: { src: "/artist/collection-shot.png", title: "Collection shot", credit: "Camilla" },
      images: [
        { src: "/artist/archives/Image.png", alt: "Illustrated eagle artwork", left: 0, top: 0, width: 19, height: 24 },
        { src: "/artist/archives/Image-2.png", alt: "Brown and gold feather textile design", left: 20.3, top: 0, width: 19, height: 20 },
        { src: "/artist/archives/Image-6.png", alt: "Fashion portrait in a patterned dress", left: 40.6, top: 0, width: 19, height: 20 },
        { src: "/artist/archives/Image-10.png", alt: "Camilla fashion team portrait", left: 60.8, top: 0, width: 19, height: 20.5 },
        { src: "/artist/archives/Image (1).png", alt: "Decorative floral textile design", left: 81, top: 0, width: 19, height: 27 },
        { src: "/artist/archives/Image-8.png", alt: "Fashion portrait in an ornate coat", left: 0, top: 25, width: 19, height: 18 },
        { src: "/artist/archives/Image-3.png", alt: "Fashion editorial group portrait", left: 20.3, top: 21, width: 39.3, height: 20 },
        { src: "/artist/archives/Image-11.png", alt: "Fashion editorial portrait in a feathered dress", left: 60.8, top: 21.5, width: 19, height: 18 },
        { src: "/artist/archives/Image-13.png", alt: "Textile artwork exhibition display", left: 81, top: 28, width: 19, height: 17.5 },
        { src: "/artist/archives/Image-9.png", alt: "Illustrated patterned jumpsuit design", left: 0, top: 44, width: 19, height: 18 },
        { src: "/artist/archives/Image-1.png", alt: "Decorative white textile design", left: 20.3, top: 42.5, width: 19, height: 21.5, caption: { title: "Crocodile Dundee Print", credit: "Camilla" } },
        { src: "/artist/archives/Image-7.png", alt: "Painted portrait detail", left: 40.6, top: 42.5, width: 19, height: 19.5 },
        { src: "/artist/archives/Image-4.png", alt: "Illustration and fashion artwork studio scene", left: 60.8, top: 46, width: 39.2, height: 20 },
        { src: "/artist/archives/Image-5.png", alt: "Pencil portrait drawing", left: 0, top: 63.5, width: 19, height: 14 },
        { src: "/artist/archives/Image-1 (1).png", alt: "Child inside a hand-drawn cardboard playhouse", left: 20.3, top: 68, width: 19, height: 32 },
        { src: "/artist/archives/Image-15.png", alt: "Fashion portrait in a feathered headpiece", left: 40.6, top: 63.5, width: 19, height: 18 },
        { src: "/artist/archives/Image-14.png", alt: "Textile and feather fashion detail", left: 60.8, top: 66.5, width: 19, height: 15 },
        { src: "/artist/archives/Image-2 (1).png", alt: "Fashion portrait with a white dog", left: 81, top: 66.5, width: 19, height: 33.5 },
        { src: "/artist/archives/Image-19.png", alt: "Fashion editorial on a desert set", left: 0, top: 78, width: 19, height: 22, caption: { title: "Collection shot", credit: "Camilla" } },
        { src: "/artist/archives/Image-16.png", alt: "Childhood artwork collage", left: 40.6, top: 82.5, width: 39.2, height: 17.5 },
      ],
    },
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
