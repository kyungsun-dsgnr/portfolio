"use client";

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";
import { StoreListMock } from "@/components/StoreListMock";

/** 지금 화면이 하는 일과, 그 위에 더할 것 */
const POINTS = [
  {
    index: "01",
    title: "Functional Search",
    body: "현재 위치와 선택한 지역을 기준으로 가까운 매장을 빠르게 찾을 수 있습니다.",
    place: "col-start-1 col-span-2 row-start-4 row-span-2",
  },
  {
    index: "02",
    title: "Local Context",
    body: "탐색은 접속 국가와 현재 위치를 중심으로 시작되어, 가까운 지역의 매장 정보에 집중됩니다.",
    place: "col-start-7 col-span-2 row-start-3 row-span-2",
  },
  {
    index: "03",
    title: "Limited Global View",
    body: "각 매장은 개별 정보로 확인되지만, 전 세계 여러 도시와 연결된 브랜드의 확장감은 한눈에 드러나지 않습니다.",
    place: "col-start-7 col-span-2 row-start-5 row-span-2 issue-low",
  },
];

/** 지금 화면을 짚고 방향을 제안하는 장 */
export function SceneProblem() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-4 row-start-1 row-span-2">
        Beyond Finding
        <br />
        Toward Global Awareness
      </h2>

      {/* 지금 화면. 가운데 두 단을 쓰고 아래쪽은 장 밖으로 잘려 나갑니다. */}
      <div
        className="store-slot rise col-start-4 col-span-2 row-start-1 row-span-6"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        <StoreListMock dots />
      </div>

      {POINTS.map((point, i) => (
        <div
          key={point.index}
          className={`issue rise ${point.place}`}
          style={{ "--delay": `${0.18 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{point.index}</span>
          <h3 className="type-title">{point.title}</h3>
          <p className="type-body">{point.body}</p>
        </div>
      ))}
    </div>
  );
}
