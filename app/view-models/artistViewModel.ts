export type ArtistViewModel = {
  name: string;
  portrait: string;
  signature: string;
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
};

export function getArtistViewModel(): ArtistViewModel {
  return {
    name: "Zsofia Matrai",
    portrait: "/artist/zsofia.png",
    signature: "/artist/signature.png",
    pricing: {
      title: "Sizes & Pricing",
      subtitle: "Worldwide shipping available soon.",
      sizes: [
        { name: "The Mini", dimensions: "30 x 40 cm", minimum: "Min. 10 artwork required", price: "$950 AUD", image: "/artist/pricing-mini.png" },
        { name: "The Statement", dimensions: "60x80cm", minimum: "Min. 15 artwork required", price: "$1750 AUD", image: "/artist/pricing-statement.png" },
        { name: "The Master", dimensions: "90x120cm", minimum: "Min. 40 artwork required", price: "$3900 AUD", image: "/artist/pricing-master.png", popular: true },
        { name: "The Grand", dimensions: "122 x 183 cm", minimum: "Min. 60 artwork required", price: "$6915 AUD", image: "/artist/pricing-grand.png" },
      ],
    },
  };
}