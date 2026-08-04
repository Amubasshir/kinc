import type { Metadata } from "next";
import Header from "./components/Header";
import "./globals.css";


export const metadata: Metadata = {
  title: "KinCollage",
  description: "Custom collage artwork by KinCollage",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
