import Image from "next/image";
import Link from "next/link";
import type { GalleryPageViewModel } from "../../models/site";
import StayConnected from "../shared/StayConnected";
import GalleryCommissionCard from "./components/GalleryCommissionCard";

export default function GalleryView({ viewModel }: { viewModel: GalleryPageViewModel }) {
  const mobileGroups = [
    [viewModel.columns[0].slice(0, 5), viewModel.columns[1].slice(0, 6)],
    [viewModel.columns[0].slice(5, 11), viewModel.columns[1].slice(6, 12)],
  ];

  return (
    <>
      <section className="gallery-page-hero" aria-label="Gallery introduction">
        <Image
          src="/gallery-page/hero.png"
          alt="A child holding a framed piece of colourful artwork"
          width={1400}
          height={651}
          priority
          sizes="100vw"
        />
        <Image
          className="gallery-page-hero-accent gallery-page-hero-accent-left"
          src="/gallery-page/hero-accent-left.png"
          alt=""
          width={61}
          height={82}
          aria-hidden="true"
        />
        <Image
          className="gallery-page-hero-accent gallery-page-hero-accent-right"
          src="/gallery-page/hero-accent-right.png"
          alt=""
          width={61}
          height={82}
          aria-hidden="true"
        />
      </section>
      <section className="gallery-page-masonry" aria-label="KinCollage artwork gallery">
        {viewModel.columns.map((column, columnIndex) => (
          <div className={`gallery-page-column gallery-page-column-${columnIndex + 1}`} key={columnIndex}>
            {column.map((item, itemIndex) => (
              <div key={`${item.src}-${itemIndex}`} className="gallery-page-item">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 700px) 47vw, 23vw"
                />
                {columnIndex === 2 && itemIndex === 6 && <GalleryCommissionCard />}
                {columnIndex === 3 && itemIndex === 5 && (
                  <div className="gallery-page-commission-spacer" aria-hidden="true" />
                )}
                {columnIndex === 0 && itemIndex === 14 && <GalleryCommissionCard />}
                {columnIndex === 1 && itemIndex === 14 && (
                  <div className="gallery-page-commission-spacer" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        ))}
      </section>
      <section className="gallery-page-mobile" aria-label="KinCollage artwork gallery">
        {mobileGroups.map((group, groupIndex) => (
          <div className="gallery-page-mobile-block" key={groupIndex}>
            <div className="gallery-page-mobile-group">
              {group.map((column, columnIndex) => (
                <div className="gallery-page-mobile-column" key={columnIndex}>
                  {column.map((item, itemIndex) => (
                    <Image
                      key={`${item.src}-${itemIndex}`}
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      sizes="47vw"
                    />
                  ))}
                </div>
              ))}
            </div>
            {groupIndex === 0 && (
              <div className="gallery-page-mobile-card">
                <GalleryCommissionCard />
              </div>
            )}
          </div>
        ))}
        <Link className="gallery-page-mobile-see-all" href="#page-top">
          SEE ALL WORK
        </Link>
      </section>
      <StayConnected />
    </>
  );
}
