import type { Metadata, Viewport } from "next";
import { Playfair_Display, Source_Serif_4, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-source-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourvitalprime.com"),
  title: {
    default: "YourVitalPrime — Health & Longevity for Adults 50+",
    template: "%s · YourVitalPrime",
  },
  description:
    "Evidence-based guides on muscle, hormones, supplementation, and longevity — written for adults 50+ who want clear answers without the hype.",
  applicationName: "YourVitalPrime",
  authors: [{ name: "YourVitalPrime Editorial" }],
  openGraph: {
    type: "website",
    siteName: "YourVitalPrime",
    images: ["/og-default.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B3A4B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSerif.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
