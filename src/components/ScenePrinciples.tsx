"use client";

import type { CSSProperties, ReactNode } from "react";

import { useInView } from "@/components/useInView";

/**
 * 카드 삽화. 레퍼런스와 같은 언어로 — 채움 없이 1px 선, 기하 도형만.
 * viewBox 단위가 곧 디자인 px 이라 캔버스와 같은 비율로 줄고 늡니다.
 */
const ART: Record<string, ReactNode> = {
  // 빛의 변화 — 광원에서 퍼져 나가는 동심 호
  "Light Shift": (
    <>
      <circle cx="100" cy="34" r="13" />
      <path d="M66 62a34 34 0 0 1 68 0" />
      <path d="M46 84a54 54 0 0 1 108 0" />
      <path d="M26 106a74 74 0 0 1 148 0" />
      <path d="M100 8V0M62 16l-5-7M138 16l5-7" />
    </>
  ),
  // 거리감 — 안으로 물러나는 사각형
  "Spatial Distance": (
    <>
      <rect x="14" y="18" width="172" height="108" />
      <rect x="52" y="42" width="96" height="60" />
      <rect x="80" y="58" width="40" height="28" />
      <path d="M14 18l38 24M186 18l-38 24M14 126l38-24M186 126l-38-24" />
    </>
  ),
  // 손의 기억 — 돌리는 노브
  "Hand Memory": (
    <>
      <circle cx="100" cy="72" r="30" />
      <circle cx="100" cy="72" r="52" strokeDasharray="4 7" />
      <path d="M100 72V42" />
      <path d="M136 40a52 52 0 0 1 15 32" />
      <path d="M129 34l9 5-6 9" />
    </>
  ),
  // 시간의 리듬 — 간격이 좁아지는 파형
  "Temporal Rhythm": (
    <>
      <path d="M12 72c10-30 20-30 30 0s20 30 30 0 16-24 24 0 13 20 20 0 11-16 17 0 9 13 14 0 8-10 13 0" />
      <path d="M12 122h164" />
      <path d="M12 122v-8M42 122v-12M72 122v-16M96 122v-12M116 122v-16M133 122v-10M147 122v-14M160 122v-9M173 122v-13" />
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
              <svg viewBox="0 0 200 134" fill="none" stroke="currentColor" aria-hidden>
                {ART[card.title]}
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
