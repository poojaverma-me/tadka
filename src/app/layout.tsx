import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree, Kalam } from "next/font/google";
import RegisterSW from "@/components/RegisterSW";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", axes: ["wdth", "opsz"] });
// Kalam, from the Indian Type Foundry: a handwritten voice for the little kitchen notes.
const kalam = Kalam({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-kalam" });

export const metadata: Metadata = {
  title: "Tadka · What to cook today?",
  description: "Tell Tadka what you're in the mood for. Jev reads all 68 classic Indian dishes against your words in a fraction of a second.",
  applicationName: "Tadka",
  appleWebApp: { capable: true, title: "Tadka", statusBarStyle: "default" },
  icons: { icon: "/icon-192.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf1f2" },
    { media: "(prefers-color-scheme: dark)", color: "#071d20" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${figtree.variable} ${bricolage.variable} ${kalam.variable}`}>
      <body className="min-h-dvh">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
