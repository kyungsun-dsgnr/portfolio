"use client";

/**
 * 23장 — Make Gift a Brand Touchpoint
 *
 * 앞장이 문제라면 이 장은 선언입니다. 여기서 정한 세 단어가
 * 08장의 걸음과 09장의 구조로 그대로 이어집니다.
 * 그리드 1번 — 큰 문장 1–7단 1–2행 · 선언 3행 · 목표 셋 4–5행 · 띠 6행.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

const GOALS = [
  {
    index: "01",
    name: "Discover",
    lead: "선물을 발견할 수 있도록",
    body: "사용자의 목적과 직접 연결되는 진입점을 만듭니다.",
    place: "col-start-1 col-span-2",
  },
  {
    index: "02",
    name: "Experience",
    lead: "고르는 과정에서도 누데이크답게",
    body: "일반적인 상품 목록이 아니라 브랜드의 시각적 경험을 유지합니다.",
    place: "col-start-4 col-span-2",
  },
  {
    index: "03",
    name: "Send",
    lead: "브랜드 경험을 다른 사람에게",
    body: "외부 선물 구매 과정까지 자연스럽게 이어 줍니다.",
    place: "col-start-7 col-span-2",
  },
];

export function SceneNudakeGoal() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display rise col-start-1 col-span-7 row-start-1 row-span-2">
        Make Gift
        <br />a Brand Touchpoint
      </h2>

      <p
        className="type-title rise self-start col-start-1 col-span-5 row-start-3"
        style={{ "--delay": "0.12s" } as CSSProperties}
      >
        온라인 선물을 단순한 구매 기능이 아니라,
        <br />
        누데이크를 발견하고 전달하는 하나의 브랜드 접점으로 확장합니다.
      </p>

      {GOALS.map((goal, i) => (
        <div
          key={goal.index}
          className={`nud-goal rise ${goal.place} row-start-4 row-span-2`}
          style={{ "--delay": `${0.26 + i * 0.1}s` } as CSSProperties}
        >
          <span className="card-index">{goal.index}</span>
          <h3 className="nud-goal-name">{goal.name}</h3>
          <p className="nud-goal-lead">{goal.lead}</p>
          <p className="type-body">{goal.body}</p>
        </div>
      ))}

      {/* 이 셋이 뒤 장의 뼈대가 됩니다. */}
      <p
        className="nud-triad rise col-start-1 col-span-8 row-start-6"
        style={{ "--delay": "0.56s" } as CSSProperties}
      >
        {GOALS.map((goal) => (
          <span key={goal.index}>{goal.name}</span>
        ))}
      </p>
    </div>
  );
}
