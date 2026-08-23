import type { CSSProperties } from "react";

import { LampScene } from "@/components/LampScene";

/** 1장 — 조명과 노브 */
export function SceneIntro() {
  return (
    <div className="page-grid">
      <h1 className="type-display reveal col-span-5 row-span-2">
        you Already Know
        <br />
        which way to turn
      </h1>

      {/* 우측 텍스트는 세로 중앙이 아니라 각자 행 시작선에 붙습니다. */}
      <h2
        className="type-title reveal col-span-3 col-start-6 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        What We Already Know
      </h2>

      <div
        className="type-body reveal col-span-3 col-start-6 row-start-2 text-[#191919]/90"
        style={{ "--delay": "0.2s" } as CSSProperties}
      >
        <p>
          사람들이 이미 이해하고 있는 행동과 감각을 디지털 브랜드
          <br />
          경험으로 번역합니다.
        </p>
        {/* 눈에 띄게 천천히 반짝이다가, 조명이 켜질수록 잦아들며 물러납니다. */}
        <p className="hint mt-[1.1em]">조명을 켜보세요.</p>
      </div>

      <LampScene />
    </div>
  );
}
