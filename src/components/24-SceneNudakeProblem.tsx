"use client";

/**
 * 21장 — Problem + Scenario
 *
 * 문제 셋을 세우고, 그것을 사람 하나의 상황으로 곧장 잇습니다.
 * 페르소나 카드를 크게 만들지 않습니다 — 문제 정의가 사용자 목적으로
 * 이어지는 것만 보이면 충분합니다.
 * 그리드 10번 — 제목 1–3단 1행 · 시나리오 6–8단 1–2행 · 단 셋 3–5행.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

const POINTS = [
  {
    index: "01",
    title: "Low Discoverability",
    lead: "선물이라는 목적이 정보 구조에 드러나지 않습니다.",
    body: "상품을 먼저 탐색해야만 기프트에 닿습니다. 누데이크가 온라인 선물을 판다는 사실을 이미 알고 있어야 그 길을 찾습니다.",
    place: "col-start-1 col-span-2",
  },
  {
    index: "02",
    title: "Hidden Brand Experience",
    lead: "티 기프트가 경험이 아니라 부가 기능처럼 놓여 있습니다.",
    body: "무엇이 들어 있는지, 어떤 향과 맛인지, 어떻게 포장되는지가 충분히 전해지지 않습니다.",
    place: "col-start-4 col-span-2",
  },
  {
    index: "03",
    title: "Limited Accessibility",
    lead: "오프라인의 한계를 온라인이 아직 받아 주지 못합니다.",
    body: "지역과 상관없이 받을 수 있는 상품이 이미 있는데도, 그 접점으로 자연스럽게 이어지지 않습니다.",
    place: "col-start-7 col-span-2",
  },
];

export function SceneNudakeProblem() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-3 row-start-1">
        Problem
      </h2>

      {/* 문제를 사람의 상황으로 곧장 잇습니다. 짧게만 둡니다. */}
      <div
        className="nud-scenario rise col-start-6 col-span-3 row-start-1 row-span-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        <p className="nud-eyebrow">Scenario</p>
        <p className="type-body">
          누데이크를 경험했던 사용자가, 매장이 없는 지역의 친구에게 같은 경험을
          선물하고 싶습니다. 사이트에 들어오지만 선물할 수 있는 상품을 바로 찾지
          못합니다.
        </p>
      </div>

      {POINTS.map((point, i) => (
        <div
          key={point.index}
          className={`issue rise ${point.place} row-start-3 row-span-3`}
          style={{ "--delay": `${0.2 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{point.index}</span>
          <h3 className="type-title">{point.title}</h3>
          <p className="nud-goal-lead">{point.lead}</p>
          <p className="type-body">{point.body}</p>
        </div>
      ))}

      {/* 이 케이스가 상품 구매 UX 에서 브랜드 경험 전달 UX 로 올라서는 문장 */}
      <p
        className="nud-need rise col-start-1 col-span-6 row-start-6"
        style={{ "--delay": "0.46s" } as CSSProperties}
      >
        &ldquo;I want to gift the Nudake experience, not just a product.&rdquo;
      </p>
    </div>
  );
}
