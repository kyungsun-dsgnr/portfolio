"use client";

/**
 * 탬버린즈 05 — 개선 화면 B. 다른 판을 시험합니다.
 * 네 화면에 나뉘어 있던 고르기를 한 화면에 모은 COMPOSE GIFT 입니다.
 * 판 위 자리는 함께 잡기로 했으니, 지금은 화면 하나만 크게 세워 둡니다.
 */

import type { CSSProperties } from "react";

import { TamburinsComposeScreenB } from "@/components/TamburinsComposeScreenB";
import { useInView } from "@/components/useInView";

const COL = 158.5;
const GAP = 16;
/* 두 단 폭. 12장 목업과 같은 폭이라 글자 크기가 그대로 통합니다. */
const SHOT_W = 2 * COL + GAP;

const px = (n: number) => `calc(${n} * var(--u))`;

export function SceneComposeB() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);

  return (
    <div ref={ref} className="page-grid" data-visible={inView || undefined}>
      <h2 className="type-lead capitalize rise col-start-1 col-span-4 row-start-1 row-span-2">
        One screen,
        <br />
        one gift.
      </h2>

      <p
        className="type-body rise col-start-1 col-span-3 row-start-3"
        style={{ "--delay": "0.24s" } as CSSProperties}
      >
        고르는 일이 화면을 옮겨 다니지 않습니다. 세트를 고르면 그 자리에서 향을
        이어 고르고, 고른 것이 그대로 목록이 되어 아래에 쌓입니다.
      </p>

      <div
        className="compose-stage rise col-start-4 col-span-2 row-start-2 row-span-5"
        style={{ "--delay": "0.32s" } as CSSProperties}
      >
        <div className="compose-frame" style={{ width: px(SHOT_W) }}>
          <TamburinsComposeScreenB />
        </div>
      </div>
    </div>
  );
}
