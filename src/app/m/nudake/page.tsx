import type { Metadata, Viewport } from "next";

import { NudakeMockCompose } from "@/components/NudakeComposeScreen";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Compose a Nudake Gift",
  description: "제안하는 누데이크 선물 구성 화면입니다.",
};

/**
 * 휴대폰으로 열어 보는 화면.
 * 판 위 목업과 같은 컴포넌트를 쓰되, 여기서는 화면 전체를 채우고
 * 스스로 고르지 않습니다 — 손으로 직접 골라 보는 자리입니다.
 */
export default function NudakePhonePage() {
  return (
    <main className="phone-page nudc-page">
      <NudakeMockCompose fill />
    </main>
  );
}
