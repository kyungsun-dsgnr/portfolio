/** 1장 — 조명을 켜는 표지 */
import type { CSSProperties } from "react";

import { LampScene } from "@/components/LampScene";

/** 1장 — 조명과 노브 */
export function SceneIntro() {
  return (
    <div className="page-grid">
      <h1 className="type-display intro-headline reveal col-span-5 row-span-2">
        What We
        <br />
        Already Know
        <br />
        Becomes Interaction
      </h1>

      {/* 우측 텍스트는 세로 중앙이 아니라 각자 행 시작선에 붙습니다. */}
      <h2
        className="type-title reveal col-span-3 col-start-6 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        Designing Digital Experiences
        <br />
        From Sensory and Behavioral Memory
      </h2>

      <div
        className="type-body reveal col-span-3 col-start-6 row-start-2"
        style={{ "--delay": "0.2s" } as CSSProperties}
      >
        <p>
          빛의 변화, 거리의 감각, 손의 움직임.
          <br />
          이미 알고 있는 감각과 행동의 기억을 바탕으로 디지털 경험을 설계합니다.
        </p>
      </div>

      <LampScene />
    </div>
  );
}
