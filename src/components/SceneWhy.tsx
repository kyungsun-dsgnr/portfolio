"use client";

import type { CSSProperties } from "react";

import { GlobeDots } from "@/components/GlobeDots";

import { StoreListMock } from "@/components/StoreListMock";
import { useInView } from "@/components/useInView";

/** 마지막 칸 지구본은 멈춘 채 서울만 이름표를 답니다. */
const SEOUL = ["Seoul"];

/** 시작점을 옮기는 이유 셋. 마지막 칸만 한 행 더 높아 글이 위에서 시작합니다. */
const REASONS = [
  {
    index: "01",
    title: "Current Start",
    body: "접속 국가와 현재 위치를 기준으로 탐색이 시작됩니다.",
  },
  {
    index: "02",
    title: "Narrowed Exploration",
    body: "사용자는 여러 도시의 매장을 둘러보기보다, 선택한 지역 안에서 가까운 매장을 확인하는 흐름에 머무릅니다.",
  },
  {
    index: "03",
    title: "New Start",
    body: "탐색의 시작점을 세계로 넓혀, 사용자가 도시를 이동하며 글로벌 스토어를 발견하게 합니다.",
    tall: true,
  },
];

/** 시작점을 왜 옮기는지 짚는 장 */
export function SceneWhy() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-4 row-start-1 row-span-2">
        Why change
        <br />
        the starting point
      </h2>

      <p
        className="type-body rise col-start-5 col-span-4 row-start-1 row-span-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        현재 스토어 페이지는 접속 국가와 현재 위치를 기준으로 가까운 매장을 빠르게
        보여줍니다.
        <br />
        하지만 탐색은 곧바로 지역 선택과 리스트 확인으로 좁혀져, 사용자가 여러 도시의
        매장을 둘러볼 여지는 제한됩니다.
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
                  {reason.index === "01" ? (
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
