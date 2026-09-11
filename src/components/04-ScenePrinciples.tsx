"use client";

/** 4장 — 원칙 카드 넷 */

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
    title: "Behavioral Memory",
    body: "반복된 경험은 특정 행동과 결과의 관계를 기억하게 합니다.",
    // 같은 원이 겹겹이 쌓이며 짙어집니다 — 반복이 남긴 자국
    art: (
      <>
        {Array.from({ length: 14 }, (_, i) => {
          const t = i / 13;
          return (
            <circle
              key={i}
              cx={8.6 + 7 * t}
              cy={15.4 - 7 * t}
              r={5.6}
              opacity={0.07 + 0.93 * t}
            />
          );
        })}
      </>
    ),
  },
  {
    index: "02",
    title: "Sensory Understanding",
    body: "우리는 보고, 듣고, 느끼는 감각을 통해 대상과 주변의 관계를 자연스럽게 이해합니다.",
    // 서로 맞물린 원들 — 따로 배우지 않아도 이어지는 동작
    art: (
      <>
        <circle cx="7" cy="15" r="4.9" />
        <circle cx="12" cy="15" r="4.9" />
        <circle cx="17" cy="15" r="4.9" />
        <circle cx="9.5" cy="9.6" r="4.9" />
        <circle cx="14.5" cy="9.6" r="4.9" />
      </>
    ),
  },
  {
    index: "03",
    title: "Natural Expectation",
    body: "이미 형성된 이해는 새로운 경험에서도 다음 결과를 예상할 수 있는 단서가 됩니다.",
    // 고른 격자 속에서 두 칸만 채워집니다 — 눈에 걸리는 신호
    art: (
      <>
        {[0, 1, 2, 3].flatMap((row) =>
          [0, 1, 2, 3].map((col) => (
            <circle
              key={`${row}-${col}`}
              cx={3.4 + col * 5.7}
              cy={3.4 + row * 5.7}
              r={2.3}
              fill={col === 1 && row < 2 ? "currentColor" : "none"}
            />
          )),
        )}
      </>
    ),
  },
  {
    index: "04",
    title: "Digital Translation",
    body: "이미 익숙한 행동 중 편리한 것을 가져와 더 자연스럽고 효율적인 디지털 경험으로 연결합니다.",
    // 두 원이 겹치는 자리 — 행동과 시스템이 만나는 지점
    art: (
      <>
        <circle cx="9.4" cy="14.6" r="6.1" />
        <circle cx="14.6" cy="9.4" r="6.1" />
      </>
    ),
  },
];

/** 4섹션 — 감각 단서 네 가지 */
export function ScenePrinciples() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-span-6 row-start-1 row-span-3">
        UX begins before the screen
        <br />
        — in the behaviors, senses, and expectations
        <br />
        we already understand
      </h2>

      {/* <p
        className="type-body rise col-span-2 col-start-7 row-start-1"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        감각과 행동의 기억은 인터페이스가 낯설지 않게 작동하는 기준이 됩니다.
        <br />
        좋은 디지털 경험은 사용자가 설명을 읽기 전에 다음 반응을 예상할 수 있게 만듭니다.
      </p> */}

      <div className="card-row col-span-8 row-start-4 row-span-3">
        {CARDS.map((card, i) => (
          <div
            key={card.index}
            className="card rise"
            style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
          >
            <span className="card-index">{card.index}</span>

            <div className="card-art">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden
              >
                {card.art}
              </svg>
            </div>

            <div className="card-text">
              <h3 className="type-title">{card.title}</h3>
              <p className="type-body">{card.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
