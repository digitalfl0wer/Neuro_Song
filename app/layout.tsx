import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuroSong Learning Tool",
  description: "Turn neuroscience facts into memorable songs and poems",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-[#03020b] via-[#0c0a2b] to-[#21065e] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
