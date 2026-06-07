import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WIDOR Schildersbedrijf – Professioneel schilderwerk in Zuid-Holland",
  description:
    "WIDOR Schildersbedrijf verzorgt professioneel schilderwerk binnen en buiten in heel Zuid-Holland. Gratis offerte op locatie. Meer dan 20 jaar ervaring.",
  keywords: "schildersbedrijf, schilder, Zuid-Holland, binnenschilderwerk, buitenschilderwerk, latex spuiten",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
