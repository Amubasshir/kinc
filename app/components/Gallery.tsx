import Image from "next/image";
import Link from "next/link";

const columns = [
  [22, 23, 24],
  [25, 26, 27],
  [28, 29, 30],
  [31, 32, 33],
  [34, 35, 36],
  [37, 38, 39],
];

export default function Gallery() {
  return (
    <section id="gallery" className="gallery-section" aria-label="KinCollage gallery">
      <div className="gallery-grid">
        {columns.map((column, columnIndex) => (
          <div className={`gallery-column gallery-column-${columnIndex + 1}`} key={columnIndex}>
            {column.map((number) => (
              <Image
                key={number}
                src={`/gallery-${number}.png`}
                alt={number === 27 || number === 34 ? "" : "KinCollage artwork and creative inspiration"}
                width={208}
                height={number === 22 || number === 26 || number === 31 || number === 36 ? 283 : number === 23 ? 397 : number === 24 || number === 28 ? 202 : number === 25 || number === 37 ? 229 : number === 27 ? 264 : number === 29 || number === 39 ? 311 : number === 30 ? 216 : number === 32 || number === 34 ? 191 : number === 33 ? 326 : number === 35 ? 394 : 314}
                sizes="(max-width: 520px) 44vw, (max-width: 900px) 29vw, 208px"
                aria-hidden={number === 27 || number === 34 ? "true" : undefined}
              />
            ))}
          </div>
        ))}
      </div>
      <Link className="gallery-cta" href="/gallery">SEE ALL WORK</Link>
    </section>
  );
}