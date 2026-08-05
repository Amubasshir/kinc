import type { Metadata } from "next";
import { Montserrat, Tenor_Sans } from "next/font/google";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./globals.css";


const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const tenorSans = Tenor_Sans({ subsets: ["latin"], weight: "400", variable: "--font-tenor-sans" });

export const metadata: Metadata = {
  title: "KinCollage",
  description: "Custom collage artwork by KinCollage",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${montserrat.variable} ${tenorSans.variable} min-h-full flex flex-col`}>
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
