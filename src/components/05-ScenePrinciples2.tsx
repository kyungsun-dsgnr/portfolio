"use client";

/**
 * 4장 — 원칙 카드 넷, 삽화가 움직입니다(세 번째 판의 원칙 장).
 *
 * 판·글은 정지한 판(04-ScenePrinciples, 앞선 판들이 씁니다)과 같고,
 * 카드의 그림만 살아 움직이는 SVG 입니다. 움직임은 v3.css 의 `.pm-*` 규칙이 맡습니다.
 *   01 반복이 남긴 자국 — 둥근 네모의 길을 점선이 계속 돕니다.
 *   02 감각으로 알아차림 — 원 셋의 윤곽이 차례로 그려지고 가운데 점이 맺힙니다.
 *   03 다음을 예상함 — 격자의 점이 잠깐 커졌다(신호) 채워집니다(결과).
 *   04 디지털로 옮김 — 원이 네모로 바뀌었다 돌아옵니다.
 */

import type { CSSProperties, ReactNode } from "react";

import { useInView } from "@/components/useInView";

/** 둥근 네모 한 바퀴 — 01 의 길 */
const LOOP =
  "M81 61H119A20 20 0 0 1 139 81V119A20 20 0 0 1 119 139H81A20 20 0 0 1 61 119V81A20 20 0 0 1 81 61Z";

/** 03 의 아홉 점 — 자리와 차례(초). 가운데가 맨 먼저 맺혀 있습니다.
 *  다른 셋과 맞춰 2 만큼 올려 앉힙니다. */
const GRID: { x: number; y: number; at: number }[] = [
  { x: 68, y: 66, at: -16 },
  { x: 100, y: 66, at: -6 },
  { x: 132, y: 66, at: -12 },
  { x: 68, y: 98, at: -2 },
  { x: 100, y: 98, at: -18 },
  { x: 132, y: 98, at: -8 },
  { x: 68, y: 130, at: -10 },
  { x: 100, y: 130, at: -14 },
  { x: 132, y: 130, at: -4 },
];

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
    art: (
      <>
        {/* 연한 선은 원본 프로토타입보다 0.2 진하게. */}
        <path className="pm-memory-back" d={LOOP} opacity={0.38} />
        <path className="pm-memory-front" d={LOOP} opacity={0.38} />
        <path d={LOOP} opacity={0.52} />
        <path
          className="pm-memory-route"
          d={LOOP}
          pathLength={100}
          strokeDasharray="22 78"
        />
      </>
    ),
  },
  {
    index: "02",
    title: "Sensory Understanding",
    body: "우리는 보고, 듣고, 느끼는 감각을 통해 대상과 주변의 관계를 자연스럽게 이해합니다.",
    art: (
      <>
        <g opacity={0.45}>
          <circle cx="84" cy="111" r="31" />
          <circle cx="116" cy="111" r="31" />
          <circle cx="100" cy="83" r="31" />
        </g>
        <circle
          className="pm-sense-0"
          cx="84"
          cy="111"
          r="31"
          pathLength={1}
          transform="rotate(-90 84 111)"
        />
        <circle
          className="pm-sense-1"
          cx="116"
          cy="111"
          r="31"
          pathLength={1}
          transform="rotate(-90 116 111)"
        />
        <circle
          className="pm-sense-2"
          cx="100"
          cy="83"
          r="31"
          pathLength={1}
          transform="rotate(-90 100 83)"
        />
        <circle
          className="pm-sense-center"
          cx="100"
          cy="102"
          r="2.5"
          fill="currentColor"
          stroke="none"
        />
      </>
    ),
  },
  {
    index: "03",
    title: "Natural Expectation",
    body: "이미 형성된 이해는 새로운 경험에서도 다음 결과를 예상할 수 있는 단서가 됩니다.",
    art: (
      <>
        {GRID.map((dot) => (
          <g
            key={`${dot.x}-${dot.y}`}
            style={{ "--phase": `${dot.at}s` } as CSSProperties}
          >
            <circle cx={dot.x} cy={dot.y} r="9" />
            <circle
              className="pm-expect-cue"
              cx={dot.x}
              cy={dot.y}
              r="13"
              opacity={0}
            />
            <circle
              className="pm-expect-result"
              cx={dot.x}
              cy={dot.y}
              r="4.5"
              fill="currentColor"
              stroke="none"
              opacity={0}
            />
          </g>
        ))}
      </>
    ),
  },
  {
    index: "04",
    title: "Digital Translation",
    body: "이미 익숙한 행동 중 편리한 것을 가져와 더 자연스럽고 효율적인 디지털 경험으로 연결합니다.",
    art: (
      <>
        {/* 다른 셋과 같은 크기감으로 — 72 의 1.15 배(82.8). */}
        <rect
          className="pm-translate-depth"
          x="58.6"
          y="58.6"
          width="82.8"
          height="82.8"
          rx="41.4"
          opacity={0}
        />
        <rect
          className="pm-translate-shape"
          x="58.6"
          y="58.6"
          width="82.8"
          height="82.8"
          rx="41.4"
          fill="var(--bg)"
        />
      </>
    ),
  },
];

/** 4섹션의 복제 — 삽화가 움직이는 원칙 넷 */
export function ScenePrinciples2() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div
      ref={ref}
      className="page-grid principles-motion"
      data-visible={inView || undefined}
    >
      <h2 className="type-lead capitalize rise col-span-6 row-start-1 row-span-3">
        UX begins before the screen
        <br />
        — in the behaviors, senses, and expectations
        <br />
        we already understand
      </h2>

      <div className="card-row col-span-8 row-start-4 row-span-3">
        {CARDS.map((card, i) => (
          <div
            key={card.index}
            className="card rise"
            style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
          >
            <span className="card-index">{card.index}</span>

            <div className="card-art pm-art">
              {/* 200 판의 가운데 100 만 보여 그림이 두 배로 섭니다. */}
              <svg
                viewBox="50 50 100 100"
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
