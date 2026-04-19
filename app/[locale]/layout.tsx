import type { Metadata } from "next";
import ClientAxiosHandler from "./ClientAxiosHandler";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { GoogleAnalytics } from "@next/third-parties/google";

// fikipo1000@agoalz.com

export const metadata: Metadata = {
  title: {
    default: "Gegmio",
    template: "%s | Gegmio",
  },
  description: "აღმოაჩინე საუკეთესო ადგილები საქართველოში — რესტორნები, ბარბერები, სპა, სერვისები და სხვა.",
  keywords: [
    "რესტორნები თბილისში",
    "ბარბერი თბილისში",
    "სპა თბილისში",
    "სილამაზის სალონი",
    "კოვორქინგი თბილისში",
    "მანქანის რეცხვა",
    "სტომატოლოგი თბილისში",
    "Gegmio",
  ],

  authors: [{ name: "Gegmio Team" }],
  creator: "Gegmio",

  openGraph: {
    title: "Gegmio | დაჯავშნე და ისიამოვნე ჭამით",
    description: "იპოვე საუკეთესო რესტორნები და დაჯავშნე მაგიდა მარტივად. Gegmio — შენი ჭამის პარტნიორი.",
    url: "https://gegmio.com",
    siteName: "Gegmio",
    locale: "ka_GE",
    type: "website",
    images: [
      {
        url: "/images/logo.svg",
        width: 1200,
        height: 630,
        alt: "Gegmio Booking Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Gegmio",
    description:
      "აღმოაჩინე ადგილები საქართველოში",
    images: ["/images/logo.svg"],
  },

  icons: {
     icon: [
      {
        url: "/favicon.ico",
        type: "image/ico",
      }
    ],
    shortcut: "/images/logo.svg",
  },

  metadataBase: new URL("https://gegmio.com"),
};

export default async function RootLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-[#0F0F0F]">
        <NextIntlClientProvider locale={locale}>
          <ClientAxiosHandler locale={locale} />
          {children}
          <GoogleAnalytics gaId="G-4X4SFKF9H2" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
