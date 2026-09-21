import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "../globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OgeDecor | African Luxury Interiors",
    template: "%s | OgeDecor"
  },
  description: "Modern Afro-luxury interior design portfolio. Curating spaces that blend Wakanda-inspired luxury with futuristic minimalism. Nigerian heritage meets contemporary elegance.",
  keywords: ["interior design", "African luxury", "Afro-luxury", "modern interiors", "OgeDecor", "Lagos interior design", "luxury furniture", "African art", "minimalism"],
  authors: [{ name: "OgeDecor" }],
  creator: "OgeDecor",
  metadataBase: new URL("https://ogedecor.com"), // Replace with actual domain when available
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://ogedecor.com",
    title: "OgeDecor | African Luxury Interiors",
    description: "Modern Afro-luxury interior design portfolio. Curating spaces that blend Wakanda-inspired luxury with futuristic minimalism.",
    siteName: "OgeDecor",
  },
  twitter: {
    card: "summary_large_image",
    title: "OgeDecor | African Luxury Interiors",
    description: "Modern Afro-luxury interior design portfolio. Curating spaces that blend Wakanda-inspired luxury with futuristic minimalism.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased bg-obsidian text-sand`}
      >
        <NavBar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
