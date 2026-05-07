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
  title: "Morpheye — Authorized Hardware Wallet Reseller",
  description:
    "Secure your crypto with certified hardware wallets. Authorized reseller of Ledger, Trezor & Keystone. Free shipping on orders over $150.",
  keywords: [
    "Morpheye",
    "hardware wallet",
    "Ledger",
    "Trezor",
    "Keystone",
    "crypto security",
    "bitcoin wallet",
  ],
  authors: [{ name: "Morpheye" }],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "Morpheye — Authorized Hardware Wallet Reseller",
    description:
      "Secure your crypto with certified hardware wallets. Free shipping on orders over $150.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        {children}
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}
