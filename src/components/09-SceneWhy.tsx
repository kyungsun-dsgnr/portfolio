"use client";

/** 9장 — 시작점을 왜 옮기는지 */

import type { CSSProperties } from "react";

import { GlobeDots } from "@/components/GlobeDots";
import { StoreListMock } from "@/components/StoreListMock";
import { useInView } from "@/components/useInView";

/** 마지막 칸 지구본은 멈춘 채 서울만 이름표를 답니다. */
const SEOUL = ["Seoul"];

/** 시작점을 하나 더 두는 이유 셋. 마지막 칸만 한 행 더 높아 글이 위에서 시작합니다. */
const REASONS = [
  {
    index: "before-01",
    title: "Local Start",
    body: "접속 국가와 현재 위치를 기준으로 가까운 매장을 찾습니다.",
  },
  {
    index: "before-02",
    title: "Quick Store Search",
    body: "지역을 선택해 필요한 매장 정보를 빠르게 확인합니다.",
  },
  {
    index: "after",
    title: "Global Start",
    body: "세계의 도시를 둘러보며 브랜드의 글로벌 스토어를 발견합니다.",
    tall: true,
  },
];

/** 시작점을 왜 옮기는지 짚는 장 */
export function SceneWhy() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-4 row-start-1 row-span-2">
        Why Add Another
        <br />
        Starting Point?
      </h2>

      <p
        className="type-body rise col-start-5 col-span-4 row-start-1 row-span-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        현재 스토어 탐색은 접속 국가와 현재 위치를 기준으로 가까운 매장을 빠르게
        찾는 데 최적화되어 있습니다.
        <br />이 기능적 흐름은 유지하면서, 세계의 도시를 둘러보는 두 번째
        시작점을 더해 글로벌 브랜드 경험으로 확장합니다.
      </p>

      <div className="card-row why-row col-start-1 col-span-8 row-start-3 row-span-4">
        {REASONS.map((reason, i) => (
          <div
            key={reason.index}
            className="card why-card rise"
            data-tall={reason.tall || undefined}
            style={{ "--delay": `${0.18 + i * 0.08}s` } as CSSProperties}
          >
            <div className="card-text">
              <span className="card-index">{reason.index}</span>
              <h3 className="type-title">{reason.title}</h3>
              <p className="type-body">{reason.body}</p>
            </div>

            {/* 칸마다 그 말에 해당하는 조각만 보여 줍니다. */}
            <div className="why-visual">
              {reason.tall ? (
                <GlobeDots interactive={false} still labels tags={SEOUL} />
              ) : (
                <div className="why-mock">
                  {i === 0 ? (
                    <StoreListMock show={["filters"]} />
                  ) : (
                    <StoreListMock show={["results"]} picked="02" phase={2} />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
