import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marketplace-ks",
  description: "Platforme moderne per transaksione te sigurta te aseteve me vlere te larte ne Kosove.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq">
      <body>{children}</body>
    </html>
  );
}
