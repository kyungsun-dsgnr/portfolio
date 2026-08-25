"use client";

/** 10장 — 지구본을 직접 만져 보는 장 */

import type { CSSProperties } from "react";

import { GlobeDots } from "@/components/GlobeDots";
import { useInView } from "@/components/useInView";

/** 설명 없이 지구본만 놓고 직접 돌려 보게 하는 장 */
export function SceneExplore() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      {/* 판 전체가 지구본입니다. 끌어 돌리고 점을 눌러 봅니다. */}
      <div className="field rise col-start-1 col-span-8 row-start-1 row-span-6">
        {/* 회색 판 위라 구를 밝게 깔아야 점이 읽힙니다. */}
        <GlobeDots veil={0.85} card />
      </div>

      <h2 className="type-lead rise col-start-1 col-span-3 row-start-1 row-span-2">
        Turn it and see
      </h2>

      <div
        className="field-note rise self-end col-start-1 col-span-3 row-start-6"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        <h3 className="type-title">Explore</h3>
        <p className="type-body">
          지구본을 끌어 돌리고, 도시를 눌러 그곳의 매장을 확인해 보세요.
        </p>
      </div>
    </div>
  );
}
