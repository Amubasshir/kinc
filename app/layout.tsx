import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Swanky_and_Moo_Moo, Tenor_Sans } from "next/font/google";
import BackToTop from "./views/shared/BackToTop";
import Footer from "./views/shared/Footer";
import SiteChrome from "./views/shared/SiteChrome";
import "./globals.css";

const tenorSans = Tenor_Sans({ subsets: ["latin"], weight: "400", variable: "--font-tenor-sans" });
const swankyAndMooMoo = Swanky_and_Moo_Moo({ subsets: ["latin"], weight: "400", variable: "--font-swanky-moo-moo" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-montserrat" });
const cormorantGaramond = Cormorant_Garamond({ subsets: ["latin"], weight: "400", variable: "--font-cormorant-garamond" });

export const metadata: Metadata = {
  title: "KinCollage",
  description: "Custom collage artwork by KinCollage",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        id="page-top"
        className={`${tenorSans.variable} ${swankyAndMooMoo.variable} ${montserrat.variable} ${cormorantGaramond.variable} min-h-full flex flex-col`}
        suppressHydrationWarning
      >
        <SiteChrome fontClassName={montserrat.className} />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
