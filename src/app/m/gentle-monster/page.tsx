import type { Metadata, Viewport } from "next";

import { MockSwitch } from "@/components/MockSwitch";
import { StoreGlobeMock } from "@/components/StoreGlobeMock";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#fafaf8",
};

export const metadata: Metadata = {
  title: "박경선 | Portfolio",
  description: "제안하는 젠틀몬스터 스토어 찾기 화면입니다.",
};

/**
 * 휴대폰으로 열어 보는 화면.
 * 판 위 목업과 같은 컴포넌트를 쓰되, 여기서는 화면 전체를 채웁니다.
 * QR 로 들어오는 자리라 설명은 두지 않고 화면만 둡니다.
 */
export default function GlobePhonePage() {
  return (
    <main className="phone-page">
      <StoreGlobeMock dots={false} initialWorld />
      {/* 로고 옆 + — 다른 화면으로 건너갑니다. */}
      <MockSwitch here="gentle-monster" />
    </main>
  );
}
