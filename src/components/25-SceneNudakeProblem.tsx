"use client";

/**
 * 22장 — Product Structure ≠ User Intent
 *
 * 앞장이 "어디에 있는가" 였다면, 여기는 "왜 그렇게 되었는가" 입니다.
 * 사용자가 머릿속에 그린 길과 화면이 실제로 요구하는 길을 나란히 세워
 * 둘의 길이가 다르다는 것을 눈으로 보게 합니다.
 * 그리드 10번 — 제목 1–3단 1행 · 좌우 두 덩이 · 단 셋 아래.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 사용자가 그리는 길 — 목적에서 곧장 갑니다. */
const INTENT = ["Nudake", "Gift", "Choose", "Send"];

/* 화면이 요구하는 길 — 제품을 하나씩 좁혀 갑니다. */
const CURRENT = ["Nudake", "Menu", "Store", "Category", "Product", "Gift"];

const POINTS = [
  {
    index: "01",
    title: "Findability",
    body: "선물이 주요 탐색 구조에서 직접 발견되지 않습니다.",
    place: "col-start-1 col-span-2",
  },
  {
    index: "02",
    title: "Information Scent",
    body: "메뉴가 선물로 이어진다는 정보적 단서가 약합니다.",
    place: "col-start-4 col-span-2",
  },
  {
    index: "03",
    title: "Intent Mismatch",
    body: "사용자의 목적은 선물하기지만, 구조는 제품 카테고리 탐색을 요구합니다.",
    place: "col-start-7 col-span-2",
  },
];

function Path({
  label,
  steps,
  lead,
}: {
  label: string;
  steps: string[];
  lead?: boolean;
}) {
  return (
    <div className="nud-path" data-lead={lead || undefined}>
      <p className="nud-eyebrow">{label}</p>

      <ol>
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}

export function SceneNudakeProblem() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1">
        Product Structure ≠ User Intent
      </h2>

      <p
        className="nud-intent-say rise col-start-1 col-span-3 row-start-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        &ldquo;I want to
        <br />
        send Nudake.&rdquo;
      </p>

      <div
        className="rise col-start-1 col-span-2 row-start-3 row-span-2"
        style={{ "--delay": "0.2s" } as CSSProperties}
      >
        <Path label="User Intent" steps={INTENT} lead />
      </div>

      <div
        className="rise col-start-4 col-span-2 row-start-3 row-span-2"
        style={{ "--delay": "0.28s" } as CSSProperties}
      >
        <Path label="Current Structure" steps={CURRENT} />
      </div>

      {/* 이 장의 결론. 없는 것이 아니라 드러나지 않는 것입니다. */}
      <p
        className="type-title rise self-start col-start-7 col-span-2 row-start-3 row-span-2"
        style={{ "--delay": "0.36s" } as CSSProperties}
      >
        선물이 없는 것이 아니라,
        <br />
        선물이라는 목적이
        <br />
        정보 구조에 드러나지 않습니다.
      </p>

      {POINTS.map((point, i) => (
        <div
          key={point.index}
          className={`issue rise ${point.place} row-start-6`}
          style={{ "--delay": `${0.44 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{point.index}</span>
          <h3 className="type-title">{point.title}</h3>
          <p className="type-body">{point.body}</p>
        </div>
      ))}
    </div>
  );
}
