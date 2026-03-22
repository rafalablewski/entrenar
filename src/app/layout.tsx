import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entrenar - Trainer & Athlete Platform",
  description: "Manage training plans, track progress, and prepare for your next endeavour",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
