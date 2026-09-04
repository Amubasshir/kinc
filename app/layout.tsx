import type { Metadata } from "next";
import { Montserrat, Swanky_and_Moo_Moo, Tenor_Sans } from "next/font/google";
import BackToTop from "./views/shared/BackToTop";
import Footer from "./views/shared/Footer";
import Header from "./views/shared/Header";
import "./globals.css";

const tenorSans = Tenor_Sans({ subsets: ["latin"], weight: "400", variable: "--font-tenor-sans" });
const swankyAndMooMoo = Swanky_and_Moo_Moo({ subsets: ["latin"], weight: "400", variable: "--font-swanky-moo-moo" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "KinCollage",
  description: "Custom collage artwork by KinCollage",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        id="page-top"
        className={`${tenorSans.variable} ${swankyAndMooMoo.variable} ${montserrat.variable} min-h-full flex flex-col`}
        suppressHydrationWarning
      >
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
