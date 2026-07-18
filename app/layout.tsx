import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.onlymath.app"),

  title: {
    default: "Only Math | Math Olympiad, SAT & Daily Practice",
    template: "%s | Only Math",
  },

  description:
    "Only Math is an online mathematics platform for Olympiad preparation, SAT Math, Daily Problems, Leaderboards and Uzbekistan National Certificate practice.",

  keywords: [
    "Only Math",
    "Math Olympiad",
    "Olympiad Mathematics",
    "Competition Math",
    "IMO",
    "USAMO",
    "SAT Math",
    "Daily Math Problems",
    "Uzbekistan National Certificate",
    "Mathematics",
    "STEM",
  ],

  authors: [{ name: "Only Math" }],
  creator: "Only Math",
  publisher: "Only Math",

  openGraph: {
    title: "Only Math",
    description:
      "Practice Olympiad Mathematics, SAT Math and Daily Challenges.",
    url: "https://www.onlymath.app",
    siteName: "Only Math",
    locale: "en_US",
    type: "website",
    images: [
  {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "Only Math",
  },
],
  },

  twitter: {
    card: "summary_large_image",
    title: "Only Math",
    description:
      "Practice Olympiad Mathematics, SAT Math and Daily Challenges.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-hidden">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}