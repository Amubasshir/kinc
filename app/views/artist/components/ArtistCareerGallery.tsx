import Image from "next/image";
import Link from "next/link";
import type { ArtistViewModel } from "../../../view-models/artistViewModel";

export default function ArtistCareerGallery({ gallery }: { gallery: ArtistViewModel["careerGallery"] }) {
  return (
    <section className="artist-career-gallery" aria-label="Selected creative work">
      <Image className="artist-career-gallery-master" src={gallery.src} alt={gallery.alt} width={1317} height={1634} sizes="calc(100vw - 16px)" />
      <figure className="artist-collection-shot">
        <Image src={gallery.collectionShot.src} alt="Camilla collection fashion campaign" width={750} height={960} sizes="19vw" />
        <figcaption>
          <strong>{gallery.collectionShot.title}</strong>
          <span>{gallery.collectionShot.credit}</span>
        </figcaption>
      </figure>
      <Link className="artist-career-mobile-see-all" href="#page-top">SEE ALL WORK</Link>
    </section>
  );
}
