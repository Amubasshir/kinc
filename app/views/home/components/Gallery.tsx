import Image from "next/image";
import Link from "next/link";
export default function Gallery({ columns }: { columns: number[][] }) {
  return (
    <section id="gallery" className="gallery-section relative min-h-[1030px] overflow-hidden rounded-[20px] bg-white px-6 pt-11 pb-[70px] max-[700px]:min-h-0 max-[700px]:rounded-none max-[700px]:px-1 max-[700px]:pt-[34px] max-[700px]:pb-[38px]" aria-label="KinCollage gallery">
      <div className="gallery-grid mx-auto grid w-full max-w-[1328px] grid-cols-6 gap-4 max-[1350px]:grid-cols-3 max-[700px]:grid-cols-2 max-[700px]:gap-2.5">
        {columns.map((column, columnIndex) => (
          <div className={`gallery-column gallery-column-${columnIndex + 1} flex flex-col gap-4 max-[700px]:gap-2.5 max-[700px]:[&:nth-child(n+3)]:hidden`} key={columnIndex}>
            {column.map((number) => (
              <Image
                className="block w-full rounded-[10px] object-cover"
                key={number}
                src={`/gallery-${number}.png`}
                alt={number === 27 || number === 34 ? "" : "KinCollage artwork and creative inspiration"}
                width={208}
                height={
                  number === 22 || number === 26 || number === 31 || number === 36
                    ? 283
                    : number === 23
                      ? 397
                      : number === 24 || number === 28
                        ? 202
                        : number === 25 || number === 37
                          ? 229
                          : number === 27
                            ? 264
                            : number === 29 || number === 39
                              ? 311
                              : number === 30
                                ? 216
                                : number === 32 || number === 34
                                  ? 191
                                  : number === 33
                                    ? 326
                                    : number === 35
                                      ? 394
                                      : 314
                }
                sizes="(max-width: 520px) 44vw, (max-width: 900px) 29vw, 208px"
                aria-hidden={number === 27 || number === 34 ? "true" : undefined}
              />
            ))}
          </div>
        ))}
      </div>
      <Link className="gallery-cta mx-auto mt-11 inline-flex min-h-[53px] min-w-[200px] items-center justify-center rounded-full border border-[#263443] text-[15px] text-[#263443] no-underline max-[700px]:mt-[33px] max-[700px]:min-h-[49px] max-[700px]:min-w-[181px] max-[700px]:text-[14px]" href="/gallery">
        SEE ALL WORK
      </Link>
    </section>
  );
}
