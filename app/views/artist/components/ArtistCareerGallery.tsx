import Image from "next/image";
import Link from "next/link";
import type { ArtistViewModel } from "../../../view-models/artistViewModel";

export default function ArtistCareerGallery({ gallery }: { gallery: ArtistViewModel["careerGallery"] }) {
  return (
    <section className="artist-career-gallery relative w-[calc(100%-24px)] self-center overflow-hidden rounded-[20px] bg-[linear-gradient(to_bottom,#00d18f_0_430px,#f5f5f5_430px)] max-[700px]:!w-[calc(100vw-36px)] max-[700px]:!max-w-[calc(100vw-36px)] max-[700px]:rounded-2xl max-[700px]:bg-[linear-gradient(to_bottom,#00d18f_0_8px,#f5f5f5_8px)] max-[700px]:pb-[38px]" aria-label="Selected creative work">
      <Image unoptimized className="artist-career-gallery-master block h-auto w-full" src={gallery.src} alt={gallery.alt} width={1317} height={1634} sizes="calc(100vw - 16px)" />
      <figure className="artist-collection-shot absolute top-[77.42%] left-0 m-0 w-[18.98%] bg-[#f5f5f5]">
        <Image unoptimized className="block h-auto w-full rounded-[14px]" src={gallery.collectionShot.src} alt="Camilla collection fashion campaign" width={750} height={960} sizes="19vw" />
        <figcaption className="relative z-[2] min-h-[52px] bg-[#f5f5f5] pt-[9px] leading-[1.1] text-[#4b4b55]">
          <strong>{gallery.collectionShot.title}</strong>
          <span>{gallery.collectionShot.credit}</span>
        </figcaption>
      </figure>
      <Link className="artist-career-mobile-see-all absolute bottom-2.5 left-1/2 hidden min-h-[23px] w-[91px] -translate-x-1/2 items-center justify-center rounded-full border border-white text-[8px] text-white no-underline max-[700px]:inline-flex" href="#page-top">SEE ALL WORK</Link>
    </section>
  );
}
