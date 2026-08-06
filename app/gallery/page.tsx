import GalleryView from "../views/gallery/GalleryView";
import { getGalleryViewModel } from "../view-models/galleryViewModel";
export default function GalleryPage(){return <GalleryView viewModel={getGalleryViewModel()}/>}
