"use client";

import type { CSSProperties } from "react";

import { StoreListMock } from "@/components/StoreListMock";
import { useInView } from "@/components/useInView";

/** 제안을 한 화면으로 보여 주는 장 */
export function SceneAfter() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead rise col-start-1 col-span-3 row-start-1 row-span-2">
        From Store List
        <br />
        To Spatial Discovery
      </h2>

      <p
        className="type-body rise self-end col-start-1 col-span-2 row-start-5 row-span-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        이 제안은 매장 정보를 단순한 목록으로 보여주는 방식에서 나아가, 도시를 이동하며
        발견하는 글로벌 브랜드 경험으로 확장합니다.
        <br />
        사용자는 가까운 매장을 찾는 동시에 Gentle Monster가 전 세계 여러 도시와 연결된
        브랜드라는 감각을 함께 인식합니다.
      </p>

      {/* 화면 하나를 크게. 아래쪽은 장을 넘어가 잘립니다. */}
      <div
        className="after-frame rise col-start-4 col-span-5 row-start-1 row-span-6"
        style={{ "--delay": "0.18s" } as CSSProperties}
      >
        <div className="after-shot">
          <StoreListMock />
        </div>
      </div>
    </div>
  );
}
