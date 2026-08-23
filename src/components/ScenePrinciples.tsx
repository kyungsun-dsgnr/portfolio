"use client";

import type { CSSProperties, ReactNode } from "react";

import { useInView } from "@/components/useInView";

/**
 * 카드 삽화 — Iconsax Linear.
 * 색과 선 굵기는 속성 대신 CSS 에서 한 번에 정합니다(.card-art).
 */
const ART: Record<string, ReactNode> = {
  // 빛의 변화 — 켜진 전구
  "Light Shift": (
    <>
      <path d="M8.3 18.04v-1.16C6 15.49 4.11 12.78 4.11 9.9c0-4.95 4.55-8.83 9.69-7.71 2.26.5 4.24 2 5.27 4.07 2.09 4.2-.11 8.66-3.34 10.61v1.16c0 .29.11.96-.96.96H9.26c-1.1.01-.96-.42-.96-.95ZM8.5 22c2.29-.65 4.71-.65 7 0" />
    </>
  ),
  // 거리감 — 깊이를 가진 입체
  "Spatial Distance": (
    <>
      <path d="m12.92 2.26 6.51 3.51c.76.41.76 1.58 0 1.99l-6.51 3.51c-.58.31-1.26.31-1.84 0L4.57 7.76c-.76-.41-.76-1.58 0-1.99l6.51-3.51c.58-.31 1.26-.31 1.84 0ZM3.61 10.13l6.05 3.03c.75.38 1.23 1.15 1.23 1.99v5.72c0 .83-.87 1.36-1.61.99l-6.05-3.03A2.238 2.238 0 0 1 2 16.84v-5.72c0-.83.87-1.36 1.61-.99ZM20.39 10.13l-6.05 3.03c-.75.38-1.23 1.15-1.23 1.99v5.72c0 .83.87 1.36 1.61.99l6.05-3.03c.75-.38 1.23-1.15 1.23-1.99v-5.72c0-.83-.87-1.36-1.61-.99Z" />
    </>
  ),
  // 손의 기억 — 지문
  "Hand Memory": (
    <>
      <path d="M12 14.88c-.91 0-1.65-.74-1.65-1.65v-2.47c0-.91.74-1.65 1.65-1.65.91 0 1.65.74 1.65 1.65v2.47c0 .91-.74 1.65-1.65 1.65Z" />
      <path d="M16.98 13.47c-.2 2.58-2.36 4.6-4.98 4.6-2.76 0-5-2.24-5-5v-2.14c0-2.76 2.24-5 5-5 2.59 0 4.72 1.97 4.97 4.49" />
      <path d="M15 2h2c3 0 5 2 5 5v2M2 9V7c0-3 2-5 5-5h2M15 22h2c3 0 5-2 5-5v-2M2 15v2c0 3 2 5 5 5h2" />
    </>
  ),
  // 시간의 리듬 — 오르내리는 파형
  "Temporal Rhythm": (
    <>
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" />
      <path d="m7.33 14.49 2.38-3.09c.34-.44.97-.52 1.41-.18l1.83 1.44c.44.34 1.07.26 1.41-.17l2.31-2.98" />
    </>
  ),
};

const CARDS = [
  {
    index: "01",
    title: "Light Shift",
    body: "빛의 변화가 상태와 분위기를 인식하게 합니다.",
  },
  {
    index: "02",
    title: "Spatial Distance",
    body: "거리감은 정보의 깊이와 접근 방식을 만듭니다.",
  },
  {
    index: "03",
    title: "Hand Memory",
    body: "손에 익은 움직임은 조작을 설명 없이 이해하게 합니다.",
  },
  {
    index: "04",
    title: "Temporal Rhythm",
    body: "머무름과 반복의 리듬은 경험의 속도를 조절합니다.",
  },
];

/** 4섹션 — 감각 단서 네 가지 */
export function ScenePrinciples() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-span-5 row-start-1 row-span-3">
        UX begins before the screen appears,
        <br />
        where familiar senses and behaviors become expectations.
      </h2>

      <p
        className="type-body rise col-span-2 col-start-7 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        감각과 행동의 기억은 인터페이스가 낯설지 않게 작동하는 기준이 됩니다.
        <br />
        좋은 디지털 경험은 사용자가 설명을 읽기 전에 다음 반응을 예상할 수 있게 만듭니다.
      </p>

      <div className="card-row col-span-8 row-start-4 row-span-3">
        {CARDS.map((card, i) => (
          <div
            key={card.index}
            className="card rise"
            style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
          >
            <div className="card-head">
              <span className="card-index">{card.index}</span>
              <h3 className="type-title">{card.title}</h3>
              <p className="type-body">{card.body}</p>
            </div>

            <div className="card-art">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                {ART[card.title]}
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
