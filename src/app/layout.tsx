import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://morpheye.com"),
  title: {
    default: "Morpheye — Authorized Hardware Wallet Reseller | Ledger, Trezor, Keystone",
    template: "%s | Morpheye",
  },
  description:
    "Secure your crypto with certified hardware wallets. Morpheye is an authorized reseller of Ledger, Trezor & Keystone. Free shipping on orders over $150. 2-year warranty included.",
  keywords: [
    "Morpheye",
    "hardware wallet",
    "crypto wallet",
    "Ledger",
    "Ledger Nano X",
    "Ledger Stax",
    "Trezor",
    "Trezor Model T",
    "Keystone",
    "bitcoin wallet",
    "crypto security",
    "cold storage",
    "authorized reseller",
    "buy hardware wallet",
    "cryptocurrency",
    "bitcoin",
    "ethereum",
    "seed phrase",
    "self custody",
  ],
  authors: [{ name: "Morpheye", url: "https://morpheye.com" }],
  creator: "Morpheye",
  publisher: "Morpheye",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://morpheye.com",
    siteName: "Morpheye",
    title: "Morpheye — Authorized Hardware Wallet Reseller",
    description:
      "Secure your crypto with certified hardware wallets. Authorized reseller of Ledger, Trezor & Keystone. Free shipping on orders over $150.",
    images: [
      {
        url: "/images/hero-banner.jpg",
        width: 1344,
        height: 768,
        alt: "Morpheye — Authorized Hardware Wallet Reseller",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Morpheye — Authorized Hardware Wallet Reseller",
    description:
      "Secure your crypto with certified hardware wallets. Authorized reseller of Ledger, Trezor & Keystone.",
    images: ["/images/hero-banner.jpg"],
    creator: "@morpheye",
  },
  alternates: {
    canonical: "https://morpheye.com",
  },
  verification: {
    google: "google-site-verification-code",
  },
};

// JSON-LD Structured Data for Organization
const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Morpheye",
  description: "Authorized hardware wallet reseller for Ledger, Trezor, and Keystone",
  url: "https://morpheye.com",
  logo: "https://morpheye.com/images/logo.png",
  sameAs: [
    "https://facebook.com/morpheye",
    "https://twitter.com/morpheye",
    "https://instagram.com/morpheye",
    "https://t.me/morpheye",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@morpheye.com",
    contactType: "customer service",
  },
};

// JSON-LD Structured Data for WebSite (enables search box in Google)
const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Morpheye",
  url: "https://morpheye.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://morpheye.com/?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

// JSON-LD for E-commerce Store
const jsonLdStore = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Morpheye",
  description: "Authorized hardware wallet reseller",
  url: "https://morpheye.com",
  image: "https://morpheye.com/images/hero-banner.jpg",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebSite),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdStore),
          }}
        />
        {/* Meta Pixel will be injected client-side if configured */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        {children}
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}
