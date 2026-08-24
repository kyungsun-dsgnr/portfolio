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
  },
  {
    index: "02",
    title: "Global Presence",
    body: "전 세계 도시의 스토어를 함께 보여주면 브랜드의 확장성과 존재감을 더 쉽게 인식할 수 있습니다.",
  },
  {
    index: "03",
    title: "Exploratory Entry",
    body: "목록에 들어가기 전, 지구본을 돌려 도시를 발견하는 진입은 탐색의 감각을 더합니다.",
  },
];

/** 세 항목은 왼쪽부터 두 단씩 나란히 놓입니다. */
const PLACE = ["col-start-1", "col-start-3", "col-start-5"];

/** 지금 화면을 짚고 방향을 제안하는 장 */
export function SceneProblem() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-5 row-start-1 row-span-2">
        The list assumes
        <br />
        you already know where to look.
      </h2>

      <div
        className="note-block rise col-start-1 col-span-3 row-start-3 row-span-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        <p className="type-body">
          현재 스토어 탐색은 접속 국가와 현재 위치를 기준으로 가까운 매장을 빠르게 찾을 수
          있도록 설계되어 있습니다.
        </p>
        <p className="type-body">
          이 프로젝트는 그 기능 위에 Gentle Monster가 전 세계 여러 도시와 연결된 글로벌
          브랜드라는 인식을 더하는 방향을 제안합니다.
        </p>
      </div>

      {POINTS.map((point, i) => (
        <div
          key={point.index}
          className={`issue rise col-span-2 row-start-5 row-span-2 ${PLACE[i]}`}
          style={{ "--delay": `${0.18 + i * 0.08}s` } as CSSProperties}
        >
          <span className="card-index">{point.index}</span>
          <h3 className="type-title">{point.title}</h3>
          <p className="type-body">{point.body}</p>
        </div>
      ))}

      {/* 지금 화면. 목업 너비 332 가 두 단(333)과 거의 같아 그대로 들어갑니다. */}
      <div
        className="store-slot rise col-start-7 col-span-2 row-start-1 row-span-6"
        style={{ "--delay": "0.26s" } as CSSProperties}
      >
        <StoreListMock />
      </div>
    </div>
  );
}
