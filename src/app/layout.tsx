import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GridOverlay } from "@/components/GridOverlay";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "What We Already Know",
  description:
    "사람들이 이미 이해하고 있는 행동과 감각을 디지털 브랜드 경험으로 번역합니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${inter.variable} antialiased`}>
      <head>
        {/* SUIT Variable 은 Google Fonts에 없어 CDN에서 불러옵니다.
            자체 호스팅하려면 woff2를 public/fonts 에 두고 next/font/local 로 바꾸세요. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT/fonts/variable/woff2/SUIT-Variable.css"
        />
      </head>
      <body>
        {children}
        <GridOverlay />
      </body>
    </html>
  );
}
