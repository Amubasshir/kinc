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
    <footer className="site-footer">
      <div className="footer-profile">
        <Image className="footer-logo" src="/logo.svg" alt="KinCollage" width={144} height={26} />
        <h2>ZSOFIA MATRAI</h2>
        <p className="footer-role">Designer &amp; Artist based in Sydney, Australia.</p>
        <p className="footer-acknowledgement">
          We design, create and build on the Gadigal land. We acknowledge the<br />
          people of the Eora Nation, the Traditional Custodians of the land, paying<br />
          my respects to their Elders past, present, and emerging.
        </p>
        <p className="footer-email">ZSOFI.MATRAI@GMAIL.COM</p>
      </div>

      <div className="footer-actions">
        <div className="footer-socials" aria-label="Social media">
          {socialIcons.map((icon) => (
            <span key={icon.name} title={icon.name}>
              <Image src={icon.src} alt={icon.name} width={icon.width} height={40} />
            </span>
          ))}
        </div>
        <Link className="footer-contact" href="#contact">
          CONTACT <Image src="/footer-arrow.svg" alt="" width={11} height={11} aria-hidden="true" />
        </Link>
      </div>

      <div className="footer-bottom">
        <p>©2026 KinCollage. All rights reserved.</p>
        <nav aria-label="Legal information">
          <span>SHIPPING POLICY</span>
          <span>PRIVACY POLICY</span>
          <span>TERMS &amp; CONDITIONS</span>
          <span>FAQ</span>
        </nav>
      </div>
    </footer>
  );
}