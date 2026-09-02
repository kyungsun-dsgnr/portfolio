"use client";

/**
 * 24장 — Result / Expected Impact
 *
 * 탐색 시간이 줄었다는 말로 끝내지 않습니다.
 * 위에서 접점이 어떻게 달라지는지 보이고, 아래에서 그 결과를 셋으로 적습니다.
 * 그리드 11번 — 큰 문장 1–7단 1–2행 · 대비 3–4행 · 결과 셋 6행.
 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/* 접점이 하나에서 둘로 늘어납니다. 앞의 것을 대체하지 않습니다. */
const REACH = [
  {
    key: "store",
    label: "Store",
    body: "제한적인 물리적 경험",
    place: "col-start-1 col-span-3",
  },
  {
    key: "gift",
    label: "Digital Gift",
    body: "지역에 관계없는 누데이크 경험",
    place: "col-start-5 col-span-3",
    add: true,
  },
];

const GAINS = [
  {
    index: "01",
    name: "Discoverability",
    body: "선물에 닿는 경로가 짧아집니다. 제품을 먼저 훑지 않아도 됩니다.",
    place: "col-start-1 col-span-2",
  },
  {
    index: "02",
    name: "Experience",
    body: "상품 구매가 브랜드 경험으로 넓어집니다. 티와 패키지, 메시지까지 하나로 건네집니다.",
    place: "col-start-4 col-span-2",
  },
  {
    index: "03",
    name: "Reach",
    body: "매장이 없는 지역의 사용자까지 접점이 이어집니다.",
    place: "col-start-7 col-span-2",
  },
];

export function SceneNudakeImpact() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-display rise col-start-1 col-span-7 row-start-1 row-span-2">
        Experience Nudake,
        <br />
        Anywhere
      </h2>

      {REACH.map((one, i) => (
        <div
          key={one.key}
          className={`nud-reach rise ${one.place} row-start-3 row-span-2`}
          data-add={one.add || undefined}
          style={{ "--delay": `${0.16 + i * 0.1}s` } as CSSProperties}
        >
          <h3 className="nud-reach-name">{one.label}</h3>
          <p className="type-body">{one.body}</p>
        </div>
      ))}

      {GAINS.map((gain, i) => (
        <div
          key={gain.index}
          className={`nud-goal rise ${gain.place} row-start-6`}
          style={{ "--delay": `${0.36 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{gain.index}</span>
          <h3 className="nud-goal-name">{gain.name}</h3>
          <p className="type-body">{gain.body}</p>
        </div>
      ))}
    </div>
  );
}
