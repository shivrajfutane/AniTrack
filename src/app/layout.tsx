import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AniTrack | The Ultimate Anime Tracker",
  description: "High-fidelity anime tracking with industrial-grade animations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#09090B] text-[#FAFAFA]">
        {children}
      </body>
    </html>
  );
}
