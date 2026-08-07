import Image from "next/image";

export default function BackToTop() {
  return (
    <a className="back-to-top" href="#page-top" aria-label="Back to top">
      <Image src="/up-button.svg" alt="" width={63} height={66} aria-hidden="true" />
    </a>
  );
}