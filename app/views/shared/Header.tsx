import Image from "next/image";
import Link from "next/link";

const navigation = [
  { label: "COMMISSIONS", href: "/commissions" },
  { label: "THE ARTIST", href: "/the-artist" },
  { label: "GALLERY", href: "/gallery" },
  { label: "TESTIMONIALS", href: "/testimonials" },
  { label: "CONTACT", href: "/contact" },
];

export default function Header() {
  return (
    <header className="site-header">
      <Link className="site-logo" href="/" aria-label="KinCollage home">
        <Image src="/logo.svg" alt="KinCollage" width={144} height={26} priority />
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
      </nav>
      <details className="mobile-nav">
        <summary aria-label="Open navigation menu"><span /><span /><span /></summary>
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
      </details>
    </header>
  );
}
