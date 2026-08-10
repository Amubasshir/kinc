import Image from "next/image";
import Link from "next/link";

const socialIcons = [
  { src: "/footer-instagram.svg", name: "Instagram", width: 40 },
  { src: "/footer-tiktok.svg", name: "TikTok", width: 40 },
  { src: "/footer-facebook.svg", name: "Facebook", width: 40 },
  { src: "/footer-pinterest.svg", name: "Pinterest", width: 40 },
  { src: "/footer-youtube.svg", name: "YouTube", width: 41 },
];

export default function Footer() {
  return (
    <footer className="site-footer relative mt-4 min-h-[548px] overflow-hidden rounded-[20px] bg-white px-[39px] pt-[143px] pb-[39px] text-[#5d5d60] max-[800px]:min-h-0 max-[800px]:px-6 max-[800px]:pt-[70px] max-[800px]:pb-[34px] max-[700px]:mt-3 max-[700px]:!w-[calc(100vw-28px)] max-[700px]:!max-w-[calc(100vw-28px)] max-[700px]:min-h-[876px] max-[700px]:rounded-[18px] max-[700px]:px-3 max-[700px]:pt-[88px] max-[700px]:pb-7">
      <div className="footer-profile">
        <Image unoptimized
          className="footer-logo block h-auto w-36 max-[700px]:w-[142px]"
          src="/logo.svg"
          alt="KinCollage"
          width={144}
          height={26}
        />
        <h2 className="mt-[31px] text-[34px] leading-none font-light max-[800px]:text-[29px] max-[700px]:mt-8 max-[700px]:font-[Georgia] max-[700px]:text-[31px]">
          ZSOFIA MATRAI
        </h2>
        <p className="footer-role mt-[11px] text-[21px] leading-[1.25] max-[800px]:text-[18px] max-[700px]:mt-[13px] max-[700px]:text-[15px]">
          Designer &amp; Artist based in Sydney, Australia.
        </p>
        <p className="footer-acknowledgement mt-[18px] text-[15.5px] leading-[1.48] text-[#78788c] max-[700px]:mt-[21px] max-[700px]:text-[15px] max-[700px]:leading-[1.5] [&>br]:max-[800px]:hidden">
          We design, create and build on the Gadigal land. We acknowledge the
          <br />
          people of the Eora Nation, the Traditional Custodians of the land, paying
          <br />
          my respects to their Elders past, present, and emerging.
        </p>
        <p className="footer-email mt-[19px] text-[15px] text-[#78788c] max-[700px]:mt-[22px]">
          ZSOFI.MATRAI@GMAIL.COM
        </p>
      </div>

      <p className="footer-follow mt-[23px] hidden text-[15px] text-[#78788c] max-[700px]:block">Follow me on:</p>

      <div className="footer-actions absolute top-[327px] right-[39px] flex items-center gap-[35px] max-[800px]:static max-[800px]:mt-[38px] max-[800px]:flex-wrap max-[800px]:gap-7 max-[700px]:mt-7 max-[700px]:items-stretch max-[700px]:flex-col max-[700px]:gap-[39px]">
        <div
          className="footer-socials flex items-center gap-9 max-[800px]:flex-wrap max-[800px]:gap-5 max-[700px]:w-full max-[700px]:justify-between max-[700px]:gap-0"
          aria-label="Social media"
        >
          {socialIcons.map((icon) => (
            <span
              className="block cursor-pointer rounded-full transition duration-150 hover:-translate-y-1 hover:scale-[1.08] hover:drop-shadow-[0_6px_7px_rgb(25_93_69/24%)]"
              key={icon.name}
              title={icon.name}
            >
              <Image unoptimized
                className="block max-[700px]:h-[31px] max-[700px]:w-[31px] max-[700px]:object-contain"
                src={icon.src}
                alt={icon.name}
                width={icon.width}
                height={40}
              />
            </span>
          ))}
        </div>
        <Link
          className="footer-contact flex h-16 min-w-[166px] items-center justify-center gap-1 rounded-full border-[7px] border-[rgba(72,222,171,.42)] bg-[#00d28e] font-[Georgia] text-[16px] text-[#121212] no-underline transition duration-150 hover:-translate-y-[3px] hover:bg-[#97ff77] hover:shadow-[0_7px_14px_rgb(25_93_69/24%)] focus-visible:-translate-y-[3px] focus-visible:bg-[#97ff77] focus-visible:shadow-[0_7px_14px_rgb(25_93_69/24%)] max-[800px]:h-[60px] max-[800px]:min-w-[155px] max-[700px]:h-[58px] max-[700px]:w-full max-[700px]:box-border"
          href="#contact"
        >
          CONTACT <Image unoptimized src="/footer-arrow.svg" alt="" width={11} height={11} aria-hidden="true" />
        </Link>
      </div>

      <div className="footer-bottom absolute right-[39px] bottom-[39px] left-[39px] flex items-center justify-between text-[15px] text-[#78788c] max-[800px]:static max-[800px]:mt-[58px] max-[800px]:items-start max-[800px]:flex-col-reverse max-[800px]:gap-7 max-[700px]:mt-[66px] max-[700px]:gap-[42px]">
        <p className="m-0 max-[700px]:text-[14px]">©2026 KinCollage. All rights reserved.</p>
        <nav
          className="flex items-center gap-[27px] font-[Georgia] text-[15px] max-[800px]:flex-wrap max-[800px]:gap-x-6 max-[800px]:gap-y-[15px] max-[700px]:items-start max-[700px]:flex-col max-[700px]:gap-[26px]"
          aria-label="Legal information"
        >
          <Link className="transition-colors hover:text-[#008d60]" href="/legal#shipping">
            SHIPPING POLICY
          </Link>
          <Link className="transition-colors hover:text-[#008d60]" href="/legal#privacy">
            PRIVACY POLICY
          </Link>
          <Link className="transition-colors hover:text-[#008d60]" href="/legal#terms">
            TERMS &amp; CONDITIONS
          </Link>
          <Link className="transition-colors hover:text-[#008d60]" href="/#faqs">
            FAQ
          </Link>
        </nav>
      </div>
    </footer>
  );
}
