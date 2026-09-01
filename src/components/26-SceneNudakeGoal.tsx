"use client";

/**
 * 23장 — Make Gift a Brand Touchpoint
 *
 * 앞장이 문제라면 이 장은 선언입니다. 여기서 정한 세 단어(Discover ·
 * Experience · Send)가 뒤의 IA 와 최종 플로우로 그대로 이어집니다.
 * 그리드 1번 — 큰 문장 1–7단 1–3행 · 본문 6–8단 4행 · 아래 단 셋 5–6행.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 뒤 장들이 이 셋을 그대로 따라갑니다. 여기서 이름을 붙여 둡니다. */
const GOALS = [
  {
    index: "01",
    name: "Discover",
    body: "선물 경험을 쉽게 발견한다.",
    place: "col-start-1 col-span-2",
  },
  {
    index: "02",
    name: "Experience",
    body: "선물을 고르는 과정에서도 누데이크의 브랜드 경험을 느낀다.",
    place: "col-start-4 col-span-2",
  },
  {
    index: "03",
    name: "Send",
    body: "선택한 경험을 자연스럽게 상대에게 전달한다.",
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
        온라인 선물을 독립적인 브랜드 접점으로 확장해,
        <br />
        장소와 관계없이 누데이크를 발견하고 전달할 수 있게 합니다.
      </p>

      {GOALS.map((goal, i) => (
        <div
          key={goal.index}
          className={`nud-goal rise ${goal.place} row-start-5 row-span-2`}
          style={{ "--delay": `${0.26 + i * 0.1}s` } as CSSProperties}
        >
          <span className="card-index">{goal.index}</span>
          <h3 className="nud-goal-name">{goal.name}</h3>
          <p className="type-body">{goal.body}</p>
        </div>
      ))}
    </div>
  );
}
