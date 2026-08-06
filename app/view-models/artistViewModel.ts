export type ArtistViewModel = {
  name: string;
  portrait: string;
  signature: string;
};
export function getArtistViewModel(): ArtistViewModel {
  return { name: "Zsofia Matrai", portrait: "/artist/zsofia.png", signature: "/artist/signature.png" };
}
