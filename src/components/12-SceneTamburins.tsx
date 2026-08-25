"use client";

/** 12장 — 탬버린즈 케이스 표지 */

import type { CSSProperties } from "react";

import { useInView } from "@/components/useInView";

/**
 * 두 번째 케이스 표지 — 좌측 네 단이 이미지, 우측 세 단이 글입니다.
 * 앞 케이스와 좌우가 뒤집혀 있어 두 프로젝트가 나란히 놓여도 같은 화면으로 읽히지 않습니다.
 */
export function SceneTamburins() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      {/* 좌측을 통째로 채우는 이미지 구성. 에셋이 오면 이 자리에 들어갑니다.
          원본은 이 칸(682×740) 안에 네 겹이 얹힌 형태입니다 —
          바탕 619×775 (좌 32 / 상 -18), 619×246 (좌 0 / 상 529),
          165×480 (좌 330 / 상 116), 213×214 (좌 94 / 상 405).
          겹치는 자리가 칸 밖으로 나가므로 넘치는 부분은 잘라 냅니다. */}
      <div className="rise col-start-1 col-span-4 row-start-1 row-span-6">
        <div className="h-full w-full bg-[var(--placeholder)]" />
      </div>

      <h2
        className="type-display rise col-start-6 col-span-3 row-start-1 row-span-2 text-right"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        Tamburins Compose
      </h2>

      {/* 글이 한 줄 정도 넘쳐도 행이 늘어나지 않도록 두 행을 잡고 위에서 시작합니다. */}
      <p
        className="type-body rise self-start col-start-6 col-span-3 row-start-3 row-span-2"
        style={{ "--delay": "0.16s" } as CSSProperties}
      >
        선물을 준비할 때, 무엇을 담을지 선택하고 하나의 구성으로 완성합니다.
        <br />
        <br />이 프로젝트는 그 경험을 바탕으로 Tamburins의 분산된 선물세트 구성
        경험과 선물 선택 과정을 하나의 Gift Composition 경험으로 재구성합니다.
      </p>

      {/* 브랜드 로고 자리. 원본 270×39.4 가 칸 오른쪽 끝에 맞춰 섭니다. */}
      <div
        className="rise col-start-7 col-span-2 row-start-6 flex items-center justify-end"
        style={{ "--delay": "0.22s" } as CSSProperties}
      >
        <div
          className="bg-[var(--placeholder)]"
          style={{
            width: "calc(270 * var(--u))",
            height: "calc(39.4 * var(--u))",
          }}
        />
      </div>
    </div>
  );
}
