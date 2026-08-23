"use client";

import type { CSSProperties, ReactNode } from "react";

import { useInView } from "@/components/useInView";

/**
 * 카드 삽화 — Iconsax Linear.
 * 색과 선 굵기는 속성 대신 CSS 에서 한 번에 정합니다(.card-art).
 * 카드마다 아이콘을 직접 들고 있어, 제목을 바꿔도 삽화가 끊기지 않습니다.
 */
const CARDS: {
  index: string;
  title: string;
  body: string;
  art: ReactNode;
}[] = [
  {
    index: "01",
    title: "Learned Behavior",
    body: "익숙한 행동 기억은 새로운 화면에서도 다음 조작을 예상하게 합니다.",
    // 되풀이되며 몸에 남는 행동 — 순환 화살표
    art: (
      <>
        <path d="M3.58 5.16h13.84c1.66 0 3 1.34 3 3v3.32" />
        <path d="M6.74 2L3.58 5.16l3.16 3.16M20.42 18.84H6.58c-1.66 0-3-1.34-3-3v-3.32" />
        <path d="M17.26 22l3.16-3.16-3.16-3.16" />
      </>
    ),
  },
  {
    index: "02",
    title: "Sensory Cues",
    body: "감각 단서는 인터페이스의 상태와 변화를 직관적으로 이해하게 합니다.",
    // 상태를 알려 주는 빛 — 켜진 전구
    art: (
      <>
        <path d="M8.3 18.04v-1.16C6 15.49 4.11 12.78 4.11 9.9c0-4.95 4.55-8.83 9.69-7.71 2.26.5 4.24 2 5.27 4.07 2.09 4.2-.11 8.66-3.34 10.61v1.16c0 .29.11.96-.96.96H9.26c-1.1.01-.96-.42-.96-.95ZM8.5 22c2.29-.65 4.71-.65 7 0" />
      </>
    ),
  },
  {
    index: "03",
    title: "Natural Control",
    body: "손에 익은 조작은 기능을 설명보다 먼저 몸으로 이해하게 합니다.",
    // 둥근 조작부 위의 손가락
    art: (
      <>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
        <path d="M12 14.88c-.91 0-1.65-.74-1.65-1.65v-2.47c0-.91.74-1.65 1.65-1.65.91 0 1.65.74 1.65 1.65v2.47c0 .91-.74 1.65-1.65 1.65Z" />
        <path d="M16.98 13.47c-.2 2.58-2.36 4.6-4.98 4.6-2.76 0-5-2.24-5-5v-2.14c0-2.76 2.24-5 5-5 2.59 0 4.72 1.97 4.97 4.49" />
      </>
    ),
  },
  {
    index: "04",
    title: "Expected Response",
    body: "예측 가능한 반응은 행동과 시스템 사이에 신뢰를 만듭니다.",
    // 예상대로 돌아온 반응 — 확인 표시
    art: (
      <>
        <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z" />
        <path d="m7.75 12 2.83 2.83 5.67-5.66" />
      </>
    ),
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
                {card.art}
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
