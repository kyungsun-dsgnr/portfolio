"use client";

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";
import { StoreListMock } from "@/components/StoreListMock";

/** 지금 화면이 하는 일과, 그 위에 더할 것 */
const POINTS = [
  {
    index: "01",
    title: "Functional Search",
    body: "현재 위치 기반으로 가까운 매장을 빠르게 찾을 수 있습니다.",
    place: "col-start-1 col-span-2 row-start-4 row-span-2",
  },
  {
    index: "02",
    title: "Global Presence",
    body: "전 세계 도시의 스토어를 함께 보여주면 브랜드의 확장성과 존재감을 더 쉽게 인식할 수 있습니다.",
    place: "col-start-7 col-span-2 row-start-3 row-span-2",
  },
  {
    index: "03",
    title: "Exploratory Entry",
    body: "목록에 들어가기 전, 지구본을 돌려 도시를 발견하는 진입은 탐색의 감각을 더합니다.",
    place: "col-start-7 col-span-2 row-start-6",
  },
];

/** 지금 화면을 짚고 방향을 제안하는 장 */
export function SceneProblem() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-2 row-start-1 row-span-3">
        Beyond Finding
        <br />
        Toward Global Awareness
      </h2>

      {/* 지금 화면. 가운데 두 단을 쓰고 아래쪽은 장 밖으로 잘려 나갑니다. */}
      <div
        className="store-slot rise col-start-4 col-span-2 row-start-1 row-span-6"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        <StoreListMock />
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
