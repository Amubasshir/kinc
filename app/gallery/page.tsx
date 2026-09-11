import type { Metadata } from "next";
import GalleryView from "../views/gallery/GalleryView";
import { getGalleryViewModel } from "../view-models/galleryViewModel";

export const metadata: Metadata = {
  title: "Children's Artwork Collage Gallery | KinCollage",
  description:
    "Explore our gallery of custom children's artwork collages. See how scattered childhood drawings are transformed into framed family heirlooms.",
  keywords: ["children artwork collage examples", "kids art framing ideas", "custom canvas collage", "custom gifts"],
};

export default function GalleryPage() {
  return <GalleryView viewModel={getGalleryViewModel()} />;
}
