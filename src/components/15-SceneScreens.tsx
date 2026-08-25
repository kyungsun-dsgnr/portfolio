"use client";

/** 15장 — 지금 선물을 사며 지나는 화면들 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 앞 장 플로우의 번호를 그대로 씁니다. 어느 걸음의 화면인지 번호로 이어집니다.
   목업은 받는 대로 각 자리에 넣습니다. */
const SHOTS = [
  { no: "01", label: "Custom Gifts", place: "col-start-1" },
  { no: "02", label: "Gift Set", place: "col-start-3" },
  { no: "03", label: "Scent 1 / 2", place: "col-start-5" },
  { no: "04", label: "Cart", place: "col-start-7" },
];

/**
 * 화면 넷을 한 줄로 늘어놓은 장. 그리드 여덟 단을 둘씩 나눠 씁니다.
 * 화면은 세로가 긴 비율이라 칸 높이에 맞추고 가운데에 둡니다.
 */
export function SceneScreens() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-3 row-start-1 row-span-2">
        Current Screens
      </h2>

      <p
        className="type-body rise col-start-5 col-span-3 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        선물 하나를 고르는 동안 지나는 화면입니다. 세트를 고르는 자리와 향을
        고르는 창이 따로 있고, 고른 구성은 마지막에야 한자리에 모입니다.
      </p>

      {SHOTS.map((shot, i) => (
        <div
          key={shot.no}
          className={`shot rise col-span-2 row-start-4 row-span-3 ${shot.place}`}
          style={{ "--delay": `${0.16 + i * 0.07}s` } as CSSProperties}
        >
          <div className="shot-head">
            <span className="card-index">{shot.no}</span>
            <h3 className="type-title">{shot.label}</h3>
          </div>
          {/* 목업이 들어갈 자리 */}
          <div className="shot-frame" />
        </div>
      ))}
    </div>
  );
}
