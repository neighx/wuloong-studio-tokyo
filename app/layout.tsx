import type { Metadata } from "next"
import Script from "next/script"
import { Dancing_Script, Cormorant_Garamond, Noto_Serif_JP } from "next/font/google"
import "./globals.css"
import SiteHeader from "@/components/SiteHeader"
import SiteFooter from "@/components/SiteFooter"
import MobileFixedCTA from "@/components/MobileFixedCTA"
import { SEO, SITE_URL, INSTAGRAM_URL } from "@/lib/constants"
import { GA_MEASUREMENT_ID } from "@/lib/analytics"
import { LanguageProvider } from "@/contexts/LanguageContext"

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-dancing",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-serif",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO.title,
  description: SEO.description,
  keywords: SEO.keywords,
  alternates: { canonical: "/" },
  openGraph: {
    title: SEO.title,
    description: SEO.description,
    type: "website",
    locale: "ja_JP",
    siteName: "Wuloong Studio TOKYO",
    url: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Wuloong Studio TOKYO",
  "description": "三軒茶屋・世田谷の完全予約制プライベートレコーディングスタジオ。初めての録音から1曲完成まで丁寧にサポートします。",
  "url": SITE_URL,
  "image": `${SITE_URL}/images/studio/studio-main.jpg`,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "三軒茶屋",
    "addressRegion": "東京都世田谷区",
    "addressCountry": "JP",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 35.6436,
    "longitude": 139.6689,
  },
  "priceRange": "¥¥",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "10:00",
      "closes": "23:00",
    },
  ],
  "sameAs": [INSTAGRAM_URL],
  "keywords": "レコーディングスタジオ,三軒茶屋,世田谷,ボーカル録音,HIPHOP,R&B,初心者,完全予約制",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${dancingScript.variable} ${cormorant.variable} ${notoSerifJP.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* NEXT_PUBLIC_GA_MEASUREMENT_ID が設定されていない限り、
            このスクリプト自体を読み込まず、外部への送信は一切発生しない */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <SiteHeader />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <SiteFooter />
          <MobileFixedCTA />
        </LanguageProvider>
      </body>
    </html>
  )
}
