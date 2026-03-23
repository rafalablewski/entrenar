import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ENTRENAR - Next-Gen Athletic Intelligence",
  description: "The future of athletic training. Interactive anatomy. Precision programming. Zero compromise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="ambient-bg" />
        {children}
      </body>
    </html>
  );
}
