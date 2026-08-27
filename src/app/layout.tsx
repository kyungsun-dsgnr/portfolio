import type { Metadata } from "next";
import { Inter, Playwrite_NZ_Basic } from "next/font/google";
import { GridOverlay } from "@/components/GridOverlay";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

/* 누데이크 카드에 손으로 쓴 것처럼 들어가는 글씨.
   손글씨 교본 서체라 획이 사람이 쓴 결에 가깝습니다.
   이 집안은 subsets 가 비어 있어 지정하지 않습니다. */
const script = Playwrite_NZ_Basic({
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "What We Already Know",
  description:
    "사람들이 이미 이해하고 있는 행동과 감각을 디지털 브랜드 경험으로 번역합니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${script.variable} antialiased`}
    >
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
