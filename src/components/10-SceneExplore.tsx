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
        {/* 서울을 고른 채로 시작합니다. */}
        <GlobeDots card openAt="Seoul" />
      </div>

      <h2 className="type-lead rise col-start-1 col-span-3 row-start-1 row-span-2">
        Turn the world,
        <br />
        find a city
      </h2>

      {/* 지구본이 휠을 가져가므로 다음 장으로 넘어갈 버튼을 따로 둡니다. */}
      <button
        type="button"
        className="page-next rise self-end col-start-4 col-span-2 row-start-6"
        style={{ "--delay": "0.2s" } as CSSProperties}
        onClick={() =>
          document
            .getElementById("gentle-monster-after")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <span>Next</span>
        <span className="scroll-cue-chevron" aria-hidden />
      </button>

      <div
        className="field-note rise self-start col-start-1 col-span-3 row-start-3 row-span-2"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        <h3 className="type-title">Familiar Interaction</h3>
        <p className="type-body">
          지구본을 돌리고 도시를 가리키는 익숙한 행동을
          <br />
          글로벌 스토어 탐색 방식으로 옮겼습니다.
        </p>
      </div>
    </div>
  );
}
