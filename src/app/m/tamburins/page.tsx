import type { Metadata, Viewport } from "next";

import { TamburinsComposeScreenB } from "@/components/TamburinsComposeScreenB";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#fafafa",
};

export const metadata: Metadata = {
  title: "One screen, one gift.",
  description: "제안하는 탬버린즈 선물 구성 화면입니다.",
};

/**
 * 휴대폰으로 열어 보는 화면.
 * 판 위 목업과 같은 컴포넌트를 쓰되, 여기서는 화면 전체를 채웁니다.
 */
export default function ComposePhonePage() {
  return (
    <main className="phone-page">
      {/* 손에 쥔 화면에서는 고른 만큼만 보여 줍니다. */}
      <TamburinsComposeScreenB stepped />
    </main>
  );
}
